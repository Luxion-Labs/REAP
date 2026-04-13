import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeMarketplace(context: __compactRuntime.CircuitContext<PS>,
                        admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                property_id_0: Uint8Array,
                price_0: bigint,
                duration_seconds_0: bigint,
                timestamp_seconds_0: bigint,
                seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updateListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                new_price_0: bigint,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  cancelListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  purchaseListing(context: __compactRuntime.CircuitContext<PS>,
                  listing_id_0: Uint8Array,
                  buyer_0: Uint8Array,
                  fee_amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getListing(context: __compactRuntime.CircuitContext<PS>,
             listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                             Uint8Array,
                                                                             bigint,
                                                                             number]>;
  getListingDetails(context: __compactRuntime.CircuitContext<PS>,
                    listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                    bigint]>;
  setMarketplaceFee(context: __compactRuntime.CircuitContext<PS>,
                    new_fee_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectFees(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  initializeMarketplace(context: __compactRuntime.CircuitContext<PS>,
                        admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                property_id_0: Uint8Array,
                price_0: bigint,
                duration_seconds_0: bigint,
                timestamp_seconds_0: bigint,
                seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updateListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                new_price_0: bigint,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  cancelListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  purchaseListing(context: __compactRuntime.CircuitContext<PS>,
                  listing_id_0: Uint8Array,
                  buyer_0: Uint8Array,
                  fee_amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getListing(context: __compactRuntime.CircuitContext<PS>,
             listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                             Uint8Array,
                                                                             bigint,
                                                                             number]>;
  getListingDetails(context: __compactRuntime.CircuitContext<PS>,
                    listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                    bigint]>;
  setMarketplaceFee(context: __compactRuntime.CircuitContext<PS>,
                    new_fee_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectFees(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeMarketplace(context: __compactRuntime.CircuitContext<PS>,
                        admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  createListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                property_id_0: Uint8Array,
                price_0: bigint,
                duration_seconds_0: bigint,
                timestamp_seconds_0: bigint,
                seller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updateListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                new_price_0: bigint,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  cancelListing(context: __compactRuntime.CircuitContext<PS>,
                listing_id_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  purchaseListing(context: __compactRuntime.CircuitContext<PS>,
                  listing_id_0: Uint8Array,
                  buyer_0: Uint8Array,
                  fee_amount_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getListing(context: __compactRuntime.CircuitContext<PS>,
             listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                             Uint8Array,
                                                                             bigint,
                                                                             number]>;
  getListingDetails(context: __compactRuntime.CircuitContext<PS>,
                    listing_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                    bigint]>;
  setMarketplaceFee(context: __compactRuntime.CircuitContext<PS>,
                    new_fee_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseMarketplace(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectFees(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  listing_sellers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  listing_property_ids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  listing_prices: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  listing_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  listing_timestamps: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  listing_durations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  listing_buyers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  readonly marketplace_initialized: boolean;
  readonly marketplace_fee: bigint;
  readonly marketplace_paused: boolean;
  readonly admin_address: Uint8Array;
  readonly collected_fees: bigint;
  readonly listing_counter: bigint;
  readonly transaction_counter: bigint;
  listing_history: {
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
