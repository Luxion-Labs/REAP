"use client";

/**
 * useToken hook
 *
 * Wraps FractionalTokenAdapter with React state.
 */

import { useState, useCallback } from "react";
import { useContracts } from "@/components/providers/contract-provider";
import { useWalletState } from "@/components/providers/wallet-provider";
import type { TokenInfo, TxResult } from "@/types/contracts";

interface UseTokenReturn {
  /** Get token info (supply, state, circulating) */
  loadTokenInfo: () => Promise<TokenInfo | null>;
  /** Get balance of current wallet */
  loadMyBalance: () => Promise<bigint | null>;
  /** Get balance of any address */
  loadBalanceOf: (coinPublicKey: string) => Promise<bigint | null>;
  /** Mint tokens to recipient */
  mint: (toCoinPublicKey: string, amount: bigint) => Promise<TxResult | null>;
  /** Burn tokens from address */
  burn: (fromCoinPublicKey: string, amount: bigint) => Promise<TxResult | null>;
  /** Transfer tokens */
  transfer: (toCoinPublicKey: string, amount: bigint) => Promise<TxResult | null>;
  /** Cached token info */
  tokenInfo: TokenInfo | null;
  /** Cached wallet balance */
  myBalance: bigint | null;
  isPending: boolean;
  error: string | null;
  lastTx: TxResult | null;
}

export function useToken(): UseTokenReturn {
  const { fractionalToken, isReady } = useContracts();
  const walletState = useWalletState();

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [myBalance, setMyBalance] = useState<bigint | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);

  const callerKey = walletState.coinPublicKey ?? "";

  const loadTokenInfo = useCallback(async (): Promise<TokenInfo | null> => {
    if (!isReady || !fractionalToken) return null;
    const info = await fractionalToken.getTokenInfo();
    setTokenInfo(info);
    return info;
  }, [fractionalToken, isReady]);

  const loadMyBalance = useCallback(async (): Promise<bigint | null> => {
    if (!isReady || !fractionalToken || !callerKey) return null;
    const bal = await fractionalToken.balanceOf(callerKey);
    setMyBalance(bal);
    return bal;
  }, [fractionalToken, isReady, callerKey]);

  const loadBalanceOf = useCallback(async (key: string): Promise<bigint | null> => {
    if (!isReady || !fractionalToken) return null;
    return fractionalToken.balanceOf(key);
  }, [fractionalToken, isReady]);

  const mint = useCallback(async (toCoinPublicKey: string, amount: bigint): Promise<TxResult | null> => {
    if (!isReady || !fractionalToken || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, err] = await fractionalToken.mint(toCoinPublicKey, amount, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [fractionalToken, isReady, callerKey]);

  const burn = useCallback(async (fromCoinPublicKey: string, amount: bigint): Promise<TxResult | null> => {
    if (!isReady || !fractionalToken || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, err] = await fractionalToken.burn(fromCoinPublicKey, amount, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [fractionalToken, isReady, callerKey]);

  const transfer = useCallback(async (toCoinPublicKey: string, amount: bigint): Promise<TxResult | null> => {
    if (!isReady || !fractionalToken || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, err] = await fractionalToken.transfer(callerKey, toCoinPublicKey, amount, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [fractionalToken, isReady, callerKey]);

  return {
    loadTokenInfo,
    loadMyBalance,
    loadBalanceOf,
    mint,
    burn,
    transfer,
    tokenInfo,
    myBalance,
    isPending,
    error,
    lastTx,
  };
}
