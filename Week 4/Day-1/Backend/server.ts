// server.ts
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// type-only import works fine with require()
import type { Request, Response } from "express";


interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory store
let tasks: Task[] = [];
let currentId = 1;

// GET all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST add task
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTask: Task = { id: currentId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task (toggle complete/incomplete)
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); //  ensure it's parsed as number
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); //  parseInt avoids type mismatch
  tasks = tasks.filter((t) => t.id !== id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
