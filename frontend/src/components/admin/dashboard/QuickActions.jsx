import { Link } from "react-router-dom";
import { Plus, Users, ClipboardList } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="font-semibold text-lg mb-5">
        Quick Actions
      </h2>

      <div className="space-y-3">
        <Link
          to="/admin/users"
          className="flex items-center gap-3 bg-slate-800 p-4 rounded-xl"
        >
          <Users size={18} />
          Manage Users
        </Link>

        <Link
          to="/admin/tests"
          className="flex items-center gap-3 bg-slate-800 p-4 rounded-xl"
        >
          <ClipboardList size={18} />
          Manage Tests
        </Link>

        <Link
          to="/admin/tests"
          className="flex items-center gap-3 bg-blue-600 p-4 rounded-xl"
        >
          <Plus size={18} />
          Create Test
        </Link>
      </div>
    </div>
  );
}