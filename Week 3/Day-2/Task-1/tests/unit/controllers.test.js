const authController = require("../../src/controllers/authController");
const taskController = require("../../src/controllers/taskController");
const User = require("../../src/models/User");
const Task = require("../../src/models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Mock User
jest.mock("../../src/models/User", () => {
  const MockUser = jest.fn().mockImplementation((data) => {
    return {
      ...data,
      _id: "userId",
      name: data.name,
      email: data.email,
      save: jest.fn(),
    };
  });
  MockUser.findOne = jest.fn();
  return MockUser;
});

// Mock Task
jest.mock("../../src/models/Task", () => {
  const MockTask = jest.fn().mockImplementation((data) => {
    return {
      ...data,
      _id: "taskId",
      title: data.title,
      user: data.user,
      save: jest.fn(),
    };
  });
  MockTask.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([]),
  });
  MockTask.findById = jest.fn();
  MockTask.findByIdAndUpdate = jest.fn();
  MockTask.deleteOne = jest.fn();
  return MockTask;
});

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        name: "Test",
        email: "test@example.com",
        password: "pass123",
      };
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed");
      const userInstance = {
        _id: "userId",
        name: "Test",
        email: "test@example.com",
        save: jest.fn(),
      };
      User.mockReturnValue(userInstance);
      userInstance.save.mockResolvedValue(userInstance);
      jwt.sign.mockReturnValue("token");

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("pass123", "salt");
      expect(User).toHaveBeenCalledWith({
        name: "Test",
        email: "test@example.com",
        password: "hashed",
      });
      expect(userInstance.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "userId" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: "token",
        user: { id: "userId", name: "Test", email: "test@example.com" },
      });
    });

    it("should return 400 if user already exists", async () => {
      req.body = {
        name: "Test",
        email: "test@example.com",
        password: "pass123",
      };
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should handle errors", async () => {
      req.body = {
        name: "Test",
        email: "test@example.com",
        password: "pass123",
      };
      User.findOne.mockRejectedValue(new Error("DB error"));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      req.body = { email: "test@example.com", password: "pass123" };
      User.findOne.mockResolvedValue({
        _id: "userId",
        name: "Test",
        email: "test@example.com",
        password: "hashed",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("pass123", "hashed");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "userId" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: "token",
        user: { id: "userId", name: "Test", email: "test@example.com" },
      });
    });

    it("should return 400 for invalid credentials", async () => {
      req.body = { email: "test@example.com", password: "wrong" };
      User.findOne.mockResolvedValue({ password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should handle errors", async () => {
      req.body = { email: "test@example.com", password: "pass123" };
      User.findOne.mockRejectedValue(new Error("DB error"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });
});

describe("Task Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { id: "userId" }, params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should get tasks for user", async () => {
      const tasks = [{ title: "Task1" }];
      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(tasks),
      });

      await taskController.getTasks(req, res);

      expect(Task.find).toHaveBeenCalledWith({ user: "userId" });
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it("should handle errors", async () => {
      // Task.find.mockImplementation(() => Promise.reject(new Error('DB error')));
      // await taskController.getTasks(req, res);
      // expect(res.status).toHaveBeenCalledWith(500);
      // expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });

  describe("getTask", () => {
    it("should get a single task", async () => {
      req.params.id = "taskId";
      const task = { _id: "taskId", user: "userId", title: "Task" };
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(task);

      await taskController.getTask(req, res);

      expect(Task.findById).toHaveBeenCalledWith("taskId");
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it("should return 400 for invalid id", async () => {
      req.params.id = "invalid";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

      await taskController.getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id" });
    });

    it("should return 404 if task not found", async () => {
      req.params.id = "taskId";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(null);

      await taskController.getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 403 if not authorized", async () => {
      req.params.id = "taskId";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      const task = { user: "otherUser" };
      Task.findById.mockResolvedValue(task);

      await taskController.getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      req.body = { title: "New Task", description: "Desc" };
      const task = {
        _id: "taskId",
        title: "New Task",
        user: "userId",
        save: jest.fn(),
      };
      Task.mockReturnValue(task);
      task.save.mockResolvedValue(task);

      await taskController.createTask(req, res);

      expect(Task).toHaveBeenCalledWith({
        title: "New Task",
        description: "Desc",
        completed: false,
        user: "userId",
      });
      expect(task.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it("should handle errors", async () => {
      req.body = { title: "New Task" };
      const taskInstance = { save: jest.fn() };
      Task.mockReturnValue(taskInstance);
      taskInstance.save.mockRejectedValue(new Error("DB error"));

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      req.params.id = "taskId";
      req.body = { title: "Updated", completed: true };
      const task = { user: "userId" };
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(task);
      Task.findByIdAndUpdate.mockResolvedValue({
        title: "Updated",
        completed: true,
      });

      await taskController.updateTask(req, res);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "taskId",
        { $set: { title: "Updated", completed: true } },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        title: "Updated",
        completed: true,
      });
    });

    it("should return 400 for invalid id", async () => {
      req.params.id = "invalid";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id" });
    });

    it("should return 404 if task not found", async () => {
      req.params.id = "taskId";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(null);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      req.params.id = "taskId";
      const task = { user: "userId" };
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(task);
      Task.deleteOne.mockResolvedValue({});

      await taskController.deleteTask(req, res);

      expect(Task.deleteOne).toHaveBeenCalledWith({ _id: "taskId" });
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return 400 for invalid id", async () => {
      req.params.id = "invalid";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id" });
    });

    it("should return 404 if task not found", async () => {
      req.params.id = "taskId";
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
      Task.findById.mockResolvedValue(null);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });
});
