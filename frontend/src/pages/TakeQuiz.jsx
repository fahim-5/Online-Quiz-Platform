import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Timer from "../components/Timer";

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [qRes, qsRes] = await Promise.all([
          api.get(`/quizzes/${id}`),
          api.get(`/questions/quiz/${id}`),
        ]);
        setQuiz(qRes.data.quiz || qRes.data);
        setQuestions(qsRes.data.questions || qsRes.data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // No automatic draft on mount. User must press Start when allowed.

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((a) => ({ ...a, [questionId]: optionIndex }));
  };

  const submitAnswers = async () => {
    const payload = {
      quiz: id,
      answers: Object.entries(answers)
        .filter(([k]) => k !== "__resultId")
        .map(([question, answerIndex]) => ({
          question,
          answerIndex: Number(answerIndex),
        })),
      resultId: answers.__resultId,
    };

    try {
      const res = await api.post("/results", payload);
      const result = res.data.result || res.data;
      navigate("/result", {
        state: {
          score: result.score,
          total: result.total,
          resultId: result._id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) return <div>Loading quiz...</div>;

  const [canStart, setCanStart] = useState(false);
  const [countdownToStart, setCountdownToStart] = useState(null);
  const [started, setStarted] = useState(false);
  const [examSeconds, setExamSeconds] = useState(quiz?.timeLimit || 300);

  useEffect(() => {
    if (!quiz) return;
    const now = Date.now();
    if (quiz.startFrom) {
      const startAt = new Date(quiz.startFrom).getTime();
      if (now < startAt) {
        setCanStart(false);
        setCountdownToStart(Math.ceil((startAt - now) / 1000));
        return;
      }
    }
    setCanStart(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  // Start the quiz (create draft and begin exam timer)
  const startQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/results/start`, { quiz: id });
      const draft = res.data.result || res.data;
      if (draft && draft._id)
        setAnswers((a) => ({ ...a, __resultId: draft._id }));
      setStarted(true);
      setExamSeconds(quiz?.timeLimit || 300);
    } catch (err) {
      console.error("Failed to create draft result:", err);
      setError(
        err?.response?.data?.message || err.message || "Cannot start quiz",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page take-quiz-page p-6">
      {/* Header with title, progress and timer/submit */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h2>
            <div className="mt-2 flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {Object.keys(answers).filter((k) => k !== "__resultId").length}{" "}
                of {questions.length} answered
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-blue-700"
                  style={{
                    width: `${questions.length ? (Object.keys(answers).filter((k) => k !== "__resultId").length / questions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              {!started && countdownToStart ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Opens in</div>
                  <Timer
                    initialSeconds={countdownToStart}
                    onExpire={() => setCanStart(true)}
                  />
                </div>
              ) : !started ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Ready to start</div>
                  <button
                    onClick={startQuiz}
                    className="px-4 py-2 bg-blue-900 text-white rounded shadow"
                    disabled={!canStart || loading}
                  >
                    Start Quiz
                  </button>
                </div>
              ) : (
                <Timer initialSeconds={examSeconds} onExpire={submitAnswers} />
              )}
            </div>

            {started && (
              <button
                onClick={submitAnswers}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>

      {started && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                    Question {idx + 1}
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                    {quiz?.category || q.category || "General"}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {q.points || 1} points
                </div>
              </div>

              <div className="mt-3 font-semibold text-gray-800">{q.text}</div>

              <div className="mt-4 space-y-3">
                {(q.options || []).map((opt, oi) => (
                  <label
                    key={oi}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm"
                  >
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === oi}
                      onChange={() => handleSelect(q._id, oi)}
                      className="h-4 w-4"
                    />
                    <div className="text-gray-700">{opt.text}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-center">
            <button
              onClick={submitAnswers}
              className="px-6 py-3 bg-black text-white rounded-lg text-lg"
            >
              Submit Quiz (
              {Object.keys(answers).filter((k) => k !== "__resultId").length}/
              {questions.length} answered)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
