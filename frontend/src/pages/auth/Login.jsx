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

      // Store JWT token in localStorage (or cookies for production)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      await loginUser(user, token);

      setLoading(false);

      // Redirect based on role
      if (user.role === "student") navigate("/student/dashboard");
      else if (user.role === "college") navigate("/college/dashboard");
      else navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
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
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-500 text-white text-sm p-2 rounded">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-lg font-semibold hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#3B82F6] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
