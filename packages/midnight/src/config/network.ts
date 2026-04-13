// Network configurations for Midnight Networks
// Reference: https://docs.midnight.network/

/** ✅ Testnet-02 (Legacy) - Still functional but being superseded by preview */
export const TESTNET_CONFIG = {
  indexer: "https://indexer.testnet-02.midnight.network/api/v1/graphql",
  indexerWS: "wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws",
  node: "https://rpc.testnet-02.midnight.network",
  proofServer: "http://127.0.0.1:6300",
  faucet: "https://faucet.testnet-02.midnight.network/api/request-tokens",
  networkId: "testnet-02",
} as const;

/** ✅ Preview Network (Early Development) - Uses Local Proof Server */
export const PREVIEW_CONFIG = {
  indexer: "https://indexer.preview.midnight.network/api/v4/graphql",
  indexerWS: "wss://indexer.preview.midnight.network/api/v4/graphql/ws",
  node: "https://rpc.preview.midnight.network",
  proofServer: "http://127.0.0.1:6300",
  faucet: "https://faucet.preview.midnight.network",
  networkId: "preview",
} as const;

/** 🎯 Preprod Network (STAGING - Final Testing Before Mainnet) - Uses Local Proof Server */
export const PREPROD_CONFIG = {
  indexer: "https://indexer.preprod.midnight.network/api/v4/graphql",
  indexerWS: "wss://indexer.preprod.midnight.network/api/v4/graphql/ws",
  node: "https://rpc.preprod.midnight.network",
  proofServer: "http://127.0.0.1:6300",
  faucet: "https://faucet.preprod.midnight.network",
  networkId: "preprod",
  blockExplorer: "https://explorer.preprod.midnight.network",
} as const;

/** 🔮 Mainnet Config (Currently points to preview, will update when mainnet launches) */
export const MAINNET_CONFIG = {
  indexer: "https://indexer.mainnet.midnight.network/api/v3/graphql",
  indexerWS: "wss://indexer.mainnet.midnight.network/api/v3/graphql/ws",
  node: "https://rpc.mainnet.midnight.network",
  proofServer: "http://127.0.0.1:6300",
  faucet: null, // ❌ No faucet on mainnet
  networkId: "mainnet",
} as const;

/** 🏠 Undeployed (Local Docker-based testing) - For development/testing only */
export const UNDEPLOYED_CONFIG = {
  indexer: "http://127.0.0.1:8088/api/v1/graphql",
  indexerWS: "ws://127.0.0.1:8088/api/v1/graphql/ws",
  node: "ws://127.0.0.1:9944",
  proofServer: "http://127.0.0.1:6300",
  faucet: null, // Local deployment - use test seeds instead
  networkId: "undeployed",
} as const;

export const NETWORK_IDS = {
  testnet: "testnet-02",
  preview: "preview",
  preprod: "preprod",
  mainnet: "mainnet",
  undeployed: "undeployed",
} as const;

// Type definitions - Union of all possible configs
export type NetworkConfig = 
  | typeof TESTNET_CONFIG
  | typeof PREVIEW_CONFIG
  | typeof PREPROD_CONFIG
  | typeof MAINNET_CONFIG
  | typeof UNDEPLOYED_CONFIG;

export type NetworkId = (typeof NETWORK_IDS)[keyof typeof NETWORK_IDS];

export const CONTRACT_NAMES = [
  "main",
  "propertyRegistry",
  "marketplace",
  "escrow",
  "verification",
  "role",
  "accessControl",
  "auditLog",
  "fractionalToken",
] as const;

export type ContractName = (typeof CONTRACT_NAMES)[number];

export const CONTRACT_PATHS: Record<ContractName, string> = {
  main: "build/REAP",
  propertyRegistry: "build/REAP",
  marketplace: "build/REAP",
  escrow: "build/REAP",
  verification: "build/REAP",
  role: "build/REAP",
  accessControl: "build/REAP",
  auditLog: "build/REAP",
  fractionalToken: "build/REAP",
};

/**
 * ⚡ USAGE GUIDE
 * 
 * For Production/Staging Deployments:
 *   → Use PREPROD_CONFIG (final testing before mainnet) ✅ RECOMMENDED
 *   → Network ID: "preprod"
 *   → Ledger v7 (latest), API v4 (latest GraphQL)
 *   → Proof Server: Local (http://127.0.0.1:6300) OR Remote (https://proof-server.preprod.midnight.network)
 * 
 * For Early Development:
 *   → Use PREVIEW_CONFIG (stable dev environment)
 *   → Network ID: "preview"
 *   → Ledger v6, API v4 GraphQL
 *   → Proof Server: Local (http://127.0.0.1:6300) OR Remote (https://proof-server.preview.midnight.network)
 * 
 * For Local Development:
 *   → Use UNDEPLOYED_CONFIG (requires Docker Compose running)
 *   → Network ID: "undeployed"
 *   → Proof Server: Local at http://127.0.0.1:6300 (via docker-compose)
 *   → Start with: docker-compose up -d
 * 
 * For Legacy Testnet (still works but deprecated):
 *   → Use TESTNET_CONFIG
 *   → Network ID: "testnet-02", API v1 (older)
 *   → Proof Server: Local at http://127.0.0.1:6300
 * 
 * For Future Mainnet:
 *   → Use MAINNET_CONFIG (endpoints ready, not yet active)
 *   → Network ID: "mainnet"
 *   → Proof Server: Local at http://127.0.0.1:6300
 * 
 * Proof Server Options:
 *   → Local: http://127.0.0.1:6300 (run: docker run -p 6300:6300 midnightnetwork/proof-server:latest)
 *   → Preview Remote: https://proof-server.preview.midnight.network
 *   → Preprod Remote: https://proof-server.preprod.midnight.network
 */

// Helper function to get config by network ID
export function getNetworkConfig(
  networkId: NetworkId | string
): NetworkConfig {
  switch (networkId) {
    case "preview":
      return PREVIEW_CONFIG;
    case "preprod":
      return PREPROD_CONFIG;
    case "mainnet":
      return MAINNET_CONFIG;
    case "undeployed":
      return UNDEPLOYED_CONFIG;
    case "testnet-02":
    case "testnet":
    default:
      return TESTNET_CONFIG;
  }
}
