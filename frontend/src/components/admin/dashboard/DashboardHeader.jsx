import { ShieldCheck } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Manage users, tests and platform analytics
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl flex items-center gap-2">
        <ShieldCheck size={18} />
        Admin Access
      </div>
    </div>
  );
}