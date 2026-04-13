import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeAccessControl(context: __compactRuntime.CircuitContext<PS>,
                          admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  grantPermission(context: __compactRuntime.CircuitContext<PS>,
                  grant_id_0: Uint8Array,
                  user_0: Uint8Array,
                  resource_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokePermission(context: __compactRuntime.CircuitContext<PS>,
                   grant_id_0: Uint8Array,
                   user_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hasReadPermission(context: __compactRuntime.CircuitContext<PS>,
                    grant_id_0: Uint8Array,
                    user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasWritePermission(context: __compactRuntime.CircuitContext<PS>,
                     grant_id_0: Uint8Array,
                     user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasExecutePermission(context: __compactRuntime.CircuitContext<PS>,
                       grant_id_0: Uint8Array,
                       user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  enableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                           resource_id_0: Uint8Array,
                           permission_0: number,
                           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  disableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                            resource_id_0: Uint8Array,
                            permission_0: number,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferAdminRights(context: __compactRuntime.CircuitContext<PS>,
                      new_admin_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  initializeAccessControl(context: __compactRuntime.CircuitContext<PS>,
                          admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  grantPermission(context: __compactRuntime.CircuitContext<PS>,
                  grant_id_0: Uint8Array,
                  user_0: Uint8Array,
                  resource_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokePermission(context: __compactRuntime.CircuitContext<PS>,
                   grant_id_0: Uint8Array,
                   user_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hasReadPermission(context: __compactRuntime.CircuitContext<PS>,
                    grant_id_0: Uint8Array,
                    user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasWritePermission(context: __compactRuntime.CircuitContext<PS>,
                     grant_id_0: Uint8Array,
                     user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasExecutePermission(context: __compactRuntime.CircuitContext<PS>,
                       grant_id_0: Uint8Array,
                       user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  enableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                           resource_id_0: Uint8Array,
                           permission_0: number,
                           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  disableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                            resource_id_0: Uint8Array,
                            permission_0: number,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferAdminRights(context: __compactRuntime.CircuitContext<PS>,
                      new_admin_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeAccessControl(context: __compactRuntime.CircuitContext<PS>,
                          admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  grantPermission(context: __compactRuntime.CircuitContext<PS>,
                  grant_id_0: Uint8Array,
                  user_0: Uint8Array,
                  resource_id_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokePermission(context: __compactRuntime.CircuitContext<PS>,
                   grant_id_0: Uint8Array,
                   user_0: Uint8Array,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  hasReadPermission(context: __compactRuntime.CircuitContext<PS>,
                    grant_id_0: Uint8Array,
                    user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasWritePermission(context: __compactRuntime.CircuitContext<PS>,
                     grant_id_0: Uint8Array,
                     user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  hasExecutePermission(context: __compactRuntime.CircuitContext<PS>,
                       grant_id_0: Uint8Array,
                       user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  enableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                           resource_id_0: Uint8Array,
                           permission_0: number,
                           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  disableResourcePermission(context: __compactRuntime.CircuitContext<PS>,
                            resource_id_0: Uint8Array,
                            permission_0: number,
                            caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseAccessControl(context: __compactRuntime.CircuitContext<PS>,
                       caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  transferAdminRights(context: __compactRuntime.CircuitContext<PS>,
                      new_admin_0: Uint8Array,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  user_permissions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  resource_permissions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): {
      isEmpty(): boolean;
      size(): bigint;
      member(key_1: number): boolean;
      lookup(key_1: number): boolean;
      [Symbol.iterator](): Iterator<[number, boolean]>
    }
  };
  permission_grants: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  permission_history: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly access_control_initialized: boolean;
  readonly admin_address: Uint8Array;
  readonly access_paused: boolean;
  readonly permission_counter: bigint;
  readonly grant_counter: bigint;
  readonly revoke_counter: bigint;
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
