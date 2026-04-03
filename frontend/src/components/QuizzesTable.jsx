import React from "react";

export default function QuizzesTable({
  quizzes = [],
  onEdit = () => {},
  onDelete = () => {},
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Quizzes</h3>
      </div>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes available.</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((q) => (
            <li
              key={q._id || q.id}
              className="p-3 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {q.title || q.name || "Untitled"}
                </div>
                <div className="text-sm text-gray-500">
                  {q.description || ""}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Duration: {q.timeLimit ? `${q.timeLimit}s` : "—"} • Rules:{" "}
                  {q.rules || "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-blue-600"
                  onClick={() => onEdit(q)}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={() => onDelete(q)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
