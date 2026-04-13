/**
 * Escrow Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface EscrowPrivateState {}
const PRIVATE_STATE_ID = 'escrowState';

export class EscrowAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/escrow/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as EscrowPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('EscrowAdapter: call connect() first.');
  }

  async createEscrow(
    escrowId: string,
    buyer: string,
    seller: string,
    amount: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.createEscrow(
        stringToBytes32(escrowId),
        buyer,
        seller,
        amount,
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'createEscrow',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async releaseEscrow(
    escrowId: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.releaseEscrow(stringToBytes32(escrowId), coinPublicKeyToBytes32(callerCoinPublicKey)),
      'releaseEscrow',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async resolveDispute(
    escrowId: string,
    refundToBuyer: boolean,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.resolveDispute(
        stringToBytes32(escrowId),
        refundToBuyer,
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'resolveDispute',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
