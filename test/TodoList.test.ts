import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import deployed from "../deployed.contracts.json";

let owner: any, user: any;
let todoList: any, taskLogic: any, categoryLogic: any, registry: any;


beforeEach(async () => {
  [owner, user] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.attach(deployed.TodoList);
});

describe("🧠 TodoList - Functional + Edge Case Tests", () => {

  it("should create and retrieve a category", async () => {
    await todoList.connect(user).createCategory("Work", "#ff0");
    const categories = await todoList.connect(user).getUserCategories();
    expect(categories.length).to.eq(1);
    expect(categories[0].name).to.eq("Work");
  });

  it("should create a task linked to a category", async () => {
    await todoList.connect(user).createCategory("Errands", "#00f");
    const cat = (await todoList.connect(user).getUserCategories())[0];

    const tx = await todoList.connect(user).createTask(
      "Buy groceries",
      "milk, bread",
      1,
      Math.floor(Date.now() / 1000) + 3600,
      cat.id,
      ["shopping"]
    );
    await tx.wait();

    const tasks = await todoList.connect(user).getUserTasks();
    expect(tasks.length).to.eq(1);
    expect(tasks[0].categoryId).to.eq(cat.id);
  });

  it("should update task content and tags", async () => {
    await todoList.connect(user).createCategory("Study", "#333");
    const cat = (await todoList.connect(user).getUserCategories())[0];

    await todoList.connect(user).createTask("Read", "Chapters", 0, Math.floor(Date.now()/1000)+600, cat.id, []);
    const task = (await todoList.connect(user).getUserTasks())[0];

    await todoList.connect(user).updateTask(
      task.id,
      "Read Math",
      "Algebra",
      1,
      task.dueDate,
      ["math"]
    );

    const updated = await todoList.connect(user).getTask(task.id);
    expect(updated.content).to.eq("Read Math");
    expect(updated.tags[0]).to.eq("math");
  });

  it("should not allow empty task content", async () => {
    await todoList.connect(user).createCategory("Test", "#000");
    const cat = (await todoList.connect(user).getUserCategories())[0];

    await expect(
      todoList.connect(user).createTask(
        "",
        "desc",
        0,
        Math.floor(Date.now()/1000)+600,
        cat.id,
        []
      )
    ).to.be.revertedWithCustomError;
  });

  it("should soft delete a task and not return it", async () => {
    await todoList.connect(user).createCategory("Trash", "#111");
    const cat = (await todoList.connect(user).getUserCategories())[0];

    await todoList.connect(user).createTask("Trash this", "desc", 0, Math.floor(Date.now()/1000)+600, cat.id, []);
    const task = (await todoList.connect(user).getUserTasks())[0];

    await todoList.connect(user).deleteTask(task.id);
    const tasks = await todoList.connect(user).getUserTasks();
    expect(tasks.length).to.eq(0);
  });

  it("should revert if someone else tries to delete your task", async () => {
    await todoList.connect(user).createCategory("Own", "#aaa");
    const cat = (await todoList.connect(user).getUserCategories())[0];

    await todoList.connect(user).createTask("Private", "keep out", 1, Math.floor(Date.now()/1000)+600, cat.id, []);
    const task = (await todoList.connect(user).getUserTasks())[0];

    await expect(
      todoList.connect(owner).deleteTask(task.id)
    ).to.be.reverted;
  });

});
