"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import type {
  MidnightInitialAPI,
  MidnightConnectedAPI,
  MidnightWalletAPI,
} from "@/types/midnight";

import {
  WalletState,
  WalletConfig,
  WalletConnectionResult,
  MidnightBalances,
  MidnightAddresses,
  MidnightServiceConfig,
  DEFAULT_NETWORK_ID,
} from "@/lib/wallet-types";

import {
  isWalletInstalled,
  getPrimaryWalletProvider,
  handleMidnightError,
} from "@/lib/midnight-utils";

// ─── Wallet Configurations ──────────────────────────────────────────────────

const walletConfigs: WalletConfig[] = [
  {
    provider: "lace",
    name: "Lace Wallet",
    icon: "💎",
    description: "Midnight-enabled Lace wallet (browser extension)",
  },
];

// ─── Context Type ────────────────────────────────────────────────────────────

interface WalletContextType {
  state: WalletState;
  availableWallets: WalletConfig[];
  connectWallet: () => Promise<WalletConnectionResult>;
  disconnectWallet: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  /** The Mesh/WalletAPI instance (initialized on demand or if standard) */
  walletAPI: MidnightWalletAPI | null;
  /** The DApp/ConnectedAPI instance */
  connectedApi: MidnightConnectedAPI | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export { WalletContext };

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: WalletState = {
  isConnected: false,
  isConnecting: false,
  address: null,
  provider: null,
  error: null,
  coinPublicKey: null,
  encryptionPublicKey: null,
  balances: null,
  addresses: null,
  serviceConfig: null,
  walletName: null,
  walletIcon: null,
  apiVersion: null,
  networkId: null,
};

// ─── Provider Component ─────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState);
  const [walletAPI, setWalletAPI] = useState<MidnightWalletAPI | null>(null);
  const [connectedApi, setConnectedApi] = useState<MidnightConnectedAPI | null>(null);
  const isAutoConnecting = useRef(false);

  // ── Fetch balances and addresses (DApp Connector pattern) ──────────────
  const fetchWalletData = useCallback(async (api: MidnightConnectedAPI) => {
    try {
      const [
        shieldedBalancesRaw,
        unshieldedBalancesRaw,
        dustBalanceRaw,
        shieldedAddresses,
        unshieldedAddressResult,
        dustAddressResult,
        config,
      ] = await Promise.all([
        api.getShieldedBalances().catch(() => ({} as Record<string, bigint>)),
        api.getUnshieldedBalances().catch(() => ({} as Record<string, bigint>)),
        api.getDustBalance().catch(() => ({ balance: BigInt(0), cap: BigInt(0) })),
        api.getShieldedAddresses().catch(() => ({ 
          shieldedAddress: "", 
          shieldedCoinPublicKey: "", 
          shieldedEncryptionPublicKey: "" 
        })),
        api.getUnshieldedAddress().catch(() => ({ unshieldedAddress: "" })),
        api.getDustAddress().catch(() => ({ dustAddress: "" })),
        api.getConfiguration().catch(() => null),
      ]);

      const balances: MidnightBalances = {
        shielded: Object.fromEntries(
          Object.entries(shieldedBalancesRaw).map(([k, v]) => [k, String(v)])
        ),
        unshielded: Object.fromEntries(
          Object.entries(unshieldedBalancesRaw).map(([k, v]) => [k, String(v)])
        ),
        dust: {
          balance: String(dustBalanceRaw.balance),
          cap: String(dustBalanceRaw.cap),
        },
      };

      const addresses: MidnightAddresses = {
        unshielded: unshieldedAddressResult.unshieldedAddress || null,
        shielded: shieldedAddresses?.shieldedAddress || null,
        dust: dustAddressResult.dustAddress || null,
      };

      setState((prev) => ({
        ...prev,
        balances,
        addresses,
        address: unshieldedAddressResult.unshieldedAddress || shieldedAddresses.shieldedAddress || prev.address,
        coinPublicKey: shieldedAddresses.shieldedCoinPublicKey || prev.coinPublicKey,
        encryptionPublicKey: shieldedAddresses.shieldedEncryptionPublicKey || prev.encryptionPublicKey,
        networkId: config?.networkId || prev.networkId || DEFAULT_NETWORK_ID,
      }));
    } catch (err) {
      console.warn("WalletProvider: Failed to fetch balance data:", err);
    }
  }, []);

  // ── Connect wallet (Main Flow) ───────────────────────────────────────────
  const connectWallet = useCallback(async (): Promise<WalletConnectionResult> => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const walletSource = getPrimaryWalletProvider();
      if (!walletSource) throw new Error("Lace Wallet not detected.");

      console.log("WalletProvider: Initializing connection...");

      // NOTE: We primarily use the DApp Connector Flow (connect). 
      // The Mesh (enable) flow is often responsible for the onboarding redirect in Lace 
      // if called before a standard connection is established.
      
      let walletAddress = "";
      let coinPubKey = "";
      let encPubKey = "";

      // 1. DApp Connector Connection (The Modern Way)
      // This provides addresses and balances reliably without onboarding redirects.
      const connected = await walletSource.connect(DEFAULT_NETWORK_ID);
      setConnectedApi(connected);
      
      const [shielded, unshielded] = await Promise.all([
        connected.getShieldedAddresses(),
        connected.getUnshieldedAddress()
      ]);
      
      walletAddress = unshielded.unshieldedAddress || shielded.shieldedAddress;
      coinPubKey = shielded.shieldedCoinPublicKey;
      encPubKey = shielded.shieldedEncryptionPublicKey;
      
      await fetchWalletData(connected);

      // 2. Initialize Mesh API (WalletAPI) SILENTLY if supported
      // We only do this after connect() to avoid conflicting popups/onboarding issues.
      if (typeof (walletSource as any).enable === 'function') {
        try {
          // Attempting a silent enable now that connect() has authorized the domain
          const api = await walletSource.enable();
          setWalletAPI(api);
          console.log("WalletProvider: Mesh API initialized successfully");
        } catch (e) {
          console.warn("WalletProvider: Mesh integration skipped (silent enable failed)", e);
        }
      }

      // Update services
      let serviceConfig: MidnightServiceConfig | null = null;
      try {
        if (walletSource.serviceUriConfig) {
          const uris = await walletSource.serviceUriConfig();
          serviceConfig = {
            indexerUri: uris.indexerUri,
            indexerWsUri: uris.indexerWsUri,
            proverServerUri: uris.proverServerUri,
          };
        }
      } catch (e) {
        console.warn("WalletProvider: serviceUriConfig not available");
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        address: walletAddress,
        coinPublicKey: coinPubKey,
        encryptionPublicKey: encPubKey,
        serviceConfig,
        provider: "lace",
        walletName: walletSource.name || "Lace Wallet",
        walletIcon: walletSource.icon || "",
        apiVersion: walletSource.apiVersion || "",
        networkId: DEFAULT_NETWORK_ID,
        error: null,
      }));

      sessionStorage.setItem("midnight_wallet_connected", "true");
      return { success: true, address: walletAddress, provider: "lace" };

    } catch (err) {
      const errorMessage = handleMidnightError(err);
      console.error("WalletProvider: Connection error:", err);
      setState((prev) => ({ ...prev, isConnecting: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [fetchWalletData]);

  // ── Disconnect wallet ──────────────────────────────────────────────────
  const disconnectWallet = useCallback(async () => {
    try {
      const walletSource = getPrimaryWalletProvider();
      if (walletSource?.disconnect) {
        await walletSource.disconnect();
      }
    } catch (err) {
      console.warn("WalletProvider: Disconnect call failed", err);
    }
    
    setWalletAPI(null);
    setConnectedApi(null);
    setState(initialState);
    sessionStorage.removeItem("midnight_wallet_connected");
  }, []);

  // ── Refresh balances ───────────────────────────────────────────────────
  const refreshBalances = useCallback(async () => {
    if (connectedApi) {
      await fetchWalletData(connectedApi);
    }
  }, [connectedApi, fetchWalletData]);

  // ── Auto-reconnect ────────────────────────────────────────────────────
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("midnight_wallet_connected") === "true" &&
      !state.isConnected &&
      !isAutoConnecting.current
    ) {
      isAutoConnecting.current = true;
      connectWallet()
        .catch(() => {
          sessionStorage.removeItem("midnight_wallet_connected");
        })
        .finally(() => {
          isAutoConnecting.current = false;
        });
    }
  }, [connectWallet, state.isConnected]);

  // ── Context value ──────────────────────────────────────────────────────
  const contextValue: WalletContextType = {
    state,
    availableWallets: walletConfigs,
    connectWallet,
    disconnectWallet,
    refreshBalances,
    walletAPI,
    connectedApi,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export function useWalletState() {
  const { state } = useWallet();
  return state;
}

export function useWalletConnection() {
  const { connectWallet, disconnectWallet, state } = useWallet();
  return {
    connectWallet,
    disconnectWallet,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
  };
}