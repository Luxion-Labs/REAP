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

export enum TokenState {
  INACTIVE = 0,
  ACTIVE = 1,
  PAUSED = 2,
  TERMINATED = 3,
}

/**
 * 🪙 REAP Fractional Token API Implementation (Modern SDK v4.0.4)
 */

export class FractionalTokenAPI {
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
      throw new Error('Contract address is required for FractionalTokenAPI');
    }

    logger.info(`Connecting to Fractional Token contract at ${this.contractAddress}...`);

    try {
      this.deployed = await findDeployedContract(this.providers, {
        contractAddress: this.contractAddress,
        compiledContract: this.compiledContract,
        privateStateId: 'reap-private-state',
        initialPrivateState: {},
      } as any);
      logger.info('Successfully connected to Fractional Token contract');
    } catch (error: any) {
      logger.error(error, 'Failed to find deployed Fractional Token contract');
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

  async initializeToken(adminAddress: string): Promise<void> {
    await this.deployed?.callTx.initializeToken(this.encodeAddress(adminAddress));
  }

  async mint(to: string, amount: bigint, caller: string): Promise<void> {
    await this.deployed?.callTx.mint(
      this.encodeAddress(to),
      amount as any,
      this.encodeAddress(caller)
    );
  }

  async burn(from: string, amount: bigint, caller: string): Promise<void> {
    await this.deployed?.callTx.burn(
      this.encodeAddress(from),
      amount as any,
      this.encodeAddress(caller)
    );
  }

  async transfer(from: string, to: string, amount: bigint, caller: string): Promise<void> {
    await this.deployed?.callTx.transfer(
      this.encodeAddress(from),
      this.encodeAddress(to),
      amount as any,
      this.encodeAddress(caller)
    );
  }

  async balanceOf(address: string): Promise<bigint> {
    const txData = await this.deployed?.callTx.balanceOf(this.encodeAddress(address));
    return txData?.private.result as any as bigint;
  }

  async getTotalSupply(): Promise<bigint> {
    const txData = await this.deployed?.callTx.getTotalSupply();
    return txData?.private.result as any as bigint;
  }

  async getTokenState(): Promise<TokenState> {
    const txData = await this.deployed?.callTx.getTokenState();
    return txData?.private.result as any as TokenState;
  }

  async pauseToken(caller: string): Promise<void> {
    await this.deployed?.callTx.pause_token(this.encodeAddress(caller));
  }

  async unpauseToken(caller: string): Promise<void> {
    await this.deployed?.callTx.unpause_token(this.encodeAddress(caller));
  }
}
