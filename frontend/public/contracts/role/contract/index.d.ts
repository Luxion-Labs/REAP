import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initialize_roles(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  set_role(context: __compactRuntime.CircuitContext<PS>,
           user_0: Uint8Array,
           role_0: number,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  get_user_role(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number]>;
  remove_role(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  is_user_admin(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  transfer_admin(context: __compactRuntime.CircuitContext<PS>,
                 new_admin_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_contract(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_contract(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  initialize_roles(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  set_role(context: __compactRuntime.CircuitContext<PS>,
           user_0: Uint8Array,
           role_0: number,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  get_user_role(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number]>;
  remove_role(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  is_user_admin(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  transfer_admin(context: __compactRuntime.CircuitContext<PS>,
                 new_admin_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_contract(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_contract(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initialize_roles(context: __compactRuntime.CircuitContext<PS>,
                   admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  set_role(context: __compactRuntime.CircuitContext<PS>,
           user_0: Uint8Array,
           role_0: number,
           caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  get_user_role(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number]>;
  remove_role(context: __compactRuntime.CircuitContext<PS>,
              user_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  is_user_admin(context: __compactRuntime.CircuitContext<PS>, user_0: Uint8Array): __compactRuntime.CircuitResults<PS, [boolean]>;
  transfer_admin(context: __compactRuntime.CircuitContext<PS>,
                 new_admin_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  pause_contract(context: __compactRuntime.CircuitContext<PS>,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpause_contract(context: __compactRuntime.CircuitContext<PS>,
                   caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  user_roles: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  readonly admin_address: Uint8Array;
  readonly is_initialized: boolean;
  readonly role_counter: bigint;
  readonly is_paused: boolean;
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
