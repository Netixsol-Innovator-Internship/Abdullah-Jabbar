import { useEffect, useState } from 'react';

export default function TaskForm({ initial = null, onSubmit, onCancel, loading = false }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
  }, [initial]);

  const isEditing = Boolean(initial?._id);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: title.trim(), description: description.trim() });
    // Clear fields after create (only if not editing)
    if (!isEditing) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 bg-white p-4 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-700">{isEditing ? 'Edit Task' : 'Add Task'}</h2>

      <input
        type="text"
        placeholder="Task title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Description (optional)"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving…' : isEditing ? 'Update' : 'Create'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
