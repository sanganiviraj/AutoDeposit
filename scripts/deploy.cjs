const { ethers, network } = require("hardhat");

async function main() {
  console.log("==================================================");
  console.log("Starting BSC USDT Multisender Deployment...");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check DEPLOYER_PRIVATE_KEY in .env");
  }

  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log(`Network Name  : ${network.name}`);
  console.log(`Chain ID      : ${network.config.chainId}`);
  console.log(`Deployer Addr : ${deployerAddress}`);
  console.log(`Balance       : ${ethers.formatEther(balance)} BNB`);

  if (balance === 0n) {
    console.warn("⚠️ WARNING: Deployer balance is 0 BNB. Deployment may fail due to lack of gas.");
  }

  const MultisenderFactory = await ethers.getContractFactory("USDTMultisender");
  console.log("\nDeploying USDTMultisender contract...");
  const multisender = await MultisenderFactory.deploy();

  await multisender.waitForDeployment();
  const multisenderAddress = await multisender.getAddress();

  console.log("\n✅ Deployment Successful!");
  console.log(`USDTMultisender Address: ${multisenderAddress}`);
  console.log("\nNext Steps:");
  console.log(`1. Update your .env file with:`);
  console.log(`   VITE_MULTISENDER_ADDRESS=${multisenderAddress}`);
  console.log(`2. Verify your contract on BscScan:`);
  console.log(`   npx hardhat verify --network ${network.name} ${multisenderAddress}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
