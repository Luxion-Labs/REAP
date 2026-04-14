/**
 * REAP Contracts — Barrel Export
 *
 * Single import point for all contract adapters.
 * Usage:
 *   import { PropertyRegistryAdapter, FractionalTokenAdapter } from '@/lib/contracts';
 */

export { REAPUnifiedAdapter } from './unified';
export { PropertyRegistryAdapter } from './property';
export { FractionalTokenAdapter } from './tokens';
export { MarketplaceAdapter } from './marketplace';
export { EscrowAdapter } from './escrow';
export { VerificationAdapter } from './verification';
export { MainContractAdapter } from './main';
export { AuditLogAdapter } from './audit';
export { RoleAdapter } from './role';
export { AccessControlAdapter } from './access';
