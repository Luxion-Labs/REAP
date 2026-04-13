/**
 * Property Registry Contract Adapter
 *
 * Wraps the raw findDeployedContract + callTx circuits with:
 * - Argument encoding (string → Bytes32/64)
 * - Error handling
 * - Typed return values
 *
 * Circuit signatures from packages/midnight/build/property_registry/contract/index.d.ts
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import {
  stringToBytes32,
  stringToBytes64,
  coinPublicKeyToBytes32,
  bytes32ToHex,
  bytesToString,
  propertyStatusLabel,
  generateId,
} from '@/lib/contract-encoding';
import type { PropertyData, TxResult } from '@/types/contracts';

// ─── Private State Shape ──────────────────────────────────────────────────────

interface PropertyRegistryPrivateState { }
const PRIVATE_STATE_ID = 'propertyRegistryState';

// ─── Adapter ──────────────────────────────────────────────────────────────────

export class PropertyRegistryAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) { }

  /** Connect to the deployed contract. Must be called before any circuit calls. */
  async connect(): Promise<void> {
    if (this.deployed) return;

    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/property_registry/contract/index.js');

    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as PropertyRegistryPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('PropertyRegistryAdapter: call connect() first.');
  }

  // ── Write Circuits ───────────────────────────────────────────────────────

  /**
   * Register a new property on-chain.
   * Caller must be the property owner.
   */
  async registerProperty(
    propertyId: string,
    ownerCoinPublicKey: string,
    valuation: bigint,
    locationHash: string,
    documentHash: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.registerProperty(
        stringToBytes32(propertyId || generateId()),
        coinPublicKeyToBytes32(ownerCoinPublicKey),
        valuation,
        stringToBytes64(locationHash),
        stringToBytes64(documentHash),
      ),
      'registerProperty',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  /**
   * Update the status of an existing property.
   * Caller must be admin.
   */
  async updatePropertyStatus(
    propertyId: string,
    newStatus: number,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.updatePropertyStatus(
        stringToBytes32(propertyId),
        newStatus,
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'updatePropertyStatus',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  /**
   * Transfer property ownership to a new owner.
   */
  async transferProperty(
    propertyId: string,
    newOwnerCoinPublicKey: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.transferProperty(
        stringToBytes32(propertyId),
        coinPublicKeyToBytes32(newOwnerCoinPublicKey),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'transferProperty',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  /**
   * Verify a property (admin action).
   */
  async verifyProperty(
    propertyId: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.verifyProperty(
        stringToBytes32(propertyId),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'verifyProperty',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  // ── Read Circuits ────────────────────────────────────────────────────────

  /**
   * Read property data from on-chain ledger state.
   * Returns: [owner_bytes, status_code, valuation]
   */
  async getProperty(propertyId: string): Promise<PropertyData | null> {
    this.ensureConnected();
    const [result, err] = await withContractCall(
      () => this.deployed.callTx.getProperty(stringToBytes32(propertyId)),
      'getProperty',
    );
    if (err || !result) return null;
    const [ownerBytes, statusCode, valuation] = result as [Uint8Array, number, bigint];
    const [metaResult] = await withContractCall(
      () => this.deployed.callTx.getPropertyMetadata(stringToBytes32(propertyId)),
      'getPropertyMetadata',
    );
    const meta = (metaResult as [Uint8Array, Uint8Array] | null) ?? [new Uint8Array(64), new Uint8Array(64)];
    const [locationBytes, documentBytes] = meta;
    return {
      propertyId,
      owner: bytes32ToHex(ownerBytes),
      status: statusCode as any,
      statusLabel: propertyStatusLabel(statusCode as any),
      valuation,
      locationHash: bytesToString(locationBytes),
      documentHash: bytesToString(documentBytes),
    };
  }

  /**
   * Read collected fees from ledger state directly (no tx needed).
   */
  async getCollectedFees(): Promise<bigint | null> {
    this.ensureConnected();
    const [result, err] = await withContractCall(
      () => this.deployed.callTx.getCollectedFees(),
      'getCollectedFees',
    );
    if (err) return null;
    return result as bigint;
  }
}
