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

/**
 * 🏛️ REAP Main API Implementation (Modern SDK v4.0.4)
 */

export class MainAPI {
  protected deployed?: FoundContract<Contract<REAPPrivateState, Witnesses<REAPPrivateState>>>;
  protected compiledContract: any;

  constructor(
    protected providers: MidnightProviders<any, string, any>,
    protected contractAddress?: string
  ) {
    // 🔗 Initialize the pipeable CompiledContract
    this.compiledContract = CompiledContract.make('REAP', Contract).pipe(
      CompiledContract.withVacantWitnesses,
      CompiledContract.withCompiledFileAssets(contractConfig.zkConfigPath)
    );
  }

  async init(): Promise<void> {
    if (!this.contractAddress) {
      throw new Error('Contract address is required for API interaction');
    }

    logger.info(`Connecting to REAP contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {} as REAPPrivateState,
      } as any);
      logger.info('Successfully connected to REAP contract');
    } catch (error: any) {
      logger.error('Failed to find deployed REAP contract', error);
      throw error;
    }
  }

  // Helper to convert Bech32m strings back to raw bytes for circuits
  private encodeAddress(address: string): Uint8Array {
    try {
      return MidnightBech32m.parse(address).data;
    } catch (e: any) {
      logger.error(e, `Failed to parse address: ${address}`);
      throw e;
    }
  }

  async initializeSystem(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeSystem(this.encodeAddress(adminAddress));
  }

  async emergencyPause(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.emergencyPause(this.encodeAddress(callerAddress));
  }

  async emergencyUnpause(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.emergencyUnpause(this.encodeAddress(callerAddress));
  }

  async getSystemStatus(): Promise<any> {
    const txData = await this.deployed?.callTx.getSystemStatus();
    return txData?.private.result;
  }

  async isSystemOperational(): Promise<boolean> {
    const txData = await this.deployed?.callTx.isSystemOperational();
    return txData?.private.result as any as boolean;
  }

  async getTotalUsers(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getTotalUsers();
    return txData?.private.result as any as bigint;
  }

  async incrementUserCount(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.incrementUserCount(this.encodeAddress(callerAddress));
  }

  async getCollectedFees(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getCollectedFees();
    return txData?.private.result as any as bigint;
  }

  async withdrawCollectedFees(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.withdrawCollectedFees(this.encodeAddress(callerAddress));
  }
}

export type REAPPrivateState = any;
