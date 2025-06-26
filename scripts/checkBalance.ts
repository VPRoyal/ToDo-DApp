import { ethers } from "hardhat";

async function main() {
  const [account] = await ethers.getSigners(); // Default signer (your deployer)
  const balance = await ethers.provider.getBalance(account.address);

  console.log(`Address: ${account.address}`);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exitCode = 1;
});
