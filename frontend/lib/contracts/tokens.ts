/**
 * Fractional Token Contract Adapter
 * Circuit signatures from packages/midnight/build/fractional_token/contract/index.d.ts
 */
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { REAPProviders } from '@/lib/midnight-providers';
import { withContractCall, extractTxInfo } from '@/lib/contract-errors';
import {
  stringToBytes32,
  coinPublicKeyToBytes32,
  tokenStateLabel,
} from '@/lib/contract-encoding';
import type { TokenInfo, TxResult } from '@/types/contracts';

interface FractionalTokenPrivateState { }
const PRIVATE_STATE_ID = 'fractionalTokenState';

export class FractionalTokenAdapter {
  private deployed: any = null;

  constructor(
    private readonly providers: REAPProviders,
    private readonly contractAddress: string,
  ) { }

  async connect(): Promise<void> {
    if (this.deployed) return;

    // @ts-ignore
    const contractModule = await import(/* webpackIgnore: true */ '/contracts/fractional_token/contract/index.js');

    // @ts-ignore
    this.deployed = await findDeployedContract(this.providers as any, {
      contractAddress: this.contractAddress,
      // @ts-ignore
      compiledContract: contractModule.compiledContract ?? contractModule,
      privateStateId: PRIVATE_STATE_ID,
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
      () => this.deployed.callTx.mint(toCoinPublicKey, amount, coinPublicKeyToBytes32(callerCoinPublicKey)),
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
      () => this.deployed.callTx.burn(senderCoinPublicKey, amount, coinPublicKeyToBytes32(callerCoinPublicKey)),
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
      () => this.deployed.callTx.transfer(senderCoinPublicKey, toCoinPublicKey, amount, coinPublicKeyToBytes32(callerCoinPublicKey)),
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
      () => this.deployed.callTx.approve(ownerCoinPublicKey, spenderCoinPublicKey, amount, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'approve',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }

  async balanceOf(holderCoinPublicKey: string): Promise<bigint | null> {
    this.ensureConnected();
    const [result, err] = await withContractCall(
      () => this.deployed.callTx.balanceOf(holderCoinPublicKey),
      'balanceOf',
    );
    if (err) return null;
    return result as bigint;
  }

  async getTokenInfo(): Promise<TokenInfo | null> {
    this.ensureConnected();
    const [
      [totalSupply],
      [circulatingSupply],
      [stateCode],
    ] = await Promise.all([
      withContractCall(() => this.deployed.callTx.getTotalSupply(), 'getTotalSupply'),
      withContractCall(() => this.deployed.callTx.getCirculatingSupply(), 'getCirculatingSupply'),
      withContractCall(() => this.deployed.callTx.getTokenState(), 'getTokenState'),
    ]);
    if (totalSupply == null) return null;
    return {
      totalSupply: totalSupply as bigint,
      circulatingSupply: (circulatingSupply as bigint | null) ?? BigInt(0),
      state: (stateCode as number | null) ?? (0 as any),
      stateLabel: tokenStateLabel((stateCode as number | null) ?? (0 as any)),
    };
  }

  async registerProperty(
    propertyId: string,
    ownerCoinPublicKey: string,
    callerCoinPublicKey: string,
  ): Promise<[TxResult | null, any]> {
    this.ensureConnected();
    const [tx, err] = await withContractCall(
      () => this.deployed.callTx.register_property(stringToBytes32(propertyId), ownerCoinPublicKey, coinPublicKeyToBytes32(callerCoinPublicKey)),
      'register_property',
    );
    if (err) return [null, err];
    return [extractTxInfo(tx, this.contractAddress), null];
  }
}
