import { ethers } from "hardhat";
import { expect } from "chai";
import deployed from "../deployed.contracts.json";

// Commands to run this test:
// npx hardhat test test/TodoList.test.ts --network localhost (for local environment)
// npx hardhat test test/TodoList.test.ts --network goerli  (for Goerli testnet)
let owner: any, user: any;
let todoList: any;

describe("🧠 TodoList - Functional + Edge Case Tests", function () {
  before(async () => {
    [owner, user] = await ethers.getSigners();
    todoList = await ethers.getContractAt("TodoList", deployed.TodoList, user);
  });

  async function createCategory(name: string, color: string) {
    const tx = await todoList.createCategory(name, color);
    await tx.wait();
    const categories = await todoList.getUserCategories();
    return categories[categories.length - 1];
  }

  async function createTask(categoryId: number, overrides: Partial<any> = {}) {
    const defaults = {
      content: "Buy groceries",
      description: "milk, bread",
      priority: 1,
      dueDate: Math.floor(Date.now() / 1000) + 3600,
      tags: ["shopping"],
    };

    const taskData = { ...defaults, ...overrides };

    const tx = await todoList.createTask(
      taskData.content,
      taskData.description,
      taskData.priority,
      taskData.dueDate,
      categoryId,
      taskData.tags
    );
    await tx.wait();

    const tasks = await todoList.getUserTasks();
    return tasks[tasks.length - 1];
  }

  it("✅ should create and retrieve a category", async () => {
    const category = await createCategory("Work", "#ff0");
    expect(category.name).to.equal("Work");
    expect(category.color).to.equal("#ff0");
  });

  it("✅ should create a task linked to a category", async () => {
    const category = await createCategory("Errands", "#00f");
    const task = await createTask(category.id);
    expect(task.categoryId).to.equal(category.id);
    expect(task.content).to.equal("Buy groceries");
  });

  it("✅ should update task content and tags", async () => {
    const category = await createCategory("Study", "#333");
    const task = await createTask(category.id);

    const tx = await todoList.updateTask(
      task.id,
      "Read Math",
      "Algebra",
      2,
      task.dueDate,
      ["math"]
    );
    await tx.wait();

    const updated = await todoList.getTask(task.id);
    expect(updated.content).to.equal("Read Math");
    expect(updated.description).to.equal("Algebra");
    expect(updated.tags).to.include("math");
  });

  it("❌ should not allow empty task content", async () => {
    const category = await createCategory("Test", "#000");

    await expect(
      todoList.createTask(
        "",
        "desc",
        1,
        Math.floor(Date.now() / 1000) + 600,
        category.id,
        []
      )
    ).to.be.revertedWithCustomError(todoList, "InvalidContent");
  });

  it("✅ should soft delete a task and not return it", async () => {
    const category = await createCategory("Trash", "#111");
    const task = await createTask(category.id);

    await todoList.deleteTask(task.id);

    const tasks = await todoList.getUserTasks();
    const taskIds = tasks.map((t: any) => t.id);
    expect(taskIds).to.not.include(task.id);
  });

  it("❌ should revert if someone else tries to delete your task", async () => {
    const category = await createCategory("Private", "#222");
    const task = await createTask(category.id);

    const todoListFromOwner = await ethers.getContractAt("TodoList", deployed.TodoList, owner);

    await expect(
      todoListFromOwner.deleteTask(task.id)
    ).to.be.revertedWithCustomError(todoList, "Unauthorized");
  });
});