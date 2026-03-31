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
    <div className="page login-page max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          className="w-full border rounded px-3 py-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border rounded px-3 py-2"
        />
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="btn-primary mt-2 w-full py-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
