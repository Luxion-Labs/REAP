import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  initializeVerification(context: __compactRuntime.CircuitContext<PS>,
                         admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestVerification(context: __compactRuntime.CircuitContext<PS>,
                      request_id_0: Uint8Array,
                      property_id_0: Uint8Array,
                      document_hash_0: Uint8Array,
                      timestamp_seconds_0: bigint,
                      requester_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approveVerifier(context: __compactRuntime.CircuitContext<PS>,
                  verifier_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  removeVerifier(context: __compactRuntime.CircuitContext<PS>,
                 verifier_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startVerification(context: __compactRuntime.CircuitContext<PS>,
                    request_id_0: Uint8Array,
                    verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                           request_id_0: Uint8Array,
                           result_hash_0: Uint8Array,
                           approved_0: boolean,
                           verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStatus(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                                        Uint8Array,
                                                                                        Uint8Array]>;
  getVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>,
              request_id_0: Uint8Array,
              proof_data_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                         amount_0: bigint,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  pauseVerification(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseVerification(context: __compactRuntime.CircuitContext<PS>,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
}

export type ProvableCircuits<PS> = {
  initializeVerification(context: __compactRuntime.CircuitContext<PS>,
                         admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestVerification(context: __compactRuntime.CircuitContext<PS>,
                      request_id_0: Uint8Array,
                      property_id_0: Uint8Array,
                      document_hash_0: Uint8Array,
                      timestamp_seconds_0: bigint,
                      requester_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approveVerifier(context: __compactRuntime.CircuitContext<PS>,
                  verifier_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  removeVerifier(context: __compactRuntime.CircuitContext<PS>,
                 verifier_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startVerification(context: __compactRuntime.CircuitContext<PS>,
                    request_id_0: Uint8Array,
                    verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                           request_id_0: Uint8Array,
                           result_hash_0: Uint8Array,
                           approved_0: boolean,
                           verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStatus(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                                        Uint8Array,
                                                                                        Uint8Array]>;
  getVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>,
              request_id_0: Uint8Array,
              proof_data_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                         amount_0: bigint,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  pauseVerification(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseVerification(context: __compactRuntime.CircuitContext<PS>,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initializeVerification(context: __compactRuntime.CircuitContext<PS>,
                         admin_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestVerification(context: __compactRuntime.CircuitContext<PS>,
                      request_id_0: Uint8Array,
                      property_id_0: Uint8Array,
                      document_hash_0: Uint8Array,
                      timestamp_seconds_0: bigint,
                      requester_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  approveVerifier(context: __compactRuntime.CircuitContext<PS>,
                  verifier_0: Uint8Array,
                  caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  removeVerifier(context: __compactRuntime.CircuitContext<PS>,
                 verifier_0: Uint8Array,
                 caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  startVerification(context: __compactRuntime.CircuitContext<PS>,
                    request_id_0: Uint8Array,
                    verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                           request_id_0: Uint8Array,
                           result_hash_0: Uint8Array,
                           approved_0: boolean,
                           verifier_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStatus(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, [number,
                                                                                        Uint8Array,
                                                                                        Uint8Array]>;
  getVerificationResult(context: __compactRuntime.CircuitContext<PS>,
                        request_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  verifyProof(context: __compactRuntime.CircuitContext<PS>,
              request_id_0: Uint8Array,
              proof_data_0: Uint8Array,
              caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                     new_fee_0: bigint,
                     caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  collectVerificationFee(context: __compactRuntime.CircuitContext<PS>,
                         amount_0: bigint,
                         caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCollectedFees(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  withdrawCollectedFees(context: __compactRuntime.CircuitContext<PS>,
                        caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  pauseVerification(context: __compactRuntime.CircuitContext<PS>,
                    caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  unpauseVerification(context: __compactRuntime.CircuitContext<PS>,
                      caller_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getVerificationStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [boolean]>;
}

export type Ledger = {
  verification_requesters: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  verification_property_ids: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  verification_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): number;
    [Symbol.iterator](): Iterator<[Uint8Array, number]>
  };
  verification_timestamps: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  verification_documents: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  verification_results: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  verification_verifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  verification_history: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly verification_initialized: boolean;
  readonly verification_fee: bigint;
  readonly verification_paused: boolean;
  readonly admin_address: Uint8Array;
  verifier_addresses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
  readonly collected_fees: bigint;
  readonly request_counter: bigint;
  readonly approved_count: bigint;
  readonly rejected_count: bigint;
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
