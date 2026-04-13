// Access Control API - Permission management

import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";

export enum Permission {
  READ = 0,
  WRITE = 1,
  EXECUTE = 2,
  ADMIN = 3,
  MODERATOR = 4,
  TRANSFER = 5,
  BURN = 6,
}

export class AccessControlAPI {
  private wallet: Wallet;
  private contractAddress: string;
  private contract: any;

  constructor(wallet: Wallet, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize() {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.accessControl);
    const providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.accessControl,
      "accessControlState"
    );
    this.contract = new ContractModule.Contract({});
    return this;
  }

  async initializeAccessControl(adminAddress: string) {
    return await this.contract.initializeAccessControl(this.addressToBytes32(adminAddress));
  }

  /**
   * Grant permission to a user for a resource.
   * grantId should be derived as hash(user || resourceId) for consistent lookup.
   */
  async grantPermission(
    grantId: string,
    userAddress: string,
    resourceId: string,
    callerAddress: string
  ) {
    return await this.contract.grantPermission(
      this.stringToBytes32(grantId),
      this.addressToBytes32(userAddress),
      this.stringToBytes32(resourceId),
      this.addressToBytes32(callerAddress)
    );
  }

  async revokePermission(grantId: string, userAddress: string, callerAddress: string) {
    return await this.contract.revokePermission(
      this.stringToBytes32(grantId),
      this.addressToBytes32(userAddress),
      this.addressToBytes32(callerAddress)
    );
  }

  /**
   * Check read permission. grantId must match the one used in grantPermission.
   */
  async hasReadPermission(grantId: string, userAddress: string) {
    return await this.contract.hasReadPermission(
      this.stringToBytes32(grantId),
      this.addressToBytes32(userAddress)
    );
  }

  async hasWritePermission(grantId: string, userAddress: string) {
    return await this.contract.hasWritePermission(
      this.stringToBytes32(grantId),
      this.addressToBytes32(userAddress)
    );
  }

  async hasExecutePermission(grantId: string, userAddress: string) {
    return await this.contract.hasExecutePermission(
      this.stringToBytes32(grantId),
      this.addressToBytes32(userAddress)
    );
  }

  async pauseAccessControl(callerAddress: string) {
    return await this.contract.pauseAccessControl(this.addressToBytes32(callerAddress));
  }

  async unpauseAccessControl(callerAddress: string) {
    return await this.contract.unpauseAccessControl(this.addressToBytes32(callerAddress));
  }

  // Helper methods
  private stringToBytes32(str: string): Uint8Array {
    const bytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 32));
    return bytes;
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
}
