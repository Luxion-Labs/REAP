import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeToken(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  burn(context: __compactRuntime.CircuitContext<PS>,
       sender_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           sender_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approve(context: __compactRuntime.CircuitContext<PS>,
          owner_0: Uint8Array,
          spender_0: Uint8Array,
          amount_0: bigint,
          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_token(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_token(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  balanceOf(context: __compactRuntime.CircuitContext<PS>, holder_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getCirculatingSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTokenState(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, number>;
  register_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    owner_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  tokenize_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    token_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer_property_ownership(context: __compactRuntime.CircuitContext<PS>,
                              property_id_0: Uint8Array,
                              new_owner_id_0: Uint8Array,
                              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  deactivate_property(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getPropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, number>;
  getPropertyOwner(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type ProvableCircuits<PS> = {
  initializeToken(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  burn(context: __compactRuntime.CircuitContext<PS>,
       sender_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           sender_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approve(context: __compactRuntime.CircuitContext<PS>,
          owner_0: Uint8Array,
          spender_0: Uint8Array,
          amount_0: bigint,
          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_token(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_token(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  balanceOf(context: __compactRuntime.CircuitContext<PS>, holder_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getCirculatingSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTokenState(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, number>;
  register_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    owner_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  tokenize_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    token_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer_property_ownership(context: __compactRuntime.CircuitContext<PS>,
                              property_id_0: Uint8Array,
                              new_owner_id_0: Uint8Array,
                              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  deactivate_property(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getPropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, number>;
  getPropertyOwner(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeToken(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  mint(context: __compactRuntime.CircuitContext<PS>,
       to_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  burn(context: __compactRuntime.CircuitContext<PS>,
       sender_0: Uint8Array,
       amount_0: bigint,
       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer(context: __compactRuntime.CircuitContext<PS>,
           sender_0: Uint8Array,
           to_0: Uint8Array,
           amount_0: bigint,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approve(context: __compactRuntime.CircuitContext<PS>,
          owner_0: Uint8Array,
          spender_0: Uint8Array,
          amount_0: bigint,
          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_token(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_token(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  balanceOf(context: __compactRuntime.CircuitContext<PS>, holder_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getCirculatingSupply(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTokenState(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, number>;
  register_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    owner_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  tokenize_property(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array,
                    token_id_0: Uint8Array,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transfer_property_ownership(context: __compactRuntime.CircuitContext<PS>,
                              property_id_0: Uint8Array,
                              new_owner_id_0: Uint8Array,
                              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  deactivate_property(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getPropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                    property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, number>;
  getPropertyOwner(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly total_supply: bigint;
  readonly circulating_supply: bigint;
  readonly nonce: bigint;
  balances: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly token_state: number;
  readonly token_admin: Uint8Array;
  readonly token_initialized: boolean;
  readonly holder_count: bigint;
  holders: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  holder_history: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  property_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  property_owners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  property_token_ids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  property_history: {
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
