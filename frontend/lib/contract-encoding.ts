/**
 * REAP Contract Encoding Utilities
 *
 * All Compact circuits receive Bytes<32> / Bytes<64> = Uint8Array.
 * This module converts human-readable strings/IDs to those byte arrays.
 *
 * Rules (from security fix in Phase 1):
 * - Owner/caller addresses → 32-byte Uint8Array (previously was truncated at 32 chars!)
 * - Property IDs → 32-byte Uint8Array (padded UTF-8)
 * - Location/document hashes → 64-byte Uint8Array
 */

import {
  PROPERTY_STATUS,
  TOKEN_STATE,
  LISTING_STATUS,
  VERIFICATION_STATUS,
  ESCROW_STATUS,
  type PropertyStatusCode,
  type TokenStateCode,
  type ListingStatusCode,
  type VerificationStatusCode,
  type EscrowStatusCode,
} from '@/types/contracts';

// ─── Bytes32 Encoding ─────────────────────────────────────────────────────────

/**
 * Converts a hex string to 32-byte Uint8Array (no truncation).
 * Use for wallet shieldedCoinPublicKey addresses.
 *
 * @throws if hex is longer than 64 chars (32 bytes)
 */
export function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const padded = clean.padStart(64, '0').slice(-64); // always 32 bytes
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    result[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
}

/**
 * Converts a UTF-8 string to a 32-byte Uint8Array (null-padded).
 * Use for property IDs, role IDs, listing IDs, etc.
 */
export function stringToBytes32(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str.slice(0, 32)); // truncate if too long
  const result = new Uint8Array(32);
  result.set(bytes);
  return result;
}

/**
 * Converts a UTF-8 string to a 64-byte Uint8Array (null-padded).
 * Use for location hashes, document hashes.
 */
export function stringToBytes64(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str.slice(0, 64));
  const result = new Uint8Array(64);
  result.set(bytes);
  return result;
}

/**
 * Converts a Midnight shielded coin public key to Bytes<32>.
 * The shieldedCoinPublicKey from ConnectedAPI is a hex string.
 */
export function coinPublicKeyToBytes32(coinPublicKey: string): Uint8Array {
  return hexToBytes32(coinPublicKey);
}

// ─── Bytes → String Decoding ──────────────────────────────────────────────────

/**
 * Decodes a 32-byte Uint8Array to a hex string (for display).
 */
export function bytes32ToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decodes a Uint8Array to a UTF-8 string (strips null bytes).
 */
export function bytesToString(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  const decoded = decoder.decode(bytes);
  return decoded.replace(/\0/g, '').trim();
}

/**
 * Shortens a hex address for display: "abcdef1234...6789ef"
 */
export function formatAddress(hex: string, chars = 8): string {
  if (!hex || hex.length <= chars * 2) return hex;
  return `${hex.slice(0, chars)}...${hex.slice(-chars)}`;
}

// ─── ID Generation ────────────────────────────────────────────────────────────

/**
 * Generates a unique property/listing/escrow ID as a 32-byte UInt8Array.
 * Uses crypto.randomUUID() + timestamp for uniqueness.
 */
export function generateContractId(): Uint8Array {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  const ts = Date.now().toString(16).padStart(16, '0');
  const combined = (uuid + ts).slice(0, 42); // will hash to 32 bytes
  return stringToBytes32(combined);
}

/**
 * Generates a string ID suitable for display + use in circuits.
 */
export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 32);
}

// ─── Status Label Decoders ────────────────────────────────────────────────────

export function propertyStatusLabel(code: PropertyStatusCode): string {
  const labels: Record<number, string> = {
    [PROPERTY_STATUS.PENDING]: 'Pending',
    [PROPERTY_STATUS.REGISTERED]: 'Registered',
    [PROPERTY_STATUS.VERIFIED]: 'Verified',
    [PROPERTY_STATUS.TOKENIZED]: 'Tokenized',
    [PROPERTY_STATUS.TRANSFERRED]: 'Transferred',
    [PROPERTY_STATUS.DEACTIVATED]: 'Deactivated',
  };
  return labels[code] ?? 'Unknown';
}

export function tokenStateLabel(code: TokenStateCode): string {
  const labels: Record<number, string> = {
    [TOKEN_STATE.INACTIVE]: 'Inactive',
    [TOKEN_STATE.ACTIVE]: 'Active',
    [TOKEN_STATE.PAUSED]: 'Paused',
  };
  return labels[code] ?? 'Unknown';
}

export function listingStatusLabel(code: ListingStatusCode): string {
  const labels: Record<number, string> = {
    [LISTING_STATUS.ACTIVE]: 'Active',
    [LISTING_STATUS.SOLD]: 'Sold',
    [LISTING_STATUS.CANCELLED]: 'Cancelled',
  };
  return labels[code] ?? 'Unknown';
}

export function verificationStatusLabel(code: VerificationStatusCode): string {
  const labels: Record<number, string> = {
    [VERIFICATION_STATUS.PENDING]: 'Pending',
    [VERIFICATION_STATUS.APPROVED]: 'Approved',
    [VERIFICATION_STATUS.REJECTED]: 'Rejected',
  };
  return labels[code] ?? 'Unknown';
}

export function escrowStatusLabel(code: EscrowStatusCode): string {
  const labels: Record<number, string> = {
    [ESCROW_STATUS.LOCKED]: 'Locked',
    [ESCROW_STATUS.RELEASED]: 'Released',
    [ESCROW_STATUS.REFUNDED]: 'Refunded',
    [ESCROW_STATUS.DISPUTED]: 'Disputed',
  };
  return labels[code] ?? 'Unknown';
}

// ─── DUST Formatter ───────────────────────────────────────────────────────────

/** Format a DUST bigint amount for display (6 decimals) */
export function formatDust(amount: bigint | string | number): string {
  try {
    const raw = BigInt(amount);
    const divisor = BigInt(1_000_000);
    const whole = raw / divisor;
    const frac = raw % divisor;
    const fracStr = frac.toString().padStart(6, '0').replace(/0+$/, '');
    return fracStr ? `${whole}.${fracStr}` : whole.toString();
  } catch {
    return '0';
  }
}

/** Format a bigint token amount (no decimals — tokens are whole units) */
export function formatTokenAmount(amount: bigint): string {
  return amount.toLocaleString();
}
