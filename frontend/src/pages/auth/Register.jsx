import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        formData
      );
      console.log(res.data);
      setLoading(false);
      navigate("/login"); // redirect after registration
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-poppins">
      {/* ===== Header ===== */}
      <header className="w-full bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to={"/"} className="font-bold text-xl text-[#60A5FA]">
            CareerGuide+
          </Link>
        </div>
      </header>

      {/* ===== Main Form ===== */}
      <main className="flex flex-1 justify-center items-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-[#3B82F6] text-center">
            Create an Account
          </h2>
          {error && (
            <div className="bg-red-500 text-white text-sm p-2 rounded">
              {error}
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#3B82F6] placeholder-gray-400 text-gray-100"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#3B82F6] placeholder-gray-400 text-gray-100"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#3B82F6] placeholder-gray-400 text-gray-100"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-[#3B82F6] text-gray-100"
              >
                <option value="student">Student</option>
                <option value="college">College</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg font-semibold hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3B82F6] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
