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

export enum EscrowStatus {
  PENDING = 0,
  FUNDS_DEPOSITED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
  DISPUTED = 4,
}

/**
 * 💰 REAP Escrow API Implementation (Modern SDK v4.0.4)
 */

export class EscrowAPI {
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
      throw new Error('Contract address is required for EscrowAPI');
    }

    logger.info(`Connecting to Escrow contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Escrow contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Escrow contract');
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

  async initializeEscrow(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeEscrow(this.encodeAddress(adminAddress));
  }

  async createEscrow(
    escrowId: string,
    listingId: string,
    seller: string,
    buyer: string,
    amount: bigint
  ): Promise<void> {
    await this.deployed?.callTx.depositEscrow(
      this.stringToBytes32(escrowId),
      this.stringToBytes32(listingId),
      this.encodeAddress(seller),
      this.encodeAddress(buyer),
      amount as any,
      BigInt(Math.floor(Date.now() / 1000))
    );
  }

  async releaseFunds(escrowId: string, caller: string): Promise<void> {
    await this.deployed?.callTx.releaseEscrow(
      this.stringToBytes32(escrowId),
      this.encodeAddress(caller),
      BigInt(Math.floor(Date.now() / 1000))
    );
  }

  async resolveDispute(escrowId: string, releaseToSeller: boolean, caller: string): Promise<void> {
    await this.deployed?.callTx.resolveDispute(
      this.stringToBytes32(escrowId),
      releaseToSeller,
      this.encodeAddress(caller)
    );
  }

  async getEscrowStatus(escrowId: string): Promise<EscrowStatus> {
    const txData = await this.deployed?.callTx.getEscrow(this.stringToBytes32(escrowId));
    // The result is [buyer, seller, amount, status]
    return (txData?.private.result as any)[3] as EscrowStatus;
  }

  async getEscrowCollectedFees(caller: string): Promise<bigint> {
    const txData = await this.deployed?.callTx.collectEscrowFees(this.encodeAddress(caller));
    return txData?.private.result as any as bigint;
  }

  async pauseEscrow(caller: string): Promise<void> {
    await this.deployed?.callTx.pauseEscrow(this.encodeAddress(caller));
  }
}
