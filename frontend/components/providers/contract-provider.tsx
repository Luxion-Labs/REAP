"use client";

/**
 * REAP Contract Context
 *
 * Sits on top of WalletProvider. Builds the Midnight SDK providers
 * as soon as the wallet connects (connectedApi is available), then
 * instantiates all contract adapters.
 *
 * Tree:
 *   <WalletProvider>
 *     <ContractProvider>        ← this file
 *       {children}
 *     </ContractProvider>
 *   </WalletProvider>
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useWallet } from "@/components/providers/wallet-provider";
import { buildREAPProviders, type REAPProvidersBundle } from "@/lib/midnight-providers";
import {
  REAPUnifiedAdapter,
  PropertyRegistryAdapter,
  FractionalTokenAdapter,
  MarketplaceAdapter,
  EscrowAdapter,
  VerificationAdapter,
  MainContractAdapter,
  AuditLogAdapter,
  RoleAdapter,
  AccessControlAdapter,
} from "@/lib/contracts";
import {
  CONTRACT_ADDRESSES,
  areContractsDeployed,
  getMissingContracts,
} from "@/lib/utils/contracts.config";
import type { ContractStateSnapshot } from "@/types/contracts";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface ContractContextType {
  /** True when provider bundle has been built (wallet connected + providers ready) */
  isReady: boolean;
  /** True while initializing providers */
  isInitializing: boolean;
  /** Any provider-init error */
  error: string | null;

  /** True if contract addresses are configured in env */
  contractsDeployed: boolean;
  /** Contract names that are missing addresses */
  missingContracts: string[];

  /** Provider bundle (contains publicDataProvider, zkConfigProvider, etc.) */
  bundle: REAPProvidersBundle | null;

  /** Pre-connected contract adapters (null until ready) */
  propertyRegistry: PropertyRegistryAdapter | null;
  fractionalToken: FractionalTokenAdapter | null;
  marketplace: MarketplaceAdapter | null;
  escrow: EscrowAdapter | null;
  verification: VerificationAdapter | null;
  mainContract: MainContractAdapter | null;
  auditLog: AuditLogAdapter | null;
  role: RoleAdapter | null;
  accessControl: AccessControlAdapter | null;

  /** Cached on-chain system snapshot (refreshed on mount + on demand) */
  systemSnapshot: Partial<ContractStateSnapshot> | null;

  /** Manually refresh the system snapshot */
  refreshSnapshot: () => Promise<void>;

  /** Re-run provider initialization (e.g. after wallet reconnect) */
  reinitialize: () => Promise<void>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const { connectedApi, state: walletState } = useWallet();

  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<REAPProvidersBundle | null>(null);
  const [systemSnapshot, setSystemSnapshot] = useState<Partial<ContractStateSnapshot> | null>(null);

  // Adapters
  const [propertyRegistry, setPropertyRegistry] = useState<PropertyRegistryAdapter | null>(null);
  const [fractionalToken, setFractionalToken] = useState<FractionalTokenAdapter | null>(null);
  const [marketplace, setMarketplace] = useState<MarketplaceAdapter | null>(null);
  const [escrow, setEscrow] = useState<EscrowAdapter | null>(null);
  const [verification, setVerification] = useState<VerificationAdapter | null>(null);
  const [mainContract, setMainContract] = useState<MainContractAdapter | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogAdapter | null>(null);
  const [role, setRole] = useState<RoleAdapter | null>(null);
  const [accessControl, setAccessControl] = useState<AccessControlAdapter | null>(null);

  const initRef = useRef(false);
  const contractsDeployed = areContractsDeployed();
  const missingContracts = getMissingContracts();

  // ── Initialize providers + adapters ────────────────────────────────────
  const initialize = useCallback(async () => {
    if (!connectedApi || initRef.current) return;
    if (!contractsDeployed) {
      console.warn("[ContractProvider] Contracts not deployed. Skipping init.");
      return;
    }

    initRef.current = true;
    setIsInitializing(true);
    setError(null);

    try {
      // Build provider bundle from connected wallet
      const providerBundle = await buildREAPProviders(connectedApi);
      setBundle(providerBundle);

      const { providers } = providerBundle;
      const unifiedAddress = CONTRACT_ADDRESSES.unified;

      if (!unifiedAddress) {
        throw new Error("UNIFIED contract address missing from environment!");
      }

      // 1. Initialize Unified Adapter
      const unified = new REAPUnifiedAdapter(providers, unifiedAddress);
      await unified.connect();

      // 2. Instantiate all sub-adapters using the same unified instance
      const pReg = new PropertyRegistryAdapter(providers, unifiedAddress, unified.deployed);
      const fTok = new FractionalTokenAdapter(providers, unifiedAddress, unified.deployed);
      const mkt = new MarketplaceAdapter(providers, unifiedAddress, unified.deployed);
      const esc = new EscrowAdapter(providers, unifiedAddress, unified.deployed);
      const ver = new VerificationAdapter(providers, unifiedAddress, unified.deployed);
      const main = new MainContractAdapter(providers, unifiedAddress, unified.deployed);
      const audit = new AuditLogAdapter(providers, unifiedAddress, unified.deployed);
      const role = new RoleAdapter(providers, unifiedAddress, unified.deployed);
      const acc = new AccessControlAdapter(providers, unifiedAddress, unified.deployed);

      setPropertyRegistry(pReg);
      setFractionalToken(fTok);
      setMarketplace(mkt);
      setEscrow(esc);
      setVerification(ver);
      setMainContract(main);
      setAuditLog(audit);
      setRole(role);
      setAccessControl(acc);

      setIsReady(true);

      // Load initial snapshot
      try {
        const snapshot = await main.getSystemSnapshot();
        setSystemSnapshot(snapshot);
      } catch (err) {
        console.warn("[ContractProvider] Snapshot load failed:", err);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ContractProvider] Init failed:", err);
      setError(msg);
    } finally {
      setIsInitializing(false);
      initRef.current = false;
    }
  }, [connectedApi, contractsDeployed]);

  // Trigger init when wallet connects
  useEffect(() => {
    if (walletState.isConnected && connectedApi) {
      initialize();
    }

    // Reset on disconnect
    if (!walletState.isConnected) {
      setIsReady(false);
      setBundle(null);
      setPropertyRegistry(null);
      setFractionalToken(null);
      setMarketplace(null);
      setEscrow(null);
      setVerification(null);
      setMainContract(null);
      setAuditLog(null);
      setRole(null);
      setAccessControl(null);
      setSystemSnapshot(null);
      initRef.current = false;
    }
  }, [walletState.isConnected, connectedApi, initialize]);

  // ── Snapshot refresh ────────────────────────────────────────────────────
  const refreshSnapshot = useCallback(async () => {
    if (!mainContract) return;
    try {
      const snapshot = await mainContract.getSystemSnapshot();
      setSystemSnapshot(snapshot);
    } catch (err) {
      console.warn("[ContractProvider] Snapshot refresh failed:", err);
    }
  }, [mainContract]);

  // ── Re-initialize (e.g. after wallet reconnect) ─────────────────────────
  const reinitialize = useCallback(async () => {
    initRef.current = false;
    setIsReady(false);
    setBundle(null);
    await initialize();
  }, [initialize]);

  return (
    <ContractContext.Provider
      value={{
        isReady,
        isInitializing,
        error,
        contractsDeployed,
        missingContracts,
        bundle,
        propertyRegistry,
        fractionalToken,
        marketplace,
        escrow,
        verification,
        mainContract,
        auditLog,
        role,
        accessControl,
        systemSnapshot,
        refreshSnapshot,
        reinitialize,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useContracts(): ContractContextType {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error("useContracts must be used within ContractProvider");
  return ctx;
}

/** Shorthand: check if ready before using adapters */
export function useContractReady() {
  const { isReady, isInitializing, error, contractsDeployed, missingContracts } = useContracts();
  return { isReady, isInitializing, error, contractsDeployed, missingContracts };
}

/** Returns the live system snapshot */
export function useSystemSnapshot() {
  const { systemSnapshot, refreshSnapshot, isReady } = useContracts();
  return { snapshot: systemSnapshot, refresh: refreshSnapshot, isReady };
}
