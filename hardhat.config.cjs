require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY && process.env.DEPLOYER_PRIVATE_KEY.length === 66
    ? process.env.DEPLOYER_PRIVATE_KEY
    : '0x0000000000000000000000000000000000000000000000000000000000000001';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    bscTestnet: {
      url: process.env.VITE_BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    bscMainnet: {
      url: process.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
      chainId: 56,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCAN_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
