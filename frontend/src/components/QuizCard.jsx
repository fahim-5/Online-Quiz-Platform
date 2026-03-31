import React from "react";

export default function QuizCard({ title, description, onStart }) {
  return (
    <div className="quiz-card">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <button onClick={onStart} className="mt-2 btn-primary">
        Start
      </button>
    </div>
  );
}
