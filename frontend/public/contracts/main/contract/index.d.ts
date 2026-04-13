import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeSystem(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyPause(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyUnpause(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSystemStatus(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean,
                                                                                                      boolean,
                                                                                                      Uint8Array]>;
  isSystemOperational(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
  incrementUserCount(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementPropertyCount(context: __compactRuntime.CircuitContext<PS>,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementTransactionCount(context: __compactRuntime.CircuitContext<PS>,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getTotalUsers(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalProperties(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalTransactions(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  updateMetric(context: __compactRuntime.CircuitContext<PS>,
               metric_key_0: Uint8Array,
               value_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getMetric(context: __compactRuntime.CircuitContext<PS>,
            metric_key_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  incrementMetric(context: __compactRuntime.CircuitContext<PS>,
                  metric_key_0: Uint8Array,
                  increment_value_0: bigint,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerContractVersion(context: __compactRuntime.CircuitContext<PS>,
                          contract_name_0: Uint8Array,
                          version_0: bigint,
                          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getContractVersion(context: __compactRuntime.CircuitContext<PS>,
                     contract_name_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  collectSystemFees(context: __compactRuntime.CircuitContext<PS>,
                    amount_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  transferAdmin(context: __compactRuntime.CircuitContext<PS>,
                new_admin_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  initializeSystem(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyPause(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyUnpause(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSystemStatus(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean,
                                                                                                      boolean,
                                                                                                      Uint8Array]>;
  isSystemOperational(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
  incrementUserCount(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementPropertyCount(context: __compactRuntime.CircuitContext<PS>,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementTransactionCount(context: __compactRuntime.CircuitContext<PS>,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getTotalUsers(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalProperties(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalTransactions(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  updateMetric(context: __compactRuntime.CircuitContext<PS>,
               metric_key_0: Uint8Array,
               value_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getMetric(context: __compactRuntime.CircuitContext<PS>,
            metric_key_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  incrementMetric(context: __compactRuntime.CircuitContext<PS>,
                  metric_key_0: Uint8Array,
                  increment_value_0: bigint,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerContractVersion(context: __compactRuntime.CircuitContext<PS>,
                          contract_name_0: Uint8Array,
                          version_0: bigint,
                          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getContractVersion(context: __compactRuntime.CircuitContext<PS>,
                     contract_name_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  collectSystemFees(context: __compactRuntime.CircuitContext<PS>,
                    amount_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  transferAdmin(context: __compactRuntime.CircuitContext<PS>,
                new_admin_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeSystem(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyPause(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  emergencyUnpause(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSystemStatus(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean,
                                                                                                      boolean,
                                                                                                      Uint8Array]>;
  isSystemOperational(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
  incrementUserCount(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementPropertyCount(context: __compactRuntime.CircuitContext<PS>,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  incrementTransactionCount(context: __compactRuntime.CircuitContext<PS>,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getTotalUsers(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalProperties(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalTransactions(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  updateMetric(context: __compactRuntime.CircuitContext<PS>,
               metric_key_0: Uint8Array,
               value_0: bigint,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getMetric(context: __compactRuntime.CircuitContext<PS>,
            metric_key_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  incrementMetric(context: __compactRuntime.CircuitContext<PS>,
                  metric_key_0: Uint8Array,
                  increment_value_0: bigint,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  registerContractVersion(context: __compactRuntime.CircuitContext<PS>,
                          contract_name_0: Uint8Array,
                          version_0: bigint,
                          caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getContractVersion(context: __compactRuntime.CircuitContext<PS>,
                     contract_name_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  collectSystemFees(context: __compactRuntime.CircuitContext<PS>,
                    amount_0: bigint,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  transferAdmin(context: __compactRuntime.CircuitContext<PS>,
                new_admin_0: Uint8Array,
                caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly system_initialized: boolean;
  readonly emergency_paused: boolean;
  readonly admin_address: Uint8Array;
  system_metrics: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  contract_versions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly system_event_counter: bigint;
  metric_keys: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  readonly total_users_count: bigint;
  readonly total_properties_count: bigint;
  readonly total_transactions_count: bigint;
  readonly system_fees_collected: bigint;
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
