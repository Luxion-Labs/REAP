/**
 * Wallet types and interfaces for Midnight Network integration.
 *
 * Based on:
 *   - DApp Connector API: https://docs.midnight.network/api-reference/dapp-connector
 *   - Wallet SDK Guide: https://docs.midnight.network/sdks/official/wallet-developer-guide
 *   - Mesh SDK Wallet: https://meshjs.dev/midnight/midnight-setup/wallet
 */

// ─── Provider Types ──────────────────────────────────────────────────────────

export type WalletProvider = 'lace' | 'midnight' | 'metamask' | 'walletconnect';

// ─── Core Wallet State ───────────────────────────────────────────────────────

export interface MidnightWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  provider: WalletProvider | null;
  error: string | null;

  // Midnight-specific state from walletAPI.state()
  coinPublicKey: string | null;
  encryptionPublicKey: string | null;

  // Midnight three-token balances (from DApp Connector ConnectedAPI)
  balances: MidnightBalances | null;

  // Midnight addresses (Bech32m encoded)
  addresses: MidnightAddresses | null;

  // Service URIs from wallet config
  serviceConfig: MidnightServiceConfig | null;

  // Legacy fields (optional)
  addressLegacy?: string | null;
  coinPublicKeyLegacy?: string | null;
  encryptionPublicKeyLegacy?: string | null;

  // Wallet metadata
  walletName: string | null;
  walletIcon: string | null;
  apiVersion: string | null;
  networkId: string | null;

  // Capabilities (optional)
  capabilities?: {
    walletTransfer?: boolean;
    coinEnum?: boolean;
  };
}

/** Alias for backward compatibility */
export type WalletState = MidnightWalletState;

// ─── Midnight Balances (Three-Token Model) ───────────────────────────────────

/**
 * Midnight uses three token types:
 * - Unshielded: NIGHT tokens (transparent, UTxO-based)
 * - Shielded: Privacy-preserving tokens using ZK proofs
 * - DUST: Transaction fee token generated from registered NIGHT
 *
 * Balances are returned as Record<tokenType, amount> from the DApp Connector.
 */
export interface MidnightBalances {
  /** Record<tokenType, amount> for unshielded tokens (NIGHT) */
  unshielded: Record<string, string>;
  /** Record<tokenType, amount> for shielded tokens */
  shielded: Record<string, string>;
  /** DUST balance information */
  dust: {
    cap: string;
    balance: string;
  } | null;
}

// ─── Midnight Addresses (Bech32m Encoded) ────────────────────────────────────

/**
 * Midnight address types with Bech32m encoding:
 * - mn_addr / mn_addr_preprod: Unshielded payment addresses
 * - mn_shield-addr / mn_shield-addr_preprod: Shielded addresses
 * - mn_dust / mn_dust_preprod: DUST addresses
 */
export interface MidnightAddresses {
  unshielded: string | null;
  shielded: string | null;
  dust: string | null;
}

// ─── Service Configuration ───────────────────────────────────────────────────

export interface MidnightServiceConfig {
  indexerUri: string;
  indexerWsUri: string;
  proverServerUri: string;
}

// ─── Wallet Configuration ────────────────────────────────────────────────────

export interface WalletConfig {
  provider: WalletProvider;
  name: string;
  icon: string;
  description: string;
}

// ─── Connection Result ───────────────────────────────────────────────────────

export interface WalletConnectionResult {
  success: boolean;
  address?: string;
  error?: string;
  provider?: WalletProvider;
  coinPublicKey?: string;
  encryptionPublicKey?: string;
}

// ─── Error Types ─────────────────────────────────────────────────────────────

export const WALLET_ERRORS = {
  NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  NOT_ENABLED: 'WALLET_NOT_ENABLED',
  CONNECTION_REJECTED: 'CONNECTION_REJECTED',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_REJECTED: 'USER_REJECTED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type WalletErrorType = typeof WALLET_ERRORS[keyof typeof WALLET_ERRORS];

// ─── Network Configurations ─────────────────────────────────────────────────

export const MIDNIGHT_NETWORK_IDS = {
  MAINNET: 'mainnet',
  PREPROD: 'preprod',
  PREVIEW: 'preview',
  UNDEPLOYED: 'undeployed',
} as const;

export type MidnightNetworkId = typeof MIDNIGHT_NETWORK_IDS[keyof typeof MIDNIGHT_NETWORK_IDS];

// Default network for REAP
export const DEFAULT_NETWORK_ID: MidnightNetworkId = 'preprod';