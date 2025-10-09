// pages/Student/Profile.jsx
import React, { useState } from "react";
import { Upload, Edit3, Save, X } from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Profile() {
  const { user, updateUser } = useUserContext();
  const [profile, setProfile] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfile(user);
  }, [user]);
  // ===== Handle Save =====
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
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

  // ===== Handle Input Change =====
  const handleChange = (section, field, value) => {
    if (section) {
      setProfile((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-poppins">
      <Header title={"My Profile"} />

      {/* overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-6 pt-20">
        {/* ===== Profile Overview ===== */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-md mb-6 transition-colors">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img
              src={
                profile.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="student avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-700"
            />
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold text-gray-100">
                {profile.personalInfo.name}
              </h2>
              <p className="text-gray-400 mb-3">
                Student ID: {profile.id?.toUpperCase() || "N/A"}
              </p>

              {/* Progress Bar */}
              <div>
                <p className="text-sm mb-1 font-medium text-gray-300">
                  Profile Completion:{" "}
                  <span className="text-blue-400">
                    {profile.profileCompletion}%
                  </span>
                </p>
                <div className="w-full bg-gray-700 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{
                      width: `${profile.profileCompletion}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Edit/Save Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              >
                {isEditing ? (
                  <>
                    <Save size={16} /> Save
                  </>
                ) : (
                  <>
                    <Edit3 size={16} /> Edit Profile
                  </>
                )}
              </button>

              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ===== Academic + Personal Info ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Academic Details */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-md transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Academic Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { key: "schoolCollege", label: "School/College" },
                { key: "grade", label: "Grade" },
                { key: "stream", label: "Stream" },
                { key: "subjects", label: "Subjects" },
                { key: "achievements", label: "Achievements" },
              ].map(({ key, label }) => (
                <p
                  key={key}
                  className={`${
                    key === "achievements" ? "col-span-2" : ""
                  } flex flex-col`}
                >
                  <span className="font-medium text-gray-300">{label}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.academicDetails?.[key] || ""}
                      onChange={(e) =>
                        handleChange("academicDetails", key, e.target.value)
                      }
                      className="bg-gray-700 rounded px-2 py-1 mt-1 text-gray-100 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{profile.academicDetails?.[key] || "-"}</span>
                  )}
                </p>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-md transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { key: "name", label: "Full Name" },
                { key: "age", label: "Age" },
                { key: "gender", label: "Gender" },
                { key: "contact", label: "Contact" },
                { key: "address", label: "Address", span: true },
              ].map(({ key, label, span }) => (
                <p
                  key={key}
                  className={`${span ? "col-span-2" : ""} flex flex-col`}
                >
                  <span className="font-medium text-gray-300">{label}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.personalInfo?.[key] || ""}
                      onChange={(e) =>
                        handleChange("personalInfo", key, e.target.value)
                      }
                      className="bg-gray-700 rounded px-2 py-1 mt-1 text-gray-100 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{profile.personalInfo?.[key] || "-"}</span>
                  )}
                </p>
              ))}

              <p className="col-span-2">
                <span className="font-medium text-gray-300">Email:</span>{" "}
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Skills & Interests ===== */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-md mb-6 transition-colors">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">
            Skills & Interests
          </h3>
          {isEditing ? (
            <textarea
              className="bg-gray-700 text-gray-100 rounded-lg w-full p-2"
              rows={3}
              value={profile.skills?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-900 text-blue-400 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
            </div>
          )}
        </section>

        {/* ===== Upload Resume ===== */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-400 mb-1">
              Upload Resume
            </h3>
            <p className="text-gray-400 text-sm">
              Attach your latest resume in PDF format
            </p>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm mt-2 inline-block"
              >
                View Current Resume
              </a>
            )}
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:shadow-md transition w-full md:w-auto justify-center cursor-pointer">
            <Upload size={18} /> Upload
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append("resume", file);
                  fetch(`${API_URL}/api/users/upload-resume`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${user?.token}` },
                    body: formData,
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.resumeUrl)
                        setProfile((prev) => ({
                          ...prev,
                          resumeUrl: data.resumeUrl,
                        }));
                    })
                    .catch((err) =>
                      console.error("Resume upload failed:", err)
                    );
                }
              }}
            />
          </label>
        </section>
      </main>
    </div>
  );
}

export default Profile;
