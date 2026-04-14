"use client";

/**
 * useProperty hook
 *
 * Wraps PropertyRegistryAdapter with React state management.
 * Handles loading, error, and tx feedback automatically.
 */

import { useState, useCallback } from "react";
import { useContracts } from "@/components/providers/contract-provider";
import { useWalletState } from "@/components/providers/wallet-provider";
import type { PropertyData, TxResult } from "@/types/contracts";

interface UsePropertyReturn {
  /** Load a property from on-chain state */
  loadProperty: (propertyId: string) => Promise<PropertyData | null>;
  /** Register a new property */
  registerProperty: (args: {
    propertyId: string;
    valuation: bigint;
    locationHash: string;
    documentHash: string;
  }) => Promise<TxResult | null>;
  /** Update property status (admin only) */
  updateStatus: (propertyId: string, newStatus: number) => Promise<TxResult | null>;
  /** Transfer property to a new owner */
  transferProperty: (propertyId: string, newOwnerKey: string) => Promise<TxResult | null>;
  /** Verify a property (admin only) */
  verifyProperty: (propertyId: string) => Promise<TxResult | null>;
  /** Last loaded property data */
  property: PropertyData | null;
  /** Transaction in progress */
  isPending: boolean;
  /** Last error message */
  error: string | null;
  /** Last successful tx result */
  lastTx: TxResult | null;
  /** True if contract adapters are ready */
  isReady: boolean;
}

export function useProperty(): UsePropertyReturn {
  const { propertyRegistry, isReady } = useContracts();
  const walletState = useWalletState();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);

  const callerKey = walletState.coinPublicKey ?? "";

  const loadProperty = useCallback(async (propertyId: string): Promise<PropertyData | null> => {
    if (!isReady || !propertyRegistry) {
      setError("Contracts not ready. Connect your wallet first.");
      return null;
    }
    setError(null);
    try {
      const data = await propertyRegistry.getProperty(propertyId);
      setProperty(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property");
      return null;
    }
  }, [propertyRegistry, isReady]);

  const registerProperty = useCallback(async ({
    propertyId,
    valuation,
    locationHash,
    documentHash,
  }: {
    propertyId: string;
    valuation: bigint;
    locationHash: string;
    documentHash: string;
  }): Promise<TxResult | null> => {
    if (!isReady || !propertyRegistry) {
      setError("Contracts not ready.");
      return null;
    }
    if (!callerKey) {
      setError("Wallet not connected.");
      return null;
    }

    setIsPending(true);
    setError(null);

    const [tx, err] = await propertyRegistry.registerProperty(
      propertyId,
      callerKey,
      valuation,
      locationHash,
      documentHash,
    );

    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [propertyRegistry, isReady, callerKey]);

  const updateStatus = useCallback(async (propertyId: string, newStatus: number): Promise<TxResult | null> => {
    if (!isReady || !propertyRegistry || !callerKey) return null;
    setIsPending(true);
    setError(null);
    const [tx, err] = await propertyRegistry.updatePropertyStatus(propertyId, newStatus, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [propertyRegistry, isReady, callerKey]);

  const transferProperty = useCallback(async (propertyId: string, newOwnerKey: string): Promise<TxResult | null> => {
    if (!isReady || !propertyRegistry || !callerKey) return null;
    setIsPending(true);
    setError(null);
    const [tx, err] = await propertyRegistry.transferProperty(propertyId, newOwnerKey, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [propertyRegistry, isReady, callerKey]);

  const verifyProperty = useCallback(async (propertyId: string): Promise<TxResult | null> => {
    if (!isReady || !propertyRegistry || !callerKey) return null;
    setIsPending(true);
    setError(null);
    const [tx, err] = await propertyRegistry.verifyProperty(propertyId, callerKey);
    setIsPending(false);
    if (err) { setError(err.message); return null; }
    setLastTx(tx);
    return tx;
  }, [propertyRegistry, isReady, callerKey]);

  return {
    loadProperty,
    registerProperty,
    updateStatus,
    transferProperty,
    verifyProperty,
    property,
    isPending,
    error,
    lastTx,
    isReady,
  };
}
