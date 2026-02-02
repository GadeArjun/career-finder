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
import { useUserContext } from "../../context/UserContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();

  const studentMenuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/student/dashboard" },
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
      name: "Explore Courses / Colleges",
      icon: <Compass size={20} />,
      path: "/student/explore-courses-college",
    },
    {
      name: "Guidance Resources & Learning Path",
      icon: <GraduationCap size={20} />,
      path: "/student/guidance-resources-path",
    },
    { name: "My Profile", icon: <User size={20} />, path: "/student/profile" },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/student/settings",
    },
  ];

  const collegeMenuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/college/dashboard" },
    {
      name: "Colleges",
      icon: <Clipboard size={20} />,
      path: "/college/colleges",
    },

    { name: "My Profile", icon: <User size={20} />, path: "/college/profile" },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/college/settings",
    },
  ];

  const companyMenuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/company/dashboard" },
    {
      name: "Company",
      icon: <Clipboard size={20} />,
      path: "/company/companys",
    },

    { name: "My Profile", icon: <User size={20} />, path: "/company/profile" },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/company/settings",
    },
  ];

  const menuItems =
    user.role === "student"
      ? studentMenuItems
      : user.role === "college"
      ? collegeMenuItems
      : user.role === "company"
      ? companyMenuItems
      : studentMenuItems;

  return (
    <>
      {/* ===== Sidebar Panel ===== */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-screen  w-64 bg-gradient-to-b from-gray-950/95 via-gray-900/90 to-gray-800/95 backdrop-blur-md border-r border-blue-500/20 shadow-[4px_0_25px_rgba(0,0,0,0.4)] z-50 transition-all duration-500 overflow-y-auto">
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 via-yellow-400/10 to-orange-400/10 shadow-md">
            <div className="flex items-center gap-2">
              <Link
                to={"/"}
                className="font-extrabold text-xl bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-500 text-transparent bg-clip-text tracking-wide"
              >
                CareerGuide+
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-700/60 transition-all duration-200"
            >
              <X size={22} className="text-gray-200" />
            </button>
          </div>

          {/* ===== Menu Items ===== */}
          <ul className="mt-4 flex flex-col gap-1 px-3 min-h-[70%]">
            {menuItems.map((item) => (
              <li key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/80 via-blue-700/80 to-blue-800/80 text-white shadow-lg shadow-blue-500/40"
                        : "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-yellow-400/10 hover:text-yellow-300 text-gray-300"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span
                    className={`transition-all ${
                      item.icon.props.className ||
                      "text-blue-400 group-hover:text-yellow-300"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                </NavLink>

                {/* Glowing Active Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 to-yellow-400 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </li>
            ))}
          </ul>

          {/* ===== Footer Section ===== */}
          <div className="p-4 mt-auto border-t border-gray-700/40 text-gray-400 text-xs text-center">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400 font-semibold">
                CareerGuide+
              </span>
            </p>
            <p className="mt-1">Empowering Careers 💡</p>
          </div>
        </div>
      )}

      {/* ===== Floating Toggle Button ===== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-[50px] p-2 rounded-tr-2xl rounded-br-2xl bg-gradient-to-b from-blue-600 via-yellow-400 to-orange-500 shadow-lg shadow-blue-500/30 hover:shadow-yellow-400/40 transform hover:scale-105 transition-all duration-300 z-50"
          title="Open Menu"
        >
          <Menu size={24} className="text-gray-900" />
        </button>
      )}

      {/* ===== Overlay for Mobile ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
