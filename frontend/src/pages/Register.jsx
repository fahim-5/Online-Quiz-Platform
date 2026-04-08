import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/images/logo.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.id || !form.password || !form.email)
      return setError("ID, email and password are required");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        id: form.id,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      // Show success modal then redirect to login on OK
      setShowSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Quizly" className="h-16" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm  text-gray-700 font-medium">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 font-medium">Email</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 font-medium">ID</span>
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="Enter your ID"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 font-medium">Password</span>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700 font-medium">
              Retype Password
            </span>
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Retype password"
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </label>

          <fieldset className="flex gap-6 items-center justify-center">
            <legend className="sr-only">Role</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={form.role === "student"}
                onChange={handleChange}
                className="accent-black focus:ring-black"
              />
              <span className="text-sm text-black">Student</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === "teacher"}
                onChange={handleChange}
                className="accent-black focus:ring-black"
              />
              <span className="text-sm text-black">Teacher</span>
            </label>
          </fieldset>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center mt-3 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-black font-medium underline">
              Login
            </a>
          </div>
        </form>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">
              Registration successful
            </h3>
            <p className="text-sm mb-4">
              Your account has been created successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/login");
                }}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
