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

  const walletConfig = {
    networkId: config.networkId,
    costParameters: {
      additionalFeeOverhead: 300_000_000_000_000n,
      feeBlocksMargin: 5,
    },
    indexerClientConnection: {
      indexerHttpUrl: config.indexer,
      indexerWsUrl: config.indexerWS,
    },
    provingServerUrl: new URL(config.proofServer),
    relayURL: new URL(config.node.replace(/^http/, 'ws')),
    txHistoryStorage: new InMemoryTransactionHistoryStorage(),
  } as any;

  logger.info('Initializing WalletFacade...');
  let wallet;
  try {
    wallet = await WalletFacade.init({
      configuration: walletConfig,
      unshielded: (cfg: typeof walletConfig) => UnshieldedWallet(cfg).startWithPublicKey(
        PublicKey.fromKeyStore(unshieldedKeystore)
      ),
      shielded: (cfg: typeof walletConfig) => ShieldedWallet(cfg).startWithSecretKeys(shieldedSecretKeys),
      dust: (cfg: typeof walletConfig) => DustWallet(cfg).startWithSecretKey(
        dustSecretKey, 
        ledger.LedgerParameters.initialParameters().dust
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
  const state = await firstValueFrom(
    wallet.state().pipe(
      tap((s: any) => {
        logger.info(`Wallet state update: synced=${s.isSynced}, address=${UnshieldedAddress.codec.encode(config.networkId, s.unshielded.address).toString()}`);
      }),
      filter((s: any) => s.isSynced)
    )
  );
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

export async function waitForSync(wallet: WalletFacade, config: AppConfig) {
  return Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.filter((state: any) => {
        if (!state.isSynced) {
          logger.info(`Syncing... (Address: ${UnshieldedAddress.codec.encode(config.networkId, state.unshielded.address).toString()})`);
        }
        return state.isSynced;
      })
    )
  );
}

export function generateWalletSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('hex');
}
