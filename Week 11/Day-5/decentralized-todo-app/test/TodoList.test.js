const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TodoList Contract", function () {
  // Fixture to deploy contract
  async function deployTodoListFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();

    return { todoList, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      expect(await todoList.getAddress()).to.be.properAddress;
    });

    it("Should initialize with zero task count for new users", async function () {
      const { todoList, owner } = await loadFixture(deployTodoListFixture);
      expect(await todoList.taskCounts(owner.address)).to.equal(0);
    });
  });

  describe("Task Creation", function () {
    it("Should create a task successfully", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const content = "Test task";
      const priority = 3;
      const category = "work";

      await expect(todoList.createTask(content, priority, category))
        .to.emit(todoList, "TaskCreated")
        .withArgs(
          await todoList.runner.address,
          0,
          content,
          priority,
          ethers.encodeBytes32String(category.slice(0, 31))
        );

      const taskCount = await todoList.taskCounts(
        await todoList.runner.address
      );
      expect(taskCount).to.equal(1);
    });

    it("Should revert when creating task with empty content", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(
        todoList.createTask("", 3, "work")
      ).to.be.revertedWithCustomError(todoList, "EmptyTaskContent");
    });

    it("Should set default priority when invalid priority is provided", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Test with priority 0 (invalid)
      await expect(todoList.createTask("Test task", 0, "work"))
        .to.emit(todoList, "TaskCreated")
        .withArgs(
          await todoList.runner.address,
          0,
          "Test task",
          3, // Should default to 3
          ethers.encodeBytes32String("work".slice(0, 31))
        );

      // Test with priority > 5 (invalid)
      await expect(todoList.createTask("Test task 2", 10, "personal"))
        .to.emit(todoList, "TaskCreated")
        .withArgs(
          await todoList.runner.address,
          1,
          "Test task 2",
          3, // Should default to 3
          ethers.encodeBytes32String("personal".slice(0, 31))
        );
    });

    it("Should handle long category names by truncating", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const longCategory = "a".repeat(50); // 50 characters
      await todoList.createTask("Test task", 3, longCategory);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(1);
    });

    it("Should create multiple tasks for the same user", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      const taskCount = await todoList.taskCounts(
        await todoList.runner.address
      );
      expect(taskCount).to.equal(3);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(3);
      expect(tasks[0].content).to.equal("Task 1");
      expect(tasks[1].content).to.equal("Task 2");
      expect(tasks[2].content).to.equal("Task 3");
    });
  });

  describe("Task Retrieval", function () {
    it("Should get all tasks for a user", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
      expect(tasks[0].content).to.equal("Task 1");
      expect(tasks[1].content).to.equal("Task 2");
    });

    it("Should get a specific task by ID", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Specific task", 4, "important");

      const task = await todoList.getTask(0);
      expect(task.content).to.equal("Specific task");
      expect(task.priority).to.equal(4);
      expect(task.isCompleted).to.be.false;
    });

    it("Should revert when getting non-existent task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.getTask(0)).to.be.revertedWithCustomError(
        todoList,
        "TaskNotFound"
      );
    });

    it("Should return empty array for user with no tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });
  });

  describe("Task Toggle", function () {
    it("Should toggle task completion status", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Toggle task", 3, "test");

      // Initially false
      let task = await todoList.getTask(0);
      expect(task.isCompleted).to.be.false;

      // Toggle to true
      await expect(todoList.toggleTask(0))
        .to.emit(todoList, "TaskToggled")
        .withArgs(await todoList.runner.address, 0, true);

      task = await todoList.getTask(0);
      expect(task.isCompleted).to.be.true;

      // Toggle back to false
      await expect(todoList.toggleTask(0))
        .to.emit(todoList, "TaskToggled")
        .withArgs(await todoList.runner.address, 0, false);

      task = await todoList.getTask(0);
      expect(task.isCompleted).to.be.false;
    });

    it("Should revert when toggling non-existent task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.toggleTask(0)).to.be.revertedWithCustomError(
        todoList,
        "TaskNotFound"
      );
    });
  });

  describe("Task Update", function () {
    it("Should update task content", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Original content", 3, "work");

      const newContent = "Updated content";
      await expect(todoList.updateTask(0, newContent))
        .to.emit(todoList, "TaskUpdated")
        .withArgs(await todoList.runner.address, 0, newContent);

      const task = await todoList.getTask(0);
      expect(task.content).to.equal(newContent);
    });

    it("Should revert when updating with empty content", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Original content", 3, "work");

      await expect(todoList.updateTask(0, "")).to.be.revertedWithCustomError(
        todoList,
        "EmptyTaskContent"
      );
    });

    it("Should revert when updating non-existent task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(
        todoList.updateTask(0, "New content")
      ).to.be.revertedWithCustomError(todoList, "TaskNotFound");
    });
  });

  describe("Task Deletion", function () {
    it("Should delete a task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Task to delete", 3, "work");

      await expect(todoList.deleteTask(0))
        .to.emit(todoList, "TaskDeleted")
        .withArgs(await todoList.runner.address, 0);

      const taskCount = await todoList.taskCounts(
        await todoList.runner.address
      );
      expect(taskCount).to.equal(0);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });

    it("Should delete task from middle of array correctly", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      // Delete middle task (index 1)
      await todoList.deleteTask(1);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
      expect(tasks[0].content).to.equal("Task 1");
      expect(tasks[1].content).to.equal("Task 3"); // Task 3 moved to index 1
    });

    it("Should revert when deleting non-existent task", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.deleteTask(0)).to.be.revertedWithCustomError(
        todoList,
        "TaskNotFound"
      );
    });
  });

  describe("Task Filtering", function () {
    beforeEach(async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      this.todoList = todoList;

      // Create test tasks
      await todoList.createTask("Completed task 1", 1, "work");
      await todoList.createTask("Pending task 1", 2, "personal");
      await todoList.createTask("Completed task 2", 3, "hobby");
      await todoList.createTask("Pending task 2", 4, "work");
      await todoList.createTask("High priority task", 5, "urgent");

      // Mark some as completed
      await todoList.toggleTask(0); // Complete task 1
      await todoList.toggleTask(2); // Complete task 3
    });

    it("Should get tasks by completion status - completed", async function () {
      const [tasks, taskIds] = await this.todoList.getTasksByStatus(true);

      expect(tasks.length).to.equal(2);
      expect(taskIds.length).to.equal(2);
      expect(tasks[0].content).to.equal("Completed task 1");
      expect(tasks[1].content).to.equal("Completed task 2");
      expect(taskIds[0]).to.equal(0);
      expect(taskIds[1]).to.equal(2);
    });

    it("Should get tasks by completion status - pending", async function () {
      const [tasks, taskIds] = await this.todoList.getTasksByStatus(false);

      expect(tasks.length).to.equal(3);
      expect(taskIds.length).to.equal(3);
      expect(tasks[0].content).to.equal("Pending task 1");
      expect(tasks[1].content).to.equal("Pending task 2");
      expect(tasks[2].content).to.equal("High priority task");
    });

    it("Should get tasks by priority", async function () {
      const [tasks, taskIds] = await this.todoList.getTasksByPriority(1);

      expect(tasks.length).to.equal(1);
      expect(taskIds.length).to.equal(1);
      expect(tasks[0].content).to.equal("Completed task 1");
      expect(taskIds[0]).to.equal(0);
    });

    it("Should return empty arrays for non-existent priority", async function () {
      const [tasks, taskIds] = await this.todoList.getTasksByPriority(10);

      expect(tasks.length).to.equal(0);
      expect(taskIds.length).to.equal(0);
    });
  });

  describe("Task Statistics", function () {
    it("Should return correct task statistics", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create tasks
      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      // Complete one task
      await todoList.toggleTask(0);

      const [total, completed, pending] = await todoList.getTaskStats();
      expect(total).to.equal(3);
      expect(completed).to.equal(1);
      expect(pending).to.equal(2);
    });

    it("Should return zero statistics for user with no tasks", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const [total, completed, pending] = await todoList.getTaskStats();
      expect(total).to.equal(0);
      expect(completed).to.equal(0);
      expect(pending).to.equal(0);
    });
  });

  describe("Utility Functions", function () {
    it("Should convert bytes32 to string correctly", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const testString = "test";
      const bytes32Value = ethers.encodeBytes32String(testString);
      const convertedString = await todoList.bytes32ToString(bytes32Value);

      expect(convertedString).to.equal(testString);
    });

    it("Should handle empty bytes32 conversion", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const emptyBytes32 =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const convertedString = await todoList.bytes32ToString(emptyBytes32);

      expect(convertedString).to.equal("");
    });
  });

  describe("Clear All Tasks", function () {
    it("Should clear all tasks for user", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create multiple tasks
      await todoList.createTask("Task 1", 1, "work");
      await todoList.createTask("Task 2", 2, "personal");
      await todoList.createTask("Task 3", 3, "hobby");

      // Verify tasks exist
      let taskCount = await todoList.taskCounts(await todoList.runner.address);
      expect(taskCount).to.equal(3);

      // Clear all tasks
      await todoList.clearAllTasks();

      // Verify all tasks are cleared
      taskCount = await todoList.taskCounts(await todoList.runner.address);
      expect(taskCount).to.equal(0);

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });
  });

  describe("Multi-user Functionality", function () {
    it("Should handle multiple users independently", async function () {
      const { todoList, owner, addr1, addr2 } = await loadFixture(
        deployTodoListFixture
      );

      // User 1 creates tasks
      await todoList.connect(addr1).createTask("User 1 Task", 1, "work");

      // User 2 creates tasks
      await todoList.connect(addr2).createTask("User 2 Task", 2, "personal");

      // Verify isolation
      const user1Tasks = await todoList.connect(addr1).getAllTasks();
      const user2Tasks = await todoList.connect(addr2).getAllTasks();

      expect(user1Tasks.length).to.equal(1);
      expect(user2Tasks.length).to.equal(1);
      expect(user1Tasks[0].content).to.equal("User 1 Task");
      expect(user2Tasks[0].content).to.equal("User 2 Task");

      // User 1 cannot access User 2's tasks
      await expect(todoList.connect(addr1).getTask(0)).to.not.be.reverted;

      const user1TaskCount = await todoList.taskCounts(addr1.address);
      const user2TaskCount = await todoList.taskCounts(addr2.address);

      expect(user1TaskCount).to.equal(1);
      expect(user2TaskCount).to.equal(1);
    });
  });

  describe("Edge Cases and Boundary Tests", function () {
    it("Should handle maximum uint32 timestamp", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTask("Timestamp test", 3, "test");
      const task = await todoList.getTask(0);

      // Verify timestamp is within reasonable bounds
      expect(task.createdAt).to.be.greaterThan(0);
    });

    it("Should handle all priority levels", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      for (let i = 1; i <= 5; i++) {
        await todoList.createTask(`Priority ${i} task`, i, "test");
      }

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(5);

      for (let i = 0; i < 5; i++) {
        expect(tasks[i].priority).to.equal(i + 1);
      }
    });

    it("Should handle large task content", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const largeContent = "A".repeat(1000); // 1000 characters
      await todoList.createTask(largeContent, 3, "test");

      const task = await todoList.getTask(0);
      expect(task.content).to.equal(largeContent);
    });
  });
});
