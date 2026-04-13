import { WalletBuilder } from "@midnight-ntwrk/wallet";
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { nativeToken } from "@midnight-ntwrk/ledger";
import { sampleSigningKey } from "@midnight-ntwrk/compact-runtime";
import { CompiledContract } from "@midnight-ntwrk/compact-js";
import { NetworkId as ZSwapNetworkId } from "@midnight-ntwrk/zswap";
import * as bip39 from "bip39";
import { WebSocket } from "ws";
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import * as readline from "readline/promises";
import * as Rx from "rxjs";
import { LocalZkConfigProvider } from "./utils/providers.js";
import { getNetworkConfig, type NetworkId } from "./config/network.js";

// Fix WebSocket for Node.js environment
// @ts-ignore
globalThis.WebSocket = WebSocket;

// Map our string NetworkId to ZSwap NetworkId enum
function toZSwapNetworkId(networkId: NetworkId): ZSwapNetworkId {
  switch (networkId) {
    case "testnet-02":
      return ZSwapNetworkId.TestNet;
    case "preview":
      return ZSwapNetworkId.DevNet;
    case "preprod":
      return ZSwapNetworkId.DevNet;
    case "mainnet":
      return ZSwapNetworkId.MainNet;
    case "undeployed":
      return ZSwapNetworkId.Undeployed;
    default:
      throw new Error(`Unknown network: ${networkId}`);
  }
}

const waitForFunds = (wallet: any) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state: any) => {
        if (state.syncProgress) {
          console.log(
            `⏳ Sync progress: synced=${state.syncProgress.synced}, sourceGap=${state.syncProgress.lag.sourceGap}, applyGap=${state.syncProgress.lag.applyGap}`
          );
        }
      }),
      Rx.filter((state: any) => state.syncProgress?.synced === true),
      Rx.map((s: any) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance: any) => balance > 0n),
      Rx.tap((balance) => console.log(`✅ Wallet funded with balance: ${balance}`))
    )
  );

// Wait for wallet to fully sync with timeout and retry
async function waitForWalletSync(wallet: any, timeoutMs: number = 120000): Promise<any> {
  return new Promise((resolve, reject) => {
    let lastHeartbeat = Date.now();
    
    const timeout = setTimeout(() => {
      reject(new Error(`Wallet sync timeout after ${timeoutMs / 1000}s. Network may be unreachable or indexer not ready.`));
    }, timeoutMs);

    let subscription: any = null;
    
    try {
      subscription = wallet
        .state()
        .pipe(
          Rx.tap((state: any) => {
            lastHeartbeat = Date.now();
            if (state.syncProgress) {
              console.log(
                `  Sync: ${state.syncProgress.synced ? '✓ synced' : '⏳ syncing'} | lag: ${state.syncProgress.lag?.sourceGap ?? 0} blocks`
              );
            }
          }),
          Rx.filter((state: any) => state.syncProgress?.synced === true),
          Rx.first()
        )
        .subscribe({
          next: (state: any) => {
            clearTimeout(timeout);
            if (subscription) subscription.unsubscribe();
            console.log(`✅ Wallet fully synced!`);
            resolve(state);
          },
          error: (error: any) => {
            clearTimeout(timeout);
            if (subscription) subscription.unsubscribe();
            reject(error);
          },
        });
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// Register wallet for DUST token generation
async function registerForDustGeneration(wallet: any): Promise<void> {
  try {
    console.log(`\n⏳ Checking DUST token status...`);
    
    const state = await Rx.firstValueFrom(wallet.state()) as any;
    
    // Get DUST balance
    const dustBalance = state.balances[nativeToken()] ?? 0n;
    
    if (dustBalance > 0n) {
      console.log(`✅ DUST tokens available: ${dustBalance}`);
      return;
    }

    console.log(`💰 Registering for DUST token generation...`);
    
    // This is a simplified approach - actual DUST generation depends on the network state
    // The wallet should automatically generate DUST if it has native tokens
    console.log(`⏳ DUST tokens will be generated automatically...`);
    console.log(`   (This typically takes 30 seconds to a few minutes)`);
    
    // Wait for DUST balance to become available
    const dustReady = await Rx.firstValueFrom(
      wallet.state().pipe(
        Rx.throttleTime(5000),
        Rx.filter((s: any) => s.balances[nativeToken()] !== undefined && s.balances[nativeToken()] > 0n),
        Rx.tap(() => console.log(`✅ DUST tokens generated!`)),
        Rx.timeout(120000) // 2 minute timeout
      )
    ) as any;

    console.log(`✅ Ready to deploy contracts`);
  } catch (error: any) {
    console.warn(`⚠️  DUST registration incomplete. Deployment may fail.`);
    console.warn(`   Error: ${error.message}`);
    throw error;
  }
}

// Faucet API client for requesting tokens
async function requestFaucetTokens(
  faucetUrl: string,
  walletAddress: string
): Promise<void> {
  try {
    console.log(`\n💰 Attempting to request tokens from faucet...`);
    console.log(`   Faucet: ${faucetUrl}`);
    console.log(`   Address: ${walletAddress}`);

    // Try the public faucet web UI endpoint
    const baseUrl = new URL(faucetUrl).origin;
    
    // Try health check first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const healthResponse = await fetch(`${baseUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!healthResponse.ok) {
        console.log(`⚠️  Faucet health check failed. Please visit faucet manually.`);
        return;
      }
    } catch {
      console.log(`⚠️  Cannot reach faucet API. Please visit the faucet manually.`);
      return;
    }

    // The public faucet may require visiting the web UI instead of API calls
    console.log(`\n📋 Token request requires manual claim via web UI:`);
    console.log(`   1. Visit: ${faucetUrl}`);
    console.log(`   2. Paste your wallet address`);
    console.log(`   3. Complete CAPTCHA if required`);
    console.log(`   4. Submit request`);
    console.log(`   ⏱️  Tokens typically arrive within 2-3 minutes`);
  } catch (error) {
    console.error(`⚠️  Could not auto-request faucet tokens.`);
  }
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Ask user which network to deploy to
    console.log("\n🌐 Available Networks:");
    console.log("  1) undeployed - Local Docker testing (DEFAULT - safe for dev) ⭐");
    console.log("  2) preview    - Early development (stable)");
    console.log("  3) preprod    - Pre-production staging (production-like)");
    console.log("  4) testnet    - Legacy testnet (deprecated)");

    let networkId: NetworkId = "undeployed"; // default to local (safer)
    const networkInput = (await rl.question(
      "\nSelect network [1-undeployed (default)]: "
    )).trim();

    // Validate network input
    if (networkInput && !["1", "2", "3", "4"].includes(networkInput)) {
      console.error("❌ Invalid network selection. Please enter 1, 2, 3, or 4");
      process.exit(1);
    }

    if (networkInput === "2") networkId = "preview" as NetworkId;
    else if (networkInput === "3") networkId = "preprod" as NetworkId;
    else if (networkInput === "4") networkId = "testnet-02" as NetworkId;

    const config = getNetworkConfig(networkId);
    console.log(`\n✓ Deploying to: ${networkId}`);
    console.log(`  RPC: ${config.node}`);
    console.log(`  Proof Server: ${config.proofServer}`);
    if (config.faucet) {
      console.log(`  Faucet: ${config.faucet}`);
    }

    // Ask user if they have an existing wallet seed
    let choiceInput = (await rl.question(
      "\n💼 Do you have an existing Lace wallet seed? (y/n) [default: n]: "
    )).toLowerCase().trim();
    
    // Validate input - only accept y, n, or empty
    while (choiceInput && choiceInput !== "y" && choiceInput !== "n" && choiceInput !== "yes" && choiceInput !== "no") {
      console.log("❌ Invalid input. Please enter 'y' or 'n'");
      choiceInput = (await rl.question("Do you have an existing Lace wallet seed? (y/n) [default: n]: ")).toLowerCase().trim();
    }
    const choice = choiceInput;

    let walletSeed: string;
    let useExistingAddress = false;
    let existingShieldedAddress = "";

    if (choice === "y" || choice === "yes") {
      // Always ask for the seed (needed for WalletBuilder regardless of address)
      console.log("\n📝 Enter your Lace wallet seed:");
      console.log("   Format: 24 words (e.g., 'word1 word2 word3...') OR");
      console.log("   Format: 64-char hex seed\n");
      
      const seedInput = await rl.question("Enter seed: ");
      
      // Check if it's 24 words (mnemonic) or hex seed
      const words = seedInput.trim().split(/\s+/);
      if (words.length === 24) {
        // Convert 24-word mnemonic to hex seed using bip39
        try {
          const isValid = bip39.validateMnemonic(seedInput.trim());
          if (!isValid) {
            console.error("❌ Invalid BIP39 mnemonic. Please check your seed words.");
            process.exit(1);
          }
          const seedBuffer = await bip39.mnemonicToSeed(seedInput.trim());
          walletSeed = seedBuffer.slice(0, 32).toString("hex");
          console.log("✓ Converted 24-word mnemonic to hex seed");
        } catch (error) {
          console.error("❌ Failed to convert mnemonic:", error);
          process.exit(1);
        }
      } else if (seedInput.length === 64 && /^[0-9a-fA-F]{64}$/.test(seedInput)) {
        // Already hex format
        walletSeed = seedInput;
        console.log("✓ Using 64-character hex seed");
      } else {
        console.error("❌ Invalid seed format. Expected 24 words or 64 hex characters.");
        process.exit(1);
      }
    } else {
      // Generate new wallet seed (default)
      console.log("\n🆕 Generating new wallet...");
      const bytes = new Uint8Array(32);
      // @ts-ignore
      crypto.getRandomValues(bytes);
      walletSeed = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0")
      ).join("");
      console.log(`\n⚠️  SAVE THIS NEW SEED: ${walletSeed}`);
      console.log("   (You'll need funds from faucet for this new wallet)\n");
    }

    // Build wallet from seed (using official WalletBuilder.build() API)
    console.log("\nBuilding wallet...");
    const wallet = await WalletBuilder.build(
      config.indexer,
      config.indexerWS,
      config.proofServer,
      config.node,
      walletSeed,
      toZSwapNetworkId(networkId),
      "info"
    );

    wallet.start();
    
    // Skip sync for local network (undeployed) - wallet may not fully sync in Docker
    let syncedState: any;
    if (networkId === "undeployed") {
      console.log("\n⏳ Checking wallet status on local network...");
      // Just get initial state without waiting for full sync
      try {
        syncedState = await Rx.firstValueFrom(
          wallet.state().pipe(Rx.timeout(10000))
        );
        console.log("✅ Wallet connected to local network");
      } catch (error) {
        console.log("⚠️  Could not get wallet state. Using default initialization.");
        syncedState = {
          address: "test-wallet",
          balances: {},
          syncProgress: { synced: true }
        };
      }
    } else {
      // Wait for wallet to fully sync on remote networks
      console.log("\n⏳ Initializing wallet connections...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log("⏳ Syncing wallet with blockchain...");
      syncedState = await waitForWalletSync(wallet);
    }

    // Use existing address if provided, otherwise use derived address
    const walletAddress = useExistingAddress ? existingShieldedAddress : syncedState.address;

    console.log(`\n✅ Your wallet address is:\n   ${walletAddress}`);

    let balance = syncedState.balances[nativeToken()] || 0n;

    if (balance === 0n) {
      console.log(`\n💳 Your wallet balance is: 0`);
      
      // For undeployed local network, skip fund waiting
      if (networkId === "undeployed") {
        console.log(`\n⚠️  Local network (undeployed) - using test wallet without requiring funds`);
        console.log(`    (Contracts can be deployed on local test networks without funds)\n`);
      } else {
        // For remote networks, show faucet instructions
        if (config.faucet) {
          await requestFaucetTokens(config.faucet, walletAddress);

          // Wait for funds to arrive
          console.log(`\n⏳ Waiting for tokens to arrive on-chain...`);
          balance = await waitForFunds(wallet);
        }
      }
    }

    if (balance > 0n) {
      console.log(`\n💰 Final wallet balance: ${balance}`);
    }

    // Register for DUST token generation (required for deployments on remote networks)
    if (networkId !== "undeployed") {
      try {
        await registerForDustGeneration(wallet);
      } catch (error) {
        console.error(`\n❌ Failed to register for DUST tokens:`, error);
        console.log(`\n💡 Tip: Try deploying again with 'npm run deploy'`);
        process.exit(1);
      }
    }


    // Load compiled contract files
    console.log("\nLoading contracts...");
    const contractPath = path.join(process.cwd(), "build");

    const contractConfigs = [
      {
        name: "main",
        path: "main/contract/index.js",
        stateId: "reapMainState",
      },
      {
        name: "property_registry",
        path: "property_registry/contract/index.js",
        stateId: "propertyRegistryState",
      },
      {
        name: "fractional_token",
        path: "fractional_token/contract/index.js",
        stateId: "fractionalTokenState",
      },
      {
        name: "marketplace",
        path: "marketplace/contract/index.js",
        stateId: "marketplaceState",
      },
      {
        name: "verification",
        path: "verification/contract/index.js",
        stateId: "verificationState",
      },
      { name: "role", path: "role/contract/index.js", stateId: "roleState" },
    ];

    // Validate all contract files exist before deployment
    for (const contractConfig of contractConfigs) {
      const contractModulePath = path.join(contractPath, contractConfig.path);
      if (!fs.existsSync(contractModulePath)) {
        console.error(
          `Contract ${contractConfig.name} not found at ${contractModulePath}! Run: npm run compile`
        );
        process.exit(1);
      }
    }

    console.log("All contract files validated. Starting deployment...");

    // Set network ID before deployment (required by midnight-js-network-id)
    setNetworkId(networkId);
    process.env.MIDNIGHT_NETWORK = networkId;

    // Create wallet provider for transactions (v4 API)
    const walletState = await Rx.firstValueFrom(wallet.state()) as any;

    // Try to get public keys from wallet methods or state
    let coinPublicKey: any = undefined;
    let encryptionPublicKey: any = undefined;
    
    // Try wallet object methods first
    if (typeof (wallet as any).getCoinPublicKey === 'function') {
      try {
        coinPublicKey = (wallet as any).getCoinPublicKey();
      } catch (e) {
        // fallback below
      }
    }
    if (typeof (wallet as any).getEncryptionPublicKey === 'function') {
      try {
        encryptionPublicKey = (wallet as any).getEncryptionPublicKey();
      } catch (e) {
        // fallback below
      }
    }
    
    // If not found on wallet, try state object
    if (!coinPublicKey) {
      coinPublicKey = (walletState as any).coinPublicKey || (walletState as any).coinKey;
    }
    if (!encryptionPublicKey) {
      encryptionPublicKey = (walletState as any).encryptionPublicKey || (walletState as any).encKey;
    }

    console.log(`\n🔐 Wallet Keys:`);
    console.log(`  - coinPublicKey: ${coinPublicKey ? 'present' : 'MISSING'}`);
    console.log(`  - encryptionPublicKey: ${encryptionPublicKey ? 'present' : 'MISSING'}`);

    const walletProvider = {
      getCoinPublicKey: () => coinPublicKey,
      getEncryptionPublicKey: () => encryptionPublicKey,
      async balanceTx(tx: any, newCoins: any) {
        return wallet.balanceTransaction(tx, newCoins);
      },
      async submitTx(tx: any) {
        return wallet.submitTransaction(tx);
      },
    };

    // Deploy all contracts
    console.log(
      "\nStarting contract deployment (30-60 seconds per contract)..."
    );

    const deployedAddresses: Record<string, string> = {};

    for (const contractConfig of contractConfigs) {
      const contractModulePath = path.join(contractPath, contractConfig.path);
      const zkConfigPath = path.join(contractPath, contractConfig.name);

      console.log(`\nDeploying ${contractConfig.name}...`);

      // Load contract module (use pathToFileURL for Windows compatibility)
      const fileUrl = pathToFileURL(contractModulePath).href;
      const ContractModule = await import(fileUrl);

      // Wrap contract module using CompiledContract.make (v4 SDK requirement)
      const contractWitnesses: any = {};
      const compiledContract = CompiledContract.make<any, any>(
        contractConfig.name,
        ContractModule.Contract
      ).pipe(
        CompiledContract.withWitnesses(contractWitnesses)
      );

      const signingKey = sampleSigningKey();

      // Configure providers for this contract
      const providers = {
        privateStateProvider: levelPrivateStateProvider({
          privateStateStoreName: `${contractConfig.name}-state`,
          accountId: "default",
          privateStoragePasswordProvider: async () => "default-password",
        }),
        publicDataProvider: indexerPublicDataProvider(
          config.indexer,
          config.indexerWS
        ),
        zkConfigProvider: new LocalZkConfigProvider(zkConfigPath),
        proofProvider: httpClientProofProvider(
          config.proofServer,
          new LocalZkConfigProvider(zkConfigPath)
        ),
        walletProvider: walletProvider,
        midnightProvider: walletProvider,
      };

      try {
        // v4 API: pass wrapped compiledContract
        let deployed;
        try {
          deployed = await deployContract(providers as any, {
            compiledContract: compiledContract,
            signingKey,
            privateStateId: contractConfig.stateId,
            initialPrivateState: {},
          } as any);
        } catch (innerError: any) {
          console.error(`❌ Error deploying ${contractConfig.name}:`);
          console.error(innerError);
          if (innerError.finalizedTxData) {
             console.error("Finalized Tx Data:", JSON.stringify(innerError.finalizedTxData, null, 2));
          }
          throw innerError;
        }

        const contractAddress =
          deployed.deployTxData.public.contractAddress;
        deployedAddresses[contractConfig.name] = contractAddress;
        console.log(`✓ ${contractConfig.name} deployed at: ${contractAddress}`);
      } catch (error: any) {
        console.error(`\n❌ Error deploying ${contractConfig.name}:`);
        console.error(error.message || error);
        if (error.stack) {
          const stackLines = error.stack.split('\n').slice(0, 5);
          console.error('  Stack:', stackLines.join('\n  '));
        }
        throw error;
      }
    }

    // Save deployment information
    console.log("\n✅ DEPLOYED!");
    console.log("Contracts:");
    Object.entries(deployedAddresses).forEach(([name, address]) => {
      console.log(`  ${name}: ${address}`);
    });

    const info = {
      contracts: deployedAddresses,
      deployedAt: new Date().toISOString(),
      network: networkId,
      deployer: walletState.address,
    };

    fs.writeFileSync("deployment.json", JSON.stringify(info, null, 2));
    console.log("\nSaved to deployment.json");

    // Close wallet connection
    await wallet.close();
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
