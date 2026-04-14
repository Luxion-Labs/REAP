/**
 * REAP Browser Provider Factory
 *
 * Builds the full Midnight SDK provider set for browser / Next.js context.
 * Uses FetchZkConfigProvider (HTTP) — NOT NodeZkConfigProvider (fs-based).
 *
 * Pattern sourced from:
 *   - example-bboard: bboard-ui/src/contexts/BrowserDeployedBoardManager.ts
 *   - Official tutorial: https://docs.midnight.network/getting-started/deploy-mn-app
 *
 * Called ONCE after wallet connects. Returns { providers, connectedAPI }.
 */

'use client';

import {
  type FinalizedTransaction,
  type TransactionId,
  Transaction,
} from '@midnight-ntwrk/ledger-v8';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import type {
  UnboundTransaction,
} from '@midnight-ntwrk/midnight-js-types';
import { toHex, fromHex } from '@midnight-ntwrk/midnight-js-utils';

import { ACTIVE_NETWORK } from './utils/contracts.config';

// ─── In-memory private state provider (browser-safe) ─────────────────────────

type PrivateStateStore = Map<string, unknown>;

function inMemoryPrivateStateProvider() {
  const store: PrivateStateStore = new Map();
  return {
    get: async (id: string) => store.get(id) ?? null,
    set: async (id: string, value: unknown) => { store.set(id, value); },
    delete: async (id: string) => { store.delete(id); },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface REAPProviders {
  publicDataProvider: ReturnType<typeof indexerPublicDataProvider>;
  zkConfigProvider: FetchZkConfigProvider<string>;
  proofProvider: ReturnType<typeof httpClientProofProvider>;
  privateStateProvider: ReturnType<typeof inMemoryPrivateStateProvider>;
  walletProvider: {
    getCoinPublicKey(): string;
    getEncryptionPublicKey(): string;
    balanceTx(tx: UnboundTransaction, ttl?: Date): Promise<FinalizedTransaction>;
  };
  midnightProvider: {
    submitTx(tx: FinalizedTransaction): Promise<TransactionId>;
  };
}

export interface REAPProvidersBundle {
  providers: REAPProviders;
  connectedAPI: ConnectedAPI;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

/**
 * Builds all Midnight providers from an already-connected DApp Connector API.
 *
 * @param connectedAPI  Result of `initialAPI.connect(networkId)` from wallet provider.
 * @param zkBasePath    Base URL for ZK artifact fetching.
 *                      In Next.js: `${window.location.origin}/contracts`
 *
 * The wallet provides service URIs automatically — no hardcoding needed.
 */
export async function buildREAPProviders(
  connectedAPI: ConnectedAPI,
  zkBasePath?: string,
): Promise<REAPProvidersBundle> {
  // 1. Get service URIs from wallet (indexer, proof server)
  const config = await connectedAPI.getConfiguration();
  const indexerUri = config.indexerUri ?? ACTIVE_NETWORK.indexerUri;
  const indexerWsUri = config.indexerWsUri ?? ACTIVE_NETWORK.indexerWsUri;
  const proverUri = config.proverServerUri ?? ACTIVE_NETWORK.proofServerUri;

  // 2. Get shielded wallet keys for walletProvider
  const shieldedAddresses = await connectedAPI.getShieldedAddresses();

  // 3. ZK config provider — fetches artifacts from public/ via HTTP
  const zkPath = zkBasePath ?? (
    typeof window !== 'undefined'
      ? `${window.location.origin}/contracts`
      : ACTIVE_NETWORK.indexerUri // fallback — won't matter server-side
  );
  const zkConfigProvider = new FetchZkConfigProvider<string>(zkPath, fetch.bind(globalThis));

  // 4. Build all providers
  const providers: REAPProviders = {
    publicDataProvider: indexerPublicDataProvider(indexerUri, indexerWsUri),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(proverUri, zkConfigProvider),
    privateStateProvider: inMemoryPrivateStateProvider(),

    walletProvider: {
      getCoinPublicKey(): string {
        return shieldedAddresses.shieldedCoinPublicKey;
      },
      getEncryptionPublicKey(): string {
        return shieldedAddresses.shieldedEncryptionPublicKey;
      },
      async balanceTx(tx: UnboundTransaction, ttl?: Date): Promise<FinalizedTransaction> {
        const serializedTx = toHex(tx.serialize());
        const received = await connectedAPI.balanceUnsealedTransaction(serializedTx);
        return Transaction.deserialize(
          'signature',
          'proof',
          'binding',
          fromHex(received.tx),
        ) as unknown as FinalizedTransaction;
      },
    },

    midnightProvider: {
      async submitTx(tx: FinalizedTransaction): Promise<TransactionId> {
        await connectedAPI.submitTransaction(toHex((tx as any).serialize()));
        const identifiers = (tx as any).identifiers?.() ?? [];
        return identifiers[0] ?? '';
      },
    },
  };

  return { providers, connectedAPI };
}

// ─── Ledger State Reader (no wallet required) ─────────────────────────────────

/**
 * Reads on-chain ledger state for a contract.
 * Use this for read-only queries that don't require signing.
 */
export async function queryContractState<T>(
  providers: REAPProviders,
  contractAddress: string,
  ledgerFn: (state: any) => T,
): Promise<T | null> {
  try {
    const state = await providers.publicDataProvider.queryContractState(contractAddress);
    if (!state) return null;
    return ledgerFn(state.data);
  } catch (err) {
    console.error('[REAP] queryContractState error:', err);
    return null;
  }
}
