import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function TeacherAnalytics() {
  const [participation, setParticipation] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizStats, setQuizStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/results/teacher/participation");
        setParticipation(res.data.participation || []);
        if (res.data.participation && res.data.participation.length > 0) {
          const q = res.data.participation[0];
          setSelectedQuiz(q.quizId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedQuiz) return;
    const loadQuiz = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        params.set("limit", String(limit));
        params.set("skip", String(page * limit));

        const [lbRes, stRes] = await Promise.all([
          api.get(
            `/results/teacher/leaderboard/${selectedQuiz}?${params.toString()}`,
          ),
          api.get(
            `/results/teacher/quiz/${selectedQuiz}/stats?${params.toString()}`,
          ),
        ]);
        setLeaderboard(lbRes.data.leaderboard || []);
        setQuizStats(stRes.data.stats || null);
      } catch (err) {
        console.error(err);
      }
    };
    loadQuiz();
  }, [selectedQuiz]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="admin-analytics p-4 border rounded bg-white">
      <h3 className="text-lg font-semibold mb-3">Participation & Scores</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium">Quiz</label>
        <select
          className="w-full border p-2"
          value={selectedQuiz || ""}
          onChange={(e) => setSelectedQuiz(e.target.value)}
        >
          {participation.map((p) => (
            <option key={p.quizId} value={p.quizId}>
              {p.title || p.quizId} — {p.attempts} attempts
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <div>
          <label className="block text-sm">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-sm">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-sm">Per page</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(0);
            }}
            className="w-full border p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          className="btn-primary"
          onClick={() => {
            setPage(0);
            /* reload effect */ setSelectedQuiz((s) => s);
          }}
        >
          Apply
        </button>
        <button
          className="btn-secondary"
          onClick={async () => {
            if (!selectedQuiz) return;
            const params = new URLSearchParams();
            if (startDate) params.set("startDate", startDate);
            if (endDate) params.set("endDate", endDate);
            const url = `/results/teacher/quiz/${selectedQuiz}/export?${params.toString()}`;
            try {
              const resp = await api.get(url, { responseType: "blob" });
              const blob = new Blob([resp.data], { type: "text/csv" });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = `leaderboard_${selectedQuiz}.csv`;
              link.click();
            } catch (err) {
              console.error("Export failed", err);
            }
          }}
        >
          Export CSV
        </button>
      </div>

      {quizStats && (
        <div className="mb-3 p-3 bg-gray-50 border rounded">
          <div>
            <strong>Attempts:</strong> {quizStats.attempts}
          </div>
          <div>
            <strong>Average %:</strong> {quizStats.avgPercent}%
          </div>
          <div>
            <strong>Top Score:</strong> {quizStats.topScore}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2">Leaderboard</h4>
        {leaderboard.length === 0 && <div>No entries yet.</div>}
        <ol className="list-decimal pl-6">
          {leaderboard.map((e, i) => (
            <li key={i} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{e.user?.name || "Unknown"}</div>
                  <div className="text-sm text-gray-600">
                    {e.user?.identifier || ""}
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    {e.bestScore} / {e.total}
                  </div>
                  <div className="text-xs text-gray-500">
                    {e.lastTaken ? new Date(e.lastTaken).toLocaleString() : ""}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-2 flex gap-2">
          <button
            className="btn"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <div className="px-2">Page {page + 1}</div>
          <button
            className="btn"
            disabled={leaderboard.length < limit}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
