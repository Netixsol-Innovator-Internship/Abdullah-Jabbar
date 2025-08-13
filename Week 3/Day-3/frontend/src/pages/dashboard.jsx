import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/taskForm.jsx';
import TaskList from '../components/taskList.jsx';
import { taskAPI } from '../services/api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const DEV_MODE = false; // set true to bypass login and use mock tasks
  const token = DEV_MODE ? 'dev-token' : localStorage.getItem('token');

  useEffect(() => {
    if (!DEV_MODE && !token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchTasks = async () => {
      setBusy(true);
      setError('');
      try {
        const data = DEV_MODE
          ? [
              { _id: '1', title: 'Mock Task 1', description: 'Sample description', completed: false },
              { _id: '2', title: 'Mock Task 2', description: 'Another sample', completed: true },
            ]
          : await taskAPI.list();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to fetch tasks';
        setError(msg);
      } finally {
        setBusy(false);
      }
    };

    fetchTasks();
  }, [navigate, token, DEV_MODE]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleCreate = async (payload) => {
    setBusy(true);
    setError('');
    try {
      const created = DEV_MODE
        ? { _id: Date.now().toString(), ...payload, completed: false }
        : await taskAPI.create(payload);
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing?._id) return;
    setBusy(true);
    setError('');
    try {
      const updated = DEV_MODE ? { ...editing, ...payload } : await taskAPI.update(editing._id, payload);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setEditing(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusy(true);
    setError('');
    try {
      if (!DEV_MODE) await taskAPI.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (task) => {
    setBusy(true);
    setError('');
    try {
      const updated = DEV_MODE ? { ...task, completed: !task.completed } : await taskAPI.update(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to toggle task';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 md:mb-0 tracking-tight">
            Task Manager
          </h1>
          {!DEV_MODE && (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </header>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow text-center font-medium">
            {error}
          </div>
        )}
        {busy && (
          <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded-lg shadow text-center font-medium">
            Loading…
          </div>
        )}

        {/* Task Form */}
        <div className="mb-10 bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <TaskForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => setEditing(null)}
            loading={busy}
          />
        </div>

        {/* Task List */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={(t) => setEditing(t)}
          />
        </div>

      </div>
    </div>
  );
}
