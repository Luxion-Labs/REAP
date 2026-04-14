import { 
  initializeMidnight, 
  getContractProviders, 
  waitForSync,
  generateWalletSeed 
} from './utils/midnight.js';
import { StandaloneConfig, contractConfig } from './config/config.js';
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
 */

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n🌐 Available Networks:');
    console.log('  1) undeployed - Local Docker testing (DEFAULT) ⭐');
    console.log('  2) preview    - Early development');
    console.log('  3) preprod    - Pre-production staging\n');

    const choice = await rl.question('Select network [1-undeployed]: ');
    const config = new StandaloneConfig(); // Default for now
    
    logger.info(`Deploying to: ${choice || 'undeployed'}`);

    // --- Wallet Setup ---
    let seedAnswer = await rl.question('💼 Use existing seed? (y/n) [default: n]: ');
    let seed: string;
    if (seedAnswer.toLowerCase() === 'y') {
      seed = await rl.question('Enter seed: ');
    } else {
      const newSeed = generateWalletSeed();
      console.log(`\n🆕 SAVE THIS SEED: ${newSeed}\n`);
      seed = newSeed;
    }

    logger.info('Building wallet...');
    const { wallet, providers: bridgeProviders } = await initializeMidnight(config, seed);
    
    logger.info('Waiting for wallet sync...');
    await waitForSync(wallet, config);
    logger.info('Wallet synced! Ready to deploy.');

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
      network: choice || 'undeployed',
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
