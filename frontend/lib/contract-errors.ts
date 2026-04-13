/**
 * REAP Contract Error Handler
 *
 * Maps raw Midnight SDK / circuit errors to user-friendly messages.
 * Pattern: try/catch around every callTx.* call; run through this handler.
 */

import type { ContractError } from '@/types/contracts';

// ─── Known Error Codes ────────────────────────────────────────────────────────

export const CONTRACT_ERROR_MESSAGES: Record<string, string> = {
  // Auth / admin
  admin_check_failed: 'Only contract admins can perform this action.',
  caller_not_admin: 'Only contract admins can perform this action.',
  unauthorized: 'You are not authorized to perform this action.',

  // Property Registry
  property_already_registered: 'This property ID is already registered on-chain.',
  property_not_found: 'Property not found on the ledger.',
  property_not_verified: 'Property must be verified before tokenization.',
  registry_paused: 'Property registry is currently paused.',
  registry_not_initialized: 'Registry contract not yet initialized.',
  insufficient_registration_fee: 'Insufficient DUST to pay registration fee.',

  // Fractional Token
  token_already_initialized: 'This token contract is already initialized.',
  token_paused: 'Token contract is currently paused.',
  insufficient_balance: 'Insufficient token balance for this operation.',
  insufficient_allowance: 'Insufficient allowance. Approve tokens first.',
  burn_exceeds_supply: 'Cannot burn more than total supply.',

  // Marketplace
  listing_not_found: 'Listing not found on-chain.',
  listing_already_sold: 'This listing has already been sold.',
  listing_cancelled: 'This listing has been cancelled.',
  insufficient_quantity: 'Requested quantity exceeds available listing.',
  price_mismatch: 'Payment amount does not match listing price.',

  // Escrow
  escrow_not_found: 'Escrow record not found.',
  escrow_already_released: 'Escrow has already been released.',
  escrow_locked: 'Escrow funds are currently locked.',
  escrow_dispute_active: 'An active dispute exists for this escrow.',

  // Verification
  verification_pending: 'Verification request is still pending review.',
  verification_rejected: 'Verification was rejected by the admin.',
  already_verified: 'This user/request is already verified.',
  request_not_found: 'Verification request not found.',

  // Wallet / network
  wallet_not_connected: 'Please connect your Lace wallet first.',
  insufficient_dust: 'Insufficient DUST in your wallet for transaction fees.',
  proof_server_unavailable: 'Proof server is not running. Please start it with Docker.',
  network_mismatch: 'Wallet is on the wrong network. Switch to Midnight Preprod.',
  transaction_failed: 'Transaction failed to submit. Please try again.',
  timeout: 'Transaction timed out. Check the indexer or try again.',
};

// ─── Error Parser ─────────────────────────────────────────────────────────────

/**
 * Parses a raw contract/circuit error into a structured ContractError.
 */
export function parseContractError(error: unknown, circuit?: string): ContractError {
  const raw = error instanceof Error ? error : new Error(String(error));
  const msg = raw.message.toLowerCase();

  // Try to match known error codes by substring scan
  for (const [code, message] of Object.entries(CONTRACT_ERROR_MESSAGES)) {
    if (msg.includes(code.replace(/_/g, ' ')) || msg.includes(code)) {
      return { code, message, circuit, raw: error };
    }
  }

  // Wallet-level errors
  if (msg.includes('dust') && msg.includes('insufficient')) {
    return { code: 'insufficient_dust', message: CONTRACT_ERROR_MESSAGES.insufficient_dust, circuit, raw: error };
  }
  if (msg.includes('proof server') || msg.includes('prover')) {
    return { code: 'proof_server_unavailable', message: CONTRACT_ERROR_MESSAGES.proof_server_unavailable, circuit, raw: error };
  }
  if (msg.includes('network')) {
    return { code: 'network_mismatch', message: CONTRACT_ERROR_MESSAGES.network_mismatch, circuit, raw: error };
  }
  if (msg.includes('timeout')) {
    return { code: 'timeout', message: CONTRACT_ERROR_MESSAGES.timeout, circuit, raw: error };
  }

  // Generic fallback
  return {
    code: 'transaction_failed',
    message: raw.message || CONTRACT_ERROR_MESSAGES.transaction_failed,
    circuit,
    raw: error,
  };
}

// ─── withContractCall ─────────────────────────────────────────────────────────

/**
 * Wraps a contract circuit call with error handling and structured result.
 *
 * Usage:
 *   const [result, error] = await withContractCall(
 *     () => deployed.callTx.registerProperty(...),
 *     'registerProperty'
 *   );
 */
export async function withContractCall<T>(
  fn: () => Promise<T>,
  circuit?: string,
): Promise<[T, null] | [null, ContractError]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const parsed = parseContractError(error, circuit);
    console.error(`[REAP] Circuit "${circuit ?? 'unknown'}" failed:`, error);
    return [null, parsed];
  }
}

// ─── Human-readable TX result ─────────────────────────────────────────────────

/**
 * Extracts txId and blockHeight from a callTx result.
 * Circuit calls return: { public: { txId, blockHeight } }
 */
export function extractTxInfo(txResult: any, contractAddress: string): { txId: string; blockHeight: number; contractAddress: string } {
  return {
    txId: txResult?.public?.txId ?? txResult?.txId ?? 'unknown',
    blockHeight: txResult?.public?.blockHeight ?? txResult?.blockHeight ?? 0,
    contractAddress,
  };
}
