import React, { useState, useEffect, useMemo } from "react";
import {
  Edit3,
  Save,
  X,
  Upload,
  CheckCircle,
  Clock,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Palette,
  Languages,
  User as UserIcon,
  Cpu,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user, updateUser } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  // --- Real-time Profile Integrity Logic ---
  const completionScore = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.name,
      profile.avatar,
      profile.contact?.phone,
      profile.contact?.address,
      profile.contact?.city,
      profile.settings?.language,
    ];
    const filled = fields.filter((f) => f && f !== "" && f !== "-").length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const handleChange = (section, field, value) => {
    setProfile((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        updateUser(data.user || data); // Adjusted for standard API responses
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Neural Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/upload-avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.avatarUrl) {
        setProfile((prev) => ({ ...prev, avatar: data.avatarUrl }));
        setAvatarPreview(data.avatarUrl);
      }
    } catch (err) {
      console.error("Buffer Upload Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 font-poppins selection:bg-blue-500/30">
      <Header title={"Neural Identity"} />

      {/* ===== Processing Overlay ===== */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex flex-col items-center justify-center z-[100]"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
            <p className="mt-4 font-mono text-blue-400 animate-pulse uppercase tracking-widest text-xs">
              Syncing Core Data...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 pt-24 max-w-5xl mx-auto w-full space-y-8 pb-24">
        {/* ===== HEADER HERO SECTION ===== */}
        <section className="relative overflow-hidden rounded-[2.5rem] p-8 border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-transparent to-slate-900/50 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Cpu size={280} className="text-blue-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Avatar Hexagon Wrapper */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-[2.5rem] rotate-45 overflow-hidden border-4 border-blue-500/50 bg-slate-800 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <img
                  src={
                    avatarPreview ||
                    profile.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Identity"
                  className="-rotate-45 scale-150 w-full h-full object-cover transition-transform group-hover:scale-[1.6]"
                />
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-400 text-white rounded-2xl p-3 cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-90 border border-white/10">
                  <Upload size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => handleChange(null, "name", e.target.value)}
                    className="text-3xl font-black bg-white/5 border border-white/10 focus:border-blue-500 rounded-2xl px-4 py-2 text-white w-full outline-none transition-all shadow-inner"
                  />
                ) : (
                  <h2 className="text-4xl font-black tracking-tighter text-white">
                    {profile.name || "Anonymous User"}
                  </h2>
                )}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-3">
                  <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    {profile.role || "Citizen"}
                  </span>
                  {profile.isVerified ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-tighter">
                      <CheckCircle size={14} /> Verified Entity
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-tighter animate-pulse">
                      <Clock size={14} /> Verification Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0 pt-2">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    System Integrity
                  </p>
                  <p className="text-xl font-black text-blue-400">
                    {completionScore}%
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Node Status
                  </p>
                  <p className="text-xl font-black text-emerald-400 uppercase tracking-tighter">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${
                  isEditing
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                }`}
              >
                {isEditing ? (
                  <>
                    <Save size={18} /> Sync Changes
                  </>
                ) : (
                  <>
                    <Edit3 size={18} /> Modify Identity
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-white/5"
                >
                  <X size={18} /> Discard
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ===== CONTACT MODULE ===== */}
          <section className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-blue-500/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Globe size={150} />
            </div>
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-blue-400">
              <Zap size={20} /> Comms Channels
            </h3>

            <div className="space-y-6">
              <ProfileInput
                label="Primary Email"
                icon={<Mail size={16} />}
                value={profile.email}
                isEditing={isEditing}
                onChange={(val) => handleChange(null, "email", val)}
              />
              <ProfileInput
                label="Neural Link (Phone)"
                icon={<Phone size={16} />}
                value={profile.contact?.phone}
                isEditing={isEditing}
                onChange={(val) => handleChange("contact", "phone", val)}
              />
              <ProfileInput
                label="Physical Node (Address)"
                icon={<MapPin size={16} />}
                value={profile.contact?.address}
                isEditing={isEditing}
                onChange={(val) => handleChange("contact", "address", val)}
              />
              <div className="grid grid-cols-2 gap-4">
                <ProfileInput
                  label="City"
                  value={profile.contact?.city}
                  isEditing={isEditing}
                  onChange={(val) => handleChange("contact", "city", val)}
                />
                <ProfileInput
                  label="Country"
                  value={profile.contact?.country}
                  isEditing={isEditing}
                  onChange={(val) => handleChange("contact", "country", val)}
                />
              </div>
            </div>
          </section>

          {/* ===== CONFIGURATION MODULE ===== */}
          <section className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-purple-500/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Palette size={150} />
            </div>
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-purple-400">
              <Cpu size={20} /> System Config
            </h3>

            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      Neural Pings
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      System Notifications
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  checked={profile.settings?.notifications || false}
                  onChange={(e) =>
                    handleChange("settings", "notifications", e.target.checked)
                  }
                  className="w-6 h-6 rounded-lg accent-purple-500 cursor-pointer disabled:opacity-50"
                />
              </div>

              <div className="space-y-6">
                <ProfileInput
                  label="Visual Theme"
                  icon={<Palette size={16} />}
                  value={profile.settings?.theme}
                  isEditing={isEditing}
                  onChange={(val) => handleChange("settings", "theme", val)}
                />
                <ProfileInput
                  label="Default Syntax (Language)"
                  icon={<Languages size={16} />}
                  value={profile.settings?.language}
                  isEditing={isEditing}
                  onChange={(val) => handleChange("settings", "language", val)}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- REUSABLE INPUT COMPONENT ---
const ProfileInput = ({ label, value, isEditing, onChange, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
      {icon} {label}
    </label>
    {isEditing ? (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-slate-200 text-sm outline-none transition-all"
        placeholder={`Enter ${label}...`}
      />
    ) : (
      <div className="px-4 py-3 bg-white/[0.02] border border-transparent rounded-xl text-sm text-slate-300 font-medium">
        {value || <span className="text-slate-600 italic">Undefined</span>}
      </div>
    )}
  </div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#020617] p-10 animate-pulse space-y-12 pt-32">
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="h-64 bg-slate-900/50 rounded-[3rem]" />
      <div className="grid grid-cols-2 gap-8">
        <div className="h-96 bg-slate-900/50 rounded-[2.5rem]" />
        <div className="h-96 bg-slate-900/50 rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

export default Profile;
