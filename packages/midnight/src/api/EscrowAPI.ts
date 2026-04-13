// Escrow API for frontend integration

// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";
import type { EscrowData, EscrowStatus } from "../types/contracts.js";

export class EscrowAPI {
  private wallet: any;
  private contractAddress: string;
  private contract: any;
  private providers: any;

  constructor(wallet: any, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize(): Promise<void> {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.escrow);
    this.contract = new ContractModule.Contract({});
    this.providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.escrow,
      "escrowState"
    );
  }

  async depositEscrow(
    escrowId: string,
    listingId: string,
    seller: string,
    buyer: string,
    amount: bigint
  ): Promise<void> {
    if (!this.contract) await this.initialize();

    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    await this.contract.depositEscrow(
      this.stringToBytes32(escrowId),
      this.stringToBytes32(listingId),
      this.addressToBytes32(seller),
      this.addressToBytes32(buyer),
      amount,
      timestamp
    );
  }

  async getEscrow(escrowId: string): Promise<EscrowData> {
    if (!this.contract) await this.initialize();

    const escrowIdBytes = this.stringToBytes32(escrowId);
    const [buyer, seller, amount, status] = await this.contract.getEscrow(escrowIdBytes);
    const [createdAt, releasedAt] = await this.contract.getEscrowTimestamps(escrowIdBytes);

    return {
      escrowId,
      listingId: "",
      buyer: this.bytes32ToAddress(buyer),
      seller: this.bytes32ToAddress(seller),
      amount,
      status: status as EscrowStatus,
      createdAt,
      releasedAt: releasedAt > 0n ? releasedAt : undefined,
    };
  }

  async releaseEscrow(escrowId: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();

    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    await this.contract.releaseEscrow(
      this.stringToBytes32(escrowId),
      this.addressToBytes32(caller),
      timestamp
    );
  }

  async fileDispute(escrowId: string, disputeReason: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.fileDispute(
      this.stringToBytes32(escrowId),
      this.stringToBytes128(disputeReason),
      this.addressToBytes32(caller)
    );
  }

  async resolveDispute(escrowId: string, releaseToSeller: boolean, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();

    await this.contract.resolveDispute(
      this.stringToBytes32(escrowId),
      releaseToSeller,
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

  private bytes32ToAddress(bytes: Uint8Array): string {
    return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  }
}
