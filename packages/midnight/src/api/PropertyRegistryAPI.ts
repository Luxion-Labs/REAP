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

export enum PropertyStatus {
  PENDING = 0,
  VERIFIED = 1,
  FRACTIONALIZED = 2,
  SOLD = 3,
  BLOCKED = 4,
}

/**
 * 🏠 REAP Property Registry API Implementation (Modern SDK v4.0.4)
 */

export class PropertyRegistryAPI {
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
      throw new Error('Contract address is required for PropertyRegistryAPI');
    }

    logger.info(`Connecting to Property Registry contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Property Registry contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Property Registry contract');
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

  async initializeRegistry(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeRegistry(this.encodeAddress(adminAddress));
  }

  async registerProperty(
    propertyId: string,
    owner: string,
    valuation: bigint,
    locationHash: string,
    documentHash: string
  ): Promise<void> {
    await this.deployed?.callTx.registerProperty(
      this.stringToBytes32(propertyId),
      this.encodeAddress(owner),
      valuation as any,
      this.stringToBytes32(locationHash),
      this.stringToBytes32(documentHash)
    );
  }

  async updatePropertyStatus(
    propertyId: string,
    status: PropertyStatus,
    caller: string
  ): Promise<void> {
    await this.deployed?.callTx.updatePropertyStatus(
      this.stringToBytes32(propertyId),
      status as any,
      this.encodeAddress(caller)
    );
  }

  async getPropertyStatus(propertyId: string): Promise<PropertyStatus> {
    const txData = await this.deployed?.callTx.getPropertyStatus(this.stringToBytes32(propertyId));
    return txData?.private.result as any as PropertyStatus;
  }

  async getPropertyOwner(propertyId: string): Promise<string> {
    const txData = await this.deployed?.callTx.getPropertyOwner(this.stringToBytes32(propertyId));
    // Implementation must handle Bech32m encoding for the return value if needed
    return txData?.private.result as any as string;
  }

  async getRegistryCollectedFees(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getRegistryCollectedFees();
    return txData?.private.result as any as bigint;
  }

  async pauseRegistry(caller: string): Promise<void> {
    await this.deployed?.callTx.pauseRegistry(this.encodeAddress(caller));
  }
}
