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

  // Create a draft result when quiz starts to record start time for server-side time enforcement
  useEffect(() => {
    const start = async () => {
      try {
        const res = await api.post(`/results/start`, { quiz: id });
        const draft = res.data.result || res.data;
        if (draft && draft._id)
          setAnswers((a) => ({ ...a, __resultId: draft._id }));
      } catch (err) {
        console.error("Failed to create draft result:", err);
      }
    };
    start();
  }, [id]);

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

  const initialSeconds = quiz?.timeLimit || 300;

  return (
    <div className="page take-quiz-page p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h2>
        <Timer initialSeconds={initialSeconds} onExpire={submitAnswers} />
      </div>

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
      </div>

      <div className="mt-4">
        <button onClick={submitAnswers} className="btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
}
