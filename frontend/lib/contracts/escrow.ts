/**
 * Escrow Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/utils/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/utils/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface EscrowPrivateState {}
const PRIVATE_STATE_ID = 'escrowState';

export class EscrowAdapter {
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
      initialPrivateState: {} as EscrowPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('EscrowAdapter: call connect() first.');
  }

  async depositEscrow(
    escrowId: string,
    listingId: string,
    seller: string,
    buyer: string,
    amount: bigint,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.depositEscrow(
        stringToBytes32(escrowId),
        stringToBytes32(listingId),
        coinPublicKeyToBytes32(seller),
        coinPublicKeyToBytes32(buyer),
        amount as any,
        timestamp
      ),
      'depositEscrow',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async releaseEscrow(
    escrowId: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.releaseEscrow(
        stringToBytes32(escrowId), 
        coinPublicKeyToBytes32(callerCoinPublicKey),
        timestamp
      ),
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
        !refundToBuyer, // Note: contract uses "releaseToSeller" bool, so !refundToBuyer represents releaseToSeller
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'resolveDispute',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
