// Marketplace API for frontend integration

// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";
import type { ListingData, ListingStatus } from "../types/contracts.js";

export class MarketplaceAPI {
  private wallet: any;
  private contractAddress: string;
  private contract: any;
  private providers: any;

  constructor(wallet: any, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize(): Promise<void> {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.marketplace);
    this.contract = new ContractModule.Contract({});
    this.providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.marketplace,
      "marketplaceState"
    );
  }

  async createListing(
    listingId: string,
    propertyId: string,
    price: bigint,
    durationSeconds: bigint,
    seller: string
  ): Promise<void> {
    if (!this.contract) await this.initialize();

    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    await this.contract.createListing(
      this.stringToBytes32(listingId),
      this.stringToBytes32(propertyId),
      price,
      durationSeconds,
      timestamp,
      this.addressToBytes32(seller)
    );
  }

  async getListing(listingId: string): Promise<ListingData> {
    if (!this.contract) await this.initialize();

    const listingIdBytes = this.stringToBytes32(listingId);
    const [seller, propertyId, price, status] = await this.contract.getListing(listingIdBytes);
    const [timestamp, duration] = await this.contract.getListingDetails(listingIdBytes);

    return {
      listingId,
      propertyId: this.bytes32ToString(propertyId),
      seller: this.bytes32ToAddress(seller),
      price,
      status: status as ListingStatus,
      timestamp,
      duration,
    };
  }

  async updateListing(listingId: string, newPrice: bigint, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.updateListing(
      this.stringToBytes32(listingId),
      newPrice,
      this.addressToBytes32(caller)
    );
  }

  async cancelListing(listingId: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.cancelListing(
      this.stringToBytes32(listingId),
      this.addressToBytes32(caller)
    );
  }

  /**
   * Purchase a listing.
   * @param feeAmount - computed off-chain as: price * marketplaceFee / 10000
   */
  async purchaseListing(listingId: string, buyer: string, feeAmount: bigint): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.purchaseListing(
      this.stringToBytes32(listingId),
      this.addressToBytes32(buyer),
      feeAmount
    );
  }

  async getCollectedFees(caller: string): Promise<bigint> {
    if (!this.contract) await this.initialize();
    return await this.contract.getMarketplaceCollectedFees(this.addressToBytes32(caller));
  }

  // Helper methods
  private stringToBytes32(str: string): Uint8Array {
    const bytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 32));
    return bytes;
  }

  private bytes32ToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes).replace(/\0/g, "");
  }

  private addressToBytes32(address: string): Uint8Array {
    const hex = address.startsWith("0x") ? address.slice(2) : address;
    const padded = hex.padStart(64, "0").slice(0, 64);
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }

  private bytes32ToAddress(bytes: Uint8Array): string {
    return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  /** Compute fee off-chain: price * basisPoints / 10000 */
  static computeFee(price: bigint, basisPoints: bigint): bigint {
    return (price * basisPoints) / 10000n;
  }
}
