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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">Welcome to Quizly</h1>
          <p className="text-lg text-gray-700 mb-6">
            Sign in or register to start taking quizzes or create them as a
            teacher.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "teacher") {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Teacher Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/teacher" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Manage Quizzes
            </Link>
            <Link to="/teacher" className="border border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
              Create Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            Total Quizzes
            <br />
            <span className="text-2xl font-bold text-black">{quizzes.length}</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            Active Students
            <br />
            <span className="text-2xl font-bold text-black">—</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            Recent Results
            <br />
            <span className="text-2xl font-bold text-black">—</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">Your Quizzes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="text-black">Loading...</div>
            ) : (
              quizzes.map((q) => (
                <div key={q._id} className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h4 className="font-semibold text-black">{q.title}</h4>
                  <p className="text-sm text-gray-700">{q.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Link to={`/teacher`} className="border border-black text-black px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition-colors">
                      Edit
                    </Link>
                    <button className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 transition-colors">
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
    <div className="p-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Available Quizzes</h2>
        <div className="text-black">
          Welcome, <strong>{user.name || user.identifier || user._id}</strong>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-black">Loading quizzes...</div>
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