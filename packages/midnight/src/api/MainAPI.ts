// Main contract API - System orchestrator

// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";

export class MainAPI {
  private wallet: any;
  private contractAddress: string;
  private contract: any;

  constructor(wallet: any, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize() {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.main);
    const providers = createContractProviders(this.wallet, CONTRACT_PATHS.main, "mainState");
    this.contract = new ContractModule.Contract({});
    return this;
  }

  async initializeSystem(adminAddress: string) {
    return await this.contract.initializeSystem(this.addressToBytes32(adminAddress));
  }

  async emergencyPause(callerAddress: string) {
    return await this.contract.emergencyPause(this.addressToBytes32(callerAddress));
  }

  async emergencyUnpause(callerAddress: string) {
    return await this.contract.emergencyUnpause(this.addressToBytes32(callerAddress));
  }

  async getSystemStatus() {
    return await this.contract.getSystemStatus();
  }

  async isSystemOperational() {
    return await this.contract.isSystemOperational();
  }

  async getTotalUsers() {
    return await this.contract.getTotalUsers();
  }

  async getTotalProperties() {
    return await this.contract.getTotalProperties();
  }

  async getTotalTransactions() {
    return await this.contract.getTotalTransactions();
  }

  async incrementUserCount(callerAddress: string) {
    return await this.contract.incrementUserCount(this.addressToBytes32(callerAddress));
  }

  async incrementPropertyCount(callerAddress: string) {
    return await this.contract.incrementPropertyCount(this.addressToBytes32(callerAddress));
  }

  async incrementTransactionCount(callerAddress: string) {
    return await this.contract.incrementTransactionCount(this.addressToBytes32(callerAddress));
  }

  async getCollectedFees() {
    return await this.contract.getCollectedFees();
  }

  async withdrawCollectedFees(callerAddress: string) {
    return await this.contract.withdrawCollectedFees(this.addressToBytes32(callerAddress));
  }

  async transferAdmin(newAdminAddress: string, callerAddress: string) {
    return await this.contract.transferAdmin(
      this.addressToBytes32(newAdminAddress),
      this.addressToBytes32(callerAddress)
    );
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
