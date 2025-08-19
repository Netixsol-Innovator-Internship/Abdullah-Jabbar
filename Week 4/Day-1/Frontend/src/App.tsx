// App.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const MAX_LENGTH = 50;

// Use environment variable in production, fallback to localhost in dev
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  // Fetch tasks
  useEffect(() => {
    axios
      .get<Task[]>(`${API_BASE}/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add task
  const addTask = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return alert("Task title required");
    if (trimmedTitle.length > MAX_LENGTH)
      return alert(`Task title cannot exceed ${MAX_LENGTH} characters`);

    axios
      .post<Task>(`${API_BASE}/tasks`, { title: trimmedTitle })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTitle("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // Toggle complete
  const toggleTask = (id: number) => {
    axios
      .put<Task>(`${API_BASE}/tasks/${id}`)
      .then((res) => {
        setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      })
      .catch((err) => console.error("Error toggling task:", err));
  };

  // Delete task
  const deleteTask = (id: number) => {
    axios
      .delete(`${API_BASE}/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((t) => t.id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  // Stats
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="max-w-md mx-auto mt-8 text-center p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          maxLength={MAX_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Enter task (max ${MAX_LENGTH} chars)`}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addTask}
          disabled={!title.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <ul className="list-none p-0">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center mb-2 bg-white p-2 rounded shadow-sm"
          >
            <span
              onClick={() => toggleTask(task.id)}
              className={`cursor-pointer ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-gray-700">
        Completed: <span className="font-semibold">{completed}</span> | Pending:{" "}
        <span className="font-semibold">{pending}</span>
      </p>
    </div>
  );
};

export default App;
