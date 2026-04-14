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

export enum EventType {
  SYSTEM = 0,
  USER = 1,
  PROPERTY = 2,
  TRANSACTION = 3,
  SECURITY = 4,
}

/**
 * 📓 REAP Audit Log API Implementation (Modern SDK v4.0.4)
 */

export class AuditLogAPI {
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
      throw new Error('Contract address is required for AuditLogAPI');
    }

    logger.info(`Connecting to Audit Log contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Audit Log contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Audit Log contract');
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

  async initializeAuditLog(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeAudit(this.encodeAddress(adminAddress));
  }

  async logEvent(
    eventId: string,
    eventType: EventType,
    propertyId: string,
    callerAddress: string
  ): Promise<void> {
    await this.deployed?.callTx.logPropertyEvent(
      this.stringToBytes32(eventId),
      eventType as any,
      this.stringToBytes32(propertyId),
      this.encodeAddress(callerAddress),
      BigInt(Math.floor(Date.now() / 1000))
    );
  }

  async getEvent(eventId: string): Promise<any> {
    const txData = await this.deployed?.callTx.getAuditEntry(this.stringToBytes32(eventId));
    return txData?.private.result;
  }

  async getLogEntryCount(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getTotalEntries();
    return txData?.private.result as any as bigint;
  }

  async pauseAuditLog(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.pauseAudit(this.encodeAddress(callerAddress));
  }

  async unpauseAuditLog(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.unpauseAudit(this.encodeAddress(callerAddress));
  }
}
