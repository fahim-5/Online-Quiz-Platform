import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function QuestionForm({ onSubmit, initial = null }) {
  const [text, setText] = useState(initial?.text || "");
  const [options, setOptions] = useState(
    initial?.options || [{ text: "" }, { text: "" }],
  );
  const [correctIndex, setCorrectIndex] = useState(
    initial?.correctIndex !== undefined ? initial.correctIndex : null,
  );
  const [points, setPoints] = useState(initial?.points ?? 1);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (initial) {
      setText(initial.text || "");
      setOptions(initial.options || [{ text: "" }, { text: "" }]);
      setCorrectIndex(
        initial.correctIndex !== undefined ? initial.correctIndex : null,
      );
      setPoints(initial.points ?? 1);
      setValidationError(null);
    }
  }, [initial]);

  const updateOption = (idx, value) => {
    setOptions((o) => {
      const copy = [...o];
      copy[idx] = { text: value };
      return copy;
    });
  };

  const addOption = () => setOptions((o) => [...o, { text: "" }]);
  const removeOption = (idx) =>
    setOptions((o) => o.filter((_, i) => i !== idx));

  const submit = (e) => {
    e && e.preventDefault();
    // Validation: at least 2 non-empty options and a selected correctIndex
    const filledOptions = options.map((o) => (o.text || "").trim());
    if (filledOptions.length < 2 || filledOptions.filter(Boolean).length < 2) {
      setValidationError("Please provide at least two options with text.");
      return;
    }
    if (correctIndex === null || correctIndex === undefined) {
      setValidationError("Please select the correct answer.");
      return;
    }

    setValidationError(null);
    onSubmit({
      text,
      options,
      correctIndex: Number(correctIndex),
      points: Number(points),
    });
    setText("");
    setOptions([{ text: "" }, { text: "" }]);
    setCorrectIndex(null);
    setPoints(1);
  };

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded shadow space-y-3">
      <div>
        <label className="block text-sm font-medium">Question</label>
        <textarea
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Options</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center mt-2">
            <input
              type="radio"
              name="correct"
              checked={correctIndex !== null && Number(correctIndex) === i}
              onChange={() => setCorrectIndex(i)}
            />
            <input
              value={opt.text}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1 border px-2 py-1"
            />
            {options.length > 2 && (
              <button
                type="button"
                className="text-red-600"
                onClick={() => removeOption(i)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="mt-2">
          <button type="button" onClick={addOption} className="text-blue-600">
            Add option
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Points</label>
          <input
            type="number"
            value={points}
            min={0}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full border px-2 py-1"
          />
        </div>
      </div>
      <div>
        <div>
          {validationError && (
            <div className="text-red-600 mb-2">{validationError}</div>
          )}
          <button type="submit" className="btn-primary">
            Save Question
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ManageQuestions() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quizRes, qRes] = await Promise.allSettled([
        api.get(`/quizzes/${quizId}`),
        api.get(`/questions/quiz/${quizId}`),
      ]);
      if (quizRes.status === "fulfilled")
        setQuiz(quizRes.value.data.quiz || quizRes.value.data);
      if (qRes.status === "fulfilled")
        setQuestions(qRes.value.data.questions || qRes.value.data);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (payload) => {
    try {
      setLoading(true);
      const body = { ...payload, quiz: quizId };
      const res = await api.post(`/questions`, body);
      // POST returns created question with correctIndex; append to list
      setQuestions((s) => [res.data.question, ...s]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (qid, payload) => {
    try {
      setLoading(true);
      await api.put(`/questions/${qid}`, payload);
      // Optimistic: refetch list
      await fetchData();
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (qid) => {
    if (!confirm("Delete this question?")) return;
    try {
      setLoading(true);
      await api.delete(`/questions/${qid}`);
      setQuestions((s) => s.filter((q) => (q._id || q.id) !== qid));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <div className="p-6">Please log in to manage questions.</div>;
  if (user.role !== "teacher")
    return (
      <div className="p-6 text-red-600">Access denied - teacher only.</div>
    );

  return (
    <div className="page p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Questions</h2>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600">
          Back
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Quiz</h3>
        <div className="p-3 bg-white rounded shadow mt-2">
          <div className="font-medium">{quiz?.title || `Quiz ${quizId}`}</div>
          <div className="text-sm text-gray-500">
            Duration: {quiz?.timeLimit || "—"}s
          </div>
          <div className="text-sm text-gray-500">
            Rules: {quiz?.rules || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Add New Question</h3>
          <QuestionForm onSubmit={createQuestion} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          {questions.length === 0 ? (
            <p className="text-gray-500">No questions yet.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((q) => (
                <li key={q._id || q.id} className="p-3 bg-white rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{q.text}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {q.options?.map((o, i) => (
                          <div key={i}>
                            {i + 1}. {o.text}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-gray-500">
                        Points: {q.points ?? 1}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(q)}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(q._id || q.id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {editing && (
            <div className="mt-4">
              <h4 className="font-semibold">Edit Question</h4>
              <QuestionForm
                initial={editing}
                onSubmit={(data) =>
                  updateQuestion(editing._id || editing.id, data)
                }
              />
              <div className="mt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
