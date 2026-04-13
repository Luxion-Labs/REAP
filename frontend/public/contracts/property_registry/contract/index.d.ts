import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeRegistry(context: __compactRuntime.CircuitContext<PS>,
                     admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   owner_0: Uint8Array,
                   valuation_0: bigint,
                   location_hash_0: Uint8Array,
                   document_hash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                       property_id_0: Uint8Array,
                       new_status_0: number,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProperty(context: __compactRuntime.CircuitContext<PS>,
              property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                               number,
                                                                               bigint]>;
  getPropertyMetadata(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                                       Uint8Array]>;
  transferProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   new_owner_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyProperty(context: __compactRuntime.CircuitContext<PS>,
                 property_id_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setRegistrationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  initializeRegistry(context: __compactRuntime.CircuitContext<PS>,
                     admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   owner_0: Uint8Array,
                   valuation_0: bigint,
                   location_hash_0: Uint8Array,
                   document_hash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                       property_id_0: Uint8Array,
                       new_status_0: number,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProperty(context: __compactRuntime.CircuitContext<PS>,
              property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                               number,
                                                                               bigint]>;
  getPropertyMetadata(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                                       Uint8Array]>;
  transferProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   new_owner_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyProperty(context: __compactRuntime.CircuitContext<PS>,
                 property_id_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setRegistrationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeRegistry(context: __compactRuntime.CircuitContext<PS>,
                     admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   owner_0: Uint8Array,
                   valuation_0: bigint,
                   location_hash_0: Uint8Array,
                   document_hash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePropertyStatus(context: __compactRuntime.CircuitContext<PS>,
                       property_id_0: Uint8Array,
                       new_status_0: number,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getProperty(context: __compactRuntime.CircuitContext<PS>,
              property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                               number,
                                                                               bigint]>;
  getPropertyMetadata(context: __compactRuntime.CircuitContext<PS>,
                      property_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [Uint8Array,
                                                                                       Uint8Array]>;
  transferProperty(context: __compactRuntime.CircuitContext<PS>,
                   property_id_0: Uint8Array,
                   new_owner_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyProperty(context: __compactRuntime.CircuitContext<PS>,
                 property_id_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setRegistrationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseRegistry(context: __compactRuntime.CircuitContext<PS>,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  property_owners: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  property_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  property_values: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  property_locations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  property_documents: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  readonly registry_initialized: boolean;
  readonly registration_fee: bigint;
  readonly registry_paused: boolean;
  readonly admin_address: Uint8Array;
  readonly collected_fees: bigint;
  readonly property_counter: bigint;
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
