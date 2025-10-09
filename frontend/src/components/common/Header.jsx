import React from "react";
import { Bell, LogOut } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function Header({ title }) {
  const { logoutUser, user } = useUserContext();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between z-10 fixed top-0 left-0 w-full items-center p-4 bg-gray-900 text-gray-100 shadow">
      {/* Center: Page Title */}
      <div className="text-lg font-semibold">{title}</div>

      {/* Right: Profile & Notifications */}
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 cursor-pointer text-gray-300" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              className="w-full h-full object-cover"
              alt="profile"
            />
          </div>
          <span className="text-gray-100 hidden sm:block">{user.personalInfo.name}</span>
        </div>

        <button
          onClick={() => {
            logoutUser();
            navigate("/");
          }}
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition"
        >
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
}

export default Header;
