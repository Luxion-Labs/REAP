import { 
  type MidnightProviders,
} from '@midnight-ntwrk/midnight-js/types';
import { 
  findDeployedContract, 
  type FoundContract 
} from '@midnight-ntwrk/midnight-js/contracts';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { Contract, Witnesses } from '../../build/REAP/contract/index.js';
import { 
  UnshieldedAddress,
  MidnightBech32m 
} from '@midnight-ntwrk/wallet-sdk-address-format';
import { contractConfig } from '../config/config.js';
import { logger } from '../utils/logger.js';

export enum ListingStatus {
  ACTIVE = 0,
  SOLD = 1,
  CANCELLED = 2,
  EXPIRED = 3,
}

/**
 * 🏪 REAP Marketplace API Implementation (Modern SDK v4.0.4)
 */

export class MarketplaceAPI {
  protected deployed?: FoundContract<Contract<any, Witnesses<any>>>;
  protected compiledContract: any;

  constructor(
    protected providers: MidnightProviders<any, string, any>,
    protected contractAddress?: string
  ) {
    this.compiledContract = CompiledContract.make('REAP', Contract).pipe(
      CompiledContract.withVacantWitnesses,
      CompiledContract.withCompiledFileAssets(contractConfig.zkConfigPath)
    );
  }

  async init(): Promise<void> {
    if (!this.contractAddress) {
      throw new Error('Contract address is required for MarketplaceAPI');
    }

    logger.info(`Connecting to Marketplace contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Marketplace contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Marketplace contract');
      throw error;
    }
  }

  private encodeAddress(address: string): Uint8Array {
    return MidnightBech32m.parse(address).data;
  }

  private stringToBytes32(str: string): Uint8Array {
    const bytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 32));
    return bytes;
  }

  async initializeMarketplace(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeMarketplace(this.encodeAddress(adminAddress));
  }

  async createListing(
    listingId: string,
    propertyId: string,
    price: bigint,
    seller: string
  ): Promise<void> {
    await this.deployed?.callTx.createListing(
      this.stringToBytes32(listingId),
      this.stringToBytes32(propertyId),
      price as any,
      BigInt(86400 * 30), // 30 days duration
      BigInt(Math.floor(Date.now() / 1000)),
      this.encodeAddress(seller)
    );
  }

  async buyProperty(listingId: string, buyer: string, feeAmount: bigint): Promise<void> {
    await this.deployed?.callTx.purchaseListing(
      this.stringToBytes32(listingId),
      this.encodeAddress(buyer),
      feeAmount as any
    );
  }

  async cancelListing(listingId: string, caller: string): Promise<void> {
    await this.deployed?.callTx.cancelListing(
      this.stringToBytes32(listingId),
      this.encodeAddress(caller)
    );
  }

  async getListingStatus(listingId: string): Promise<ListingStatus> {
    const txData = await this.deployed?.callTx.getListing(this.stringToBytes32(listingId));
    // The result is [property_id, seller_id, price, status]
    return (txData?.private.result as any)[3] as ListingStatus;
  }

  async getMarketplaceCollectedFees(caller: string): Promise<bigint> {
    const txData = await this.deployed?.callTx.collectFees(this.encodeAddress(caller));
    return txData?.private.result as any as bigint;
  }

  async pauseMarketplace(caller: string): Promise<void> {
    await this.deployed?.callTx.pauseMarketplace(this.encodeAddress(caller));
  }
}
