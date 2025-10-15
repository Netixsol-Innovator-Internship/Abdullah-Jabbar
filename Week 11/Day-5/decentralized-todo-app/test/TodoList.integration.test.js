const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList Deployment & Integration", function () {
  let todoList;
  let owner;
  let addr1;
  let addr2;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Contract Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      const TodoList = await ethers.getContractFactory("TodoList");
      todoList = await TodoList.deploy();
      await todoList.waitForDeployment();

      expect(await todoList.getAddress()).to.be.properAddress;
      console.log(`      Contract deployed at: ${await todoList.getAddress()}`);
    });

    it("Should have correct initial state", async function () {
      // Check that new users have zero task count
      expect(await todoList.taskCounts(owner.address)).to.equal(0);
      expect(await todoList.taskCounts(addr1.address)).to.equal(0);
      expect(await todoList.taskCounts(addr2.address)).to.equal(0);

      // Check that getAllTasks returns empty array for new users
      const ownerTasks = await todoList.getAllTasks();
      const addr1Tasks = await todoList.connect(addr1).getAllTasks();

      expect(ownerTasks.length).to.equal(0);
      expect(addr1Tasks.length).to.equal(0);
    });

    it("Should have all functions accessible", async function () {
      // Verify all public functions exist and are callable
      expect(typeof todoList.createTask).to.equal("function");
      expect(typeof todoList.toggleTask).to.equal("function");
      expect(typeof todoList.updateTask).to.equal("function");
      expect(typeof todoList.deleteTask).to.equal("function");
      expect(typeof todoList.getAllTasks).to.equal("function");
      expect(typeof todoList.getTask).to.equal("function");
      expect(typeof todoList.getTasksByStatus).to.equal("function");
      expect(typeof todoList.getTasksByPriority).to.equal("function");
      expect(typeof todoList.getTaskStats).to.equal("function");
      expect(typeof todoList.bytes32ToString).to.equal("function");
      expect(typeof todoList.clearAllTasks).to.equal("function");
      expect(typeof todoList.taskCounts).to.equal("function");
    });
  });

  describe("End-to-End User Journey", function () {
    it("Should handle complete user workflow", async function () {
      // User creates their first task
      await todoList
        .connect(addr1)
        .createTask("Learn Solidity", 5, "education");

      let tasks = await todoList.connect(addr1).getAllTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0].content).to.equal("Learn Solidity");
      expect(tasks[0].priority).to.equal(5);
      expect(tasks[0].isCompleted).to.be.false;

      // User creates more tasks
      await todoList.connect(addr1).createTask("Build a DApp", 4, "project");
      await todoList.connect(addr1).createTask("Write tests", 3, "development");
      await todoList
        .connect(addr1)
        .createTask("Deploy to mainnet", 5, "deployment");

      tasks = await todoList.connect(addr1).getAllTasks();
      expect(tasks.length).to.equal(4);

      // User completes some tasks
      await todoList.connect(addr1).toggleTask(0); // Complete "Learn Solidity"
      await todoList.connect(addr1).toggleTask(2); // Complete "Write tests"

      // Check completion status
      const [completedTasks] = await todoList
        .connect(addr1)
        .getTasksByStatus(true);
      const [pendingTasks] = await todoList
        .connect(addr1)
        .getTasksByStatus(false);

      expect(completedTasks.length).to.equal(2);
      expect(pendingTasks.length).to.equal(2);

      // User updates a task
      await todoList
        .connect(addr1)
        .updateTask(1, "Build an advanced DApp with React");

      const updatedTask = await todoList.connect(addr1).getTask(1);
      expect(updatedTask.content).to.equal("Build an advanced DApp with React");

      // User checks statistics
      const [total, completed, pending] = await todoList
        .connect(addr1)
        .getTaskStats();
      expect(total).to.equal(4);
      expect(completed).to.equal(2);
      expect(pending).to.equal(2);

      // User filters by priority
      const [highPriorityTasks] = await todoList
        .connect(addr1)
        .getTasksByPriority(5);
      expect(highPriorityTasks.length).to.equal(2); // "Learn Solidity" and "Deploy to mainnet"

      // User deletes a completed task
      await todoList.connect(addr1).deleteTask(0); // Delete "Learn Solidity" (completed)

      tasks = await todoList.connect(addr1).getAllTasks();
      expect(tasks.length).to.equal(3);

      // Final statistics check
      const [finalTotal, finalCompleted, finalPending] = await todoList
        .connect(addr1)
        .getTaskStats();
      expect(finalTotal).to.equal(3);
      expect(finalCompleted).to.equal(1); // Only "Write tests" is completed now
      expect(finalPending).to.equal(2);

      console.log("      Complete user journey successful!");
    });

    it("Should handle multiple users independently", async function () {
      // User 1 workflow
      await todoList.connect(addr1).createTask("User 1 - Task 1", 1, "work");
      await todoList
        .connect(addr1)
        .createTask("User 1 - Task 2", 2, "personal");

      // User 2 workflow
      await todoList.connect(addr2).createTask("User 2 - Task 1", 3, "hobby");
      await todoList.connect(addr2).createTask("User 2 - Task 2", 4, "urgent");
      await todoList.connect(addr2).createTask("User 2 - Task 3", 5, "project");

      // Verify independent task counts
      expect(await todoList.taskCounts(addr1.address)).to.equal(5); // 3 from previous test + 2 new
      expect(await todoList.taskCounts(addr2.address)).to.equal(3);

      // Users modify their own tasks
      await todoList.connect(addr1).toggleTask(0);
      await todoList.connect(addr2).toggleTask(1);

      // Verify isolation
      const user1Stats = await todoList.connect(addr1).getTaskStats();
      const user2Stats = await todoList.connect(addr2).getTaskStats();

      expect(user1Stats[0]).to.equal(5); // User 1 total
      expect(user2Stats[0]).to.equal(3); // User 2 total

      console.log("      Multi-user independence verified!");
    });
  });

  describe("Performance Under Load", function () {
    it("Should handle bulk operations efficiently", async function () {
      const startTime = Date.now();

      // Create 25 tasks rapidly
      for (let i = 0; i < 25; i++) {
        await todoList.createTask(
          `Bulk task ${i}`,
          (i % 5) + 1,
          `category${i % 3}`
        );
      }

      const creationTime = Date.now() - startTime;
      console.log(`      Created 25 tasks in ${creationTime}ms`);

      // Verify all tasks created
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(25);

      // Bulk status changes
      const toggleStartTime = Date.now();
      for (let i = 0; i < 25; i += 2) {
        // Toggle every other task
        await todoList.toggleTask(i);
      }
      const toggleTime = Date.now() - toggleStartTime;
      console.log(`      Toggled 13 tasks in ${toggleTime}ms`);

      // Verify correct completion count
      const [total, completed, pending] = await todoList.getTaskStats();
      expect(total).to.equal(25);
      expect(completed).to.equal(13);
      expect(pending).to.equal(12);

      // Test bulk filtering performance
      const filterStartTime = Date.now();
      const [completedTasks] = await todoList.getTasksByStatus(true);
      const [priority1Tasks] = await todoList.getTasksByPriority(1);
      const filterTime = Date.now() - filterStartTime;

      console.log(`      Filtered tasks in ${filterTime}ms`);
      expect(completedTasks.length).to.equal(13);
      expect(priority1Tasks.length).to.equal(5); // Should be 5 priority 1 tasks
    });

    it("Should maintain performance with mixed operations", async function () {
      const operationStartTime = Date.now();

      // Mixed operations: create, update, toggle, delete
      await todoList.createTask("Mixed op 1", 3, "test");
      await todoList.createTask("Mixed op 2", 2, "test");
      await todoList.createTask("Mixed op 3", 4, "test");

      await todoList.toggleTask(25); // Toggle first new task
      await todoList.updateTask(26, "Updated mixed op 2");
      await todoList.deleteTask(27); // Delete last task

      await todoList.createTask("Mixed op 4", 1, "test");
      await todoList.toggleTask(27); // Toggle new task (index shifted due to deletion)

      const operationTime = Date.now() - operationStartTime;
      console.log(`      Mixed operations completed in ${operationTime}ms`);

      // Verify final state
      const finalStats = await todoList.getTaskStats();
      expect(finalStats[0]).to.equal(27); // 25 + 3 - 1 = 27 total tasks
    });
  });

  describe("Contract State Verification", function () {
    it("Should maintain consistent state after all operations", async function () {
      // Get final state for owner
      const ownerTasks = await todoList.getAllTasks();
      const ownerStats = await todoList.getTaskStats();
      const ownerTaskCount = await todoList.taskCounts(owner.address);

      // Verify consistency
      expect(ownerTasks.length).to.equal(ownerStats[0]); // tasks length = total from stats
      expect(ownerTasks.length).to.equal(ownerTaskCount); // tasks length = taskCounts

      // Count completed/pending manually
      let manualCompleted = 0;
      let manualPending = 0;

      for (let task of ownerTasks) {
        if (task.isCompleted) {
          manualCompleted++;
        } else {
          manualPending++;
        }
      }

      expect(manualCompleted).to.equal(ownerStats[1]); // Manual count = stats completed
      expect(manualPending).to.equal(ownerStats[2]); // Manual count = stats pending
      expect(manualCompleted + manualPending).to.equal(ownerStats[0]); // Sum = total

      console.log("      Final state verification passed!");
      console.log(`        Total tasks: ${ownerStats[0]}`);
      console.log(`        Completed: ${ownerStats[1]}`);
      console.log(`        Pending: ${ownerStats[2]}`);
    });

    it("Should verify all task IDs are valid", async function () {
      const tasks = await todoList.getAllTasks();

      // Verify we can access each task by ID
      for (let i = 0; i < tasks.length; i++) {
        const task = await todoList.getTask(i);
        expect(task.content).to.equal(tasks[i].content);
        expect(task.priority).to.equal(tasks[i].priority);
        expect(task.isCompleted).to.equal(tasks[i].isCompleted);
        expect(task.createdAt).to.equal(tasks[i].createdAt);
        expect(task.category).to.equal(tasks[i].category);
      }

      console.log(`      All ${tasks.length} task IDs verified as valid!`);
    });
  });

  describe("Event Emission Verification", function () {
    it("Should emit correct events for all operations", async function () {
      // Test TaskCreated event
      await expect(todoList.createTask("Event test task", 3, "events")).to.emit(
        todoList,
        "TaskCreated"
      );

      const taskCount = await todoList.taskCounts(owner.address);
      const newTaskId = taskCount - 1;

      // Test TaskToggled event
      await expect(todoList.toggleTask(newTaskId))
        .to.emit(todoList, "TaskToggled")
        .withArgs(owner.address, newTaskId, true);

      // Test TaskUpdated event
      await expect(todoList.updateTask(newTaskId, "Updated event test task"))
        .to.emit(todoList, "TaskUpdated")
        .withArgs(owner.address, newTaskId, "Updated event test task");

      // Test TaskDeleted event
      await expect(todoList.deleteTask(newTaskId))
        .to.emit(todoList, "TaskDeleted")
        .withArgs(owner.address, newTaskId);

      console.log("      All events emitted correctly!");
    });
  });
});
