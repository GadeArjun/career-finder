import React, { useState } from "react";
import { User, Lock, Bell, Trash2, Save, Shield } from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

function Settings() {
  const { user, updateUser, logoutUser } = useUserContext();
  const [formData, setFormData] = useState({
    name: user?.personalInfo?.name || user.name || "",
    email: user?.email || "",
    contact: { phone: user?.personalInfo?.contact || user.contact.phone || "" },
    address: user?.personalInfo?.address || "",
    notifications: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { phone: value },
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save general settings
  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        alert("Profile updated successfully!");
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // 🔹 Change password handler
  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully! (Connect to backend)");
  };

  // 🔹 Delete account
  const handleDelete = () => {
    alert("Account deletion request sent!");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-gray-100 font-poppins">
      <Header title={"Settings"} />

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-6 pt-20 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🔹 General Settings */}
          <section className="bg-gradient-to-br from-gray-800 via-blue-900/40 to-gray-900 border border-blue-500/20 rounded-2xl shadow-lg hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1 p-6">
            <h2 className="flex items-center gap-2 text-blue-400 text-lg font-semibold mb-4">
              <User size={18} /> General Information
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Contact</label>
                <input
                  type="number"
                  name="contact"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <button
                onClick={handleSave}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-blue-400/40 py-2 rounded-lg font-medium transition"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </section>

          {/* 🔹 Security & Preferences */}
          <section className="bg-gradient-to-br from-gray-800 via-blue-900/40 to-gray-900 border border-blue-500/20 rounded-2xl shadow-lg hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1 p-6 space-y-8">
            {/* Password Section */}
            <div>
              <h2 className="flex items-center gap-2 text-blue-400 text-lg font-semibold mb-4">
                <Lock size={18} /> Account Security
              </h2>

              <div className="space-y-4 text-sm">
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  onClick={handlePasswordUpdate}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-blue-400/40 py-2 rounded-lg font-medium transition"
                >
                  <Shield size={16} /> Update Password
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="flex items-center gap-2 text-blue-400 text-lg font-semibold mb-3">
                <Bell size={18} /> Preferences
              </h2>
              <div className="flex items-center justify-between bg-gray-900 border border-gray-700 p-3 rounded-lg mb-2">
                <span className="text-gray-300">Notifications</span>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </section>
        </div>

        {/* 🔹 Danger Zone */}
        <section className="bg-gradient-to-br from-gray-800 via-red-900/30 to-gray-900 border border-red-500/20 rounded-2xl shadow-lg hover:shadow-red-400/30 transition-all duration-300 transform hover:-translate-y-1 p-6">
          <h2 className="flex items-center gap-2 text-red-400 text-lg font-semibold mb-3">
            <Trash2 size={18} /> Danger Zone
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Deleting your account will permanently remove your profile, data,
            and test history. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-red-400/40 py-2 rounded-lg w-full md:w-auto px-6 font-medium transition"
          >
            Delete My Account
          </button>
        </section>

        {/* 🔹 Confirm Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900 via-red-900/30 to-gray-900 border border-red-500/20 p-6 rounded-2xl shadow-xl w-96 text-center">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                Confirm Account Deletion
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Are you sure you want to permanently delete your account? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:shadow-red-400/40 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Settings;
