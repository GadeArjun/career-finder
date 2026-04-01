import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import { Cpu, ShieldCheck, ArrowRight, Lock } from "lucide-react";

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
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-poppins relative overflow-hidden">
      {/* ===== Background Aesthetic ===== */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>

      {/* ===== Header ===== */}
      <header className="w-full backdrop-blur-md bg-slate-950/60 border-b border-white/5 py-4 px-8 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
            <Cpu size={20} className="text-cyan-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            CareerFinder<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors"
        >
          RETURN_TO_SYSTEM
        </Link>
      </header>

      {/* ===== Main Form ===== */}
      <main className="flex flex-1 justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                <ShieldCheck size={12} /> Secure Portal
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm">
                Verify your identity to access your 6D Roadmap.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1"
                >
                  System ID (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  required
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all placeholder:text-slate-700"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    Access Key
                  </label>
                  <Link
                    to="/forgot-password"
                    size={14}
                    className="text-[10px] text-cyan-500 hover:underline"
                  >
                    Reset Key?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all placeholder:text-slate-700"
                  />
                  <Lock
                    className="absolute right-4 top-4 text-slate-700"
                    size={18}
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    Initialize Session{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-sm">
                New to the platform?{" "}
                <Link
                  to="/register"
                  className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                >
                  Create Vector Profile
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-[10px] text-slate-700 px-10">
              Authorized access only. All login attempts are logged for system
              integrity via smart-ranking algorithms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
