const About = () => {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Qizy</h1>
          <p className="text-xl text-gray-600">
            Qizy is an Online Quiz Platform built as a CSE 4165 project —
            create, take, and review timed quizzes.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What you can do
            </h2>
            <ul className="space-y-3">
              <li>
                👨‍💼 Teachers: create, edit, and delete quizzes and questions.
              </li>
              <li>👨‍🎓 Students: take timed quizzes and view past results.</li>
              <li>⏱️ Real-time timers to enforce quiz duration.</li>
              <li>✅ Automatic scoring and result persistence.</li>
              <li>🔐 JWT-based authentication and protected routes.</li>
            </ul>
          </div>

          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tech stack
            </h2>
            <p className="text-gray-600 mb-4">Qizy uses a modern MERN stack:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Frontend: React, Vite, Tailwind CSS</li>
              <li>• Backend: Node.js, Express</li>
              <li>• Database: MongoDB with Mongoose</li>
              <li>• Auth: bcrypt + JWT</li>
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Getting started
            </h2>
            <p className="text-gray-600 mb-4">
              Clone the repository, install dependencies for both `backend` and
              `frontend`, then run the dev servers.
            </p>
            <p className="text-gray-600">
              See the project README for full setup instructions and environment
              variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
