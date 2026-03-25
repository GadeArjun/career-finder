import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Trash2,
  Save,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Fingerprint,
  Mail,
  Smartphone,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Settings() {
  const { user, updateUser, logoutUser } = useUserContext();

  // 🔹 State Management
  const [formData, setFormData] = useState({
    name: user?.personalInfo?.name || user?.name || "",
    email: user?.email || "",
    contact: {
      phone: user?.personalInfo?.contact || user?.contact?.phone || "",
    },
    address: user?.personalInfo?.address || "",
    notifications: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // 🔹 Input Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, phone: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Logic Handlers
  const handleSaveProfile = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        // Toast notification could go here
      }
    } catch (err) {
      console.error("System sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Encryption keys (passwords) do not match!");
      return;
    }
    alert("Security protocol updated!");
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-poppins selection:bg-blue-500/30">
      <Header title={"System Settings"} />

      <main className="flex-1 p-6 pt-24 max-w-6xl mx-auto w-full space-y-8 pb-20">
        {/* ===== TOP GRID: GENERAL & SECURITY ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🔹 GENERAL CONFIGURATION */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md hover:border-blue-500/20 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Fingerprint size={120} />
            </div>

            <h2 className="flex items-center gap-3 text-blue-400 text-xl font-bold mb-8">
              <User size={22} className="text-blue-500" /> Core Identity
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Legal Designation
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Communication Node (Email)
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Neural Link (Phone)
                  </label>
                  <div className="relative">
                    <Smartphone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Active Preferences
                  </label>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 h-[46px]">
                    <span className="text-xs text-slate-400">
                      Notifications
                    </span>
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Physical Coordinates (Address)
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-4 top-3 text-slate-500"
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all resize-none"
                    placeholder="Enter full address..."
                  ></textarea>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isSyncing}
                className="w-full group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                {isSyncing ? (
                  "Syncing..."
                ) : (
                  <>
                    <Save size={18} /> Push Configuration
                  </>
                )}
              </button>
            </div>
          </section>

          {/* 🔹 SECURITY PROTOCOLS */}
          <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md hover:border-purple-500/20 transition-all duration-500 flex flex-col group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Shield size={120} />
            </div>

            <h2 className="flex items-center gap-3 text-purple-400 text-xl font-bold mb-8">
              <Lock size={22} className="text-purple-500" /> Security Protocols
            </h2>

            <div className="space-y-6 flex-1">
              {[
                {
                  name: "currentPassword",
                  label: "Current Access Key",
                  key: "current",
                },
                { name: "newPassword", label: "New Access Key", key: "new" },
                {
                  name: "confirmPassword",
                  label: "Re-verify Access Key",
                  key: "confirm",
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass[field.key] ? "text" : "password"}
                      name={field.name}
                      value={passwords[field.name]}
                      onChange={handlePasswordChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass((prev) => ({
                          ...prev,
                          [field.key]: !prev[field.key],
                        }))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                    >
                      {showPass[field.key] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handlePasswordUpdate}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-95"
            >
              <Shield size={18} /> Update Encryption
            </button>
          </section>
        </div>

        {/* 🔹 DANGER ZONE */}
        <section className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 group hover:bg-red-500/10 transition-all duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="flex items-center gap-3 text-red-500 text-xl font-bold">
                <AlertTriangle size={22} /> Critical Action: Terminate Entity
              </h2>
              <p className="text-slate-500 text-sm max-w-xl">
                Initiating account deletion will result in permanent removal of
                all data nodes, transaction history, and system access. This
                action is{" "}
                <span className="text-red-400 font-bold uppercase underline decoration-2 underline-offset-4">
                  irreversible
                </span>
                .
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        </section>

        {/* 🔹 DELETE MODAL */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-red-500/30 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-6"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">
                    Confirm Termination?
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    You are about to wipe your data from the central grid. This
                    process cannot be halted once initiated.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-slate-300 transition-all"
                  >
                    Abort Mission
                  </button>
                  <button
                    onClick={() => alert("Entity Purged.")}
                    className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-red-900/40"
                  >
                    Confirm Purge
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Settings;
