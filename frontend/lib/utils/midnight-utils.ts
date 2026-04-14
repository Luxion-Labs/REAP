/**
 * Midnight wallet error handling and utility functions.
 */
import type { MidnightInitialAPI } from "@/types/midnight";

// ─── Error Handling ──────────────────────────────────────────────────────────

/**
 * Maps a raw Midnight wallet error into a user-friendly message.
 */
export function handleMidnightError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes('install lace') || message.includes('wallet not found') || message.includes('not detected')) {
    return 'Lace Wallet not detected. Please ensure you have the Lace Beta extension installed and Midnight Network enabled.';
  }
  if (message.includes('access to wallet api denied')) {
    return 'Lace denied access. Please go to Lace settings > Experimental Features and ensure "Midnight Network" is enabled.';
  }
  if (message.includes('user rejected') || message.includes('user denied') || message.includes('declined') || message.includes('cancel')) {
    return 'Authorization rejected. Please approve the connection request in your Lace wallet extension.';
  }
  if (message.includes('insufficient funds')) {
    return 'Insufficient funds in your wallet for this operation.';
  }
  if (message.includes('network')) {
    return 'Network mismatch. Please ensure Lace is set to the Midnight PreProd network.';
  }
  if (message.includes('timeout')) {
    return 'Connection timed out. Please try again.';
  }

  return 'An unexpected wallet error occurred. Please try again.';
}

// ─── Detection ───────────────────────────────────────────────────────────────

/**
 * Checks whether ANY Midnight wallet extension is installed and injected.
 */
export function isWalletInstalled(): boolean {
  if (typeof window === 'undefined' || !window.midnight) return false;
  
  // Return true if any injected object in window.midnight looks like a wallet provider
  return Object.values(window.midnight).some(
    (w: any) => w && typeof w === 'object' && (typeof w.enable === 'function' || typeof w.connect === 'function')
  );
}

/**
 * Returns the best available Midnight provider (prefers mnLace).
 */
export function getPrimaryWalletProvider(): MidnightInitialAPI | null {
  if (typeof window === 'undefined' || !window.midnight) return null;
  
  // 1. Prefer mnLace (standard)
  if (window.midnight.mnLace) return window.midnight.mnLace as unknown as MidnightInitialAPI;
  
  // 2. Fallback to any other provider that has enable/connect
  const otherProviders = Object.values(window.midnight).filter(
    (w: any) => w && typeof w === 'object' && (typeof w.enable === 'function' || typeof w.connect === 'function')
  );
  
  return (otherProviders[0] as unknown as MidnightInitialAPI) || null;
}

/**
 * Returns all injected Midnight wallets.
 */
export function getAvailableWallets(): { id: string; name: string; icon: string; apiVersion: string; rdns: string }[] {
  if (typeof window === 'undefined' || !window.midnight) return [];

  return Object.entries(window.midnight)
    .filter(([, wallet]) => wallet && typeof wallet === 'object' && (typeof (wallet as any).enable === 'function' || typeof (wallet as any).connect === 'function'))
    .map(([id, wallet]) => {
      const w = wallet as any;
      return {
        id,
        name: w.name || id,
        icon: w.icon || '',
        apiVersion: w.apiVersion || 'unknown',
        rdns: w.rdns || '',
      };
    });
}


// ─── Address Formatting ──────────────────────────────────────────────────────

/**
 * Shortens a Midnight address for display.
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  const part1 = address.slice(0, Math.max(0, chars + (address.startsWith('mn_addr') ? 8 : 0)));
  return `${part1}...${address.slice(-chars)}`;
}

/**
 * Determines the address type from a Midnight Bech32m address prefix.
 */
export function getAddressType(address: string): 'unshielded' | 'shielded' | 'dust' | 'unknown' {
  if (address.startsWith('mn_addr')) return 'unshielded';
  if (address.startsWith('mn_shield')) return 'shielded';
  if (address.startsWith('mn_dust')) return 'dust';
  return 'unknown';
}

// ─── Balance Formatting ──────────────────────────────────────────────────────

/**
 * Formats a Midnight token balance for display.
 * Midnight uses 6 decimals for NIGHT.
 */
export function formatTokenBalance(amount: bigint | number | string, decimals: number = 6): string {
  try {
    const raw = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const whole = raw / divisor;
    const fraction = raw % divisor;
    const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');

    if (fractionStr.length === 0) {
      return whole.toString();
    }
    return `${whole}.${fractionStr}`;
  } catch {
    return '0';
  }
}
