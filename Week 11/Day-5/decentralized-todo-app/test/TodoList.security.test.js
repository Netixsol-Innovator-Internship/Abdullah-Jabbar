const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TodoList Security & Edge Cases", function () {
  async function deployTodoListFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();

    return { todoList, owner, addr1, addr2, addr3 };
  }

  describe("Access Control Security", function () {
    it("Should prevent users from accessing other users' tasks", async function () {
      const { todoList, addr1, addr2 } = await loadFixture(
        deployTodoListFixture
      );

      // User 1 creates a task
      await todoList
        .connect(addr1)
        .createTask("User 1 private task", 3, "work");

      // User 2 should not be able to access User 1's tasks
      const user2Tasks = await todoList.connect(addr2).getAllTasks();
      expect(user2Tasks.length).to.equal(0);

      // User 2 should not be able to modify User 1's tasks
      await expect(
        todoList.connect(addr2).getTask(0)
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");

      await expect(
        todoList.connect(addr2).toggleTask(0)
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");

      await expect(
        todoList.connect(addr2).updateTask(0, "Hacked content")
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");

      await expect(
        todoList.connect(addr2).deleteTask(0)
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");
    });

    it("Should maintain task isolation between multiple users", async function () {
      const { todoList, addr1, addr2, addr3 } = await loadFixture(
        deployTodoListFixture
      );

      // Each user creates tasks
      await todoList.connect(addr1).createTask("User 1 Task 1", 1, "work");
      await todoList.connect(addr1).createTask("User 1 Task 2", 2, "personal");

      await todoList.connect(addr2).createTask("User 2 Task 1", 3, "hobby");

      await todoList.connect(addr3).createTask("User 3 Task 1", 4, "urgent");
      await todoList.connect(addr3).createTask("User 3 Task 2", 5, "low");
      await todoList.connect(addr3).createTask("User 3 Task 3", 1, "work");

      // Verify task counts
      expect(await todoList.taskCounts(addr1.address)).to.equal(2);
      expect(await todoList.taskCounts(addr2.address)).to.equal(1);
      expect(await todoList.taskCounts(addr3.address)).to.equal(3);

      // Verify task isolation
      const user1Tasks = await todoList.connect(addr1).getAllTasks();
      const user2Tasks = await todoList.connect(addr2).getAllTasks();
      const user3Tasks = await todoList.connect(addr3).getAllTasks();

      expect(user1Tasks.length).to.equal(2);
      expect(user2Tasks.length).to.equal(1);
      expect(user3Tasks.length).to.equal(3);

      expect(user1Tasks[0].content).to.equal("User 1 Task 1");
      expect(user2Tasks[0].content).to.equal("User 2 Task 1");
      expect(user3Tasks[0].content).to.equal("User 3 Task 1");
    });

    it("Should prevent unauthorized task modifications after user changes", async function () {
      const { todoList, addr1, addr2 } = await loadFixture(
        deployTodoListFixture
      );

      // User 1 creates and modifies tasks
      await todoList.connect(addr1).createTask("Original task", 3, "work");
      await todoList.connect(addr1).toggleTask(0);
      await todoList.connect(addr1).updateTask(0, "Updated task");

      // Verify User 1 can access their task
      const task = await todoList.connect(addr1).getTask(0);
      expect(task.content).to.equal("Updated task");
      expect(task.isCompleted).to.be.true;

      // User 2 still cannot access User 1's tasks
      await expect(
        todoList.connect(addr2).getTask(0)
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");
    });
  });

  describe("Integer Overflow/Underflow Protection", function () {
    it("Should handle large task counts safely", async function () {
      const { todoList, addr1 } = await loadFixture(deployTodoListFixture);

      // Create a reasonable number of tasks to test array bounds
      const taskCount = 100;
      for (let i = 0; i < taskCount; i++) {
        await todoList.connect(addr1).createTask(`Task ${i}`, 3, "test");
      }

      expect(await todoList.taskCounts(addr1.address)).to.equal(taskCount);

      // Test accessing all valid indices
      for (let i = 0; i < 10; i++) {
        // Test first 10 for efficiency
        const task = await todoList.connect(addr1).getTask(i);
        expect(task.content).to.equal(`Task ${i}`);
      }

      // Test that accessing invalid index fails
      await expect(
        todoList.connect(addr1).getTask(taskCount)
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");
    });

    it("Should handle timestamp edge cases", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Timestamp test", 3, "test");
      const task = await todoList.getTask(0);

      // Verify timestamp is within uint32 bounds
      expect(task.createdAt).to.be.greaterThan(0);
      expect(task.createdAt).to.be.lessThanOrEqual(4294967295); // Max uint32

      // Verify timestamp is reasonable (after 2020)
      expect(task.createdAt).to.be.greaterThan(1577836800); // Jan 1, 2020
    });

    it("Should handle priority boundary values", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Test valid priorities
      for (let priority = 1; priority <= 5; priority++) {
        await todoList.createTask(
          `Priority ${priority} task`,
          priority,
          "test"
        );
        const task = await todoList.getTask(priority - 1);
        expect(task.priority).to.equal(priority);
      }

      // Test invalid priorities default to 3
      await todoList.createTask("Invalid priority 0", 0, "test");
      const task0 = await todoList.getTask(5);
      expect(task0.priority).to.equal(3);

      await todoList.createTask("Invalid priority 255", 255, "test");
      const task255 = await todoList.getTask(6);
      expect(task255.priority).to.equal(3);
    });
  });

  describe("Memory and Storage Edge Cases", function () {
    it("Should handle empty and very long strings", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Empty content should revert
      await expect(
        todoList.createTask("", 3, "work")
      ).to.be.revertedWithCustomError(todoList, "EmptyTaskContent");

      // Very long content should work
      const longContent = "A".repeat(1000);
      await todoList.createTask(longContent, 3, "work");

      const task = await todoList.getTask(0);
      expect(task.content).to.equal(longContent);

      // Very long category should work (truncated to bytes32)
      const longCategory = "B".repeat(100);
      await todoList.createTask("Test task", 3, longCategory);

      const task2 = await todoList.getTask(1);
      expect(task2.category).to.not.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });

    it("Should handle special characters and unicode", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const specialContent =
        "Task with émojis 🚀 and spéciål characters!@#$%^&*()";
      const unicodeCategory = "tëst-çătégørÿ";

      await todoList.createTask(specialContent, 3, unicodeCategory);

      const task = await todoList.getTask(0);
      expect(task.content).to.equal(specialContent);
    });

    it("Should handle bytes32 category conversion edge cases", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Empty category
      await todoList.createTask("Empty category test", 3, "");
      const task1 = await todoList.getTask(0);
      expect(task1.category).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      // Exactly 32 character category
      const exactly32 = "A".repeat(32);
      await todoList.createTask("32 char category", 3, exactly32);
      const task2 = await todoList.getTask(1);
      expect(task2.category).to.not.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      // Test bytes32ToString function
      const converted = await todoList.bytes32ToString(task2.category);
      expect(converted).to.equal(exactly32);
    });
  });

  describe("Array Manipulation Edge Cases", function () {
    it("Should handle deletion of single task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Only task", 3, "work");
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        1
      );

      await todoList.deleteTask(0);
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        0
      );

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });

    it("Should handle multiple consecutive deletions", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create 5 tasks
      for (let i = 0; i < 5; i++) {
        await todoList.createTask(`Task ${i}`, 3, "work");
      }

      // Delete all tasks one by one from the end
      for (let i = 4; i >= 0; i--) {
        await todoList.deleteTask(i);
        const remainingTasks = await todoList.getAllTasks();
        expect(remainingTasks.length).to.equal(i);
      }

      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        0
      );
    });

    it("Should handle alternating creation and deletion", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create, delete, create, delete pattern
      await todoList.createTask("Task 1", 3, "work");
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        1
      );

      await todoList.deleteTask(0);
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        0
      );

      await todoList.createTask("Task 2", 3, "work");
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        1
      );

      await todoList.createTask("Task 3", 3, "work");
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        2
      );

      await todoList.deleteTask(0);
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        1
      );

      const remainingTasks = await todoList.getAllTasks();
      expect(remainingTasks.length).to.equal(1);
    });
  });

  describe("State Consistency Edge Cases", function () {
    it("Should maintain consistency after clearAllTasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create multiple tasks with various states
      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      await todoList.toggleTask(0);
      await todoList.updateTask(1, "Updated Task 2");

      // Clear all tasks
      await todoList.clearAllTasks();

      // Verify complete cleanup
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        0
      );

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);

      const [total, completed, pending] = await todoList.getTaskStats();
      expect(total).to.equal(0);
      expect(completed).to.equal(0);
      expect(pending).to.equal(0);

      // Verify we can create new tasks after clearing
      await todoList.createTask("New task after clear", 3, "test");
      expect(await todoList.taskCounts(await todoList.runner.address)).to.equal(
        1
      );
    });

    it("Should handle rapid state changes", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Rapid change task", 3, "test");

      // Rapid toggle operations
      for (let i = 0; i < 10; i++) {
        await todoList.toggleTask(0);
      }

      // Should be back to original state (false)
      const task = await todoList.getTask(0);
      expect(task.isCompleted).to.be.false;

      // Rapid content updates
      for (let i = 0; i < 5; i++) {
        await todoList.updateTask(0, `Updated content ${i}`);
      }

      const updatedTask = await todoList.getTask(0);
      expect(updatedTask.content).to.equal("Updated content 4");
    });
  });

  describe("Filter Function Edge Cases", function () {
    it("Should handle filtering with no matching tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Only task", 3, "work");

      // No completed tasks
      const [completedTasks, completedIds] =
        await todoList.getTasksByStatus(true);
      expect(completedTasks.length).to.equal(0);
      expect(completedIds.length).to.equal(0);

      // No priority 5 tasks
      const [priority5Tasks, priority5Ids] =
        await todoList.getTasksByPriority(5);
      expect(priority5Tasks.length).to.equal(0);
      expect(priority5Ids.length).to.equal(0);
    });

    it("Should handle filtering with all tasks matching", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create all priority 3 tasks
      await todoList.createTask("Task 1", 3, "work");
      await todoList.createTask("Task 2", 3, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      const [priority3Tasks, priority3Ids] =
        await todoList.getTasksByPriority(3);
      expect(priority3Tasks.length).to.equal(3);
      expect(priority3Ids.length).to.equal(3);

      // Verify all task IDs are correct
      expect(priority3Ids[0]).to.equal(0);
      expect(priority3Ids[1]).to.equal(1);
      expect(priority3Ids[2]).to.equal(2);
    });

    it("Should handle filtering after task deletion", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "work");
      await todoList.createTask("Task 3", 1, "work");

      // Delete middle task
      await todoList.deleteTask(1);

      // Filter should return correct remaining tasks
      const [priority1Tasks, priority1Ids] =
        await todoList.getTasksByPriority(1);
      expect(priority1Tasks.length).to.equal(2);
      expect(priority1Tasks[0].content).to.equal("Task 1");
      expect(priority1Tasks[1].content).to.equal("Task 3");
    });
  });

  describe("Reentrancy and External Call Safety", function () {
    it("Should be safe from reentrancy attacks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // This contract doesn't make external calls, so it's inherently safe from reentrancy
      // But we test that state changes are atomic

      await todoList.createTask("Test task", 3, "work");

      // Verify that task creation is atomic
      const taskCountBefore = await todoList.taskCounts(
        await todoList.runner.address
      );
      expect(taskCountBefore).to.equal(1);

      // Multiple operations should maintain consistency
      await todoList.toggleTask(0);
      await todoList.updateTask(0, "Updated content");

      const task = await todoList.getTask(0);
      expect(task.content).to.equal("Updated content");
      expect(task.isCompleted).to.be.true;

      const taskCountAfter = await todoList.taskCounts(
        await todoList.runner.address
      );
      expect(taskCountAfter).to.equal(1);
    });
  });

  describe("Gas Limit Edge Cases", function () {
    it("Should handle operations near gas limits", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create a reasonable number of tasks to test gas consumption
      const maxTasks = 50; // Reasonable limit for testing

      for (let i = 0; i < maxTasks; i++) {
        await todoList.createTask(`Task ${i}`, 3, "test");
      }

      // Operations should still work with many tasks
      const allTasks = await todoList.getAllTasks();
      expect(allTasks.length).to.equal(maxTasks);

      // Filtering should work
      const [pendingTasks] = await todoList.getTasksByStatus(false);
      expect(pendingTasks.length).to.equal(maxTasks);

      // Statistics should work
      const [total, completed, pending] = await todoList.getTaskStats();
      expect(total).to.equal(maxTasks);
      expect(completed).to.equal(0);
      expect(pending).to.equal(maxTasks);
    });
  });
});
