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
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h2>
        {!started && (
          <div className="mt-2">
            {countdownToStart ? (
              <div>
                <div>Quiz opens in:</div>
                <Timer
                  initialSeconds={countdownToStart}
                  onExpire={() => setCanStart(true)}
                />
                <div className="text-sm text-gray-500">
                  You will be able to open the quiz when the timer ends.
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500">
                  You can start this quiz now.
                </div>
                <button
                  onClick={startQuiz}
                  className="btn-primary mt-2"
                  disabled={!canStart || loading}
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        )}
        {started && (
          <Timer initialSeconds={examSeconds} onExpire={submitAnswers} />
        )}
      </div>

      {started && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q._id} className="p-4 border rounded">
              <div className="font-semibold">
                {idx + 1}. {q.text}
              </div>
              <div className="mt-2 space-y-1">
                {(q.options || []).map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === oi}
                      onChange={() => handleSelect(q._id, oi)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4">
            <button onClick={submitAnswers} className="btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
