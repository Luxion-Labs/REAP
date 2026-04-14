/**
 * REAP Unified Contract Adapter (V3)
 *
 * This adapter connects to the single 'REAP' unified contract which includes:
 * - Property Registry
 * - Fractional Token
 * - Marketplace
 * - Escrow
 * - Verification
 * - Access Control / Roles
 * - Audit Log
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall } from '@/lib/utils/contract-errors';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Unified private state ID for the REAP system */
export const UNIFIED_PRIVATE_STATE_ID = 'reapState';

// ─── Adapter ──────────────────────────────────────────────────────────────────

export class REAPUnifiedAdapter {
  /** The single 'deployed' contract instance from findDeployedContract */
  public deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  /** 
   * Connect to the unified contract. 
   * This loads 'build/REAP/contract/index.js'.
   */
  async connect(): Promise<void> {
    if (this.deployed) return;

    console.log(`[REAP] Connecting to UNIFIED contract at ${this.contractAddress}`);

    // Load the unified contract module
    // We expect the 'REAP' build to be available at /contracts/REAP/
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/REAP/contract/index.js');

    // Instantiate and connect
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: UNIFIED_PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('[REAP] Unified contract connected successfully');
  }

  /** Checks if connection is ready */
  public isOpen(): boolean {
    return !!this.deployed;
  }

  /** Shorthand to call circuits directly if needed */
  public get circuits() {
    if (!this.deployed) throw new Error('REAPUnifiedAdapter: not connected');
    return this.deployed.callTx;
  }
}
