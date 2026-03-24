import type { InitialAPI as DAppInitialAPI, ConnectedAPI as DAppConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

/**
 * Official Mesh / WalletAPI structure for Midnight.
 */
export interface MidnightWalletAPI {
  /** Retrieves coinPublicKey, encryptionPublicKey, and address */
  state(): Promise<{
    address: string;
    coinPublicKey: string;
    encryptionPublicKey: string;
    /** Current token balance for the primary token */
    balance?: bigint; 
  }>;
  /** Balancing and proving for contracts */
  balanceAndProveTransaction(tx: unknown, newCoins: unknown): Promise<unknown>;
  /** Direct transaction submission */
  submitTransaction(tx: unknown): Promise<unknown>;
}

/**
 * Augmented InitialAPI that handles both Mesh and DApp Connector patterns.
 */
export interface MidnightInitialAPI extends DAppInitialAPI {
  /** Mesh SDK / legacy connect method */
  enable(): Promise<MidnightWalletAPI>;
  /** End the session */
  disconnect(): Promise<void>;
  /** Get service URLs */
  serviceUriConfig(): Promise<{
    indexerUri: string;
    indexerWsUri: string;
    proverServerUri: string;
  }>;
}

/**
 * Standard DApp Connector API
 */
export type MidnightConnectedAPI = DAppConnectedAPI;

declare global {
  interface Window {
    midnight?: {
      mnLace?: MidnightInitialAPI;
      [key: string]: MidnightInitialAPI | undefined;
    };
  }
}
