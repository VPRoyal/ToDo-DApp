import { ethers } from "hardhat";

import deployed from "../deployed.contracts.json";

async function main() {
    let [owner, user] = await ethers.getSigners();
    // console.log("Owner:", owner.address);
    // console.log("User:", user.address);]
// const TodoList = await ethers.getContractFactory("TodoList");
// const list = TodoList.attach(deployed.TodoList); // deployed.TodoList = proxy address
// const id = await list.createTask(
//       "Buy groceries",
//       "milk, bread",
//       1,
//       Math.floor(Date.now() / 1000) + 3600,
//       1,
//       ["shopping"]
//     );
// console.log(id);

// const categories = await list.getVersion();

// console.log(categories);

// const Registry = await ethers.getContractFactory("StorageAccessRegistry");
// const registry = Registry.attach(deployed.Registry); // deployed.TodoList = proxy address
// const contracAddress = await registry.getContract("CATEGORY_STORAGE");
// console.log("TaskStorage Address:", contracAddress);


// const TodoList = await ethers.getContractFactory("TodoList");
// const list = TodoList.attach(deployed.TodoList); 
// const taskLogicAddress = await list.taskLogic();
// console.log("TaskLogic Address:", taskLogicAddress); 
// const categoryLogicAddress = await list.categoryLogic();
// console.log("CategoryLogic Address:", categoryLogicAddress);   
    let todoList = await ethers.getContractAt("TodoList", deployed.TodoList, user);
    const tx = await todoList.createCategory("Work", "#ff0");
    await tx.wait();
    const categories = await todoList.getUserCategories();
    console.log(categories[categories.length - 1]);
}
main();
