import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-1">
            <Link to="/" className="flex items-center">
              <div
                className="h-8 w-8 bg-indigo-600 rounded-lg"
                aria-hidden="true"
              ></div>
              <span className="ml-3 text-2xl font-extrabold">Qizy</span>
            </Link>
            <p className="text-gray-400 text-base">
              Qizy — an Online Quiz Platform (CSE 4165 project). Create, take,
              and review quizzes with timers and results.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/take-quiz"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Take Quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      to="/admin"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Admin Panel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/README.md"
                      className="text-base text-gray-300 hover:text-white"
                    >
                      Project README
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-start justify-between sm:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Qizy. Built for CSE 4165.
            </p>
            <p className="mt-4 text-sm text-gray-400 sm:mt-0">
              Crafted with React, Vite & Tailwind — MIT Licensed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
