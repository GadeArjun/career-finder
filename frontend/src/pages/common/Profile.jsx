import React, { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Upload,
  CheckCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const { user, updateUser } = useUserContext();
  const [profile, setProfile] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    setProfile(user);
  }, [user]);

  // Generic input handler
  const handleChange = (section, field, value) => {
    if (section) {
      setProfile((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Save updated profile
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
        updateUser(data);
        setIsEditing(false);
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
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
      console.error("Avatar upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-gray-100 font-poppins">
      <Header title={"User Profile"} />

      {/* ===== Loading Overlay ===== */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <main className="flex-1 p-6 pt-20">
        {/* ===== Basic Info Section ===== */}
        <section className="bg-gradient-to-br from-gray-800 via-blue-900/30 to-gray-900 border border-blue-500/20 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/30 mb-6 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar + Upload */}
            <div className="relative">
              <img
                src={
                  avatarPreview ||
                  profile.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="User Avatar"
                className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-md object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-2 cursor-pointer shadow-lg transition">
                  <Upload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>

            {/* Name, Role, Badges */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name || ""}
                  onChange={(e) => handleChange(null, "name", e.target.value)}
                  className="text-2xl font-bold bg-gray-700 border border-gray-600 focus:border-blue-500 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400/50 transition w-full"
                />
              ) : (
                <h2 className="text-3xl font-bold tracking-wide">
                  {profile.name || "User Name"}
                </h2>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full text-sm bg-blue-700/50 border border-blue-500 text-blue-300 capitalize">
                  {profile.role}
                </span>

                {profile.isVerified ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Clock size={14} /> Pending Verification
                  </span>
                )}

                {profile.status !== "active" && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <ShieldAlert size={14} /> {profile.status}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="text-sm text-gray-400 mt-3 space-y-1">
                <p>
                  Joined:{" "}
                  <span className="text-gray-300">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  Last Login:{" "}
                  <span className="text-gray-300">
                    {profile.lastLogin
                      ? new Date(profile.lastLogin).toLocaleString()
                      : "Never"}
                  </span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-blue-400/40 hover:scale-[1.03] active:scale-95 transition-all"
              >
                {isEditing ? (
                  <>
                    <Save size={16} /> Save
                  </>
                ) : (
                  <>
                    <Edit3 size={16} /> Edit
                  </>
                )}
              </button>

              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-[1.03] transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ===== Contact Information ===== */}
        <section className="bg-gradient-to-br from-gray-800 via-blue-900/30 to-gray-900 border border-blue-500/20 p-6 rounded-2xl shadow-md hover:shadow-blue-400/30 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            📞 Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { key: "email", label: "Email", section: null },
              { key: "phone", label: "Phone", section: "contact" },
              { key: "address", label: "Address", section: "contact" },
              { key: "city", label: "City", section: "contact" },
              { key: "state", label: "State", section: "contact" },
              { key: "country", label: "Country", section: "contact" },
            ].map(({ key, label, section }) => (
              <p key={key} className="flex flex-col">
                <span className="font-medium text-gray-300">{label}:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={
                      section
                        ? profile[section]?.[key] || ""
                        : profile[key] || ""
                    }
                    onChange={(e) => handleChange(section, key, e.target.value)}
                    className="bg-gray-700 border border-gray-600 focus:border-blue-500 rounded px-2 py-1 mt-1 text-gray-100 focus:ring-2 focus:ring-blue-400/50 transition"
                  />
                ) : (
                  <span>
                    {section
                      ? profile[section]?.[key] || "-"
                      : profile[key] || "-"}
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>

        {/* ===== User Settings ===== */}
        <section className="bg-gradient-to-br from-gray-800 via-blue-900/30 to-gray-900 border border-blue-500/20 p-6 rounded-2xl shadow-md hover:shadow-blue-400/30 mb-6 transition-all">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            ⚙️ Preferences
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              {
                key: "notifications",
                label: "Notifications",
                type: "checkbox",
              },
              { key: "theme", label: "Theme", type: "text" },
              { key: "language", label: "Language", type: "text" },
            ].map(({ key, label, type }) => (
              <p key={key} className="flex flex-col">
                <span className="font-medium text-gray-300">{label}:</span>
                {isEditing ? (
                  type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={profile.settings?.[key] || false}
                      onChange={(e) =>
                        handleChange("settings", key, e.target.checked)
                      }
                      className="mt-2 w-5 h-5 accent-blue-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile.settings?.[key] || ""}
                      onChange={(e) =>
                        handleChange("settings", key, e.target.value)
                      }
                      className="bg-gray-700 border border-gray-600 focus:border-blue-500 rounded px-2 py-1 mt-1 text-gray-100 focus:ring-2 focus:ring-blue-400/50 transition"
                    />
                  )
                ) : (
                  <span>
                    {type === "checkbox"
                      ? profile.settings?.[key]
                        ? "Enabled"
                        : "Disabled"
                      : profile.settings?.[key] || "-"}
                  </span>
                )}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
