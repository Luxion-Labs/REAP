import { type MidnightProviders } from '@midnight-ntwrk/midnight-js/types';
import { PropertyRegistryAPI } from '../api/PropertyRegistryAPI.js';
import { MarketplaceAPI } from '../api/MarketplaceAPI.js';
import { EscrowAPI } from '../api/EscrowAPI.js';
import { VerificationAPI } from '../api/VerificationAPI.js';
import { FractionalTokenAPI } from '../api/FractionalTokenAPI.js';
import { RoleAPI } from '../api/RoleAPI.js';
import { AccessControlAPI } from '../api/AccessControlAPI.js';
import { AuditLogAPI } from '../api/AuditLogAPI.js';
import { MainAPI } from '../api/MainAPI.js';
import type { ContractAddresses } from '../types/contracts.js';
import { logger } from '../utils/logger.js';

/**
 * 🧱 REAP Client (Modern SDK v4.0.4)
 * Orchestrates all domain-specific APIs using a single provider set.
 */
export class Client {
  public main: MainAPI;
  public propertyRegistry: PropertyRegistryAPI;
  public marketplace: MarketplaceAPI;
  public escrow: EscrowAPI;
  public verification: VerificationAPI;
  public fractionalToken: FractionalTokenAPI;
  public roles: RoleAPI;
  public accessControl: AccessControlAPI;
  public auditLog: AuditLogAPI;

  constructor(
    private providers: MidnightProviders<any, string, any>,
    private addresses: ContractAddresses
  ) {
    // Initialize all APIs with shared providers and their respective addresses
    // For many of these, we use the same address if they are part of the same base contract
    // or separate addresses if deployed separately.
    this.main = new MainAPI(providers, addresses.main);
    this.propertyRegistry = new PropertyRegistryAPI(providers, addresses.propertyRegistry);
    this.marketplace = new MarketplaceAPI(providers, addresses.marketplace);
    this.escrow = new EscrowAPI(providers, addresses.escrow);
    this.verification = new VerificationAPI(providers, addresses.verification);
    this.fractionalToken = new FractionalTokenAPI(providers, addresses.fractionalToken);
    this.roles = new RoleAPI(providers, addresses.role || addresses.main);
    this.accessControl = new AccessControlAPI(providers, addresses.accessControl || addresses.main);
    this.auditLog = new AuditLogAPI(providers, addresses.auditLog || addresses.main);
  }

  /**
   * Initialize all underlying contract connections
   */
  async init(): Promise<void> {
    logger.info('Initializing all REAP APIs...');
    await Promise.all([
      this.main.init(),
      this.propertyRegistry.init(),
      this.marketplace.init(),
      this.escrow.init(),
      this.verification.init(),
      this.fractionalToken.init(),
      this.roles.init(),
      this.accessControl.init(),
      this.auditLog.init(),
    ]);
    logger.info('All REAP APIs initialized successfully');
  }

  getProviders(): MidnightProviders<any, string, any> {
    return this.providers;
  }

  getAddresses(): ContractAddresses {
    return this.addresses;
  }
}
