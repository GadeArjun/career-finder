import React, { useState } from "react";
import {
  Home,
  Book,
  Clipboard,
  User,
  Settings,
  Menu,
  X,
  Compass,
  GraduationCap,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/student/dashboard" },
    { name: "My Profile", icon: <User size={20} />, path: "/student/profile" },
    {
      name: "Aptitude / Psychometric Test",
      icon: <Clipboard size={20} />,
      path: "/student/aptitude-test",
    },
    {
      name: "Recommendations",
      icon: <Book size={20} />,
      path: "/student/recommendations",
    },
    {
      name: "Explore courses / colleges",
      icon: <Compass size={20} />,
      path: "/student/explore-courses-college",
    },
    {
      name: "Guidance Resources & Learning Path",
      icon: <GraduationCap size={20} />,
      path: "/student/guidance-resources-path",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/student/settings",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-screen bg-gray-900 text-gray-100 shadow-lg z-50 w-64 transition-all duration-300 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Link to={"/"} className="font-bold text-xl text-[#60A5FA]">
                CareerGuide+
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-gray-700 transition"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="mt-4">
            {menuItems.map((item) => (
              <li key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-700 font-semibold"
                        : "hover:bg-gray-800"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Independent toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-[50px] rounded-tr-[20px] rounded-br-[20px] p-2 z-50 bg-[#458bfa] shadow hover:bg-[#2172f5] transition-all duration-200"
        >
          <Menu size={24} className="text-white" />
        </button>
      )}

      {/* Optional overlay when open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
