import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import DashboardStats from "../components/DashboardStats";
import QuizzesTable from "../components/QuizzesTable";
import UsersTable from "../components/UsersTable";
import TeacherAnalytics from "../components/AdminAnalytics";

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ users: 0, quizzes: 0, results: 0 });
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [lastDeleted, setLastDeleted] = useState(null); // { id, title }
  const [showCreate, setShowCreate] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    timeLimit: 300,
    rules: "",
  });

  useEffect(() => {
    if (!user) return; // wait for auth
    if (user && user.role !== "teacher") return; // don't fetch if not teacher
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try fetching users, quizzes, results counts. Endpoints may vary; handle failures gracefully.
      const [usersRes, quizzesRes, resultsRes] = await Promise.allSettled([
        api.get("/users"),
        api.get("/quizzes"),
        api.get("/results"),
      ]);

      if (
        usersRes.status === "fulfilled" &&
        Array.isArray(usersRes.value.data)
      ) {
        setUsers(usersRes.value.data);
        setStats((s) => ({ ...s, users: usersRes.value.data.length }));
      }

      if (quizzesRes.status === "fulfilled") {
        const data = quizzesRes.value.data;
        const list = Array.isArray(data)
          ? data
          : data?.quizzes || data?.results || [];
        setQuizzes(list);
        setStats((s) => ({ ...s, quizzes: list.length }));
      }

      if (resultsRes.status === "fulfilled") {
        // results endpoint might return array or object with meta
        const data = resultsRes.value.data;
        const count = Array.isArray(data) ? data.length : data.count || 0;
        setStats((s) => ({ ...s, results: count }));
      }
    } catch (err) {
      setError(err.message || "Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    // TODO: open quiz editor modal or navigate to edit page
    navigate(`/quiz/${quiz._id || quiz.id}`);
  };

  const handleManageQuiz = (quiz) => {
    navigate(`/teacher/quiz/${quiz._id || quiz.id}`);
  };

  const handleCreateQuiz = async (e) => {
    e && e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = {
        title: newQuiz.title,
        description: newQuiz.description,
        timeLimit: Number(newQuiz.timeLimit) || 0,
        rules: newQuiz.rules,
      };
      await api.post("/quizzes", payload);
      setNewQuiz({ title: "", description: "", timeLimit: 300, rules: "" });
      setShowCreate(false);
      await fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quiz) => {
    if (!confirm("Delete this quiz? You can undo within 30s.")) return;
    try {
      setLoading(true);
      await api.delete(`/quizzes/${quiz._id || quiz.id}`);
      setLastDeleted({ id: quiz._id || quiz.id, title: quiz.title });
      // refresh list to reflect removal
      await fetchAll();
      // clear undo option after 30s
      setTimeout(() => setLastDeleted(null), 30000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!lastDeleted) return;
    try {
      setLoading(true);
      await api.post(`/quizzes/${lastDeleted.id}/undo`);
      setLastDeleted(null);
      await fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Undo failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userObj) => {
    if (!confirm(`Promote ${userObj.email || userObj.name} to teacher?`))
      return;
    try {
      setLoading(true);
      await api.put(`/users/${userObj._id || userObj.id}`, { role: "teacher" });
      await fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Promote failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userObj) => {
    if (!confirm(`Deactivate ${userObj.email || userObj.name}?`)) return;
    try {
      setLoading(true);
      await api.delete(`/users/${userObj._id || userObj.id}`);
      await fetchAll();
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Deactivate failed",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page teacher-page p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher Panel</h2>
        <p className="mb-4">Please log in to access the teacher panel.</p>
        <button
          className="btn bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (user.role !== "teacher") {
    return (
      <div className="page teacher-page p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher Panel</h2>
        <p className="text-red-600">Access denied — teacher role required.</p>
      </div>
    );
  }

  return (
    <div className="page teacher-page p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Teacher Panel</h2>
        <div>
          <button
            className="btn bg-gray-200 px-3 py-1 rounded mr-2"
            onClick={fetchAll}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            className="btn bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? "Cancel" : "Create Quiz"}
          </button>
        </div>
      </div>

      {loading && <p>Loading teacher data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <DashboardStats stats={stats} />

      {showCreate && (
        <div className="mb-6 p-4 border rounded bg-white">
          <h3 className="text-lg font-semibold mb-2">Create New Quiz</h3>
          <form onSubmit={handleCreateQuiz} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                className="w-full border px-2 py-1"
                value={newQuiz.title}
                onChange={(e) =>
                  setNewQuiz((n) => ({ ...n, title: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full border px-2 py-1"
                value={newQuiz.description}
                onChange={(e) =>
                  setNewQuiz((n) => ({ ...n, description: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  className="w-full border px-2 py-1"
                  value={newQuiz.timeLimit}
                  onChange={(e) =>
                    setNewQuiz((n) => ({ ...n, timeLimit: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rules</label>
                <input
                  className="w-full border px-2 py-1"
                  value={newQuiz.rules}
                  onChange={(e) =>
                    setNewQuiz((n) => ({ ...n, rules: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <button type="submit" className="btn-primary" disabled={loading}>
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <QuizzesTable
              quizzes={quizzes.slice(0, 10)}
              onEdit={handleEditQuiz}
              onDelete={handleDeleteQuiz}
              onManage={handleManageQuiz}
            />
          </div>
          <div>
            <TeacherAnalytics />
          </div>
        </div>
        {lastDeleted && (
          <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            Deleted "{lastDeleted.title}" —{" "}
            <button className="text-blue-600 underline" onClick={handleUndo}>
              Undo
            </button>{" "}
            (30s)
          </div>
        )}
      </div>

      <div>
        <UsersTable
          users={users.slice(0, 12)}
          onPromote={handlePromoteUser}
          onDeactivate={handleDeactivateUser}
        />
      </div>
    </div>
  );
}
