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
          {/* Hero Section - Black & White Version */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Text */}
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-tight mb-6">
                    Create Engaging Quizzes.
                    <br />
                    Measure Real Learning.
                  </h1>

                  <p className="text-lg text-gray-600 mb-6 max-w-xl">
                    The all-in-one quiz platform where teachers build smarter
                    assessments in minutes and students learn through timed,
                    interactive challenges. Auto-scoring, leaderboards, and
                    detailed analytics included.
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 transition-colors"
                    >
                      For Teachers
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-3 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-50 transition-colors"
                    >
                      For Students
                    </Link>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-black">✓</span>
                      50,000+ quizzes created
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black">✓</span>
                      Instant auto-grading
                    </div>
                  </div>
                </div>

                {/* Right: Visual card - Black & White Version */}
                <div className="flex justify-center md:justify-end">
                  <div className="relative w-full max-w-md">
                    <div className="rounded-2xl p-6 bg-gray-900 text-white shadow-xl">
                      <div className="bg-gray-800 rounded-xl p-4 mb-6">
                        <div className="text-sm opacity-80">Active Quiz</div>
                        <div className="text-lg font-semibold mt-1">
                          General Knowledge Quiz
                        </div>
                        <div className="text-sm opacity-70">
                          Question 3 of 10
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                              🏆
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                Leaderboard
                              </div>
                            </div>
                          </div>
                        </div>

                        <ul className="space-y-3 text-sm opacity-90">
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gray-700 text-xs flex items-center justify-center">
                                1
                              </div>
                              Alice Johnson
                            </div>
                            <div>98%</div>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gray-700 text-xs flex items-center justify-center">
                                2
                              </div>
                              Bob Smith
                            </div>
                            <div>95%</div>
                          </li>
                          <li className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gray-700 text-xs flex items-center justify-center">
                                3
                              </div>
                              Charlie Davis
                            </div>
                            <div>92%</div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="absolute -bottom-6 left-6 bg-white border border-gray-200 rounded-lg shadow p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-sm">100%</div>
                        <div className="text-xs text-gray-600">Auto-Graded</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid: Everything You Need to Succeed */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-2 text-black">
                Everything You Need to Succeed
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                Powerful features designed for both teachers and students to
                make learning engaging and effective.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📚</div>
                    <div>
                      <h3 className="font-semibold text-black">Question Bank</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Build and manage your own library of questions. Reuse
                        across multiple quizzes and organize by category.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">⏱️</div>
                    <div>
                      <h3 className="font-semibold text-black">Smart Timer</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Set time limits for quizzes. Students see a live
                        countdown timer that keeps them focused and engaged.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-black">Auto-Scoring</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Instant grading for objective questions. No manual work
                        required—results appear immediately after submission.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h3 className="font-semibold text-black">Leaderboard</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Gamify learning with competitive leaderboards. Students
                        can see how they rank and stay motivated to improve.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="font-semibold text-black">Score Analytics</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Track student performance over time. Detailed history
                        and insights help identify strengths and weaknesses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 6 */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🛡️</div>
                    <div>
                      <h3 className="font-semibold text-black">Secure Access</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Role-based authentication ensures teachers and students
                        have appropriate access and data protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3-step divider */}
          <section className="flex items-center justify-center py-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black">
                  1
                </div>
                <div className="mt-2 text-black">Create</div>
                <div className="text-sm text-gray-600">
                  Build quiz in minutes
                </div>
              </div>
              <div className="w-24" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black">
                  2
                </div>
                <div className="mt-2 text-black">Share</div>
                <div className="text-sm text-gray-600">Send code to class</div>
              </div>
              <div className="w-24" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black">
                  3
                </div>
                <div className="mt-2 text-black">Play</div>
                <div className="text-sm text-gray-600">
                  Get results instantly
                </div>
              </div>
            </div>
          </section>

          {/* Teacher & Student Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            {/* Teacher Card */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                <div className="flex justify-center">
                  <img
                    src={teacherImg}
                    alt="Teacher"
                    className="w-40 h-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-black">For Teachers</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create, manage, and monitor quizzes with powerful admin tools.
                  </p>
                  <ul className="space-y-2 text-gray-600 list-inside text-sm">
                    <li>
                      <strong className="text-black">Build Custom Quizzes:</strong> Set title, duration, rules, and questions
                    </li>
                    <li>
                      <strong className="text-black">Manage Question Bank:</strong> Add, edit, delete, and organize questions
                    </li>
                    <li>
                      <strong className="text-black">Monitor Performance:</strong> Track participation and score records
                    </li>
                    <li>
                      <strong className="text-black">Zero Grading Work:</strong> Automatic scoring saves hours per week
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Student Card */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                <div className="flex justify-center">
                  <img
                    src={studentImg}
                    alt="Student"
                    className="w-40 h-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-black">For Students</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Take quizzes, compete, and track your learning progress.
                  </p>
                  <ul className="space-y-2 text-gray-600 list-inside text-sm">
                    <li>
                      <strong className="text-black">Timed Challenges:</strong> Complete quizzes within fixed time limits
                    </li>
                    <li>
                      <strong className="text-black">Instant Results:</strong> See your score immediately after submission
                    </li>
                    <li>
                      <strong className="text-black">Track Your Progress:</strong> View complete score history and analytics
                    </li>
                    <li>
                      <strong className="text-black">Compete & Win:</strong> Climb the leaderboard and challenge peers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Integrated */}
          <section className="py-12">
            <div className="bg-black text-white rounded-lg">
              <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Assessments?
                </h2>
                <p className="text-lg md:text-xl mb-6 opacity-80">
                  Join thousands of educators and students using Quizly to make
                  learning more engaging.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link
                    to="/register"
                    className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                  >
                    Get Started as Teacher
                  </Link>
                  <Link
                    to="/register"
                    className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                  >
                    Join as Student
                  </Link>
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