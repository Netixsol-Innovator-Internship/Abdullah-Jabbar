export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (!tasks?.length)
    return <p className="text-gray-500 text-center opacity-80">No tasks yet.</p>;

  return (
    <ul className="grid gap-4">
      {tasks.map((t) => (
        <li
          key={t._id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>
              <div
                className={`font-semibold text-gray-800 ${
                  t.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {t.title}
              </div>
              {t.description && (
                <div className="text-gray-600 text-sm mt-1">{t.description}</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <button
                onClick={() => onToggle(t)}
                className={`px-3 py-1 rounded-lg font-medium text-sm shadow transition
                  ${t.completed ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {t.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>

              <button
                onClick={() => onEdit(t)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(t._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium shadow hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
