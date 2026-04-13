/**
 * Marketplace Contract Adapter
 * Circuit signatures from packages/midnight/build/marketplace/contract/index.d.ts
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import {
  stringToBytes32,
  coinPublicKeyToBytes32,
  listingStatusLabel,
  generateId,
} from '@/lib/contract-encoding';
import type { MarketplaceListing, TxResult } from '@/types/contracts';

interface MarketplacePrivateState {}
const PRIVATE_STATE_ID = 'marketplaceState';

export class MarketplaceAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/marketplace/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as MarketplacePrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('MarketplaceAdapter: call connect() first.');
  }

  async createListing(
    sellerCoinPublicKey: string,
    tokenId: string,
    quantity: bigint,
    pricePerToken: bigint,
    callerCoinPublicKey: string,
    listingId?: string,
  ): Promise<[TxResult | null, string, any]> {
    this.ensureConnected();
    const id = listingId ?? generateId();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.createListing(
        stringToBytes32(id),
        sellerCoinPublicKey,
        stringToBytes32(tokenId),
        quantity,
        pricePerToken,
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'createListing',
    );
    if (err) return [null, id, err];
    return [extractTxInfo(tx, this.contractAddress), id, null];
  }

  async purchaseListing(
    listingId: string,
    buyerCoinPublicKey: string,
    quantity: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.purchaseListing(
        stringToBytes32(listingId),
        buyerCoinPublicKey,
        quantity,
        coinPublicKeyToBytes32(callerCoinPublicKey),
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
