import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

function Layout() {
  return (
    <div>
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
