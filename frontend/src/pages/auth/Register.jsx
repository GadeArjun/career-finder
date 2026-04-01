import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Cpu,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  UserCircle,
  Mail,
  Lock,
  Briefcase,
} from "lucide-react";

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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        formData
      );
      setLoading(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Registration failed. System capacity reached or invalid data."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-poppins relative overflow-hidden">
      {/* ===== Background Aesthetic ===== */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>

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
          to="/login"
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors"
        >
          ALREADY_REGISTERED?
        </Link>
      </header>

      {/* ===== Main Form ===== */}
      <main className="flex flex-1 justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-lg">
          {/* Form Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                <UserPlus size={12} /> Initialize Profile
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Create Vector Profile
              </h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Join the platform to unlock your personalized 6D Competency
                Roadmap.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Legal Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all"
                  />
                  <UserCircle
                    className="absolute left-4 top-4 text-slate-700"
                    size={18}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Academic/Work Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@university.edu"
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all"
                  />
                  <Mail
                    className="absolute left-4 top-4 text-slate-700"
                    size={18}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Access Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all"
                  />
                  <Lock
                    className="absolute left-4 top-4 text-slate-700"
                    size={18}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                  System Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 outline-none text-slate-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="student">Student / Learner</option>
                    <option value="college">College / Academic</option>
                    <option value="company">Company / HR</option>
                  </select>
                  <Briefcase
                    className="absolute left-4 top-4 text-slate-700"
                    size={18}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Profile...
                    </span>
                  ) : (
                    <>
                      Register & Begin Assessment{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-sm">
                Already have a profile?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  Login to System
                </Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-green-500/50" />
              AES-256 Encrypted
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;
