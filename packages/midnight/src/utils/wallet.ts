// Wallet utilities for Midnight blockchain

import { WalletBuilder } from "@midnight-ntwrk/wallet";
// Wallet type from @midnight-ntwrk/wallet-api (v5 API)
import { nativeToken } from "@midnight-ntwrk/ledger";
import { getNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import * as Rx from "rxjs";
import { TESTNET_CONFIG } from "../config/network.js";

export async function buildWallet(seed: string): Promise<any> {
  const wallet = await WalletBuilder.buildFromSeed(
    TESTNET_CONFIG.indexer,
    TESTNET_CONFIG.indexerWS,
    TESTNET_CONFIG.proofServer,
    TESTNET_CONFIG.node,
    seed,
    getNetworkId() as any,
    "info"
  );

  return wallet;
}

export function generateWalletSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function waitForFunds(wallet: any): Promise<bigint> {
  return Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state: any) => {
        if (state.syncProgress) {
          console.log(
            `Sync progress: synced=${state.syncProgress.synced}, sourceGap=${state.syncProgress.lag.sourceGap}, applyGap=${state.syncProgress.lag.applyGap}`
          );
        }
      }),
      Rx.filter((state: any) => state.syncProgress?.synced === true),
      Rx.map((s: any) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance: any) => balance > 0n),
      Rx.tap((balance) => console.log(`Wallet funded with balance: ${balance}`))
    )
  );
}

export async function getWalletBalance(wallet: any): Promise<bigint> {
  const state = await Rx.firstValueFrom(wallet.state()) as any;
  return state.balances[nativeToken()] ?? 0n;
}

export async function getWalletAddress(wallet: any): Promise<string> {
  const state = await Rx.firstValueFrom(wallet.state()) as any;
  return state.address;
}
