import React, { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    id: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.id || !form.password)
      return setError("ID and password are required");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        id: form.id,
        password: form.password,
        role: form.role,
      });
      // TODO: redirect to login or dashboard
      alert("Registered");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page register-page max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-700">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">ID</span>
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Enter your ID"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Password</span>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <fieldset className="flex gap-4 items-center">
          <legend className="sr-only">Role</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="student"
              checked={form.role === "student"}
              onChange={handleChange}
            />
            <span className="text-sm">Student</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={form.role === "teacher"}
              onChange={handleChange}
            />
            <span className="text-sm">Teacher</span>
          </label>
        </fieldset>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
