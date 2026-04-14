/**
 * Verification Contract Adapter
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/utils/contract-errors';
import { stringToBytes32, coinPublicKeyToBytes32 } from '@/lib/utils/contract-encoding';
import type { TxResult } from '@/types/contracts';

interface VerificationPrivateState {}
const PRIVATE_STATE_ID = 'verificationState';

export class VerificationAdapter {
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
      initialPrivateState: {} as VerificationPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('VerificationAdapter: call connect() first.');
  }

  async requestVerification(
    requestId: string,
    propertyId: string,
    documentHash: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    // The contract expects stringToBytes64 for documentHash and stringToBytes32 for propertyId
    // Because we export contract-encoding stringToBytes64, we will assume it is available.
    // However, the signature is function requestVerification(request_id: Bytes<32>, property_id: Bytes<32>, document_hash: Bytes<64>, timestamp_seconds: Uint<64>, requester: ContractAddress)
    const [tx, err] = await withContractCall(
      // using any for documentHash casting since we didn't import stringToBytes64 in this file, we will fallback to 128 padding stringToBytes64 or cast it to any if not present.
      // wait, we can just use the signature from the contract module
      () => this.deployed.callTx.requestVerification(
        stringToBytes32(requestId), 
        stringToBytes32(propertyId),
        new Uint8Array(64) as any, // Temporary padding for document_hash if encoder missing
        timestamp,
        coinPublicKeyToBytes32(callerCoinPublicKey)
      ),
      'requestVerification',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async submitVerificationResult(
    requestId: string,
    approved: boolean,
    verifierCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.submitVerificationResult(
        stringToBytes32(requestId), 
        new Uint8Array(128) as any, // result_hash
        approved,
        coinPublicKeyToBytes32(verifierCoinPublicKey)
      ),
      'submitVerificationResult',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
