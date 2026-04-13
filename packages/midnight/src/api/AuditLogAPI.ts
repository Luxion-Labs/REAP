// Audit Log API - Event logging and tracking

import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";

export enum EventType {
  PropertyRegistered = 0,
  PropertyVerified = 1,
  PropertyTokenized = 2,
  ListingCreated = 3,
  ListingSold = 4,
  TransactionCompleted = 5,
  UserRoleChanged = 6,
  AdminAction = 7,
  EmergencyPause = 8,
  FeeCollected = 9,
  DisputeFiled = 10,
  DisputeResolved = 11,
}

export class AuditLogAPI {
  private wallet: Wallet;
  private contractAddress: string;
  private contract: any;

  constructor(wallet: Wallet, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize() {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.auditLog);
    const providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.auditLog,
      "auditLogState"
    );
    this.contract = new ContractModule.Contract({});
    return this;
  }

  async initializeAudit(adminAddress: string) {
    return await this.contract.initializeAudit(this.addressToBytes32(adminAddress));
  }

  async logPropertyEvent(
    entryId: string,
    eventType: EventType,
    propertyId: string,
    actorAddress: string,
    timestamp: bigint
  ) {
    return await this.contract.logPropertyEvent(
      this.stringToBytes32(entryId),
      eventType,
      this.stringToBytes32(propertyId),
      this.addressToBytes32(actorAddress),
      timestamp
    );
  }

  async logTransactionEvent(
    entryId: string,
    eventType: EventType,
    transactionId: string,
    actorAddress: string,
    counterpartyAddress: string,
    amount: bigint,
    timestamp: bigint
  ) {
    return await this.contract.logTransactionEvent(
      this.stringToBytes32(entryId),
      eventType,
      this.stringToBytes32(transactionId),
      this.addressToBytes32(actorAddress),
      this.addressToBytes32(counterpartyAddress),
      amount,
      timestamp
    );
  }

  async logAdminAction(
    entryId: string,
    actionType: EventType,
    adminAddress: string,
    targetResource: string,
    detailsHash: string,
    timestamp: bigint
  ) {
    return await this.contract.logAdminAction(
      this.stringToBytes32(entryId),
      actionType,
      this.addressToBytes32(adminAddress),
      this.stringToBytes32(targetResource),
      this.stringToBytes128(detailsHash),
      timestamp
    );
  }

  async getAuditEntry(entryId: string) {
    return await this.contract.getAuditEntry(this.stringToBytes32(entryId));
  }

  async getEventTypeCount(eventType: EventType) {
    return await this.contract.getEventTypeCount(eventType);
  }

  async getActorEventCount(actorAddress: string) {
    return await this.contract.getActorEventCount(this.addressToBytes32(actorAddress));
  }

  async getTotalEntries() {
    return await this.contract.getTotalEntries();
  }

  // Helper methods
  private stringToBytes32(str: string): Uint8Array {
    const bytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 32));
    return bytes;
  }

  private stringToBytes128(str: string): Uint8Array {
    const bytes = new Uint8Array(128);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 128));
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
