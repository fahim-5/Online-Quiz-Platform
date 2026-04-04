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

  // No guest join-by-code: users must login first.

  // Guest landing page (black & white)
  if (!user) {
    return (
      <div className="min-h-screen bg-white text-black">
        <main className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Run quizzes. Track results. Simple.
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Please login to continue.
            </p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <Link
                to="/login"
                className="px-6 py-3 bg-black text-white rounded-md hover:opacity-90"
              >
                Teacher
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-black rounded-md"
              >
                Student
              </Link>
            </div>
          </section>

          {/* 3-step divider */}
          <section className="flex items-center justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                  1
                </div>
                <div className="mt-2">Create</div>
                <div className="text-sm text-gray-600">
                  Build quiz in minutes
                </div>
              </div>
              <div className="w-24" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                  2
                </div>
                <div className="mt-2">Share</div>
                <div className="text-sm text-gray-600">Send code to class</div>
              </div>
              <div className="w-24" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                  3
                </div>
                <div className="mt-2">Play</div>
                <div className="text-sm text-gray-600">
                  Get results instantly
                </div>
              </div>
            </div>
          </section>

          {/* Features */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            {/* Teacher Card */}
            <div className="border border-black p-6 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                {/* Image */}
                <div className="flex justify-center">
                  <img
                    src={teacherImg}
                    alt="Teacher"
                    className="w-40 h-auto object-contain"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-xl mb-3">For Teachers</h3>

                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> Create quizzes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> Add questions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> CSV reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> Auto-grading
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Student Card */}
            <div className="border border-black p-6 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                {/* Image */}
                <div className="flex justify-center">
                  <img
                    src={studentImg}
                    alt="Student"
                    className="w-40 h-auto object-contain"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-xl mb-3">For Students</h3>

                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> Timed quizzes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold">✓</span> See score
                    </li>
                    <li className="flex items-center gap-2">
                      ✓  Works on phone
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
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
              className="border border-black text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Create Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            Total Quizzes
            <br />
            <span className="text-2xl font-bold text-black">
              {quizzes.length}
            </span>
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
                  className="p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <h4 className="font-semibold text-black">{q.title}</h4>
                  <p className="text-sm text-gray-700">{q.description}</p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      to={`/teacher`}
                      className="border border-black text-black px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition-colors"
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
