import React from "react";
import { useLocation } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const score = state?.score ?? null;
  const total = state?.total ?? null;

  return (
    <div className="page result-page p-6">
      <h2 className="text-2xl font-bold">Results</h2>
      {score !== null && total !== null ? (
        <p>
          Score: {score} / {total}
        </p>
      ) : (
        <p>No result data available.</p>
      )}
    </div>
  );
}
