import { ethers, upgrades } from "hardhat";

async function main() {
  const NewTodoList = await ethers.getContractFactory("TodoList");

  console.log("Upgrading TodoList proxy...");
  const upgraded = await upgrades.upgradeProxy("<PROXY_ADDRESS>", NewTodoList);
  console.log("✅ Upgrade complete. New address:", upgraded.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});