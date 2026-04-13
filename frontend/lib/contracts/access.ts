/**
 * Access Control Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface AccessControlPrivateState {}
const PRIVATE_STATE_ID = 'accessControlState';

export class AccessControlAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/access/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as AccessControlPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('AccessControlAdapter: call connect() first.');
  }

  async grantPermission(
    resourceId: string,
    userCoinPublicKey: string,
    permission: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.grantPermission(
        stringToBytes32(resourceId),
        coinPublicKeyToBytes32(userCoinPublicKey),
        stringToBytes32(permission),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'grantPermission',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async revokePermission(
    resourceId: string,
    userCoinPublicKey: string,
    permission: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.revokePermission(
        stringToBytes32(resourceId),
        coinPublicKeyToBytes32(userCoinPublicKey),
        stringToBytes32(permission),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'revokePermission',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
