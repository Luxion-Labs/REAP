/**
 * Audit Log Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface AuditLogPrivateState {}
const PRIVATE_STATE_ID = 'auditLogState';

export class AuditLogAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) {}

  async connect(): Promise<void> {
    if (this.deployed) return;
    
    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/audit_log/contract/index.js');
    
    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {} as AuditLogPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('AuditLogAdapter: call connect() first.');
  }

  async logEvent(
    eventType: string,
    resourceId: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.logEvent(
        stringToBytes32(eventType),
        stringToBytes32(resourceId),
        coinPublicKeyToBytes32(callerCoinPublicKey),
      ),
      'logEvent',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
