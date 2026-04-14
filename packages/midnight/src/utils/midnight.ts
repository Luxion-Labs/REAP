import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import {
  createKeystore,
  UnshieldedWallet,
  PublicKey
} from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import {
  type MidnightProvider,
  type WalletProvider,
  type MidnightProviders
} from '@midnight-ntwrk/midnight-js/types';
import {
  MidnightBech32m,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
  UnshieldedAddress
} from '@midnight-ntwrk/wallet-sdk-address-format';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import * as ledger from '@midnight-ntwrk/ledger-v8';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { InMemoryTransactionHistoryStorage } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { Config as AppConfig } from '../config/config.js';
import { logger } from './logger.js';
import * as Rx from 'rxjs';
import { tap, filter, firstValueFrom } from 'rxjs';
import { Buffer } from 'node:buffer';
import { WebSocket } from 'ws';

// Required for GraphQL subscriptions (wallet sync) to work in Node.js
// @ts-ignore
globalThis.WebSocket = WebSocket;

/**
 * 🛠️ Modern Midnight Setup & Provider Bridge (v4.0.4)
 */

export interface MidnightContext {
  wallet: WalletFacade;
  providers: MidnightProvider & WalletProvider;
}

const signTransactionIntents = (
  tx: { intents?: Map<number, any> },
  signFn: (payload: Uint8Array) => ledger.Signature,
  proofMarker: 'proof' | 'pre-proof',
): void => {
  if (!tx.intents || tx.intents.size === 0) return;

  for (const segment of tx.intents.keys()) {
    const intent = tx.intents.get(segment);
    if (!intent) continue;

    const cloned = ledger.Intent.deserialize<ledger.SignatureEnabled, ledger.Proofish, ledger.PreBinding>(
      'signature',
      proofMarker,
      'pre-binding',
      intent.serialize(),
    );

    const sigData = cloned.signatureData(segment);
    const signature = signFn(sigData);

    if (cloned.fallibleUnshieldedOffer) {
      const sigs = cloned.fallibleUnshieldedOffer.inputs.map(
        (_: ledger.UtxoSpend, i: number) => cloned.fallibleUnshieldedOffer!.signatures.at(i) ?? signature,
      );
      cloned.fallibleUnshieldedOffer = cloned.fallibleUnshieldedOffer.addSignatures(sigs);
    }

    if (cloned.guaranteedUnshieldedOffer) {
      const sigs = cloned.guaranteedUnshieldedOffer.inputs.map(
        (_: ledger.UtxoSpend, i: number) => cloned.guaranteedUnshieldedOffer!.signatures.at(i) ?? signature,
      );
      cloned.guaranteedUnshieldedOffer = cloned.guaranteedUnshieldedOffer.addSignatures(sigs);
    }

    tx.intents.set(segment, cloned);
  }
};

export async function initializeMidnight(
  config: AppConfig,
  seedStr: string
): Promise<MidnightContext> {
  const seed = Buffer.from(seedStr, 'hex');
  const hdWalletResult = HDWallet.fromSeed(seed);

  if (hdWalletResult.type !== 'seedOk') {
    throw new Error('Invalid wallet seed');
  }

  const derivationResult = hdWalletResult.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

  if (derivationResult.type !== 'keysDerived') {
    throw new Error('Failed to derive keys');
  }

  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(derivationResult.keys[Roles.Zswap]);
  const dustSecretKey = ledger.DustSecretKey.fromSeed(derivationResult.keys[Roles.Dust]);
  const unshieldedKeystore = createKeystore(derivationResult.keys[Roles.NightExternal], config.networkId);

  // Set logger level to debug for detailed troubleshooting
  logger.level = 'debug';

  // FIX #2: Use network-specific cost parameters
  // Ensure ledger parameters match the selected network
  const ledgerParams = ledger.LedgerParameters.initialParameters();



  const additionalFeeOverhead = config.networkId === 'undeployed'
    ? 500_000_000_000_000_000n  // Local network: higher overhead for testing
    : 30_000_000_000_000n;       // Preview/Preprod: 30 DUST (standard)

  const buildIndexerConfig = () => ({
    indexerClientConnection: {
      indexerHttpUrl: config.indexer,
      indexerWsUrl: config.indexerWS,
    }
  });

  const buildRelayConfig = () => ({
    provingServerUrl: new URL(config.proofServer),
    relayURL: new URL(config.node.replace(/^http/, 'ws')),
  });

  const shieldedConfig = {
    networkId: config.networkId,
    ...buildIndexerConfig(),
    ...buildRelayConfig(),
  };

  const unshieldedConfig = {
    networkId: config.networkId,
    ...buildIndexerConfig(),
    txHistoryStorage: new InMemoryTransactionHistoryStorage(),
  };

  const dustConfig = {
    networkId: config.networkId,
    ...buildIndexerConfig(),
    ...buildRelayConfig(),
    costParameters: {
      additionalFeeOverhead,
      feeBlocksMargin: 5,
    },
  };

  logger.info(`Wallet Configuration:
    - Network ID: ${config.networkId}
    - Fee Overhead: ${additionalFeeOverhead.toString()}
    - Indexer: ${config.indexer}
    - Node: ${config.node}
    - Proof Server: ${config.proofServer}`);

  // Set pino level to debug to see low-level logs
  logger.level = 'debug';

  logger.info('Initializing WalletFacade...');
  let wallet;
  try {
    wallet = await WalletFacade.init({
      configuration: { ...shieldedConfig, ...unshieldedConfig, ...dustConfig } as any,
      shielded: (cfg: typeof shieldedConfig) => ShieldedWallet(cfg).startWithSecretKeys(shieldedSecretKeys),
      unshielded: (cfg: typeof unshieldedConfig) => UnshieldedWallet(cfg).startWithPublicKey(
        PublicKey.fromKeyStore(unshieldedKeystore)
      ),
      dust: (cfg: typeof dustConfig) => DustWallet(cfg).startWithSecretKey(
        dustSecretKey,
        ledgerParams.dust
      ),
    } as any);
  } catch (err: any) {
    logger.error(`Failed to initialize WalletFacade: ${err.message}`);
    throw err;
  }

  logger.info('Starting WalletFacade...');
  await wallet.start(shieldedSecretKeys, dustSecretKey);

  logger.info('WalletFacade started. Waiting for first sync...');
  // 🔄 Wait for initial sync to capture IDs for synchronous providers
  const state$ = wallet.state().pipe(Rx.share());

  // Heartbeat log during initial sync wait
  const heartbeatSub = state$.pipe(
    Rx.throttleTime(15_000),
    Rx.tap((s: any) => {
      if (!s.isSynced) {
        const shielded = s.shielded?.state?.progress;
        const dust = s.dust?.state?.progress;
        const unshielded = s.unshielded?.progress;

        const formatPct = (p: any) => {
          if (!p || typeof p.current !== 'number' || typeof p.total !== 'number' || p.total === 0) {
            return 'Starting...';
          }
          return `${((p.current / p.total) * 100).toFixed(1)}%`;
        };

        logger.info(`...syncing: Shielded ${formatPct(shielded)}, Dust ${formatPct(dust)}, Unshielded ${formatPct(unshielded)}...`);
      }
    })
  ).subscribe();

  const state = await firstValueFrom(
    state$.pipe(
      filter((s: any) => s.isSynced)
    )
  );
  heartbeatSub.unsubscribe();
  logger.info('Initial sync complete.');
  const coinPublicKey = ShieldedCoinPublicKey.codec.encode(
    config.networkId,
    state.shielded.coinPublicKey
  ).toString();
  const encryptionPublicKey = ShieldedEncryptionPublicKey.codec.encode(
    config.networkId,
    state.shielded.encryptionPublicKey
  ).toString();

  const providers: MidnightProvider & WalletProvider = {
    getCoinPublicKey() {
      return coinPublicKey;
    },
    getEncryptionPublicKey() {
      return encryptionPublicKey;
    },
    async balanceTx(tx, options) {
      const balanceOptions = (options instanceof Date) ? { ttl: options } : options || { ttl: new Date(Date.now() + 3600000) };

      const recipe = await wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys, dustSecretKey },
        balanceOptions as any
      );

      const signFn = (payload: Uint8Array) => unshieldedKeystore.signData(payload);
      signTransactionIntents(recipe.baseTransaction, signFn, 'proof');
      if (recipe.balancingTransaction) {
        signTransactionIntents(recipe.balancingTransaction, signFn, 'pre-proof');
      }
      return wallet.finalizeRecipe(recipe);
    },
    async submitTx(tx) {
      return wallet.submitTransaction(tx);
    }
  };

  return { wallet, providers };
}

export async function getContractProviders(
  wallet: WalletFacade,
  bridgeProviders: MidnightProvider & WalletProvider,
  config: AppConfig
): Promise<MidnightProviders<any, string, any>> {
  const state = await Rx.firstValueFrom(wallet.state().pipe(Rx.filter((s: any) => s.isSynced)));
  const zkConfigProvider = new NodeZkConfigProvider(config.zkConfigPath);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStoragePasswordProvider: () => 'reap-secure-password',
      accountId: UnshieldedAddress.codec.encode(
        config.networkId,
        state.unshielded.address
      ).toString()
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider as any),
    zkConfigProvider: zkConfigProvider,
    walletProvider: bridgeProviders,
    midnightProvider: bridgeProviders,
  } as MidnightProviders<any, string, any>;
}

/**
 * Helper to check if a progress object indicates strict completion
 * (100% synced and no pending data)
 */
function isProgressStrictlyComplete(progress: any): boolean {
  if (!progress) return false;
  // On empty chains (like local testing with a new seed), current and total will both be 0.
  // We consider it complete if current >= total.
  return progress.current >= progress.total;
}

export async function waitForSync(wallet: WalletFacade, config: AppConfig) {
  // Network-appropriate timeouts
  // - Local networks sync quickly (< 1 minute)
  // - Preview/Preprod can take 5-15+ minutes due to chain history replay
  const timeoutMs = config.networkId === 'undeployed' ? 120_000 : 600_000; // 2 min local, 10 min testnet
  const startTime = Date.now();

  logger.info(`Starting wallet sync for ${config.networkId} network (timeout: ${(timeoutMs / 1000 / 60).toFixed(1)} minutes)...`);
  logger.info(`Network: ${config.networkId === 'undeployed' ? 'Local (fast, ~30-60s)' : 'Preview/Preprod (slow, 5-15+ minutes) — This cannot be rushed.'}`);

  try {
    return await Rx.firstValueFrom(
      wallet.state().pipe(
        // Throttle updates to reduce log spam - emit at most once every 20 seconds
        Rx.throttleTime(20_000),
        // Detailed progress logging
        Rx.tap((state: any) => {
          const shieldedProgress = state.shielded.state.progress;
          const dustProgress = state.dust.state.progress;
          const unshieldedComplete = state.unshielded.progress?.current >= state.unshielded.progress?.total;

          const shieldedComplete = isProgressStrictlyComplete(shieldedProgress);
          const dustComplete = isProgressStrictlyComplete(dustProgress);
          const elapsed = Date.now() - startTime;

          logger.info(`Sync Progress [${(elapsed / 1000).toFixed(0)}s]:
  Shielded:   ${shieldedProgress?.current ?? 0}/${shieldedProgress?.total ?? 0} ${shieldedComplete ? '✓' : '⏳'}
  Dust:       ${dustProgress?.current ?? 0}/${dustProgress?.total ?? 0} ${dustComplete ? '✓' : '⏳'}
  Unshielded: ${unshieldedComplete ? '✓' : '⏳'}`);
        }),
        // Filter: all three sub-wallets must be completely synced OR the wallet must report isSynced 
        Rx.filter((state: any) => {
          if (state.isSynced) return true;

          const shieldedComplete = isProgressStrictlyComplete(state.shielded.state.progress);
          const dustComplete = isProgressStrictlyComplete(state.dust.state.progress);
          const unshieldedComplete = state.unshielded.progress &&
            state.unshielded.progress.current >= state.unshielded.progress.total;

          return shieldedComplete && dustComplete && unshieldedComplete;
        }),
        // Timeout after network-specific duration
        Rx.timeout({
          each: timeoutMs,
          with: () => Rx.throwError(() =>
            new Error(`⏱️ Wallet sync timeout after ${(timeoutMs / 1000 / 60).toFixed(1)} minutes on ${config.networkId} network.

🔍 What This Means:
  - On Preview/Preprod: Sync is still waiting for wallet state to fully replay from chain history
  - This is expected behavior — the wallet is querying the indexer for all relevant blocks
  - Note: Reaching isSynced=true is NOT the same as full progress completion (which is stricter)

🛠️ Troubleshooting Steps:
1️⃣  On Preview/Preprod: Be patient. Initial sync takes 5-15+ minutes. Still syncing is normal!
2️⃣  Verify indexer WebSocket URL (must include /ws):
    - Preview: wss://indexer.preview.midnight.network/api/v3/graphql/ws
    - Preprod: wss://indexer.preprod.midnight.network/api/v3/graphql/ws
3️⃣  Check indexer connectivity:
    curl https://indexer.${config.networkId}.midnight.network/api/v3/graphql
4️⃣  Ensure you have DUST tokens on ${config.networkId === 'preprod' ? 'Preprod' : 'Preview'}:
    - Hold tNIGHT tokens
    - Register for DUST generation
    - Wait 1-2 minutes for DUST to accrue
5️⃣  If sync never completes after 20+ minutes, restart the deployment process`)
          ),
        })
      )
    );
  } catch (err: any) {
    logger.error(`Wallet sync failed: ${err.message}`);
    throw err;
  } finally {
    const elapsed = Date.now() - startTime;
    logger.info(`Wallet sync completed in ${(elapsed / 1000).toFixed(1)}s`);
  }
}

export function generateWalletSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('hex');
}
