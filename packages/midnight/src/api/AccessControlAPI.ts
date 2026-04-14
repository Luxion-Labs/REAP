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

export enum Permission {
  READ = 0,
  WRITE = 1,
  EXECUTE = 2,
  ADMIN = 3,
  MODERATOR = 4,
  TRANSFER = 5,
  BURN = 6,
}

/**
 * 🔐 REAP Access Control API Implementation (Modern SDK v4.0.4)
 */

export class AccessControlAPI {
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
      throw new Error('Contract address is required for AccessControlAPI');
    }

    logger.info(`Connecting to Access Control contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Access Control contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Access Control contract');
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

  async initializeAccessControl(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeAccessControl(this.encodeAddress(adminAddress));
  }

  async grantPermission(
    grantId: string,
    userAddress: string,
    resourceId: string,
    callerAddress: string
  ): Promise<void> {
    await this.deployed?.callTx.grantPermission(
      this.stringToBytes32(grantId),
      this.encodeAddress(userAddress),
      this.stringToBytes32(resourceId),
      this.encodeAddress(callerAddress)
    );
  }

  async revokePermission(grantId: string, userAddress: string, callerAddress: string): Promise<void> {
    await this.deployed?.callTx.revokePermission(
      this.stringToBytes32(grantId),
      this.encodeAddress(userAddress),
      this.encodeAddress(callerAddress)
    );
  }

  async hasReadPermission(grantId: string, userAddress: string): Promise<boolean> {
    const txData = await this.deployed?.callTx.hasReadPermission(
      this.stringToBytes32(grantId),
      this.encodeAddress(userAddress)
    );
    return (txData?.private.result as any)[0] as boolean;
  }

  async hasWritePermission(grantId: string, userAddress: string): Promise<boolean> {
    const txData = await this.deployed?.callTx.hasWritePermission(
      this.stringToBytes32(grantId),
      this.encodeAddress(userAddress)
    );
    return (txData?.private.result as any)[0] as boolean;
  }

  async hasExecutePermission(grantId: string, userAddress: string): Promise<boolean> {
    const txData = await this.deployed?.callTx.hasExecutePermission(
      this.stringToBytes32(grantId),
      this.encodeAddress(userAddress)
    );
    return (txData?.private.result as any)[0] as boolean;
  }

  async pauseAccessControl(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.pauseAccessControl(this.encodeAddress(callerAddress));
  }

  async unpauseAccessControl(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.unpauseAccessControl(this.encodeAddress(callerAddress));
  }
}
