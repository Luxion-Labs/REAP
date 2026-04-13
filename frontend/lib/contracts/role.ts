/**
 * Role Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface RolePrivateState {}
const PRIVATE_STATE_ID = 'roleState';

export class RoleAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/role/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as RolePrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('RoleAdapter: call connect() first.');
  }

  async assignRole(
    userCoinPublicKey: string,
    role: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.assignRole(
        coinPublicKeyToBytes32(userCoinPublicKey),
        stringToBytes32(role),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'assignRole',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async removeRole(
    userCoinPublicKey: string,
    role: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.removeRole(
        coinPublicKeyToBytes32(userCoinPublicKey),
        stringToBytes32(role),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'removeRole',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
