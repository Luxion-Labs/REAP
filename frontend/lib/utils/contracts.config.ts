/**
 * REAP Contract Addresses Configuration
 *
 * These are populated after running: cd packages/midnight && npm run deploy
 * The deployment outputs a deployments/addresses.json which maps here.
 *
 * HOW TO UPDATE:
 * 1. Run `npm run deploy` in packages/midnight/
 * 2. Copy the contract addresses from the output
 * 3. Replace the placeholder strings below with real addresses
 * 4. Commit contracts.config.ts (it is not secret — addresses are public on-chain)
 */

// ─── Network Config ───────────────────────────────────────────────────────────

export const NETWORK_ID = (process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK_ID ?? 'preprod') as
  | 'preprod'
  | 'mainnet'
  | 'undeployed';

export const NETWORK_CONFIG = {
  preprod: {
    indexerUri: 'https://indexer.preprod.midnight.network/api/v3/graphql',
    indexerWsUri: 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws',
    nodeUri: 'https://rpc.preprod.midnight.network',
    proofServerUri: process.env.NEXT_PUBLIC_PROOF_SERVER_URI ?? 'http://127.0.0.1:6300',
  },
  mainnet: {
    indexerUri: 'https://indexer.midnight.network/api/v3/graphql',
    indexerWsUri: 'wss://indexer.midnight.network/api/v3/graphql/ws',
    nodeUri: 'https://rpc.midnight.network',
    proofServerUri: process.env.NEXT_PUBLIC_PROOF_SERVER_URI ?? 'http://127.0.0.1:6300',
  },
  undeployed: {
    indexerUri: 'http://localhost:8088/api/v3/graphql',
    indexerWsUri: 'ws://localhost:8088/api/v3/graphql/ws',
    nodeUri: 'http://localhost:9944',
    proofServerUri: 'http://localhost:6300',
  },
} as const;

export const ACTIVE_NETWORK = NETWORK_CONFIG[NETWORK_ID];

// ─── Contract Addresses ───────────────────────────────────────────────────────

/**
 * After deployment, replace the null values with actual contract addresses.
 * Format: Base58 / Bech32m contract address string from Midnight indexer.
 *
 * Example: "mn_contract1qz9...abc"
 */
export const CONTRACT_ADDRESSES = {
  // UNIFIED V3: Single address for all modules
  unified: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  
  // Legacy mappings (can point to unified during transition)
  main: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  propertyRegistry: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  fractionalToken: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  marketplace: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  verification: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  escrow: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  accessControl: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  auditLog: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
  role: process.env.NEXT_PUBLIC_CONTRACT_REAP ?? null,
};

/**
 * Returns the contract address for a given key, throwing if not configured.
 */
export function requireContractAddress(key: keyof typeof CONTRACT_ADDRESSES): string {
  const addr = CONTRACT_ADDRESSES[key];
  if (!addr) {
    throw new Error(
      `Contract address for "${key}" is not configured. ` +
      `Set NEXT_PUBLIC_CONTRACT_${key.toUpperCase().replace(/([A-Z])/g, '_$1')} ` +
      `in your .env file or deploy contracts first.`
    );
  }
  return addr;
}

/**
 * Returns true if all P0 contracts are deployed and configured.
 */
export function areContractsDeployed(): boolean {
  const p0 = ['propertyRegistry', 'fractionalToken', 'main'];
  return p0.every((k) => !!CONTRACT_ADDRESSES[k as keyof typeof CONTRACT_ADDRESSES]);
}

/**
 * Returns a list of contracts that are missing addresses.
 */
export function getMissingContracts(): string[] {
  return Object.entries(CONTRACT_ADDRESSES)
    .filter(([, v]) => !v)
    .map(([k]) => k);
}
