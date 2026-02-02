import React from "react";
import { Bell, LogOut } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

function Header({ title }) {
  const { logoutUser, user } = useUserContext();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center fixed top-0 left-0 w-full z-10 px-6 py-2 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg">
      {/* ===== Title (Center) ===== */}
      <div className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-500 tracking-wide">
        {title}
      </div>

      {/* ===== Right Section: Notification, Profile, Logout ===== */}
      <div className="flex items-center gap-5">
        {/* 🔔 Notification Icon */}
        {/* <button
          className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition shadow-md hover:shadow-blue-500/30"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-yellow-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button> */}

        {/* 👤 User Profile */}
        <Link
          to={`${
            user.role === "student"
              ? "/student/profile"
              : user.role === "college"
              ? "/college/profile"
              : "/company/profile"
          }`}
          className="flex items-center gap-3 bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-700 transition border border-gray-700/50 shadow-sm"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500/50">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>
          <span className="text-gray-200 text-sm font-medium hidden sm:block">
            {user?.personalInfo?.name || user.name || "Guest User"}
          </span>
        </Link>

        {/* 🚪 Logout Button */}
        <button
          onClick={() => {
            logoutUser();
            navigate("/");
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all shadow-md hover:shadow-red-500/40 active:scale-95"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:block font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
