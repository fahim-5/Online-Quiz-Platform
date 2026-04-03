import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import QuizCard from "../components/QuizCard";
import api from "../services/api";

const Home = () => {
  const auth = useAuth();
  const user = auth?.user || null;
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await api.get("/quizzes");
        setQuizzes(res.data.quizzes || res.data || []);
      } catch (err) {
        setQuizzes([
          {
            _id: "q1",
            title: "Sample Quiz 1",
            description: "A short sample quiz",
          },
          {
            _id: "q2",
            title: "Sample Quiz 2",
            description: "Intermediate quiz",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Quizly</h1>
          <p className="text-lg text-gray-600 mb-6">
            Sign in or register to start taking quizzes or create them as a
            teacher.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary px-6 py-3">
              Login
            </Link>
            <Link to="/register" className="btn-secondary px-6 py-3">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "teacher") {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/teacher" className="btn-primary">
              Manage Quizzes
            </Link>
            <Link to="/teacher" className="btn-secondary">
              Create Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            Total Quizzes
            <br />
            <span className="text-2xl font-bold">{quizzes.length}</span>
          </div>
          <div className="card p-4">
            Active Students
            <br />
            <span className="text-2xl font-bold">—</span>
          </div>
          <div className="card p-4">
            Recent Results
            <br />
            <span className="text-2xl font-bold">—</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Your Quizzes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              quizzes.map((q) => (
                <div key={q._id} className="p-4 border rounded">
                  <h4 className="font-semibold">{q.title}</h4>
                  <p className="text-sm text-gray-600">{q.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Link to={`/teacher`} className="btn-secondary text-sm">
                      Edit
                    </Link>
                    <button className="btn-primary text-sm">
                      View Results
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Available Quizzes</h2>
        <div>
          Welcome, <strong>{user.name || user.identifier || user._id}</strong>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Loading quizzes...</div>
        ) : (
          quizzes.map((q) => (
            <QuizCard
              key={q._id}
              title={q.title}
              description={q.description}
              onStart={() => navigate(`/quiz/${q._id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
