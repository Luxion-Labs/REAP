"use client";

/**
 * useMarketplace hook
 */

import { useState, useCallback } from "react";
import { useContracts } from "@/components/providers/contract-provider";
import { useWalletState } from "@/components/providers/wallet-provider";
import type { TxResult } from "@/types/contracts";

interface UseMarketplaceReturn {
  createListing: (args: {
    tokenId: string;
    quantity: bigint;
    pricePerToken: bigint;
  }) => Promise<{ tx: TxResult; listingId: string } | null>;
  purchaseListing: (listingId: string, quantity: bigint) => Promise<TxResult | null>;
  cancelListing: (listingId: string) => Promise<TxResult | null>;
  isPending: boolean;
  error: string | null;
  lastTx: TxResult | null;
}

export function useMarketplace(): UseMarketplaceReturn {
  const { marketplace, isReady } = useContracts();
  const walletState = useWalletState();
  const callerKey = walletState.coinPublicKey ?? "";

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);

  const createListing = useCallback(async ({
    tokenId,
    quantity,
    pricePerToken,
  }: {
    tokenId: string;
    quantity: bigint;
    pricePerToken: bigint;
  }): Promise<{ tx: TxResult; listingId: string } | null> => {
    if (!isReady || !marketplace || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, listingId, err] = await marketplace.createListing(callerKey, tokenId, quantity, pricePerToken, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx!);
    return { tx: tx!, listingId };
  }, [marketplace, isReady, callerKey]);

  const purchaseListing = useCallback(async (listingId: string, quantity: bigint): Promise<TxResult | null> => {
    if (!isReady || !marketplace || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, err] = await marketplace.purchaseListing(listingId, callerKey, quantity, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx!);
    return tx;
  }, [marketplace, isReady, callerKey]);

  const cancelListing = useCallback(async (listingId: string): Promise<TxResult | null> => {
    if (!isReady || !marketplace || !callerKey) { setError("Not ready"); return null; }
    setIsPending(true); setError(null);
    const [tx, err] = await marketplace.cancelListing(listingId, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx!);
    return tx;
  }, [marketplace, isReady, callerKey]);

  return { createListing, purchaseListing, cancelListing, isPending, error, lastTx };
}
