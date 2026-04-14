# Changelog

## [4.0.0] - 2026-04-14

### Summarized Architecture Shift
The project has migrated from a procedural, manual provider setup to a standardized, configuration-driven architecture aligned with the `midnightntwrk/example-counter` patterns. 

#### Key Architectural Components:
- **`src/config.ts`**: Centralized configuration management. Supports multiple networks (undeployed, preview, preprod) and handles path resolution for ZK artifacts and logs.
- **`src/utils/midnight.ts`**: The new heart of the wallet integration. It manages the `WalletFacade` lifecycle, handles synchronization using RxJS, and provides the necessary `MidnightProvider` and `WalletProvider` implementations for the SDK.
- **`src/utils/providers.ts`**: contains utilities for creating contract providers that bridge the old REAP API classes with the new SDK patterns.
- **Modular API Layers**: All contract APIs (`AccessControlAPI.ts`, `MainAPI.ts`, etc.) have been refactored to decouple contract logic from provider initialization. They now accept a standardized `MidnightProviders` object, making them compatible with both local and deployed environments.
- **Improved API Connectivity**: Standardized the `init()` pattern across all APIs using `findDeployedContract` from the Midnight SDK, replacing various inconsistent connection methods.
- **Pipeable Contract Assets**: Updated API constructors to use the `v4` pipeable `CompiledContract` pattern for loading ZK assets and witnesses.

### New Features & Improvements
- **V4 SDK Integration**: Fully upgraded to `@midnight-ntwrk/midnight-js` v4.0.4.
- **Improved Logging**: Integrated `pino` for structured, persistent logging. Logs are saved to `logs/deployment-*.log` with full stack traces and debug data.
- **Standardized Synchronization**: Uses RxJS observables to ensure the wallet is 100% synced before any ledger interaction.
- **Bech32m Compliance**: Updated all address and public key handling to use the mandatory Bech32m encoding required by v4.

### Deprecations & Cleanup (Legacy Files)
The following files are now obsolete and can be safely removed or ignored:
- `src/utils/wallet.ts`: Replaced by the improved logic in `midnight.ts`.
- `src/examples/completeFlow.ts`: Legacy example flow that does not follow the new v4 patterns.
- `src/deployment/`: Contains legacy deployment scripts (`deployAll.ts`, `deployAllContracts.ts`, `deployer.ts`) superseded by `src/deploy.ts`.

### Bug Fixes
- Resolved `bech32.decode` error during contract deployment by correctly encoding `coinPublicKey` and `encryptionPublicKey` using `ShieldedCoinPublicKey` and `ShieldedEncryptionPublicKey` codecs.
- Fixed `WalletFacade` initialization issues where synchronization was not being triggered due to missing `wallet.start()` call.
- Ensured `pino` logs are flushed synchronously on failure to prevent data loss during crashes.
