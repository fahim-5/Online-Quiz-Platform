import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import QuizCard from "../components/QuizCard";
import api from "../services/api";
import teacherImg from "../assets/images/Teacher.png";
import studentImg from "../assets/images/Student.png";

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
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Guest view: allow unauthenticated visitors to see and start available quizzes
  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <main className="flex-grow">
          <div className="max-w-6xl mx-auto px-6 py-20">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Run quizzes. Track results. Simple.
              </h1>
              <p className="mt-4 text-gray-600">Please login to continue.</p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/login?role=teacher")}
                  className="bg-black text-white px-6 py-3 rounded-md font-medium"
                >
                  Teacher
                </button>
                <button
                  onClick={() => navigate("/login?role=student")}
                  className="border border-gray-300 text-black px-6 py-3 rounded-md font-medium hover:bg-gray-50"
                >
                  Student
                </button>
              </div>

              {/* Three step features */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold">
                    1
                  </div>
                  <h4 className="mt-4 font-semibold">Create</h4>
                  <p className="text-sm text-gray-600">Build quiz in minutes</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold">
                    2
                  </div>
                  <h4 className="mt-4 font-semibold">Share</h4>
                  <p className="text-sm text-gray-600">Send code to class</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold">
                    3
                  </div>
                  <h4 className="mt-4 font-semibold">Play</h4>
                  <p className="text-sm text-gray-600">Get results instantly</p>
                </div>
              </div>

              {/* Teacher / Student boxes */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">For Teachers</h3>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>Create quizzes</li>
                    <li>Add questions</li>
                    <li>CSV reports</li>
                    <li>Auto-grading</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">For Students</h3>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>Timed quizzes</li>
                    <li>See score</li>
                    <li>Works on phone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Teacher dashboard
  if (user.role === "teacher") {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Teacher Dashboard</h2>
          <div className="flex gap-2">
            <Link
              to="/teacher"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Manage Quizzes
            </Link>
            <Link
              to="/teacher"
              className="border border-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Create Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <span className="text-gray-600">Total Quizzes</span>
            <br />
            <span className="text-2xl font-bold text-black">
              {quizzes.length}
            </span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <span className="text-gray-600">Active Students</span>
            <br />
            <span className="text-2xl font-bold text-black">—</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <span className="text-gray-600">Recent Results</span>
            <br />
            <span className="text-2xl font-bold text-black">—</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">
            Your Quizzes
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="text-black">Loading...</div>
            ) : (
              quizzes.map((q) => (
                <div
                  key={q._id}
                  className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                >
                  <h4 className="font-semibold text-black">{q.title}</h4>
                  <p className="text-sm text-gray-600">{q.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      to={`/teacher`}
                      className="border border-gray-300 text-black px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition-colors"
                    >
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

  // Student dashboard
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
