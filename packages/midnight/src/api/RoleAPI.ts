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

export enum Role {
  USER = 0,
  VERIFIER = 1,
  AGENT = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
}

/**
 * 👤 REAP Role API Implementation (Modern SDK v4.0.4)
 */

export class RoleAPI {
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
      throw new Error('Contract address is required for RoleAPI');
    }

    logger.info(`Connecting to Role contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Role contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Role contract');
      throw error;
    }
  }

  private encodeAddress(address: string): Uint8Array {
    return MidnightBech32m.parse(address).data;
  }

  async initializeRole(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initialize_roles(this.encodeAddress(adminAddress));
  }

  async assignRole(userAddress: string, role: Role, callerAddress: string): Promise<void> {
    await this.deployed?.callTx.set_role(
      this.encodeAddress(userAddress),
      role as any,
      this.encodeAddress(callerAddress)
    );
  }

  async revokeRole(userAddress: string, callerAddress: string): Promise<void> {
    await this.deployed?.callTx.remove_role(
      this.encodeAddress(userAddress),
      this.encodeAddress(callerAddress)
    );
  }

  async getUserRole(userAddress: string): Promise<Role> {
    const txData = await this.deployed?.callTx.get_user_role(this.encodeAddress(userAddress));
    return txData?.private.result as any as Role;
  }

  async hasRole(userAddress: string, role: Role): Promise<boolean> {
    const txData = await this.deployed?.callTx.is_user_admin(
      this.encodeAddress(userAddress)
    );
    return txData?.private.result as any as boolean;
  }

  async pauseRole(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.pause_contract(this.encodeAddress(callerAddress));
  }

  async unpauseRole(callerAddress: string): Promise<void> {
    await this.deployed?.callTx.unpause_contract(this.encodeAddress(callerAddress));
  }
}
