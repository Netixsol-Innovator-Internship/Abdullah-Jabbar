// api/tasks.ts
// import express, { Request, Response } from "express";
// import cors from "cors";

// interface Task {
//   id: number;
//   title: string;
//   completed: boolean;
// }

// let tasks: Task[] = [];
// let currentId = 1;

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ----------------- Routes -----------------

// // GET all tasks
// app.get("/", (req: Request, res: Response) => {
//   res.json(tasks);
// });

// // POST add task
// app.post("/", (req: Request, res: Response) => {
//   const { title } = req.body;
//   if (!title) return res.status(400).json({ message: "Title is required" });

//   const newTask: Task = { id: currentId++, title, completed: false };
//   tasks.push(newTask);
//   res.status(201).json(newTask);
// });

// // PUT update task
// app.put("/:id", (req: Request, res: Response) => {
//   const id = parseInt(req.params.id, 10);
//   const task = tasks.find((t) => t.id === id);
//   if (!task) return res.status(404).json({ message: "Task not found" });

//   task.completed = !task.completed;
//   res.json(task);
// });

// // DELETE task
// app.delete("/:id", (req: Request, res: Response) => {
//   const id = parseInt(req.params.id, 10);
//   tasks = tasks.filter((t) => t.id !== id);
//   res.json({ message: "Task deleted" });
// });

// // -------------------------------------------------
// // Export for Vercel (works at /api/tasks/*)
// // -------------------------------------------------
// export default app;

// // -------------------------------------------------
// // Local development (works at localhost:4000/api/tasks)
// // -------------------------------------------------
// if (require.main === module) {
//   const PORT = process.env.PORT || 4000;
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}/api/tasks`);
//   });
// }


let tasks: { id: number; title: string; completed: boolean }[] = [];
let currentId = 1;

export default (req: any, res: any) => {
  if (req.method === "GET") {
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = { id: currentId++, title, completed: false };
    tasks.push(newTask);
    return res.status(201).json(newTask);
  }

  if (req.method === "PUT") {
    const id = parseInt(req.query.id as string, 10);
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    return res.status(200).json(task);
  }

  if (req.method === "DELETE") {
    const id = parseInt(req.query.id as string, 10);
    tasks = tasks.filter((t) => t.id !== id);
    return res.status(200).json({ message: "Task deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
};
