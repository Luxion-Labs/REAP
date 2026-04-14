/**
 * Marketplace Contract Adapter
 * Circuit signatures from packages/midnight/build/marketplace/contract/index.d.ts
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/utils/contract-errors';
import {
  stringToBytes32,
  coinPublicKeyToBytes32,
  listingStatusLabel,
  generateId,
} from '@/lib/utils/contract-encoding';
import type { MarketplaceListing, TxResult } from '@/types/contracts';

interface MarketplacePrivateState {}
const PRIVATE_STATE_ID = 'marketplaceState';

export class MarketplaceAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
    private unifiedInstance?: any,
  ) {
    if (unifiedInstance) {
      this.deployed = unifiedInstance;
    }
  }

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/REAP/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: 'reapState',
      initialPrivateState: {} as MarketplacePrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('MarketplaceAdapter: call connect() first.');
  }

  async createListing(
    sellerCoinPublicKey: string,
    tokenId: string,
    pricePerToken: bigint,
    callerCoinPublicKey: string,
    listingId?: string,
  ): Promise<[TxResult | null, string, any]> {
    this.ensureConnected();
    const id = listingId ?? generateId();
    const duration = BigInt(86400 * 30); // 30 days
    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.createListing(
        stringToBytes32(id),
        stringToBytes32(tokenId),
        pricePerToken,
        duration,
        timestamp,
        coinPublicKeyToBytes32(sellerCoinPublicKey), // Seller ID
      ),
      'createListing',
    );
    if (err) return [null, id, err];
    return [extractTxInfo(tx, this.contractAddress), id, null];
  }

  async purchaseListing(
    listingId: string,
    buyerCoinPublicKey: string,
    feeAmount: bigint,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.purchaseListing(
        stringToBytes32(listingId),
        coinPublicKeyToBytes32(buyerCoinPublicKey),
        feeAmount,
      ),
      'purchaseListing',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async cancelListing(
    listingId: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.cancelListing(stringToBytes32(listingId), coinPublicKeyToBytes32(callerCoinPublicKey)),
      'cancelListing',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
