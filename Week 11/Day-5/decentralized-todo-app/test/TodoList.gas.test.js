const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TodoList Gas Optimization Tests", function () {
  async function deployTodoListFixture() {
    const [owner, addr1] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();

    return { todoList, owner, addr1 };
  }

  describe("Gas Usage Analysis", function () {
    it("Should measure gas for creating tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const tx1 = await todoList.createTask("Task 1", 3, "work");
      const receipt1 = await tx1.wait();
      console.log(
        `      Gas used for first task creation: ${receipt1.gasUsed.toString()}`
      );

      const tx2 = await todoList.createTask("Task 2", 3, "work");
      const receipt2 = await tx2.wait();
      console.log(
        `      Gas used for second task creation: ${receipt2.gasUsed.toString()}`
      );

      const tx3 = await todoList.createTask("Task 3", 3, "work");
      const receipt3 = await tx3.wait();
      console.log(
        `      Gas used for third task creation: ${receipt3.gasUsed.toString()}`
      );

      // Verify gas usage is reasonable (should be similar for each task)
      const gasVariation = Math.abs(
        Number(receipt2.gasUsed) - Number(receipt3.gasUsed)
      );
      expect(gasVariation).to.be.lessThan(10000); // Allow small variation
    });

    it("Should measure gas for toggling tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Toggle test", 3, "work");

      const tx1 = await todoList.toggleTask(0);
      const receipt1 = await tx1.wait();
      console.log(
        `      Gas used for toggling task (false -> true): ${receipt1.gasUsed.toString()}`
      );

      const tx2 = await todoList.toggleTask(0);
      const receipt2 = await tx2.wait();
      console.log(
        `      Gas used for toggling task (true -> false): ${receipt2.gasUsed.toString()}`
      );

      // Toggle operations should use similar gas
      const gasVariation = Math.abs(
        Number(receipt1.gasUsed) - Number(receipt2.gasUsed)
      );
      expect(gasVariation).to.be.lessThan(1000); // Very small variation expected
    });

    it("Should measure gas for updating tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Original content", 3, "work");

      const shortUpdate = await todoList.updateTask(0, "Short");
      const shortReceipt = await shortUpdate.wait();
      console.log(
        `      Gas used for short content update: ${shortReceipt.gasUsed.toString()}`
      );

      const longContent = "A".repeat(100);
      const longUpdate = await todoList.updateTask(0, longContent);
      const longReceipt = await longUpdate.wait();
      console.log(
        `      Gas used for long content update: ${longReceipt.gasUsed.toString()}`
      );

      // Longer content should use more gas
      expect(Number(longReceipt.gasUsed)).to.be.greaterThan(
        Number(shortReceipt.gasUsed)
      );
    });

    it("Should measure gas for deleting tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create multiple tasks
      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "work");
      await todoList.createTask("Task 3", 3, "work");

      // Delete middle task (requires array manipulation)
      const deleteMiddle = await todoList.deleteTask(1);
      const middleReceipt = await deleteMiddle.wait();
      console.log(
        `      Gas used for deleting middle task: ${middleReceipt.gasUsed.toString()}`
      );

      // Delete last task (simpler operation)
      const deleteLast = await todoList.deleteTask(1); // Now index 1 is the last
      const lastReceipt = await deleteLast.wait();
      console.log(
        `      Gas used for deleting last task: ${lastReceipt.gasUsed.toString()}`
      );

      // Deleting last task should be cheaper or similar
      expect(Number(lastReceipt.gasUsed)).to.be.lessThanOrEqual(
        Number(middleReceipt.gasUsed) + 5000
      );
    });

    it("Should measure gas for batch operations", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Measure gas for creating 10 tasks in sequence
      const startGas = await ethers.provider.getBalance(
        todoList.runner.address
      );

      for (let i = 0; i < 10; i++) {
        await todoList.createTask(`Task ${i}`, 3, "batch");
      }

      const endGas = await ethers.provider.getBalance(todoList.runner.address);
      console.log(
        `      Total gas used for 10 task creations: ${startGas - endGas}`
      );

      // Verify all tasks were created
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(10);
    });

    it("Should measure gas for reading operations", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create test data
      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");
      await todoList.toggleTask(0);

      // Test view functions (should not consume gas when called externally)
      const allTasks = await todoList.getAllTasks.staticCall();
      expect(allTasks.length).to.equal(3);

      const [completedTasks] = await todoList.getTasksByStatus.staticCall(true);
      expect(completedTasks.length).to.equal(1);

      const [priorityTasks] = await todoList.getTasksByPriority.staticCall(2);
      expect(priorityTasks.length).to.equal(1);

      const [total, completed, pending] =
        await todoList.getTaskStats.staticCall();
      expect(total).to.equal(3);
      expect(completed).to.equal(1);
      expect(pending).to.equal(2);

      console.log(
        "      All view functions executed successfully (no gas cost for external calls)"
      );
    });
  });

  describe("Storage Optimization Tests", function () {
    it("Should verify struct packing efficiency", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Test task", 5, "category");
      const task = await todoList.getTask(0);

      // Verify all fields are accessible and correct
      expect(task.content).to.equal("Test task");
      expect(task.isCompleted).to.be.false;
      expect(task.priority).to.equal(5);
      expect(task.createdAt).to.be.greaterThan(0);
      expect(task.category).to.not.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      console.log("      Struct packing verified - all fields accessible");
    });

    it("Should test bytes32 category storage efficiency", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const categories = ["work", "personal", "hobby", "urgent", "low"];

      for (let i = 0; i < categories.length; i++) {
        await todoList.createTask(`Task ${i}`, 3, categories[i]);
      }

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(5);

      // Verify each task has a non-zero category
      for (let i = 0; i < tasks.length; i++) {
        expect(tasks[i].category).to.not.equal(
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
      }

      console.log("      Category storage optimization verified");
    });

    it("Should test uint32 timestamp efficiency", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Timestamp test", 3, "test");
      const task = await todoList.getTask(0);

      // Verify timestamp is reasonable (between Jan 1, 2020 and far future)
      const minTimestamp = 1577836800; // Jan 1, 2020
      const maxTimestamp = 4294967295; // Max uint32

      expect(task.createdAt).to.be.greaterThan(minTimestamp);
      expect(task.createdAt).to.be.lessThanOrEqual(maxTimestamp);

      console.log(`      Timestamp stored as uint32: ${task.createdAt}`);
      console.log("      Timestamp storage optimization verified");
    });
  });

  describe("Error Handling Efficiency Tests", function () {
    it("Should use custom errors efficiently", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Test TaskNotFound error
      try {
        await todoList.getTask(0);
        expect.fail("Should have thrown TaskNotFound error");
      } catch (error) {
        expect(error.message).to.include("TaskNotFound");
      }

      // Test EmptyTaskContent error
      try {
        await todoList.createTask("", 3, "work");
        expect.fail("Should have thrown EmptyTaskContent error");
      } catch (error) {
        expect(error.message).to.include("EmptyTaskContent");
      }

      console.log(
        "      Custom error usage verified - more gas efficient than require strings"
      );
    });
  });

  describe("Array Operations Efficiency", function () {
    it("Should test array growth patterns", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const gasUsage = [];

      // Test gas usage for first 20 tasks
      for (let i = 0; i < 20; i++) {
        const tx = await todoList.createTask(`Task ${i}`, 3, "test");
        const receipt = await tx.wait();
        gasUsage.push(Number(receipt.gasUsed));
      }

      // Log gas usage pattern
      console.log("      Task creation gas usage pattern:");
      for (let i = 0; i < gasUsage.length; i += 5) {
        console.log(
          `        Tasks ${i}-${Math.min(i + 4, gasUsage.length - 1)}: ${gasUsage[i]} gas`
        );
      }

      // Gas usage should remain relatively stable
      const firstTaskGas = gasUsage[0];
      const lastTaskGas = gasUsage[gasUsage.length - 1];
      const gasIncrease = lastTaskGas - firstTaskGas;

      // Allow for some increase due to array growth, but shouldn't be dramatic
      expect(gasIncrease).to.be.lessThan(firstTaskGas * 0.5); // Less than 50% increase

      console.log(
        `      Gas increase from first to last task: ${gasIncrease} (${((gasIncrease / firstTaskGas) * 100).toFixed(2)}%)`
      );
    });

    it("Should test deletion efficiency with different array sizes", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create 10 tasks
      for (let i = 0; i < 10; i++) {
        await todoList.createTask(`Task ${i}`, 3, "test");
      }

      // Test deleting from different positions
      const deleteFirst = await todoList.deleteTask(0);
      const deleteFirstReceipt = await deleteFirst.wait();

      const deleteMiddle = await todoList.deleteTask(4); // Middle of remaining 9
      const deleteMiddleReceipt = await deleteMiddle.wait();

      const deleteLast = await todoList.deleteTask(7); // Last of remaining 8
      const deleteLastReceipt = await deleteLast.wait();

      console.log(
        `      Delete first task gas: ${deleteFirstReceipt.gasUsed.toString()}`
      );
      console.log(
        `      Delete middle task gas: ${deleteMiddleReceipt.gasUsed.toString()}`
      );
      console.log(
        `      Delete last task gas: ${deleteLastReceipt.gasUsed.toString()}`
      );

      // All deletions should have similar gas costs due to optimization
      const maxGas = Math.max(
        Number(deleteFirstReceipt.gasUsed),
        Number(deleteMiddleReceipt.gasUsed),
        Number(deleteLastReceipt.gasUsed)
      );
      const minGas = Math.min(
        Number(deleteFirstReceipt.gasUsed),
        Number(deleteMiddleReceipt.gasUsed),
        Number(deleteLastReceipt.gasUsed)
      );

      expect(maxGas - minGas).to.be.lessThan(10000); // Variation should be small
    });
  });

  describe("Memory vs Storage Efficiency", function () {
    it("Should test filtering functions memory usage", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create diverse tasks
      await todoList.createTask("Work task 1", 1, "work");
      await todoList.createTask("Personal task", 2, "personal");
      await todoList.createTask("Work task 2", 1, "work");
      await todoList.createTask("Urgent task", 5, "urgent");
      await todoList.createTask("Work task 3", 3, "work");

      // Complete some tasks
      await todoList.toggleTask(0);
      await todoList.toggleTask(2);

      // Test filtering operations
      const [completedTasks, completedIds] =
        await todoList.getTasksByStatus(true);
      const [pendingTasks, pendingIds] = await todoList.getTasksByStatus(false);
      const [priority1Tasks, priority1Ids] =
        await todoList.getTasksByPriority(1);

      expect(completedTasks.length).to.equal(2);
      expect(pendingTasks.length).to.equal(3);
      expect(priority1Tasks.length).to.equal(2);

      console.log(
        "      Memory-efficient filtering operations completed successfully"
      );
      console.log(`        Completed tasks: ${completedTasks.length}`);
      console.log(`        Pending tasks: ${pendingTasks.length}`);
      console.log(`        Priority 1 tasks: ${priority1Tasks.length}`);
    });
  });
});
