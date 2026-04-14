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

export enum VerificationStatus {
  UNVERIFIED = 0,
  PENDING = 1,
  VERIFIED = 2,
  EXPIRED = 3,
  REVOKED = 4,
}

/**
 * ✅ REAP Verification API Implementation (Modern SDK v4.0.4)
 */

export class VerificationAPI {
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
      throw new Error('Contract address is required for VerificationAPI');
    }

    logger.info(`Connecting to Verification contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Verification contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Verification contract');
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

  async initializeVerification(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeVerification(this.encodeAddress(adminAddress));
  }

  async submitVerification(
    requestId: string,
    propertyId: string,
    documentHash: string,
    requester: string
  ): Promise<void> {
    await this.deployed?.callTx.requestVerification(
      this.stringToBytes32(requestId),
      this.stringToBytes32(propertyId),
      this.stringToBytes32(documentHash),
      BigInt(Math.floor(Date.now() / 1000)),
      this.encodeAddress(requester)
    );
  }

  async approveVerification(requestId: string, resultHash: string, approved: boolean, verifier: string): Promise<void> {
    await this.deployed?.callTx.submitVerificationResult(
      this.stringToBytes32(requestId),
      this.stringToBytes32(resultHash),
      approved,
      this.encodeAddress(verifier)
    );
  }

  async revokeVerification(verifier: string, caller: string): Promise<void> {
    await this.deployed?.callTx.removeVerifier(
      this.encodeAddress(verifier),
      this.encodeAddress(caller)
    );
  }

  async getVerificationStatus(requestId: string): Promise<VerificationStatus> {
    const txData = await this.deployed?.callTx.getVerificationStatus(this.stringToBytes32(requestId));
    // result is [status, verifier_id, result_hash]
    return (txData?.private.result as any)[0] as VerificationStatus;
  }

  async getVerificationCollectedFees(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getVerificationCollectedFees();
    return txData?.private.result as any as bigint;
  }

  async pauseVerification(caller: string): Promise<void> {
    await this.deployed?.callTx.pauseVerification(this.encodeAddress(caller));
  }
}
