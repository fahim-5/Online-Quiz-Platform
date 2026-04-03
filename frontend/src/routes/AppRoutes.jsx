import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TakeQuiz from "../pages/TakeQuiz";
import Result from "../pages/Result";
import AdminPanel from "../pages/AdminPanel";
import ManageQuestions from "../pages/ManageQuestions";
import ResultsHistory from "../pages/ResultsHistory";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz/:id" element={<TakeQuiz />} />
      <Route path="/result" element={<Result />} />
      <Route path="/results" element={<ResultsHistory />} />
      <Route path="/teacher" element={<AdminPanel />} />
      <Route path="/teacher/quiz/:id" element={<ManageQuestions />} />
    </Routes>
  );
}
