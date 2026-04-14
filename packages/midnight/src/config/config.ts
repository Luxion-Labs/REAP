import path from 'node:path';
import { setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');

export const contractConfig = {
  privateStateStoreName: 'reap-private-state',
  zkConfigPath: path.resolve(currentDir, '..', '..', 'build', 'REAP'),
};

export interface Config {
  readonly networkId: NetworkId;
  readonly logDir: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;
  readonly zkConfigPath: string;
}

export class StandaloneConfig implements Config {
  networkId: NetworkId = 'undeployed';
  logDir: string;
  indexer = 'http://127.0.0.1:8088/api/v3/graphql';
  indexerWS = 'ws://127.0.0.1:8088/api/v3/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6300';
  zkConfigPath = contractConfig.zkConfigPath;
  constructor() {
    this.logDir = path.resolve(currentDir, '..', 'logs', 'standalone', `${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
    setNetworkId(this.networkId);
  }
}

export class PreviewConfig implements Config {
  networkId: NetworkId = 'preview';
  logDir: string;
  indexer = 'https://indexer.preview.midnight.network/api/v4/graphql';
  indexerWS = 'wss://indexer.preview.midnight.network/api/v4/graphql/ws';
  node = 'https://rpc.preview.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  zkConfigPath = contractConfig.zkConfigPath;
  constructor() {
    this.logDir = path.resolve(currentDir, '..', 'logs', 'preview', `${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
    setNetworkId(this.networkId);
  }
}

export class PreprodConfig implements Config {
  networkId: NetworkId = 'preprod';
  logDir: string;
  indexer = 'https://indexer.preprod.midnight.network/api/v4/graphql';
  indexerWS = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
  node = 'https://rpc.preprod.midnight.network';
  proofServer = 'https://proof-server.preprod.midnight.network';
  zkConfigPath = contractConfig.zkConfigPath;
  constructor() {
    this.logDir = path.resolve(currentDir, '..', 'logs', 'preprod', `${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
    setNetworkId(this.networkId);
  }
}

export function getAppConfig(networkId: string = 'undeployed'): Config {
  switch (networkId) {
    case 'preview': return new PreviewConfig();
    case 'preprod': return new PreprodConfig();
    case 'undeployed':
    default: return new StandaloneConfig();
  }
}

export const CONTRACT_NAMES = [
  "main",
  "propertyRegistry",
  "marketplace",
  "escrow",
  "verification",
  "role",
  "accessControl",
  "auditLog",
  "fractionalToken",
] as const;

export type ContractName = (typeof CONTRACT_NAMES)[number];

export const CONTRACT_PATHS: Record<ContractName, string> = {
  main: "build/REAP",
  propertyRegistry: "build/REAP",
  marketplace: "build/REAP",
  escrow: "build/REAP",
  verification: "build/REAP",
  role: "build/REAP",
  accessControl: "build/REAP",
  auditLog: "build/REAP",
  fractionalToken: "build/REAP",
};
