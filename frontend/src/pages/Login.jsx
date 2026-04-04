import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { id, password });

      const token = res?.data?.token;
      const user = res?.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user && auth?.login) {
        auth.login(user);
      }

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="ID"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}