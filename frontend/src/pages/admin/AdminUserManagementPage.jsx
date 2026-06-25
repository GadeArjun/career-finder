import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  RefreshCcw,
  Filter,
  UserCircle2,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  BadgeCheck,
  Ban,
  Trash2,
  Edit3,
  Save,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
  UserCog,
  Copy,
  Sparkles,
  CircleAlert,
  Settings2,
  IdCard,
  Laptop,
  Building2,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import SectionCard from "../../components/admin/dashboard/SectoinCard";
import PreviewLine from "../../components/admin/dashboard/PreviewLine";

const API_BASE = import.meta.env.VITE_BACKEND_URL +  "/api/admin/users";

const ROLES = ["student", "college", "company", "admin"];
const STATUSES = ["active", "inactive", "banned"];
const THEMES = ["light", "dark"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function apiFetch(url, options = {}) {
  const token = getToken();

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

function prettyDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function roleIcon(role) {
  switch (role) {
    case "student":
      return GraduationCap;
    case "college":
      return Building2;
    case "company":
      return Laptop;
    case "admin":
      return UserCog;
    default:
      return UserCircle2;
  }
}

function Badge({ children, tone = "slate" }) {
  const map = {
    slate: "border-slate-700 bg-slate-800/70 text-slate-200",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-200",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-200",
    teal: "border-teal-500/30 bg-teal-500/10 text-teal-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {label}
          </p>
          <div className="mt-2 text-2xl font-bold text-white">{value}</div>
          {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Button({ children, className = "", icon: Icon, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </span>
  );
}

function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-slate-700 bg-gray-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
      />
    </label>
  );
}

function Textarea({ label, className = "", ...props }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        className={cn(
          "min-h-[110px] w-full rounded-2xl border border-slate-700 bg-gray-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
      />
    </label>
  );
}

function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        {...props}
        className={cn(
          "w-full rounded-2xl border border-slate-700 bg-gray-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
      >
        {children}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
        checked
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-1 transition",
          checked ? "bg-emerald-500" : "bg-slate-700"
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full bg-white transition",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}

function getToneByStatus(status) {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "amber";
    case "banned":
      return "rose";
    default:
      return "slate";
  }
}

function getToneByVerify(value) {
  return value ? "green" : "amber";
}

function UserCard({ user, onOpen }) {
  const RoleIcon = roleIcon(user.role);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 transition hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-slate-300">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <RoleIcon className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-white">
                {user.name}
              </h3>
              <Badge tone={getToneByStatus(user.status)}>{user.status}</Badge>
              <Badge tone={getToneByVerify(user.isVerified)}>
                {user.isVerified ? "Verified" : "Not Verified"}
              </Badge>
              <Badge tone="blue">{user.role}</Badge>
            </div>

            <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" /> Last Login{" "}
                {prettyDate(user.lastLogin)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Profile {user.profileCompletion || 0}%
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> Joined {prettyDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onOpen(user)}
            className="border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
            icon={Eye}
          >
            Open
          </Button>
          <Button
            onClick={() => onOpen(user)}
            className="border border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20"
            icon={Edit3}
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function UserDetailPanel({
  user,
  onClose,
  onEdit,
  onRefresh,
  onDelete,
  onToggleStatus,
  onToggleVerified,
  onChangeRole,
}) {
  const RoleIcon = roleIcon(user.role);

  return (
    <motion.aside
      initial={{ x: 32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 32, opacity: 0 }}
      className="sticky top-6 h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Selected User
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {user.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-2xl border border-slate-700 bg-slate-950 p-2 text-slate-300 transition hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="custom-scrollbar h-[calc(100%-72px)] overflow-y-auto p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-slate-300">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <RoleIcon className="h-7 w-7" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-xl font-semibold text-white">
                {user.name}
              </h3>
              <Badge tone={getToneByStatus(user.status)}>{user.status}</Badge>
              <Badge tone={user.isVerified ? "green" : "amber"}>
                {user.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <QuickInfo label="Role" value={user.role} />
          <QuickInfo label="Status" value={user.status} />
          <QuickInfo
            label="Verification"
            value={user.isVerified ? "Yes" : "No"}
          />
          <QuickInfo
            label="Profile Completion"
            value={`${user.profileCompletion || 0}%`}
          />
          <QuickInfo label="Theme" value={user.settings?.theme || "dark"} />
          <QuickInfo
            label="Notifications"
            value={user.settings?.notifications ? "On" : "Off"}
          />
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <SectionBox title="Contact">
            <InfoRow icon={Phone} label="Phone" value={user.contact?.phone} />
            <InfoRow icon={MapPin} label="Address" value={user.contact?.address} />
            <InfoRow icon={MapPin} label="City" value={user.contact?.city} />
            <InfoRow icon={MapPin} label="State" value={user.contact?.state} />
            <InfoRow icon={MapPin} label="Country" value={user.contact?.country} />
          </SectionBox>

          <SectionBox title="Profile Links">
            <InfoRow
              icon={IdCard}
              label="Student Profile"
              value={user.studentProfileId || "—"}
            />
            <InfoRow
              icon={IdCard}
              label="College Owner"
              value={user.collegeOwnerId || "—"}
            />
            <InfoRow
              icon={IdCard}
              label="Company Owner"
              value={user.companyOwnerId || "—"}
            />
            <InfoRow
              icon={Copy}
              label="Resume URL"
              value={user.resumeUrl || "—"}
            />
          </SectionBox>

          <SectionBox title="Activity">
            <InfoRow icon={CalendarDays} label="Created" value={prettyDate(user.createdAt)} />
            <InfoRow icon={Clock3} label="Updated" value={prettyDate(user.updatedAt)} />
            <InfoRow icon={Clock3} label="Last Login" value={prettyDate(user.lastLogin)} />
            <InfoRow icon={Clock3} label="Last Activity" value={prettyDate(user.lastActivity)} />
          </SectionBox>
        </div>

        <div className="mt-5 grid gap-2">
          <Button
            onClick={() => onEdit(user)}
            className="bg-blue-600 text-white hover:bg-blue-500"
            icon={Edit3}
          >
            Edit Full Profile
          </Button>

          <Button
            onClick={() => onToggleVerified(user)}
            className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            icon={user.isVerified ? ShieldCheck : ShieldAlert}
          >
            {user.isVerified ? "Mark Unverified" : "Verify User"}
          </Button>

          <Button
            onClick={() => onToggleStatus(user)}
            className="border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            icon={user.status === "active" ? Ban : ToggleLeft}
          >
            {user.status === "active" ? "Set Inactive" : "Set Active"}
          </Button>

          <Button
            onClick={() => onChangeRole(user)}
            className="border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
            icon={UserCog}
          >
            Change Role
          </Button>

          <Button
            onClick={() => onDelete(user)}
            className="border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
            icon={Trash2}
          >
            Delete User
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}

function QuickInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-100">{value || "—"}</p>
    </div>
  );
}

function SectionBox({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="max-w-[55%] truncate text-sm text-slate-100">{value || "—"}</p>
    </div>
  );
}

function UserFormPage({
  mode,
  initialValue,
  onBack,
  onSaved,
  onDelete,
  onForceRefresh,
}) {
  const [form, setForm] = useState(initialValue || null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("details");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setForm(initialValue || null);
    setError("");
    setSuccess("");
  }, [initialValue]);

  if (!form) return null;

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateContact = (key, value) =>
    setForm((prev) => ({
      ...prev,
      contact: {
        ...(prev.contact || {}),
        [key]: value,
      },
    }));

  const updateSettings = (key, value) =>
    setForm((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        [key]: value,
      },
    }));

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        avatar: form.avatar,
        profileCompletion: Number(form.profileCompletion || 0),
        lastLogin: form.lastLogin || undefined,
        lastActivity: form.lastActivity || undefined,
        resumeUrl: form.resumeUrl,
        contact: form.contact,
        settings: form.settings,
        studentProfileId: form.studentProfileId || undefined,
        collegeOwnerId: form.collegeOwnerId || undefined,
        companyOwnerId: form.companyOwnerId || undefined,
      };

      const data = await apiFetch(`${API_BASE}/${form._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess("User updated successfully.");
      onSaved?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusPatch = async (nextStatus) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE}/${form._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setSuccess(`Status changed to ${nextStatus}.`);
      onForceRefresh?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPatch = async (nextValue) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE}/${form._id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: nextValue }),
      });
      setSuccess(
        nextValue ? "User marked as verified." : "User marked as unverified."
      );
      onForceRefresh?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRolePatch = async (nextRole) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE}/${form._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      setSuccess(`Role updated to ${nextRole}.`);
      onForceRefresh?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return;
    setLoading(true);
    setError("");
    try {
      await apiFetch(`${API_BASE}/${form._id}`, {
        method: "DELETE",
      });
      onDelete?.(form._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={onBack}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" /> Back to list
            </button>
            <h1 className="text-3xl font-bold text-white">
              {mode === "edit" ? "Edit User" : "User Profile"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Manage the full user profile, status, verification, and role in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleStatusPatch(form.status === "active" ? "inactive" : "active")}
              className="border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
              icon={form.status === "active" ? Ban : ToggleRight}
            >
              {form.status === "active" ? "Set Inactive" : "Set Active"}
            </Button>

            <Button
              onClick={() => handleVerifyPatch(!form.isVerified)}
              className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              icon={form.isVerified ? ShieldAlert : ShieldCheck}
            >
              {form.isVerified ? "Unverify" : "Verify"}
            </Button>

            <Button
              onClick={handleDelete}
              className="border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
              icon={Trash2}
            >
              Delete
            </Button>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-500"
              icon={loading ? Loader2 : Save}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {(error || success) && (
          <div
            className={cn(
              "mb-6 rounded-3xl border px-4 py-3 text-sm",
              error
                ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            )}
          >
            {error || success}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: "details", label: "Details" },
            { key: "security", label: "Status & Role" },
            { key: "links", label: "Relations" },
            { key: "preview", label: "Preview" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "rounded-2xl border px-4 py-2.5 text-sm font-medium transition",
                tab === item.key
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]"
            >
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <UserCircle2 className="h-5 w-5 text-blue-300" /> User Details
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    value={form.name || ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                  <Input
                    label="Avatar URL"
                    value={form.avatar || ""}
                    onChange={(e) => updateField("avatar", e.target.value)}
                    placeholder="https://..."
                  />
                  <Input
                    label="Profile Completion"
                    type="number"
                    min="0"
                    max="100"
                    value={form.profileCompletion ?? 0}
                    onChange={(e) => updateField("profileCompletion", e.target.value)}
                  />
                  <Input
                    label="Last Login"
                    type="datetime-local"
                    value={form.lastLogin ? new Date(form.lastLogin).toISOString().slice(0, 16) : ""}
                    onChange={(e) => updateField("lastLogin", e.target.value)}
                  />
                  <Input
                    label="Last Activity"
                    type="datetime-local"
                    value={form.lastActivity ? new Date(form.lastActivity).toISOString().slice(0, 16) : ""}
                    onChange={(e) => updateField("lastActivity", e.target.value)}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Resume URL"
                      value={form.resumeUrl || ""}
                      onChange={(e) => updateField("resumeUrl", e.target.value)}
                      placeholder="Resume link"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <SectionCard title="Contact Details">
                    <div className="grid gap-4">
                      <Input
                        label="Phone"
                        value={form.contact?.phone || ""}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        placeholder="+91..."
                      />
                      <Input
                        label="Address"
                        value={form.contact?.address || ""}
                        onChange={(e) => updateContact("address", e.target.value)}
                        placeholder="Street address"
                      />
                      <Input
                        label="City"
                        value={form.contact?.city || ""}
                        onChange={(e) => updateContact("city", e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        label="State"
                        value={form.contact?.state || ""}
                        onChange={(e) => updateContact("state", e.target.value)}
                        placeholder="State"
                      />
                      <Input
                        label="Country"
                        value={form.contact?.country || ""}
                        onChange={(e) => updateContact("country", e.target.value)}
                        placeholder="India"
                      />
                    </div>
                  </SectionCard>

                  <SectionCard title="Relation IDs">
                    <div className="grid gap-4">
                      <Input
                        label="Student Profile ID"
                        value={form.studentProfileId || ""}
                        onChange={(e) => updateField("studentProfileId", e.target.value)}
                        placeholder="ObjectId"
                      />
                      <Input
                        label="College Owner ID"
                        value={form.collegeOwnerId || ""}
                        onChange={(e) => updateField("collegeOwnerId", e.target.value)}
                        placeholder="ObjectId"
                      />
                      <Input
                        label="Company Owner ID"
                        value={form.companyOwnerId || ""}
                        onChange={(e) => updateField("companyOwnerId", e.target.value)}
                        placeholder="ObjectId"
                      />
                    </div>
                  </SectionCard>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-violet-300" /> Live Preview
                </h2>

                <div className="space-y-3 text-sm text-slate-300">
                  <InfoPreview label="Name" value={form.name || "—"} />
                  <InfoPreview label="Email" value={form.email || "—"} />
                  <InfoPreview label="Role" value={form.role || "student"} />
                  <InfoPreview label="Status" value={form.status || "active"} />
                  <InfoPreview
                    label="Verified"
                    value={form.isVerified ? "Yes" : "No"}
                  />
                  <InfoPreview
                    label="Profile Completion"
                    value={`${form.profileCompletion || 0}%`}
                  />
                  <InfoPreview
                    label="Theme"
                    value={form.settings?.theme || "dark"}
                  />
                  <InfoPreview
                    label="Notifications"
                    value={form.settings?.notifications ? "On" : "Off"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 xl:grid-cols-[1.2fr_1fr]"
            >
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Shield className="h-5 w-5 text-emerald-300" /> Status & Role Control
                </h2>

                <div className="grid gap-4">
                  <Select
                    label="Role"
                    value={form.role || "student"}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      updateField("role", nextRole);
                      handleRolePatch(nextRole);
                    }}
                  >
                    {ROLES.map((item) => (
                      <option key={item} value={item} className="bg-slate-950">
                        {item}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Status"
                    value={form.status || "active"}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      updateField("status", nextStatus);
                      handleStatusPatch(nextStatus);
                    }}
                  >
                    {STATUSES.map((item) => (
                      <option key={item} value={item} className="bg-slate-950">
                        {item}
                      </option>
                    ))}
                  </Select>

                  <div className="grid gap-3 md:grid-cols-2">
                    <Toggle
                      label="Verified"
                      checked={!!form.isVerified}
                      onChange={(v) => {
                        updateField("isVerified", v);
                        handleVerifyPatch(v);
                      }}
                    />
                    <Toggle
                      label="Notifications"
                      checked={!!form.settings?.notifications}
                      onChange={(v) => updateSettings("notifications", v)}
                    />
                  </div>

                  <Select
                    label="Theme"
                    value={form.settings?.theme || "dark"}
                    onChange={(e) => updateSettings("theme", e.target.value)}
                  >
                    {THEMES.map((item) => (
                      <option key={item} value={item} className="bg-slate-950">
                        {item}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Language"
                    value={form.settings?.language || "en"}
                    onChange={(e) => updateSettings("language", e.target.value)}
                    placeholder="en"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <BadgeCheck className="h-5 w-5 text-blue-300" /> Status Summary
                </h2>

                <div className="space-y-3">
                  <SummaryCard label="Current Role" value={form.role} tone="blue" />
                  <SummaryCard label="Account Status" value={form.status} tone={getToneByStatus(form.status)} />
                  <SummaryCard label="Verification" value={form.isVerified ? "Verified" : "Unverified"} tone={form.isVerified ? "green" : "amber"} />
                  <SummaryCard label="Profile Completion" value={`${form.profileCompletion || 0}%`} tone="violet" />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "links" && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 xl:grid-cols-2"
            >
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Relations & Connected IDs
                </h2>
                <div className="grid gap-4">
                  <InfoRow icon={IdCard} label="Student Profile ID" value={form.studentProfileId || "—"} />
                  <InfoRow icon={IdCard} label="College Owner ID" value={form.collegeOwnerId || "—"} />
                  <InfoRow icon={IdCard} label="Company Owner ID" value={form.companyOwnerId || "—"} />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Contact & Meta
                </h2>
                <div className="grid gap-4">
                  <InfoRow icon={Mail} label="Email" value={form.email || "—"} />
                  <InfoRow icon={Phone} label="Phone" value={form.contact?.phone || "—"} />
                  <InfoRow icon={MapPin} label="City" value={form.contact?.city || "—"} />
                  <InfoRow icon={MapPin} label="Country" value={form.contact?.country || "—"} />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 xl:grid-cols-2"
            >
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-lg font-semibold text-white">User Preview</h2>
                <div className="space-y-3 text-sm text-slate-300">
                  <PreviewLine label="Name" value={form.name || "—"} />
                  <PreviewLine label="Email" value={form.email || "—"} />
                  <PreviewLine label="Role" value={form.role || "student"} />
                  <PreviewLine label="Status" value={form.status || "active"} />
                  <PreviewLine label="Verified" value={form.isVerified ? "Yes" : "No"} />
                  <PreviewLine label="Theme" value={form.settings?.theme || "dark"} />
                  <PreviewLine label="Language" value={form.settings?.language || "en"} />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 text-lg font-semibold text-white">Current State</h2>
                <div className="space-y-2">
                  <Badge tone="blue">{form.role}</Badge>
                  <Badge tone={getToneByStatus(form.status)}>{form.status}</Badge>
                  <Badge tone={form.isVerified ? "green" : "amber"}>
                    {form.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoPreview({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, tone = "slate" }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("list"); // list | edit
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    isVerified: "",
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    count: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");

      if (search.trim()) params.set("search", search.trim());
      if (filters.role) params.set("role", filters.role);
      if (filters.status) params.set("status", filters.status);
      if (filters.isVerified !== "") params.set("isVerified", filters.isVerified);

      const data = await apiFetch(`${API_BASE}?${params.toString()}`);
      setUsers(data.data || []);
      setPagination({
        total: data.total || 0,
        pages: data.pages || 1,
        count: data.count || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.role, filters.status, filters.isVerified]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.contact?.phone?.toLowerCase().includes(q) ||
        u.contact?.city?.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const stats = useMemo(() => {
    const total = pagination.total || users.length;
    const active = users.filter((u) => u.status === "active").length;
    const verified = users.filter((u) => u.isVerified).length;
    const admins = users.filter((u) => u.role === "admin").length;

    return {
      total,
      active,
      verified,
      admins,
    };
  }, [users, pagination.total]);

  const openUser = async (user) => {
    try {
      setDetailLoading(true);
      const data = await apiFetch(`${API_BASE}/${user._id}`);
      setSelectedUser(data.data || data);
      setMode("edit");
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshSelected = async (updatedUser) => {
    if (!selectedUser?._id) return;
    const data = await apiFetch(`${API_BASE}/${selectedUser._id}`);
    setSelectedUser(data.data || data);
    await fetchUsers();
    if (updatedUser?._id) {
      const fresh = data.data || data;
      setSelectedUser(fresh);
    }
  };

  const backToList = () => {
    setSelectedUser(null);
    setMode("list");
  };

  const handleSaved = async () => {
    await fetchUsers();
    await refreshSelected();
  };

  const handleDeleted = async () => {
    await fetchUsers();
    setSelectedUser(null);
    setMode("list");
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      await apiFetch(`${API_BASE}/${user._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchUsers();
      if (selectedUser?._id === user._id) {
        const data = await apiFetch(`${API_BASE}/${user._id}`);
        setSelectedUser(data.data || data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleVerified = async (user) => {
    try {
      await apiFetch(`${API_BASE}/${user._id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: !user.isVerified }),
      });
      await fetchUsers();
      if (selectedUser?._id === user._id) {
        const data = await apiFetch(`${API_BASE}/${user._id}`);
        setSelectedUser(data.data || data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeRole = async (user) => {
    const nextRole = prompt(
      `Enter new role for ${user.name}:\nstudent / college / company / admin`,
      user.role
    );

    if (!nextRole) return;
    if (!ROLES.includes(nextRole)) {
      setError("Invalid role.");
      return;
    }

    try {
      await apiFetch(`${API_BASE}/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      await fetchUsers();
      if (selectedUser?._id === user._id) {
        const data = await apiFetch(`${API_BASE}/${user._id}`);
        setSelectedUser(data.data || data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (user) => {
    if (
      !confirm(`Delete ${user.name} permanently? This cannot be undone.`)
    ) {
      return;
    }

    try {
      await apiFetch(`${API_BASE}/${user._id}`, {
        method: "DELETE",
      });
      await fetchUsers();
      if (selectedUser?._id === user._id) {
        setSelectedUser(null);
        setMode("list");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (mode === "edit" && selectedUser) {
    return (
      <UserFormPage
        mode="edit"
        initialValue={selectedUser}
        onBack={backToList}
        onSaved={handleSaved}
        onDelete={handleDeleted}
        onForceRefresh={refreshSelected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
              Admin Panel
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              User Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Search, inspect, verify, update, and delete users from one fully
              detailed management screen.
            </p>
          </div>

          <Button
            onClick={fetchUsers}
            className="border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            icon={loading || detailLoading ? Loader2 : RefreshCcw}
          >
            {loading || detailLoading ? "Loading" : "Refresh"}
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.total}
            hint="All user accounts"
          />
          <StatCard
            icon={BadgeCheck}
            label="Verified"
            value={stats.verified}
            hint="Verified accounts"
          />
          <StatCard
            icon={ShieldCheck}
            label="Active"
            value={stats.active}
            hint="Currently active"
          />
          <StatCard
            icon={UserCog}
            label="Admins"
            value={stats.admins}
            hint="Admin accounts"
          />
        </div>

        <div className="mb-6 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20">
          <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr_1fr]">
            <label className="block">
              <FieldLabel>Search users</FieldLabel>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, phone, city..."
                  className="w-full rounded-2xl border border-slate-700 bg-gray-950 py-3 pl-11 pr-4 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </label>

            <Select
              label="Role Filter"
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <option value="" className="bg-slate-950">
                All Roles
              </option>
              {ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-950">
                  {role}
                </option>
              ))}
            </Select>

            <Select
              label="Status Filter"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="" className="bg-slate-950">
                All Statuses
              </option>
              {STATUSES.map((status) => (
                <option key={status} value={status} className="bg-slate-950">
                  {status}
                </option>
              ))}
            </Select>

            <Select
              label="Verification"
              value={filters.isVerified}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isVerified: e.target.value }))
              }
            >
              <option value="" className="bg-slate-950">
                All
              </option>
              <option value="true" className="bg-slate-950">
                Verified
              </option>
              <option value="false" className="bg-slate-950">
                Unverified
              </option>
            </Select>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">All Users</h2>
                <p className="text-sm text-slate-400">
                  Click a user to open the detailed management view.
                </p>
              </div>
              <div className="text-sm text-slate-500">
                Showing {filteredUsers.length} of {pagination.total}
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
                  <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                  Loading users...
                </div>
              ) : filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <UserCard key={user._id} user={user} onOpen={openUser} />
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-500">
                  <CircleAlert className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                  No users found.
                </div>
              )}
            </div>

            {/* <div className="mt-6 flex items-center justify-between rounded-[2rem] border border-slate-800 bg-slate-900/70 px-4 py-3">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                icon={ChevronLeft}
              >
                Prev
              </Button>

              <div className="text-sm text-slate-400">
                Page <span className="text-white">{page}</span> of{" "}
                <span className="text-white">{pagination.pages || 1}</span>
              </div>

              <Button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages || 1, p + 1))
                }
                disabled={page >= (pagination.pages || 1)}
                className="border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                icon={ChevronRight}
              >
                Next
              </Button>
            </div> */}
          </div>

          <AnimatePresence>
            {selectedUser ? (
              <UserDetailPanel
                key={selectedUser._id}
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onEdit={(user) => {
                  setSelectedUser(user);
                  setMode("edit");
                }}
                onRefresh={refreshSelected}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onToggleVerified={handleToggleVerified}
                onChangeRole={handleChangeRole}
              />
            ) : (
                null
            //   <div className="flex min-h-[500px] items-center justify-center rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-500">
            //     <div>
            //       <Eye className="mx-auto mb-3 h-8 w-8 text-slate-600" />
            //       <p className="text-sm">
            //         Select a user to see the full detail and control panel.
            //       </p>
            //     </div>
            //   </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}