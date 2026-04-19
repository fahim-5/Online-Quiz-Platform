import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // close the menus when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];
  if (user) navigation.push({ name: "Quizzes", href: "/dashboard" });

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Qizy logo" className="h-12 mr-2 w-auto" />
            </Link>
            <div className="hidden lg:block">
              <input
                type="search"
                placeholder="Search quizzes..."
                className="border rounded-md px-3 py-1 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
                aria-label="Search quizzes"
              />
            </div>
          </div>

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

            {!user ? (
              <div className="flex items-center space-x-2">
                {location.pathname !== "/login" && (
                  <Link
                    to="/login"
                    className="text-sm px-3 py-2 bg-black text-white rounded-md"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== "/register" && (
                  <Link
                    to="/register"
                    className="text-sm px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    Registration
                  </Link>
                )}
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-black">
                    {(user.name || "U")[0]}
                  </div>
                  <span className="text-sm text-black">{user.name || "User"}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout && logout();
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

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
                    {location.pathname !== "/login" && (
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-base text-black text-center"
                      >
                        Login
                      </Link>
                    )}
                    {location.pathname !== "/register" && (
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="block mt-1 px-3 py-2 bg-black text-white rounded-md text-base text-center"
                      >
                        Registration
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base text-black">
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

