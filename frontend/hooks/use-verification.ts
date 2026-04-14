"use client";

/**
 * useVerification hook
 */

import { useState, useCallback } from "react";
import { useContracts } from "@/components/providers/contract-provider";
import { useWalletState } from "@/components/providers/wallet-provider";
import type { TxResult } from "@/types/contracts";

interface UseVerificationReturn {
  requestVerification: (propertyId: string, documentHash: string) => Promise<{ tx: TxResult; requestId: string } | null>;
  submitResult: (requestId: string, result: number) => Promise<TxResult | null>;
  getStatus: (requestId: string) => Promise<{ code: number; label: string } | null>;
  isPending: boolean;
  error: string | null;
  lastTx: TxResult | null;
}

export function useVerification(): UseVerificationReturn {
  const { verification, isReady } = useContracts();
  const walletState = useWalletState();
  const callerKey = walletState.coinPublicKey ?? "";

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);

  const requestVerification = useCallback(async (propertyId: string, documentHash: string): Promise<{ tx: TxResult; requestId: string } | null> => {
    if (!isReady || !verification || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const requestId = Date.now().toString(16);
    const [tx, err] = await verification.requestVerification(requestId, propertyId, documentHash, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx!);
    return { tx: tx!, requestId };
  }, [verification, isReady, callerKey]);

  const submitResult = useCallback(async (requestId: string, result: number): Promise<TxResult | null> => {
    if (!isReady || !verification || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const approved = result > 0;
    const [tx, err] = await verification.submitVerificationResult(requestId, approved, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx!);
    return tx;
  }, [verification, isReady, callerKey]);

  const getStatus = useCallback(async (requestId: string) => {
    if (!isReady || !verification) return null;
    // getVerificationStatus not ported on chain yet, returning dummy object so UI doesn't crash during build
    return { code: 1, label: "Pending" };
  }, [verification, isReady]);

  return { requestVerification, submitResult, getStatus, isPending, error, lastTx };
}
