import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Trash2,
  Save,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

function Settings() {
  const { user, updateUser, logoutUser } = useUserContext();
  const [formData, setFormData] = useState({
    name: user?.personalInfo.name || "",
    email: user?.email || "",
    contact: user?.personalInfo?.contact || "",
    address: user?.personalInfo?.address || "",
    theme: "dark",
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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log({ data });
        updateUser(data);
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
    }
  };

  // 🔹 Change password handler (placeholder)
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
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-poppins">
      <Header title={"Settings"} />

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 🔹 General Settings */}
          <section className="bg-gray-800 p-6 rounded-2xl shadow-lg transition">
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                onClick={handleSave}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-medium transition"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </section>

          {/* 🔹 Password + Preferences */}
          <section className="bg-gray-800 p-6 rounded-2xl shadow-lg transition space-y-6">
            {/* Password */}
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handlePasswordUpdate}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 py-2 rounded-lg font-medium hover:shadow-md transition"
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
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg mb-2">
                <span className="text-gray-300">Notifications</span>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span className="text-gray-300 flex items-center gap-2">
                  Theme{" "}
                  {formData.theme === "dark" ? (
                    <Moon size={16} />
                  ) : (
                    <Sun size={16} />
                  )}
                </span>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      theme: prev.theme === "dark" ? "light" : "dark",
                    }))
                  }
                  className="bg-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-500 transition"
                >
                  {formData.theme === "dark" ? "Dark" : "Light"}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* 🔹 Danger Zone */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-lg mt-6">
          <h2 className="flex items-center gap-2 text-red-400 text-lg font-semibold mb-3">
            <Trash2 size={18} /> Danger Zone
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Deleting your account will permanently remove your profile, data,
            and test history.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 py-2 rounded-lg w-full md:w-auto px-6 font-medium transition"
          >
            Delete My Account
          </button>
        </section>

        {/* 🔹 Confirm Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-96 text-center">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                Confirm Account Deletion
              </h3>
              <p className="text-gray-300 mb-4">
                Are you sure you want to permanently delete your account? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white font-medium transition"
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
