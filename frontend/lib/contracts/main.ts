/**
 * Main System Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/utils/contract-errors';
import { coinPublicKeyToBytes32 } from '@/lib/utils/contract-encoding';
import type { ContractStateSnapshot, TxResult } from '@/types/contracts';

interface MainPrivateState {}
const PRIVATE_STATE_ID = 'mainState';

export class MainContractAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
    private unifiedInstance?: any,
  ) {
    if (unifiedInstance) {
      this.deployed = unifiedInstance;
    }
  }

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/REAP/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: 'reapState',
      initialPrivateState: {} as MainPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('MainContractAdapter: call connect() first.');
  }

  async getSystemSnapshot(): Promise<Partial<ContractStateSnapshot>> {
    this.ensureConnected();
    const [
      isOperationalResult,
      totalPropertiesResult,
      totalTokensResult, // getTotalTransactions
      pendingVerificationsResult, // getTotalUsers
    ] = await Promise.all([
      withContractCall(() => this.deployed.callTx.isSystemOperational(), 'isSystemOperational'),
      withContractCall(() => this.deployed.callTx.getTotalProperties(), 'getTotalProperties'),
      withContractCall(() => this.deployed.callTx.getTotalTransactions(), 'getTotalTransactions'),
      withContractCall(() => this.deployed.callTx.getTotalUsers(), 'getTotalUsers'),
    ]);
    
    const isOpArray = (isOperationalResult[0] as any)?.private?.result as [boolean, boolean, Uint8Array] | [boolean] | null; 
    const isOp = Array.isArray(isOpArray) ? isOpArray[0] : true;
    
    return {
      systemOperational: isOp ?? true,
      propertyCount: ((totalPropertiesResult[0] as any)?.private?.result as bigint) ?? BigInt(0),
      totalTokenSupply: ((totalTokensResult[0] as any)?.private?.result as bigint) ?? BigInt(0),
      pendingVerifications: ((pendingVerificationsResult[0] as any)?.private?.result as bigint) ?? BigInt(0),
      lastUpdated: new Date(),
    };
  }

  async pauseSystem(callerCoinPublicKey: string): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.pauseSystem(coinPublicKeyToBytes32(callerCoinPublicKey)),
      'pauseSystem',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async unpauseSystem(callerCoinPublicKey: string): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.unpauseSystem(coinPublicKeyToBytes32(callerCoinPublicKey)),
      'unpauseSystem',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
