import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useUserContext();

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
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        formData
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      await loginUser(user, token);

      setLoading(false);

      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "college") navigate("/college/dashboard");
      else if (user.role === "company") navigate("/company/dashboard");
      else navigate("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
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
        {/* Decorative glow orbs */}
        <div className="absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-orange-500/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"></div>

        <div className="w-full max-w-md bg-gradient-to-br from-gray-800/90 via-blue-900/40 to-gray-900 border border-blue-500/20 rounded-2xl shadow-lg backdrop-blur-md p-8 flex flex-col gap-6 hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Login to Your Account
          </h2>

          {error && (
            <div
              id="error-message"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white text-sm p-2 rounded-md shadow-md text-center"
            >
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-gray-300 font-medium tracking-wide"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none placeholder-gray-400 text-gray-100 transition-all duration-200"
                id="email"
                data-testid="email-input"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-gray-300 font-medium tracking-wide"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none placeholder-gray-400 text-gray-100 transition-all duration-200"
                id="password"
                data-testid="password-input"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 px-4 py-3 bg-gradient-to-r from-blue-600 via-yellow-400 to-orange-500 text-white rounded-lg font-semibold tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
