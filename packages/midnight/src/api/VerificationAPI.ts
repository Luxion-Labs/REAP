// Verification API for frontend integration

import { type Wallet } from "@midnight-ntwrk/wallet-api";
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";
import type { VerificationRequest, VerificationStatus } from "../types/contracts.js";

export class VerificationAPI {
  private wallet: Wallet;
  private contractAddress: string;
  private contract: any;
  private providers: any;

  constructor(wallet: Wallet, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize(): Promise<void> {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.verification);
    this.contract = new ContractModule.Contract({});
    this.providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.verification,
      "verificationState"
    );
  }

  async requestVerification(
    requestId: string,
    propertyId: string,
    documentHash: string,
    requester: string
  ): Promise<void> {
    if (!this.contract) await this.initialize();

    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    await this.contract.requestVerification(
      this.stringToBytes32(requestId),
      this.stringToBytes32(propertyId),
      this.stringToBytes64(documentHash),
      timestamp,
      this.addressToBytes32(requester)
    );
  }

  async getVerificationStatus(requestId: string): Promise<VerificationRequest> {
    if (!this.contract) await this.initialize();

    const [status, requester, propertyId] = await this.contract.getVerificationStatus(
      this.stringToBytes32(requestId)
    );

    return {
      requestId,
      propertyId: this.bytes32ToString(propertyId),
      requester: this.bytes32ToAddress(requester),
      status: status as VerificationStatus,
      documentHash: "",
      timestamp: 0n,
    };
  }

  async approveVerifier(verifier: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.approveVerifier(
      this.addressToBytes32(verifier),
      this.addressToBytes32(caller)
    );
  }

  async startVerification(requestId: string, verifier: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.startVerification(
      this.stringToBytes32(requestId),
      this.addressToBytes32(verifier)
    );
  }

  async submitVerificationResult(
    requestId: string,
    resultHash: string,
    approved: boolean,
    verifier: string
  ): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.submitVerificationResult(
      this.stringToBytes32(requestId),
      this.stringToBytes128(resultHash),
      approved,
      this.addressToBytes32(verifier)
    );
  }

  async verifyProof(requestId: string, proofData: string, caller: string): Promise<boolean> {
    if (!this.contract) await this.initialize();
    return await this.contract.verifyProof(
      this.stringToBytes32(requestId),
      this.stringToBytes128(proofData),
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

  private stringToBytes128(str: string): Uint8Array {
    const bytes = new Uint8Array(128);
    const encoded = new TextEncoder().encode(str);
    bytes.set(encoded.slice(0, 128));
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
}
