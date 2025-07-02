import { ethers, upgrades } from "hardhat";
import { exportAbi } from "./exportABI";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("✅ Deployer:", await deployer.getAddress());

  const deployed: Record<string, string> = {};

  const TaskStorage = await ethers.getContractFactory("TaskStorage");
  const taskStorage = await upgrades.deployProxy(TaskStorage, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await taskStorage.waitForDeployment();
  deployed["TaskStorage"] = await taskStorage.getAddress();
  console.log("✅ TaskStorage:", deployed["TaskStorage"]);

  const CategoryStorage = await ethers.getContractFactory("CategoryStorage");
  const categoryStorage = await upgrades.deployProxy(CategoryStorage, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await categoryStorage.waitForDeployment();
  deployed["CategoryStorage"] = await categoryStorage.getAddress();
  console.log("✅ CategoryStorage:", deployed["CategoryStorage"]);

  const Registry = await ethers.getContractFactory("StorageAccessRegistry");
  const registry = await upgrades.deployProxy(Registry, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await registry.waitForDeployment();
  deployed["Registry"] = await registry.getAddress();
  console.log("✅ Registry:", deployed["Registry"]);

  const TaskLogic = await ethers.getContractFactory("TaskLogic");
  const taskLogic = await upgrades.deployProxy(TaskLogic, [deployed["Registry"]], {
    initializer: "initialize",
    kind: "uups",
  });
  await taskLogic.waitForDeployment();
  deployed["TaskLogic"] = await taskLogic.getAddress();
  console.log("✅ TaskLogic:", deployed["TaskLogic"]);

  const CategoryLogic = await ethers.getContractFactory("CategoryLogic");
  const categoryLogic = await upgrades.deployProxy(CategoryLogic, [deployed["Registry"]], {
    initializer: "initialize",
    kind: "uups",
  });
  await categoryLogic.waitForDeployment();
  deployed["CategoryLogic"] = await categoryLogic.getAddress();
  console.log("✅ CategoryLogic:", deployed["CategoryLogic"]);

  const TodoList = await ethers.getContractFactory("TodoList");
  const todoList = await upgrades.deployProxy(
    TodoList,
    [deployed["TaskLogic"], deployed["CategoryLogic"]],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );
  await todoList.waitForDeployment();
  deployed["TodoList"] = await todoList.getAddress();
  console.log("✅ TodoList:", deployed["TodoList"]);

  // Register module addresses
  await registry.setContract("TASK_STORAGE", deployed["TaskStorage"]);
  await registry.setContract("CATEGORY_STORAGE", deployed["CategoryStorage"]);
  await registry.setContract("TASK_LOGIC", deployed["TaskLogic"]);
  await registry.setContract("CATEGORY_LOGIC", deployed["CategoryLogic"]);

  // Write to deployed.contracts.json
  fs.writeFileSync(
    "./deployed.contracts.json",
    JSON.stringify(deployed, null, 2),
    { encoding: "utf-8" }
  );

  console.log("📄 Deployment addresses saved to deployed.contracts.json");

  exportAbi({
  contractPath: "contracts/core/TodoList.sol",
  contractName: "TodoList",
  outputDir: "client/src/lib",
  outputFileName: "TodoListABI.json",
  constractAddress:deployed["TodoList"]
});
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});



/**
  * This script deploys the Todo DApp smart contracts using Hardhat and OpenZeppelin Upgrades.
  * Deployment command: npx hardhat run scripts/deploy.ts --network <network>
  * 
  * Export ABI command for TodoList Contract: npx hardhat export-abi --contract TodoList --output ./client/src/lib/TodoListABI.json

 */