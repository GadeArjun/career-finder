import { useEffect, useState } from "react";
import axios from "axios";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import StatsCards from "../../components/admin/dashboard/StatsCards";
import RecentUsersTable from "../../components/admin/dashboard/RecentUsersTable";
import RecentTestsTable from "../../components/admin/dashboard/RecentTestsTable";
import QuickActions from "../../components/admin/dashboard/QuickActions";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalTests: 0,
    activeTests: 0,
    studentCount: 0,
    companyCount: 0,
    collegeCount: 0,
  });

  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [userResponse, testResponse] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, { headers }),
        axios.get(`${API_URL}/api/admin/test`, { headers }),
      ]);

      console.log({testResponse})

      const userList =
        userResponse.data?.users ||
        userResponse.data?.data ||
        [];

      const testList =
        testResponse.data?.tests ||
        testResponse.data?.data ||
        [];

      setUsers(userList.slice(0, 8));
      setTests(testList.slice(0, 8));

      setStats({
        totalUsers: userList.length,

        activeUsers: userList.filter(
          (u) => u.status === "active"
        ).length,

        verifiedUsers: userList.filter(
          (u) => u.isVerified
        ).length,

        totalTests: testList.length,

        activeTests: testList.filter(
          (t) => t.isActive
        ).length,

        studentCount: userList.filter(
          (u) => u.role === "student"
        ).length,

        companyCount: userList.filter(
          (u) => u.role === "company"
        ).length,

        collegeCount: userList.filter(
          (u) => u.role === "college"
        ).length,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <DashboardHeader />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-6">
          <RecentUsersTable users={users} />
          <RecentTestsTable tests={tests} />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <QuickActions />

          {/* USER DISTRIBUTION */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-semibold text-lg mb-5">
              User Distribution
            </h3>

            <div className="space-y-5">
              <ProgressItem
                label="Students"
                value={stats.studentCount}
                total={stats.totalUsers}
              />

              <ProgressItem
                label="Companies"
                value={stats.companyCount}
                total={stats.totalUsers}
              />

              <ProgressItem
                label="Colleges"
                value={stats.collegeCount}
                total={stats.totalUsers}
              />
            </div>
          </div>

          {/* PLATFORM HEALTH */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold mb-5">
              Platform Health
            </h3>

            <div className="space-y-5">
              <HealthRow
                title="Verified Users"
                value={stats.verifiedUsers}
                total={stats.totalUsers}
              />

              <HealthRow
                title="Active Accounts"
                value={stats.activeUsers}
                total={stats.totalUsers}
              />

              <HealthRow
                title="Active Tests"
                value={stats.activeTests}
                total={stats.totalTests}
              />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">
              Overview
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  Total Students
                </span>
                <span>{stats.studentCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Total Companies
                </span>
                <span>{stats.companyCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Total Colleges
                </span>
                <span>{stats.collegeCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Tests Created
                </span>
                <span>{stats.totalTests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, total }) {
  const percentage =
    total === 0
      ? 0
      : Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function HealthRow({ title, value, total }) {
  const percentage =
    total === 0
      ? 0
      : Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-slate-400">
          {title}
        </span>

        <span className="font-semibold text-green-400">
          {percentage}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-2 rounded-full bg-green-500 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}