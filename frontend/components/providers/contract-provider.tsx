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
} from "@/lib/contracts.config";
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

      // Instantiate adapters for configured contracts only
      const newAdapters: Partial<{
        propertyRegistry: PropertyRegistryAdapter;
        fractionalToken: FractionalTokenAdapter;
        marketplace: MarketplaceAdapter;
        escrow: EscrowAdapter;
        verification: VerificationAdapter;
        mainContract: MainContractAdapter;
        auditLog: AuditLogAdapter;
        role: RoleAdapter;
        accessControl: AccessControlAdapter;
      }> = {};

      if (CONTRACT_ADDRESSES.propertyRegistry) {
        const a = new PropertyRegistryAdapter(providers, CONTRACT_ADDRESSES.propertyRegistry!);
        await a.connect();
        newAdapters.propertyRegistry = a;
      }
      if (CONTRACT_ADDRESSES.fractionalToken) {
        const a = new FractionalTokenAdapter(providers, CONTRACT_ADDRESSES.fractionalToken!);
        await a.connect();
        newAdapters.fractionalToken = a;
      }
      if (CONTRACT_ADDRESSES.marketplace) {
        const a = new MarketplaceAdapter(providers, CONTRACT_ADDRESSES.marketplace!);
        await a.connect();
        newAdapters.marketplace = a;
      }
      if (CONTRACT_ADDRESSES.escrow) {
        const a = new EscrowAdapter(providers, CONTRACT_ADDRESSES.escrow!);
        await a.connect();
        newAdapters.escrow = a;
      }
      if (CONTRACT_ADDRESSES.verification) {
        const a = new VerificationAdapter(providers, CONTRACT_ADDRESSES.verification!);
        await a.connect();
        newAdapters.verification = a;
      }
      if (CONTRACT_ADDRESSES.main) {
        const a = new MainContractAdapter(providers, CONTRACT_ADDRESSES.main!);
        await a.connect();
        newAdapters.mainContract = a;
      }
      if (CONTRACT_ADDRESSES.auditLog) {
        const a = new AuditLogAdapter(providers, CONTRACT_ADDRESSES.auditLog!);
        await a.connect();
        newAdapters.auditLog = a;
      }
      if (CONTRACT_ADDRESSES.role) {
        const a = new RoleAdapter(providers, CONTRACT_ADDRESSES.role!);
        await a.connect();
        newAdapters.role = a;
      }
      if (CONTRACT_ADDRESSES.accessControl) {
        const a = new AccessControlAdapter(providers, CONTRACT_ADDRESSES.accessControl!);
        await a.connect();
        newAdapters.accessControl = a;
      }

      setPropertyRegistry(newAdapters.propertyRegistry ?? null);
      setFractionalToken(newAdapters.fractionalToken ?? null);
      setMarketplace(newAdapters.marketplace ?? null);
      setEscrow(newAdapters.escrow ?? null);
      setVerification(newAdapters.verification ?? null);
      setMainContract(newAdapters.mainContract ?? null);
      setAuditLog(newAdapters.auditLog ?? null);
      setRole(newAdapters.role ?? null);
      setAccessControl(newAdapters.accessControl ?? null);
      setIsReady(true);

      // Load initial snapshot
      if (newAdapters.mainContract) {
        try {
          const snapshot = await newAdapters.mainContract.getSystemSnapshot();
          setSystemSnapshot(snapshot);
        } catch {
          // Non-fatal: snapshot load failure
        }
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
