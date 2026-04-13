// Property Registry API for frontend integration

// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";
import type { PropertyData, PropertyStatus } from "../types/contracts.js";

export class PropertyRegistryAPI {
  private wallet: any;
  private contractAddress: string;
  private contract: any;
  private providers: any;

  constructor(wallet: any, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize(): Promise<void> {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.propertyRegistry);
    this.contract = new ContractModule.Contract({});
    this.providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.propertyRegistry,
      "propertyRegistryState"
    );
  }

  async registerProperty(
    propertyId: string,
    owner: string,
    valuation: bigint,
    locationHash: string,
    documentHash: string
  ): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.registerProperty(
      this.stringToBytes32(propertyId),
      this.addressToBytes32(owner),
      valuation,
      this.stringToBytes64(locationHash),
      this.stringToBytes64(documentHash)
    );
  }

  async getProperty(propertyId: string): Promise<PropertyData> {
    if (!this.contract) await this.initialize();

    const propertyIdBytes = this.stringToBytes32(propertyId);
    const [owner, status, value] = await this.contract.getProperty(propertyIdBytes);
    const [location, documents] = await this.contract.getPropertyMetadata(propertyIdBytes);

    return {
      propertyId,
      owner: this.bytes32ToAddress(owner),
      status: status as PropertyStatus,
      valuation: value,
      locationHash: this.bytes64ToString(location),
      documentHash: this.bytes64ToString(documents),
    };
  }

  async updatePropertyStatus(
    propertyId: string,
    newStatus: PropertyStatus,
    caller: string
  ): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.updatePropertyStatus(
      this.stringToBytes32(propertyId),
      newStatus,
      this.addressToBytes32(caller)
    );
  }

  async transferProperty(propertyId: string, newOwner: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.transferProperty(
      this.stringToBytes32(propertyId),
      this.addressToBytes32(newOwner),
      this.addressToBytes32(caller)
    );
  }

  async verifyProperty(propertyId: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.verifyProperty(
      this.stringToBytes32(propertyId),
      this.addressToBytes32(caller)
    );
  }

  // Helper methods
  private stringToBytes32(str: string): Uint8Array {
    const bytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 32));
    return bytes;
  }

  private stringToBytes64(str: string): Uint8Array {
    const bytes = new Uint8Array(64);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 64));
    return bytes;
  }

  private bytes64ToString(bytes: Uint8Array): string {
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
}
