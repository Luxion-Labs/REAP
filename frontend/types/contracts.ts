/**
 * REAP Contract Types
 * Shared domain types derived from the Compact contract ledger shapes.
 * These match the Ledger structures in the build artifacts.
 */

// ─── Encoding Helpers ────────────────────────────────────────────────────────

/** Raw Bytes<32> from a contract circuit — 32-byte Uint8Array */
export type Bytes32 = Uint8Array;

/** Raw Bytes<64> from a contract circuit — 64-byte Uint8Array */
export type Bytes64 = Uint8Array;

// ─── Property Registry ───────────────────────────────────────────────────────

/**
 * On-chain property status codes (enum index from Compact).
 * Maps to the PropertyStatus enum in property_registry.compact
 */
export const PROPERTY_STATUS = {
  PENDING: 0,
  REGISTERED: 1,
  VERIFIED: 2,
  TOKENIZED: 3,
  TRANSFERRED: 4,
  DEACTIVATED: 5,
} as const;

export type PropertyStatusCode = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];

export interface OnChainProperty {
  /** Bytes<32> owner address */
  owner: Bytes32;
  /** Status enum index */
  status: PropertyStatusCode;
  /** Valuation in DUST units (bigint) */
  valuation: bigint;
  /** Bytes<64> location hash */
  locationHash: Bytes64;
  /** Bytes<64> document hash */
  documentHash: Bytes64;
}

/** Decoded property for UI display */
export interface PropertyData {
  propertyId: string;
  owner: string;
  status: PropertyStatusCode;
  statusLabel: string;
  valuation: bigint;
  locationHash: string;
  documentHash: string;
}

// ─── Fractional Token ────────────────────────────────────────────────────────

/**
 * Token state codes (enum index from Compact).
 * Maps to the TokenState enum in fractional_token.compact
 */
export const TOKEN_STATE = {
  INACTIVE: 0,
  ACTIVE: 1,
  PAUSED: 2,
} as const;

export type TokenStateCode = typeof TOKEN_STATE[keyof typeof TOKEN_STATE];

export interface TokenBalance {
  holder: string;
  balance: bigint;
}

export interface TokenInfo {
  totalSupply: bigint;
  circulatingSupply: bigint;
  state: TokenStateCode;
  stateLabel: string;
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

export const LISTING_STATUS = {
  ACTIVE: 0,
  SOLD: 1,
  CANCELLED: 2,
} as const;

export type ListingStatusCode = typeof LISTING_STATUS[keyof typeof LISTING_STATUS];

export interface MarketplaceListing {
  listingId: string;
  seller: string;
  tokenId: string;
  quantity: bigint;
  pricePerToken: bigint;
  status: ListingStatusCode;
  statusLabel: string;
}

// ─── Verification ────────────────────────────────────────────────────────────

export const VERIFICATION_TYPE = {
  KYC: 'KYC',
  AML: 'AML',
  ACCREDITED: 'ACCREDITED',
} as const;

export type VerificationType = typeof VERIFICATION_TYPE[keyof typeof VERIFICATION_TYPE];

export const VERIFICATION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

export type VerificationStatusCode = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

export interface VerificationRequest {
  requestId: string;
  user: string;
  verificationType: VerificationType;
  status: VerificationStatusCode;
  statusLabel: string;
}

// ─── Escrow ──────────────────────────────────────────────────────────────────

export const ESCROW_STATUS = {
  LOCKED: 0,
  RELEASED: 1,
  REFUNDED: 2,
  DISPUTED: 3,
} as const;

export type EscrowStatusCode = typeof ESCROW_STATUS[keyof typeof ESCROW_STATUS];

export interface EscrowInfo {
  escrowId: string;
  buyer: string;
  seller: string;
  amount: bigint;
  status: EscrowStatusCode;
  statusLabel: string;
}

// ─── Access Control ──────────────────────────────────────────────────────────

export const ROLE_TYPE = {
  ADMIN: 0,
  OPERATOR: 1,
  VERIFIED_BUYER: 2,
  UNVERIFIED: 3,
} as const;

export type RoleCode = typeof ROLE_TYPE[keyof typeof ROLE_TYPE];

// ─── Transaction Results ─────────────────────────────────────────────────────

export interface TxResult {
  txId: string;
  blockHeight: number;
  contractAddress: string;
}

export interface ContractCallResult<T = void> {
  tx: TxResult;
  result?: T;
}

// ─── Contract State Observable ───────────────────────────────────────────────

export interface ContractStateSnapshot {
  propertyCount: bigint;
  totalTokenSupply: bigint;
  systemOperational: boolean;
  pendingVerifications: bigint;
  lastUpdated: Date;
}

// ─── Shared Error Types ───────────────────────────────────────────────────────

export interface ContractError {
  code: string;
  message: string;
  circuit?: string;
  raw?: unknown;
}
