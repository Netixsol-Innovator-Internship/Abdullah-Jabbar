import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
const MAX_LENGTH = 50;
const App = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    // Fetch tasks
    useEffect(() => {
        axios
            .get("https://week4-day1-backend.onrender.com/")
            .then((res) => setTasks(res.data))
            .catch((err) => console.error(err));
    }, []);
    // Add task
    const addTask = () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle)
            return alert("Task title required");
        if (trimmedTitle.length > MAX_LENGTH)
            return alert(`Task title cannot exceed ${MAX_LENGTH} characters`);
        axios
            .post("https://week4-day1-backend.onrender.com/", { title: trimmedTitle })
            .then((res) => {
            setTasks([...tasks, res.data]);
            setTitle("");
        });
    };
    // Toggle complete
    const toggleTask = (id) => {
        axios.put(`https://week4-day1-backend.onrender.com/${id}`).then((res) => {
            setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
        });
    };
    // Delete task
    const deleteTask = (id) => {
        axios
            .delete(`https://week4-day1-backend.onrender.com/${id}`)
            .then(() => setTasks(tasks.filter((t) => t.id !== id)));
    };
    // Stats
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;
    return (_jsxs("div", { className: "max-w-md mx-auto mt-8 text-center p-4 bg-gray-50 rounded-lg shadow", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Todo App" }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("input", { type: "text", value: title, maxLength: MAX_LENGTH, onChange: (e) => setTitle(e.target.value), placeholder: `Enter task (max ${MAX_LENGTH} chars)`, className: "flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" }), _jsx("button", { onClick: addTask, disabled: !title.trim(), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Add" })] }), _jsx("ul", { className: "list-none p-0", children: tasks.map((task) => (_jsxs("li", { className: "flex justify-between items-center mb-2 bg-white p-2 rounded shadow-sm", children: [_jsx("span", { onClick: () => toggleTask(task.id), className: `cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`, children: task.title }), _jsx("button", { onClick: () => deleteTask(task.id), className: "text-red-500 hover:text-red-700 transition", children: "Delete" })] }, task.id))) }), _jsxs("p", { className: "mt-4 text-gray-700", children: ["Completed: ", _jsx("span", { className: "font-semibold", children: completed }), " | Pending:", " ", _jsx("span", { className: "font-semibold", children: pending })] })] }));
};
export default App;
