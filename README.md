# BSC USDT Multisender

A production-quality, non-custodial Web3 dApp for batch sending BEP-20 USDT (and standard BEP-20/ERC-20 tokens) to multiple BNB Smart Chain (BSC) addresses in a single transaction.

![BSC USDT Multisender](https://bscscan.com/images/svg/brands/bnb.svg)

---

## Key Features

- **Non-Custodial Architecture**: The application never requests, stores, or handles private keys or seed phrases. All transaction signatures take place directly inside the user's wallet.
- **Exact Approval Security Model**: Requests approval for the exact total batch amount instead of unlimited (`MaxUint256`) allowances. Skips approval automatically if allowance is already sufficient.
- **Atomic Batch Execution**: Transfers are processed via `USDTMultisender.sol` using OpenZeppelin `SafeERC20`. If any individual transfer fails, the entire transaction reverts automatically.
- **CSV Support**: Upload CSV files (`address,amount`), download CSV templates, and export recipient lists. Supports up to 100 recipients per batch.
- **Duplicate Address Protection**: Identifies duplicate recipient addresses with row-level error indicators, with an optional user toggle to allow duplicates if intended.
- **Pre-Flight Review Modal**: Full pre-transaction review screen with a mandatory confirmation checkbox and explicit mainnet warning badge.
- **Reown AppKit & Wagmi**: Seamless connection with Trust Wallet, WalletConnect-compatible wallets, and browser extension wallets.
- **Explorer Direct Links**: View approval and batch multisend transaction receipts on BscScan (Mainnet or Testnet).

---

## Technology Stack

- **Smart Contract**: Solidity `0.8.24`, OpenZeppelin Contracts v5, Hardhat, Chai
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, PapaParse
- **Web3 Engine**: Wagmi v2, Viem v2, Reown AppKit v1

---

## Wallet Connection & Secrets Management

Wallet connection is established using **Reown AppKit** and **WalletConnect** infrastructure:
- `VITE_REOWN_PROJECT_ID` is configuration data used by WalletConnect relay servers to establish Web3 sessions. It is **NOT** a wallet private key.
- The deployer private key (`DEPLOYER_PRIVATE_KEY`) is **STRICTLY** reserved for Hardhat deployment scripts (`scripts/deploy.ts`) and is **NEVER** exposed to the frontend bundle (never prefixed with `VITE_`).

---

## Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd bsc-usdt-multisender
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and set your configuration parameters:
```env
VITE_REOWN_PROJECT_ID=your_reown_project_id
VITE_BSC_RPC_URL=https://bsc-dataseed.binance.org
VITE_BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
VITE_USDT_ADDRESS=0x55d398326f99059fF775485246999027B3197955
VITE_TESTNET_USDT_ADDRESS=0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
VITE_MULTISENDER_ADDRESS=

# Deployment only (Do NOT expose to frontend)
DEPLOYER_PRIVATE_KEY=0x...
BSCSCAN_API_KEY=
```

---

## Smart Contract Compilation & Testing

### Compile Smart Contracts
Compiles `USDTMultisender.sol` with solc 0.8.24 and generates TypeScript bindings:
```bash
npm run compile
```

### Run Comprehensive Hardhat Test Suite
Runs unit tests verifying transfers, exact allowance, custom errors, zero address checks, and partial failure atomicity:
```bash
npm test
```

---

## Deployment & Verification Guide

### Recommended Deployment Flow

1. **Deploy to BSC Testnet First**:
   ```bash
   npm run deploy:testnet
   ```
2. **Verify Contract on BscScan Testnet**:
   ```bash
   npx hardhat verify --network bscTestnet <DEPLOYED_CONTRACT_ADDRESS>
   ```
3. **Configure Frontend**:
   Copy the printed contract address into `VITE_MULTISENDER_ADDRESS` in `.env`.
4. **Test with Testnet Funds**:
   Use tBNB faucet and testnet USDT tokens to perform test batch transfers.
5. **Deploy to BSC Mainnet (Optional)**:
   ```bash
   npm run deploy:mainnet
   ```
   Verify on mainnet:
   ```bash
   npx hardhat verify --network bscMainnet <DEPLOYED_CONTRACT_ADDRESS>
   ```

---

## Frontend Development & Build

### Run Local Development Server
Starts Vite dev server on `http://localhost:3000`:
```bash
npm run dev
```

### Build Production Bundle
Typechecks code and outputs production assets to `dist/`:
```bash
npm run build
```

---

## License & Security Disclaimer

This project is licensed under the MIT License. It is an independent non-custodial Web3 dApp. Always verify network, contract addresses, and recipient details before broadcasting transactions on mainnet.
# AutoDeposit
