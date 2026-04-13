import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeAudit(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  logPropertyEvent(context: __compactRuntime.CircuitContext<PS>,
                   entry_id_0: Uint8Array,
                   event_type_0: number,
                   property_id_0: Uint8Array,
                   actor_0: Uint8Array,
                   timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logTransactionEvent(context: __compactRuntime.CircuitContext<PS>,
                      entry_id_0: Uint8Array,
                      event_type_0: number,
                      transaction_id_0: Uint8Array,
                      actor_0: Uint8Array,
                      counterparty_0: Uint8Array,
                      amount_0: bigint,
                      timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logAdminAction(context: __compactRuntime.CircuitContext<PS>,
                 entry_id_0: Uint8Array,
                 action_type_0: number,
                 admin_0: Uint8Array,
                 target_resource_0: Uint8Array,
                 details_hash_0: Uint8Array,
                 timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markEntryFailed(context: __compactRuntime.CircuitContext<PS>,
                  entry_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getAuditEntry(context: __compactRuntime.CircuitContext<PS>,
                entry_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                              Uint8Array,
                                                                              Uint8Array,
                                                                              bigint,
                                                                              boolean]>;
  getEventTypeCount(context: __compactRuntime.CircuitContext<PS>,
                    event_type_0: number): __compactRuntime.CircuitResults<PS, bigint>;
  getActorEventCount(context: __compactRuntime.CircuitContext<PS>,
                     actor_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalEntries(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  pauseAudit(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAudit(context: __compactRuntime.CircuitContext<PS>,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  initializeAudit(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  logPropertyEvent(context: __compactRuntime.CircuitContext<PS>,
                   entry_id_0: Uint8Array,
                   event_type_0: number,
                   property_id_0: Uint8Array,
                   actor_0: Uint8Array,
                   timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logTransactionEvent(context: __compactRuntime.CircuitContext<PS>,
                      entry_id_0: Uint8Array,
                      event_type_0: number,
                      transaction_id_0: Uint8Array,
                      actor_0: Uint8Array,
                      counterparty_0: Uint8Array,
                      amount_0: bigint,
                      timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logAdminAction(context: __compactRuntime.CircuitContext<PS>,
                 entry_id_0: Uint8Array,
                 action_type_0: number,
                 admin_0: Uint8Array,
                 target_resource_0: Uint8Array,
                 details_hash_0: Uint8Array,
                 timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markEntryFailed(context: __compactRuntime.CircuitContext<PS>,
                  entry_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getAuditEntry(context: __compactRuntime.CircuitContext<PS>,
                entry_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                              Uint8Array,
                                                                              Uint8Array,
                                                                              bigint,
                                                                              boolean]>;
  getEventTypeCount(context: __compactRuntime.CircuitContext<PS>,
                    event_type_0: number): __compactRuntime.CircuitResults<PS, bigint>;
  getActorEventCount(context: __compactRuntime.CircuitContext<PS>,
                     actor_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalEntries(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  pauseAudit(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAudit(context: __compactRuntime.CircuitContext<PS>,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeAudit(context: __compactRuntime.CircuitContext<PS>,
                  admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  logPropertyEvent(context: __compactRuntime.CircuitContext<PS>,
                   entry_id_0: Uint8Array,
                   event_type_0: number,
                   property_id_0: Uint8Array,
                   actor_0: Uint8Array,
                   timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logTransactionEvent(context: __compactRuntime.CircuitContext<PS>,
                      entry_id_0: Uint8Array,
                      event_type_0: number,
                      transaction_id_0: Uint8Array,
                      actor_0: Uint8Array,
                      counterparty_0: Uint8Array,
                      amount_0: bigint,
                      timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  logAdminAction(context: __compactRuntime.CircuitContext<PS>,
                 entry_id_0: Uint8Array,
                 action_type_0: number,
                 admin_0: Uint8Array,
                 target_resource_0: Uint8Array,
                 details_hash_0: Uint8Array,
                 timestamp_seconds_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markEntryFailed(context: __compactRuntime.CircuitContext<PS>,
                  entry_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getAuditEntry(context: __compactRuntime.CircuitContext<PS>,
                entry_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                              Uint8Array,
                                                                              Uint8Array,
                                                                              bigint,
                                                                              boolean]>;
  getEventTypeCount(context: __compactRuntime.CircuitContext<PS>,
                    event_type_0: number): __compactRuntime.CircuitResults<PS, bigint>;
  getActorEventCount(context: __compactRuntime.CircuitContext<PS>,
                     actor_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  getTotalEntries(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  pauseAudit(context: __compactRuntime.CircuitContext<PS>, caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAudit(context: __compactRuntime.CircuitContext<PS>,
               caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  audit_entries: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  entry_actors: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  entry_targets: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  entry_details: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  entry_timestamps: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  entry_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  readonly audit_initialized: boolean;
  readonly admin_address: Uint8Array;
  readonly audit_paused: boolean;
  readonly total_entries: bigint;
  readonly entry_counter: bigint;
  entries_by_type: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: number): boolean;
    lookup(key_0: number): bigint;
    [Symbol.iterator](): Iterator<[number, bigint]>
  };
  entries_by_actor: {
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
