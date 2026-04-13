import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { nativeToken } from "@midnight-ntwrk/ledger";
import { NetworkId as ZSwapNetworkId } from "@midnight-ntwrk/zswap";
import * as Rx from "rxjs";
import { WebSocket } from "ws";
import * as fs from "fs";

// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

async function main() {
  try {
    setNetworkId("undeployed");

    const walletSeed = "e84fb98065f8c3140a7114ecdef3904b4c33e709b73ad17321e2bdd99e4c4009";

    console.log("Building wallet...");
    const wallet = await WalletBuilder.build(
      "http://127.0.0.1:20000",
      "ws://127.0.0.1:20000",
      "http://127.0.0.1:6300",
      "ws://127.0.0.1:9944",
      walletSeed,
      ZSwapNetworkId.Undeployed,
      "debug"
    );

    wallet.start();

    console.log("\n📋 Wallet Object Keys:");
    console.log(Object.keys(wallet));

    const initialState = await Rx.firstValueFrom(
      wallet.state().pipe(Rx.timeout(5000))
    );

    console.log("\n📋 Wallet State:");
    console.log(JSON.stringify(initialState, (key, val) => {
      if (typeof val === "bigint") return val.toString();
      if (val instanceof Uint8Array) return `Uint8Array(${val.length})`;
      return val;
    }, 2));

    // Try to access methods
    console.log("\n🔍 Wallet Methods:");
    console.log(`- typeof wallet.getCoinPublicKey: ${typeof (wallet as any).getCoinPublicKey}`);
    console.log(`- typeof wallet.getEncryptionPublicKey: ${typeof (wallet as any).getEncryptionPublicKey}`);
    console.log(`- typeof wallet.balanceTransaction: ${typeof (wallet as any).balanceTransaction}`);
    console.log(`- typeof wallet.submitTransaction: ${typeof (wallet as any).submitTransaction}`);

    // Try calling the methods
    if (typeof (wallet as any).getCoinPublicKey === "function") {
      try {
        const coinPubKey = (wallet as any).getCoinPublicKey();
        console.log(`\n✓ getCoinPublicKey() returned:`, coinPubKey ? `Uint8Array(${coinPubKey.length})` : null);
      } catch (e) {
        console.log(`\n✗ getCoinPublicKey() error:`, (e as Error).message);
      }
    }

    if (typeof (wallet as any).getEncryptionPublicKey === "function") {
      try {
        const encPubKey = (wallet as any).getEncryptionPublicKey();
        console.log(`✓ getEncryptionPublicKey() returned:`, encPubKey ? `Uint8Array(${encPubKey.length})` : null);
      } catch (e) {
        console.log(`✗ getEncryptionPublicKey() error:`, (e as Error).message);
      }
    }

    // Check state properties
    if ((initialState as any).getCoinPublicKey) {
      console.log(`\n✓ initialState.getCoinPublicKey exists (${typeof (initialState as any).getCoinPublicKey})`);
    }
    if ((initialState as any).coinPublicKey) {
      console.log(`✓ initialState.coinPublicKey exists:`, (initialState as any).coinPublicKey ? `Uint8Array(${(initialState as any).coinPublicKey.length})` : null);
    }

    console.log("\n✅ Debug complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
