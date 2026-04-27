import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import QuizCard from "../components/QuizCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // If teacher, request only their quizzes and include all statuses
        const quizUrl =
          user && user.role === "teacher"
            ? "/quizzes?all=true&mine=true"
            : "/quizzes";
        const [qRes, rRes] = await Promise.all([
          api.get(quizUrl),
          api.get("/results"),
        ]);
        if (!mounted) return;
        setQuizzes(qRes.data.quizzes || qRes.data || []);
        setResults(rRes.data || []);
        // load subjects for teacher view
        if (user && user.role === "teacher") {
          try {
            const sRes = await api.get("/subjects");
            if (mounted) setSubjects(sRes.data.subjects || []);
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // Fallback: if results endpoint not available, still load quizzes
        try {
          const qOnly = await api.get(
            user && user.role === "teacher"
              ? "/quizzes?all=true&mine=true"
              : "/quizzes",
          );
          if (mounted) setQuizzes(qOnly.data.quizzes || qOnly.data || []);
        } catch (err) {
          // ignore — show empty state
        }
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const quizzesTaken = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((s, r) => s + (r.score || 0), 0) / results.length,
        )
      : 0;
  const bestScore =
    results.length > 0 ? Math.max(...results.map((r) => r.score || 0)) : 0;
  const timeSpent = results.reduce((s, r) => s + (r.timeSpentMinutes || 0), 0);

  function handleStart(quiz) {
    navigate(`/quiz/${quiz._id}`);
  }

  return (
    <div className="page dashboard-page p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">
              Welcome back, {user?.name || user?.username || "Student"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to test your knowledge? Choose a quiz below to get started.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-lg">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Quizzes Taken</div>
                <div className="text-xl font-bold">{quizzesTaken}</div>
                <div className="text-xs text-gray-400">
                  {Math.max(0, quizzes.length - quizzesTaken)} remaining
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="p-2 bg-indigo-600 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Average Score</div>
                <div className="text-xl font-bold">{averageScore}%</div>
                <div className="w-36 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${averageScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="p-2 bg-green-50 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Best Score</div>
                <div className="text-xl font-bold">{bestScore}%</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
              <div className="p-2 bg-yellow-50 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Time Spent</div>
                <div className="text-xl font-bold">{timeSpent}</div>
                <div className="text-xs text-gray-400">minutes total</div>
              </div>
            </div>
          </div>
        </header>

        {user && user.role === "teacher" ? (
          <>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Quizzes</h2>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-gray-600"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quizzes.length === 0 && (
                  <div className="col-span-full p-6 bg-white rounded shadow">
                    No quizzes available yet.
                  </div>
                )}
                {quizzes.slice(0, 4).map((q) => (
                  <div key={q._id} className="">
                    <QuizCard quiz={q} onStart={() => handleStart(q)} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Courses</h2>
                <button
                  onClick={() => navigate("/teacher/courses")}
                  className="text-sm text-gray-600"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {subjects.length === 0 && (
                  <div className="col-span-full p-6 bg-white rounded shadow">
                    No courses yet.
                  </div>
                )}
                {subjects
                  .filter(
                    (s) =>
                      String(s.createdBy?._id || s.createdBy || "") ===
                      String(user._id),
                  )
                  .slice(0, 4)
                  .map((s) => (
                    <div
                      key={s._id}
                      className="p-4 bg-white rounded shadow flex flex-col"
                    >
                      <div className="text-sm text-gray-500">{s.code}</div>
                      <div className="font-semibold text-black">{s.name}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Enroll key: {s.enrollKey || "—"}
                      </div>
                      {s.createdBy && (
                        <div className="text-xs text-gray-500 mt-2">
                          Owner: {s.createdBy.name || s.createdBy.identifier}
                        </div>
                      )}
                      <div className="mt-4">
                        <button
                          onClick={() => navigate(`/teacher/courses/${s._id}`)}
                          className="text-sm px-3 py-1 border rounded"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quizzes.length === 0 && (
                <div className="col-span-full p-6 bg-white rounded shadow">
                  No quizzes available yet.
                </div>
              )}
              {quizzes.map((q) => (
                <div key={q._id} className="">
                  <QuizCard quiz={q} onStart={() => handleStart(q)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
