import { ethers } from "hardhat";

import deployed from "../deployed.contracts.json";

async function main() {
    let [owner, user] = await ethers.getSigners();
    // console.log("Owner:", owner.address);
    // console.log("User:", user.address);]
const TodoList = await ethers.getContractFactory("TodoList");
const list = TodoList.attach(deployed.TodoList); // deployed.TodoList = proxy address

const categories = await list.getVersion();
console.log(categories);
}
main();
