import { ethers, upgrades } from "hardhat";
import deployed from "../deployed.contracts.json";

async function main() {
  const Registry = await ethers.getContractFactory("StorageAccessRegistry");

  console.log("Upgrading TodoList proxy...");
  const registry = await upgrades.upgradeProxy(deployed.Registry, Registry);
  await registry.waitForDeployment();
  deployed["Registry"] = await registry.getAddress();
  console.log("✅ Registry:", deployed["Registry"]);

  // Upgrade TaskLogic

  const TaskLogic = await ethers.getContractFactory("TaskLogic");
  const taskLogic = await upgrades.upgradeProxy(deployed.TaskLogic,TaskLogic);
  await taskLogic.waitForDeployment();
  deployed["TaskLogic"] = await taskLogic.getAddress();
  console.log("✅ TaskLogic:", deployed["TaskLogic"]);
  await taskLogic.setRegistry(deployed["Registry"]);

  // Upgrade CategoryLogic
  const CategoryLogic = await ethers.getContractFactory("CategoryLogic");
  const categoryLogic = await upgrades.upgradeProxy(deployed.CategoryLogic,CategoryLogic);
  await categoryLogic.waitForDeployment();
  deployed["CategoryLogic"] = await categoryLogic.getAddress();
  console.log("✅ CategoryLogic:", deployed["CategoryLogic"]);
  await categoryLogic.setRegistry(deployed["Registry"]);


    // Register module addresses
  await registry.setContract("TASK_STORAGE", deployed["TaskStorage"]);
  await registry.setContract("CATEGORY_STORAGE", deployed["CategoryStorage"]);
  await registry.setContract("TASK_LOGIC", deployed["TaskLogic"]);
  await registry.setContract("CATEGORY_LOGIC", deployed["CategoryLogic"]);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});