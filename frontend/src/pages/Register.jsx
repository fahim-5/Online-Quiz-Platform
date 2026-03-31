import React, { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call register API
  };

  return (
    <div className="page register-page">
      <h2 className="text-2xl font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
        />
        <button type="submit" className="btn-primary mt-2">
          Register
        </button>
      </form>
    </div>
  );
}
