import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth() || {};
  const mobileMenuRef = useRef();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Quizzes", href: "/dashboard" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-black">
                Quizly
              </span>
            </Link>

            {/* Search (desktop) */}
            <div className="hidden lg:block">
              <input
                type="search"
                placeholder="Search quizzes..."
                className="border rounded-md px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 text-black bg-white"
                aria-label="Search quizzes"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? "text-black border-b-2 border-black"
                    : "text-black hover:text-gray-600"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth buttons */}
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm px-3 py-2 text-black hover:text-gray-600"
                >
                  Login
                </Link>
                <Link to="/register" className="text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => alert("Open profile menu")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-black">
                    {(user.name || "U")[0]}
                  </div>
                  <span className="text-sm text-black">{user.name || "User"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    location.pathname === item.href
                      ? "bg-gray-100 text-black"
                      : "text-black hover:bg-gray-50 hover:text-gray-600"
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 border-t pt-2">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base text-black"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block mt-1 px-3 py-2 bg-black text-white rounded-md text-base text-center"
                    >
                      Create account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base text-black"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout && logout();
                        setIsOpen(false);
                      }}
                      className="w-full mt-2 px-3 py-2 text-base text-left text-red-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;