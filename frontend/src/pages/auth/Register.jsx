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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-gray-100 font-poppins">
      {/* ===== Header ===== */}
      <header className="w-full backdrop-blur-md bg-gray-900/60 border-b border-blue-500/20 shadow-md py-4 px-6 flex justify-between items-center">
        <Link
          to={"/"}
          className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-md"
        >
          CareerGuide+
        </Link>
      </header>

      {/* ===== Main Form ===== */}
      <main className="flex flex-1 justify-center items-center p-6 relative">
        {/* Background glowing orbs */}
        <div className="absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl top-16 left-10 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-orange-500/20 rounded-full blur-3xl bottom-16 right-10 animate-pulse"></div>

        {/* Form Card */}
        <div className="w-full max-w-md bg-gradient-to-br from-gray-800/90 via-blue-900/40 to-gray-900 border border-blue-500/20 rounded-2xl shadow-lg backdrop-blur-md p-8 flex flex-col gap-6 hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Create an Account
          </h2>

          {error && (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm p-2 rounded-md shadow-md text-center">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300 font-medium tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none placeholder-gray-400 text-gray-100 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300 font-medium tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none placeholder-gray-400 text-gray-100 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300 font-medium tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none placeholder-gray-400 text-gray-100 transition-all duration-200"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300 font-medium tracking-wide">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100 transition-all duration-200 outline-none"
              >
                <option value="student">Student</option>
                <option value="college">College</option>
                <option value="company">Company</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 via-yellow-400 to-orange-500 text-white rounded-lg font-semibold tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-gray-400 text-sm text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
