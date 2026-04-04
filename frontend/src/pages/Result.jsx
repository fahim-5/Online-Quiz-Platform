import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export default function Result() {
  const { state } = useLocation();
  const score = state?.score ?? null;
  const total = state?.total ?? null;

  const auth = useAuth();
  const user = auth?.user;

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === "teacher") fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/quizzes?all=true");
      const list = res?.data?.quizzes || res?.data || [];
      setQuizzes(list);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load quizzes",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/questions/quiz/${quizId}`);
      const list = res?.data?.questions || res?.data || [];
      setQuestions(list);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load questions",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id, updates) => {
    try {
      await api.put(`/questions/${id}`, updates);
      // reflect change locally
      setQuestions((q) =>
        q.map((item) =>
          item._id === id || item.id === id ? { ...item, ...updates } : item,
        ),
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Update failed");
    }
  };

  const saveAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        questions.map((q) =>
          api.put(`/questions/${q._id || q.id}`, {
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            points: q.points,
          }),
        ),
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role === "teacher") {
    return (
      <div className="page result-page p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher: Set Answer Key</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium">Select Quiz</label>
          <select
            value={selectedQuiz || ""}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedQuiz(id);
              if (id) loadQuestions(id);
            }}
            className="border px-2 py-1"
          >
            <option value="">-- select --</option>
            {quizzes.map((q) => (
              <option key={q._id || q.id} value={q._id || q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        {questions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <ul className="space-y-3">
              {questions.map((q) => (
                <li key={q._id || q.id} className="p-3 bg-white rounded shadow">
                  <div className="font-medium">{q.text}</div>
                  <div className="mt-2 space-y-1">
                    {(q.options || []).map((opt, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q._id || q.id}`}
                          checked={q.correctIndex === i}
                          onChange={() =>
                            updateQuestion(q._id || q.id, { correctIndex: i })
                          }
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <button
                className="btn-primary mr-2"
                onClick={saveAll}
                disabled={loading}
              >
                Save All
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student view: show immediate result if provided in state
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
