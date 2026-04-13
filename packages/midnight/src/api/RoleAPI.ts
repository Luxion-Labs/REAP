// Role contract API - User role management

import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";

export enum Role {
  USER = 0,
  ADMIN = 1,
  MODERATOR = 2,
}

export class RoleAPI {
  private wallet: Wallet;
  private contractAddress: string;
  private contract: any;

  constructor(wallet: Wallet, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize() {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.role);
    const providers = createContractProviders(this.wallet, CONTRACT_PATHS.role, "roleState");
    this.contract = new ContractModule.Contract({});
    return this;
  }

  async initializeRoles(adminAddress: string) {
    return await this.contract.initialize_roles(this.addressToBytes32(adminAddress));
  }

  async setRole(userAddress: string, role: Role, callerAddress: string) {
    return await this.contract.set_role(
      this.addressToBytes32(userAddress),
      role,
      this.addressToBytes32(callerAddress)
    );
  }

  async getUserRole(userAddress: string) {
    return await this.contract.get_user_role(this.addressToBytes32(userAddress));
  }

  async removeRole(userAddress: string, callerAddress: string) {
    return await this.contract.remove_role(
      this.addressToBytes32(userAddress),
      this.addressToBytes32(callerAddress)
    );
  }

  async isUserAdmin(userAddress: string) {
    return await this.contract.is_user_admin(this.addressToBytes32(userAddress));
  }

  async transferAdmin(newAdminAddress: string, callerAddress: string) {
    return await this.contract.transfer_admin(
      this.addressToBytes32(newAdminAddress),
      this.addressToBytes32(callerAddress)
    );
  }

  async pauseContract(callerAddress: string) {
    return await this.contract.pause_contract(this.addressToBytes32(callerAddress));
  }

  async unpauseContract(callerAddress: string) {
    return await this.contract.unpause_contract(this.addressToBytes32(callerAddress));
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
