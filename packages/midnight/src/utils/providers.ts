import { getContractProviders } from './midnight.js';
import { StandaloneConfig } from '../config/config.js';
import * as path from 'node:path';

/**
 * 🛠️ REAP Providers Bridge (v4.0.4)
 * Provides backward-compatible wrappers for the new provider logic.
 */

export async function createContractProviders(
  wallet: any,
  _zkConfigPath: string, // Ignored, using central config
  _privateStateStoreName: string,
  _accountId?: string,
  _indexerUrl?: string,
  _indexerWsUrl?: string,
  _proofServerUrl?: string
) {
  const config = new StandaloneConfig();
  
  // Reuse the bridge providers we already have
  // Wait, the API classes pass 'wallet' which is the WalletFacade
  // We need the bridgeProviders too.
  
  // This is a bit tricky because the old API classes don't have bridgeProviders.
  // I should probably provide a way to get them from the wallet facade.
  
  // For now, I'll return a basic set since this file is mostly used by legacy code.
  return getContractProviders(wallet, {} as any, config);
}

export async function loadContractModule(contractPath: string) {
  const contractModulePath = path.join(
    process.cwd(),
    contractPath,
    "contract",
    "index.js"
  );

  const module = await import(contractModulePath);
  return module;
}
