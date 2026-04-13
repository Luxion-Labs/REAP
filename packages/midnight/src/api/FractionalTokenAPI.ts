// Fractional Token API for frontend integration

// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { createContractProviders, loadContractModule } from "../utils/providers.js";
import { CONTRACT_PATHS } from "../config/network.js";
import type { TokenState } from "../types/contracts.js";

export class FractionalTokenAPI {
  private wallet: any;
  private contractAddress: string;
  private contract: any;
  private providers: any;

  constructor(wallet: any, contractAddress: string) {
    this.wallet = wallet;
    this.contractAddress = contractAddress;
  }

  async initialize(): Promise<void> {
    const ContractModule = await loadContractModule(CONTRACT_PATHS.fractionalToken);
    this.contract = new ContractModule.Contract({});
    this.providers = createContractProviders(
      this.wallet,
      CONTRACT_PATHS.fractionalToken,
      "fractionalTokenState"
    );
  }

  async initializeToken(admin: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.initializeToken(this.addressToBytes32(admin));
  }

  async mint(to: string, amount: bigint, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.mint(this.addressToBytes32(to), amount, this.addressToBytes32(caller));
  }

  async burn(from: string, amount: bigint, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.burn(this.addressToBytes32(from), amount, this.addressToBytes32(caller));
  }

  async transfer(from: string, to: string, amount: bigint, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.transfer(
      this.addressToBytes32(from),
      this.addressToBytes32(to),
      amount,
      this.addressToBytes32(caller)
    );
  }

  async approve(owner: string, spender: string, amount: bigint, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.approve(
      this.addressToBytes32(owner),
      this.addressToBytes32(spender),
      amount,
      this.addressToBytes32(caller)
    );
  }

  async balanceOf(holder: string): Promise<bigint> {
    if (!this.contract) await this.initialize();
    return await this.contract.balanceOf(this.addressToBytes32(holder));
  }

  async getTotalSupply(): Promise<bigint> {
    if (!this.contract) await this.initialize();
    return await this.contract.getTotalSupply();
  }

  async getCirculatingSupply(): Promise<bigint> {
    if (!this.contract) await this.initialize();
    return await this.contract.getCirculatingSupply();
  }

  async getTokenState(): Promise<TokenState> {
    if (!this.contract) await this.initialize();
    return await this.contract.getTokenState();
  }

  async pauseToken(caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.pause_token(this.addressToBytes32(caller));
  }

  async unpauseToken(caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.unpause_token(this.addressToBytes32(caller));
  }

  async registerProperty(propertyId: string, ownerId: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.register_property(
      this.stringToBytes32(propertyId),
      this.addressToBytes32(ownerId),
      this.addressToBytes32(caller)
    );
  }

  async tokenizeProperty(propertyId: string, tokenId: string, caller: string): Promise<void> {
    if (!this.contract) await this.initialize();
    await this.contract.tokenize_property(
      this.stringToBytes32(propertyId),
      this.stringToBytes32(tokenId),
      this.addressToBytes32(caller)
    );
  }

  async getPropertyStatus(propertyId: string): Promise<number> {
    if (!this.contract) await this.initialize();
    return await this.contract.getPropertyStatus(this.stringToBytes32(propertyId));
  }

  async getPropertyOwner(propertyId: string): Promise<string> {
    if (!this.contract) await this.initialize();
    const owner = await this.contract.getPropertyOwner(this.stringToBytes32(propertyId));
    return this.bytes32ToAddress(owner);
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

  private bytes32ToAddress(bytes: Uint8Array): string {
    return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  }
}
