import { 
  initializeMidnight, 
  getContractProviders, 
  waitForSync,
  generateWalletSeed 
} from './utils/midnight.js';
import { 
  StandaloneConfig, 
  PreviewConfig, 
  PreprodConfig, 
  contractConfig,
  type Config 
} from './config/config.js';
import { deployContract } from '@midnight-ntwrk/midnight-js/contracts';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { Contract } from '../build/REAP/contract/index.js';
import { logger } from './utils/logger.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/**
 * 🚀 REAP Modern Orchestration Layer (v4.0.4)
 * 
 * FIXED: Network ID is now dynamically selected based on user input
 * to avoid hardcoded 'undeployed' networkId regardless of selection.
 */

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n🌐 Available Networks:');
    console.log('  1) undeployed - Local Docker testing (DEFAULT) ⭐');
    console.log('  2) preview    - Early development');
    console.log('  3) preprod    - Pre-production staging\n');

    const networkChoices = ['1', '2', '3', 'undeployed', 'preview', 'preprod'];
    let choice = await rl.question('Select network [1-undeployed]: ');
    if (!choice.trim()) choice = '1';

    while (!networkChoices.includes(choice.trim().toLowerCase())) {
      console.log(`❌ Invalid choice "${choice}". Please choose 1, 2, or 3.`);
      choice = await rl.question('Select network [1-undeployed]: ');
      if (!choice.trim()) choice = '1';
    }
    
    // FIX #1: Map user choice to appropriate config class
    let config: Config;
    let selectedNetwork: string;
    
    const normalizedChoice = choice.trim().toLowerCase();
    if (normalizedChoice === '2' || normalizedChoice === 'preview') {
      config = new PreviewConfig();
      selectedNetwork = 'preview';
    } else if (normalizedChoice === '3' || normalizedChoice === 'preprod') {
      config = new PreprodConfig();
      selectedNetwork = 'preprod';
    } else {
      config = new StandaloneConfig();
      selectedNetwork = 'undeployed';
    }
    
    logger.info(`Deploying to: ${selectedNetwork} (networkId: ${config.networkId})`);

    // --- Wallet Setup ---
    let seed: string;
    const isHexSeed = (s: string) => /^[0-9a-fA-F]{64}$/.test(s.trim());

    while (true) {
      let seedAnswer = await rl.question('💼 Use existing seed? (y/n/SEED) [default: n]: ');
      const input = seedAnswer.trim();

      if (!input || input.toLowerCase() === 'n') {
        const newSeed = generateWalletSeed();
        console.log(`\n🆕 SAVE THIS SEED: ${newSeed}\n`);
        seed = newSeed;
        break;
      }

      if (isHexSeed(input)) {
        seed = input;
        logger.info('Detected hex seed from input, using it.');
        break;
      }

      if (input.toLowerCase() === 'y') {
        const providedSeed = await rl.question('Enter 64-char hex seed: ');
        if (isHexSeed(providedSeed)) {
          seed = providedSeed.trim();
          break;
        } else {
          console.log('❌ Invalid seed format. Must be 64-character hex.');
          continue;
        }
      }

      console.log('❌ Invalid input. Please enter "y", "n", or a 64-char hex seed.');
    }

    logger.info('Building wallet...');
    const { wallet, providers: bridgeProviders } = await initializeMidnight(config, seed);
    
    // Network-specific guidance
    if (selectedNetwork !== 'undeployed') {
      console.log(`\n⏳ Network: ${selectedNetwork.toUpperCase()}`);
      console.log('   Initial sync is slower on testnet—this can take 5-15+ minutes.');
      console.log('   The wallet is syncing all relevant blocks from chain history.');
      console.log('   ⚠️  If you\'re on Preprod, ensure you have DUST tokens before deploying.\n');
    }
    
    logger.info('Waiting for wallet sync...');
    await waitForSync(wallet, config);
    logger.info('✅ Wallet synced! Ready to deploy.');

    // --- Contract Deployment ---
    logger.info('Preparing REAP contract...');
    
    const compiledContract = CompiledContract.make('REAP', Contract).pipe(
      CompiledContract.withVacantWitnesses,
      CompiledContract.withCompiledFileAssets(contractConfig.zkConfigPath)
    );

    const providers = await getContractProviders(wallet, bridgeProviders, config);
    
    // Initial state for REAP contract
    // Note: Adjust according to REAP constructor requirements
    const initialState = {}; 

    logger.info('Broadcasting deployment transaction...');
    const deployed = await deployContract(providers as any, {
      compiledContract: compiledContract as any,
      privateStateId: 'reap-private-state',
      initialPrivateState: initialState as any,
      args: [],
    });

    logger.info(`🎯 DEPLOYED SUCCESSFULLY!`);
    logger.info(`Address: ${deployed.deployTxData.public.contractAddress}`);

    // --- Save Deployment Info ---
    const deploymentData = {
      network: selectedNetwork,
      address: deployed.deployTxData.public.contractAddress,
      timestamp: new Date().toISOString(),
    };

    const deployDir = path.resolve('deployments');
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir);
    
    fs.writeFileSync(
      path.join(deployDir, `${deploymentData.network}.json`),
      JSON.stringify(deploymentData, null, 2)
    );

    logger.info(`Deployment details saved to deployments/${deploymentData.network}.json`);

  } catch (error: any) {
    logger.error('Deployment failed!');
    if (error.message) logger.error(`Error Message: ${error.message}`);
    if (error.stack) logger.debug(`Error Stack: ${error.stack}`);
    if (error.data) logger.debug(`Error Data: ${JSON.stringify(error.data, null, 2)}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
