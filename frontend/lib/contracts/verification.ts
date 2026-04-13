/**
 * Verification Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface VerificationPrivateState {}
const PRIVATE_STATE_ID = 'verificationState';

export class VerificationAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/verification/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as VerificationPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('VerificationAdapter: call connect() first.');
  }

  async verifyAsset(
    assetId: string,
    verifierCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.verifyAsset(stringToBytes32(assetId), coinPublicKeyToBytes32(verifierCoinPublicKey)),
      'verifyAsset',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async revokeVerification(
    assetId: string,
    verifierCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.revokeVerification(stringToBytes32(assetId), coinPublicKeyToBytes32(verifierCoinPublicKey)),
      'revokeVerification',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
