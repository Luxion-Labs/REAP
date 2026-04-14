/**
 * Fractional Token Contract Adapter
 * Circuit signatures from packages/midnight/build/fractional_token/contract/index.d.ts
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/utils/contract-errors';
import {
  stringToBytes32,
  coinPublicKeyToBytes32,
  tokenStateLabel,
} from '@/lib/utils/contract-encoding';
import type { TokenInfo, TxResult } from '@/types/contracts';

interface FractionalTokenPrivateState { }
const PRIVATE_STATE_ID = 'fractionalTokenState';

export class FractionalTokenAdapter {
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
      initialPrivateState: {} as FractionalTokenPrivateState,
    });
  }

  private ensureConnected(): void {
    if (!this.deployed) throw new Error('FractionalTokenAdapter: call connect() first.');
  }

  async initializeToken(adminCoinPublicKey: string): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.initializeToken(coinPublicKeyToBytes32(adminCoinPublicKey)),
      'initializeToken',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  /** Mint tokens to a recipient. Caller must be admin. */
  async mint(
    toCoinPublicKey: string,
    amount: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.mint(coinPublicKeyToBytes32(toCoinPublicKey), amount as any, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'mint',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async burn(
    senderCoinPublicKey: string,
    amount: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.burn(coinPublicKeyToBytes32(senderCoinPublicKey), amount as any, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'burn',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async transfer(
    senderCoinPublicKey: string,
    toCoinPublicKey: string,
    amount: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.transfer(coinPublicKeyToBytes32(senderCoinPublicKey), coinPublicKeyToBytes32(toCoinPublicKey), amount as any, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'transfer',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async approve(
    ownerCoinPublicKey: string,
    spenderCoinPublicKey: string,
    amount: bigint,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.approve(coinPublicKeyToBytes32(ownerCoinPublicKey), coinPublicKeyToBytes32(spenderCoinPublicKey), amount as any, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'approve',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async balanceOf(holderCoinPublicKey: string): Promise<bigint | null> {
    this.ensureConnected();
    const [result, err] = await withContractCall(
      () => this.deployed.callTx.balanceOf(coinPublicKeyToBytes32(holderCoinPublicKey)),
      'balanceOf',
    );
    if (err) return null;
    return (result as any).private.result as bigint;
  }

  async getTokenInfo(): Promise<TokenInfo | null> {
    this.ensureConnected();
    const [
      totalSupplyResult,
      circulatingSupplyResult,
      stateCodeResult,
    ] = await Promise.all([
      withContractCall(() => this.deployed.callTx.getTotalSupply(), 'getTotalSupply'),
      withContractCall(() => this.deployed.callTx.getCirculatingSupply(), 'getCirculatingSupply'),
      withContractCall(() => this.deployed.callTx.getTokenState(), 'getTokenState'),
    ]);
    
    if (totalSupplyResult[0] == null) return null;

    const totalSupply = (totalSupplyResult[0] as any).private.result as bigint;
    const circulatingSupply = (circulatingSupplyResult[0] as any)?.private?.result as bigint ?? BigInt(0);
    const stateCode = (stateCodeResult[0] as any)?.private?.result as number ?? 0;

    return {
      totalSupply: totalSupply,
      circulatingSupply: circulatingSupply,
      state: stateCode as any,
      stateLabel: tokenStateLabel(stateCode as any),
    };
  }

  async pauseToken(
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.pause_token(coinPublicKeyToBytes32(callerCoinPublicKey)),
      'pause_token',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async unpauseToken(
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.unpause_token(coinPublicKeyToBytes32(callerCoinPublicKey)),
      'unpause_token',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
