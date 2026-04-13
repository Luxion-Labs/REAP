import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeEscrow(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  depositEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                listing_id_0: Uint8Array,
                seller_0: Uint8Array,
                buyer_0: Uint8Array,
                amount_0: bigint,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  releaseEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                caller_0: Uint8Array,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fileDispute(context: __compactRuntime.CircuitContext<PS>,
              escrow_id_0: Uint8Array,
              dispute_reason_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveDispute(context: __compactRuntime.CircuitContext<PS>,
                 escrow_id_0: Uint8Array,
                 release_to_seller_0: boolean,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>,
            escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                           Uint8Array,
                                                                           bigint,
                                                                           number]>;
  getEscrowTimestamps(context: __compactRuntime.CircuitContext<PS>,
                      escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                     bigint]>;
  setEscrowFee(context: __compactRuntime.CircuitContext<PS>,
               new_fee_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseEscrow(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseEscrow(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectEscrowFees(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  initializeEscrow(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  depositEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                listing_id_0: Uint8Array,
                seller_0: Uint8Array,
                buyer_0: Uint8Array,
                amount_0: bigint,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  releaseEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                caller_0: Uint8Array,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fileDispute(context: __compactRuntime.CircuitContext<PS>,
              escrow_id_0: Uint8Array,
              dispute_reason_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveDispute(context: __compactRuntime.CircuitContext<PS>,
                 escrow_id_0: Uint8Array,
                 release_to_seller_0: boolean,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>,
            escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                           Uint8Array,
                                                                           bigint,
                                                                           number]>;
  getEscrowTimestamps(context: __compactRuntime.CircuitContext<PS>,
                      escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                     bigint]>;
  setEscrowFee(context: __compactRuntime.CircuitContext<PS>,
               new_fee_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseEscrow(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseEscrow(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectEscrowFees(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeEscrow(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  depositEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                listing_id_0: Uint8Array,
                seller_0: Uint8Array,
                buyer_0: Uint8Array,
                amount_0: bigint,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  releaseEscrow(context: __compactRuntime.CircuitContext<PS>,
                escrow_id_0: Uint8Array,
                caller_0: Uint8Array,
                timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  fileDispute(context: __compactRuntime.CircuitContext<PS>,
              escrow_id_0: Uint8Array,
              dispute_reason_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  resolveDispute(context: __compactRuntime.CircuitContext<PS>,
                 escrow_id_0: Uint8Array,
                 release_to_seller_0: boolean,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>,
            escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                           Uint8Array,
                                                                           bigint,
                                                                           number]>;
  getEscrowTimestamps(context: __compactRuntime.CircuitContext<PS>,
                      escrow_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                     bigint]>;
  setEscrowFee(context: __compactRuntime.CircuitContext<PS>,
               new_fee_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseEscrow(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseEscrow(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectEscrowFees(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  escrow_buyers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  escrow_sellers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  escrow_amounts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  escrow_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  escrow_listing_ids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  escrow_created_at: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  escrow_released_at: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  escrow_disputes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  readonly escrow_initialized: boolean;
  readonly escrow_fee_percentage: bigint;
  readonly escrow_paused: boolean;
  readonly admin_address: Uint8Array;
  readonly collected_fees: bigint;
  readonly escrow_counter: bigint;
  readonly release_counter: bigint;
  readonly dispute_counter: bigint;
  escrow_history: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
