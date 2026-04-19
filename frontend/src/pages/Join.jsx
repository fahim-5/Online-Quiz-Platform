import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Join() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = String(code || "").trim();
    if (!trimmed) return setError("Please enter the 6-digit code");
    setLoading(true);
    try {
      const res = await api.get(`/quizzes/code/${encodeURIComponent(trimmed)}`);
      const quiz = res.data.quiz || res.data;
      if (!quiz) return setError("Quiz not found for that code");
      navigate(`/quiz/${quiz._id}`, {
        state: { guestName: name || undefined },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to find quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Join Quiz</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
