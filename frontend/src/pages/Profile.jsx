import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users/me");
      setProfile(res.data.data || res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6">No profile data</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Profile</h2>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-700 mr-2"
          >
            Back
          </button>
          <button
            onClick={() => logout && logout()}
            className="text-sm px-3 py-1 border rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl bg-white border rounded-md p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-black">
            {(profile.name || profile.identifier || "U")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-semibold text-black">
              {profile.name || profile.identifier}
            </div>
            <div className="text-sm text-gray-600">{profile.email}</div>
            <div className="text-sm text-gray-600">Role: {profile.role}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Identifier</div>
            <div className="text-sm text-black">{profile.identifier}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Institution</div>
            <div className="text-sm text-black">
              {profile.institution || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Active</div>
            <div className="text-sm text-black">
              {profile.isActive ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Joined</div>
            <div className="text-sm text-black">
              {new Date(profile.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => navigate(`/teacher`)}
            className="px-3 py-1 border rounded-md"
          >
            Manage Quizzes
          </button>
          <button
            onClick={() => navigate(`/teacher/courses`)}
            className="px-3 py-1 border rounded-md"
          >
            My Courses
          </button>
        </div>
      </div>
    </div>
  );
}
