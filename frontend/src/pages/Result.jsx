import React from "react";

export default function Result({ score, total }) {
  return (
    <div className="page result-page">
      <h2 className="text-2xl font-bold">Results</h2>
      <p>
        Score: {score} / {total}
      </p>
    </div>
  );
}
