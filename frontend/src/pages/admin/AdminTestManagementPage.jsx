import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  Eye,
  ArrowLeft,
  Save,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  FileText,
  Clock3,
  Sparkles,
  Tag,
  ListChecks,
  User2,
  Layers3,
  GripVertical,
  CircleAlert,
  Ban,
} from "lucide-react";

/*
  AdminTestManagementPage.jsx
  Single-file, production-style admin UI for:
  - list all tests
  - open a test for edit/detail
  - create new test
  - update
  - soft delete / restore
  - hard delete

  Assumes your backend routes:
  GET    /api/tests
  GET    /api/tests/:testId
  POST   /api/tests
  PUT    /api/tests/:testId
  PATCH  /api/tests/:testId/soft-delete
  PATCH  /api/tests/:testId/restore
  DELETE /api/tests/:testId
*/

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/admin/test";

const TEST_CATEGORIES = [
  "Aptitude",
  "Personality",
  "Technical",
  "Career Assessment",
];

const QUESTION_TYPES = ["MCQ", "TrueFalse", "Numeric", "Scenario", "Descriptive"];
const QUESTION_CATEGORIES = ["Aptitude", "Personality", "Technical", "Analytical", "Creative"];
const CAREER_TAGS = [
  "Engineering",
  "Medical",
  "Design",
  "Law",
  "Management",
  "Research",
  "Entrepreneurship",
  "Teaching",
  "Defense",
  "Civil Services",
  "Media",
  "AI",
  "Finance",
];
const PERSONALITY_IMPACTS = ["Leader", "Creative", "Analytical", "Empathetic", "Practical"];

const emptyQuestion = () => ({
  questionText: "",
  type: "MCQ",
  correctAnswer: "",
  marks: 1,
  difficulty: "Medium",
  questionCategory: "Aptitude",
  isActive: true,
  competencies: {
    analytical: 0,
    verbal: 0,
    creative: 0,
    scientific: 0,
    social: 0,
    technical: 0,
  },
  personalityTraits: {
    leadership: 0,
    teamwork: 0,
    riskTaking: 0,
    discipline: 0,
    adaptability: 0,
    creativity: 0,
  },
  careerTags: [],
  options: [
    { text: "", weight: 1, isCorrect: false, personalityImpact: "" },
    { text: "", weight: 1, isCorrect: false, personalityImpact: "" },
  ],
});

const emptyTest = () => ({
  title: "",
  description: "",
  category: "Career Assessment",
  duration: 30,
  randomizeQuestions: true,
  isActive: true,
  questions: [emptyQuestion()],
});

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function prettyDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function scoreBadge(score) {
  if (score >= 80) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (score >= 50) return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  return "bg-rose-500/15 text-rose-300 border-rose-500/30";
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token"),
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

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
          {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "border-slate-700 bg-slate-800/70 text-slate-200",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    yellow: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    red: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    purple: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneMap[tone])}>
      {children}
    </span>
  );
}

function InputField({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className={cn("input-field", className)} {...props} />
    </label>
  );
}

function TextAreaField({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <textarea className={cn("input-field min-h-[120px] resize-y", className)} {...props} />
    </label>
  );
}

function SelectField({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className={cn("input-field", className)} {...props}>
        {children}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
        checked
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className={cn("flex h-6 w-11 items-center rounded-full p-1 transition", checked ? "bg-emerald-500" : "bg-slate-700") }>
        <span className={cn("h-4 w-4 rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-0")} />
      </span>
    </button>
  );
}

function QuestionCard({ question, index, onChange, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const update = (key, value) => onChange(index, { ...question, [key]: value });

  const updateCompetency = (key, value) =>
    onChange(index, {
      ...question,
      competencies: {
        ...question.competencies,
        [key]: value,
      },
    });

  const updatePersonality = (key, value) =>
    onChange(index, {
      ...question,
      personalityTraits: {
        ...question.personalityTraits,
        [key]: value,
      },
    });

  const updateOption = (optIndex, nextOpt) => {
    const nextOptions = [...(question.options || [])];
    nextOptions[optIndex] = nextOpt;
    update("options", nextOptions);
  };

  const addOption = () => {
    update("options", [
      ...(question.options || []),
      { text: "", weight: 1, isCorrect: false, personalityImpact: "" },
    ]);
  };

  const removeOption = (optIndex) => {
    update("options", question.options.filter((_, i) => i !== optIndex));
  };

  return (
    <motion.div layout className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-300">
            <span className="text-sm font-semibold">{index + 1}</span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Question {index + 1}</h3>
            <p className="text-sm text-slate-400">Configure text, scoring, tags, and answer options.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onMoveUp(index)} disabled={!canMoveUp} className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronUp className="mr-1 inline h-4 w-4" /> Up
          </button>
          <button type="button" onClick={() => onMoveDown(index)} disabled={!canMoveDown} className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronDown className="mr-1 inline h-4 w-4" /> Down
          </button>
          <button type="button" onClick={() => onRemove(index)} className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20">
            <Trash2 className="mr-1 inline h-4 w-4" /> Remove
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="label">Question Text</span>
          <textarea
            className="input-field min-h-[110px] resize-y"
            value={question.questionText}
            onChange={(e) => update("questionText", e.target.value)}
            placeholder="Enter the question text..."
          />
        </label>

        <SelectField label="Question Type" value={question.type} onChange={(e) => update("type", e.target.value)}>
          {QUESTION_TYPES.map((t) => (
            <option key={t} value={t} className="bg-slate-950">
              {t}
            </option>
          ))}
        </SelectField>

        <SelectField label="Question Category" value={question.questionCategory} onChange={(e) => update("questionCategory", e.target.value)}>
          {QUESTION_CATEGORIES.map((t) => (
            <option key={t} value={t} className="bg-slate-950">
              {t}
            </option>
          ))}
        </SelectField>

        <InputField label="Correct Answer" value={question.correctAnswer} onChange={(e) => update("correctAnswer", e.target.value)} placeholder="Text / number / boolean" />
        <InputField label="Marks" type="number" min="0" value={question.marks} onChange={(e) => update("marks", e.target.value)} />
        <SelectField label="Difficulty" value={question.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
          {['Easy', 'Medium', 'Hard'].map((d) => (
            <option key={d} value={d} className="bg-slate-950">
              {d}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-200">
            <Layers3 className="h-4 w-4 text-blue-300" />
            <p className="text-sm font-semibold">Competencies</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.keys(question.competencies || {}).map((k) => (
              <InputField
                key={k}
                label={k}
                type="number"
                min="0"
                value={question.competencies?.[k] ?? 0}
                onChange={(e) => updateCompetency(k, Number(e.target.value))}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-200">
            <User2 className="h-4 w-4 text-violet-300" />
            <p className="text-sm font-semibold">Personality Traits</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.keys(question.personalityTraits || {}).map((k) => (
              <InputField
                key={k}
                label={k}
                type="number"
                min="0"
                value={question.personalityTraits?.[k] ?? 0}
                onChange={(e) => updatePersonality(k, Number(e.target.value))}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Career Tags</span>
            <span className="text-xs text-slate-500">Choose one or more</span>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
            {CAREER_TAGS.map((tag) => {
              const active = question.careerTags?.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => {
                    const current = question.careerTags || [];
                    update(
                      "careerTags",
                      active ? current.filter((x) => x !== tag) : [...current, tag]
                    );
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ToggleField label="Question Active" checked={question.isActive} onChange={(v) => update("isActive", v)} />
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <ListChecks className="h-4 w-4 text-emerald-300" />
                <p className="text-sm font-semibold">Options</p>
              </div>
              {(question.type === "MCQ" || question.type === "TrueFalse") ? (
                <button type="button" onClick={addOption} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800">
                  + Add Option
                </button>
              ) : (
                <span className="text-xs text-slate-500">Not required for this type</span>
              )}
            </div>

            {(question.type === "MCQ" || question.type === "TrueFalse") ? (
              <div className="space-y-3">
                {(question.options || []).map((opt, optIndex) => (
                  <div key={optIndex} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <InputField
                        label={`Option ${optIndex + 1}`}
                        value={opt.text}
                        onChange={(e) => updateOption(optIndex, { ...opt, text: e.target.value })}
                      />
                      <InputField
                        label="Weight"
                        type="number"
                        value={opt.weight}
                        onChange={(e) => updateOption(optIndex, { ...opt, weight: Number(e.target.value) })}
                      />
                      <SelectField
                        label="Personality Impact"
                        value={opt.personalityImpact || ""}
                        onChange={(e) => updateOption(optIndex, { ...opt, personalityImpact: e.target.value })}
                      >
                        <option value="" className="bg-slate-950">None</option>
                        {PERSONALITY_IMPACTS.map((p) => (
                          <option key={p} value={p} className="bg-slate-950">
                            {p}
                          </option>
                        ))}
                      </SelectField>
                      <div className="flex items-end justify-between gap-3">
                        <ToggleField
                          label="Correct"
                          checked={!!opt.isCorrect}
                          onChange={(v) => updateOption(optIndex, { ...opt, isCorrect: v })}
                        />
                        <button type="button" onClick={() => removeOption(optIndex)} className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-300 transition hover:bg-rose-500/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
                This question type is typically answered as text, number, or scenario input.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestFormPage({ mode, initialTest, onBack, onSaved, onDeleted }) {
  const [form, setForm] = useState(initialTest || emptyTest());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    setForm(initialTest || emptyTest());
  }, [initialTest]);

  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const updateQuestion = (index, nextQuestion) => {
    setForm((p) => {
      const next = [...p.questions];
      next[index] = nextQuestion;
      return { ...p, questions: next };
    });
  };
  const addQuestion = () => setForm((p) => ({ ...p, questions: [...p.questions, emptyQuestion()] }));
  const removeQuestion = (index) =>
    setForm((p) => ({
      ...p,
      questions: p.questions.filter((_, i) => i !== index),
    }));

  const moveQuestion = (from, to) => {
    setForm((p) => {
      const next = [...p.questions];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...p, questions: next };
    });
  };

  const payload = useMemo(() => {
    return {
      title: form.title?.trim(),
      description: form.description?.trim(),
      category: form.category,
      duration: Number(form.duration),
      randomizeQuestions: !!form.randomizeQuestions,
      isActive: !!form.isActive,
      questions: form.questions,
    };
  }, [form]);

  const validateClient = () => {
    if (!payload.title) return "Title is required.";
    if (!payload.questions?.length) return "Add at least one question.";
    for (let i = 0; i < payload.questions.length; i++) {
      const q = payload.questions[i];
      if (!q.questionText?.trim()) return `Question #${i + 1} needs text.`;
      if ((q.type === "MCQ" || q.type === "TrueFalse") && (!q.options || q.options.length < 2)) {
        return `Question #${i + 1}: MCQ/TrueFalse needs at least 2 options.`;
      }
    }
    return "";
  };

  const handleSave = async () => {
    const validationMessage = validateClient();
    if (validationMessage) {
      setError(validationMessage);
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let data;
      if (mode === "create") {
        data = await apiFetch(API_BASE, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        data = await apiFetch(`${API_BASE}/${form._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      setSuccess(mode === "create" ? "Test created successfully." : "Test updated successfully.");
      onSaved?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!form._id) return;
    if (!confirm("Move this test to inactive state?")) return;

    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE}/${form._id}/soft-delete`, { method: "PATCH" });
      setSuccess("Test soft deleted.");
      onSaved?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!form._id) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE}/${form._id}/restore`, { method: "PATCH" });
      setSuccess("Test restored.");
      onSaved?.(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHardDelete = async () => {
    if (!form._id) return;
    if (!confirm("Permanently delete this test? This cannot be undone.")) return;

    setLoading(true);
    setError("");
    try {
      await apiFetch(`${API_BASE}/${form._id}`, { method: "DELETE" });
      onDeleted?.(form._id);
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
            <button onClick={onBack} className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to list
            </button>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {mode === "create" ? "Add New Test" : "Edit Test"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {mode === "create"
                ? "Create a new assessment with questions, scoring, tags, and competency mapping."
                : "Update the selected test, soft delete it, restore it, or permanently remove it."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {mode === "edit" ? (
              <>
                <button onClick={handleSoftDelete} className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20">
                  <Ban className="h-4 w-4" /> Soft Delete
                </button>
                <button onClick={handleRestore} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20">
                  <RotateCcw className="h-4 w-4" /> Restore
                </button>
                <button onClick={handleHardDelete} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </>
            ) : null}
            <button onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {mode === "create" ? "Create Test" : "Save Changes"}
            </button>
          </div>
        </div>

        {(error || success) && (
          <div className={cn(
            "mb-6 rounded-2xl border px-4 py-3 text-sm",
            error ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          )}>
            {error || success}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: "details", label: "Details" },
            { key: "questions", label: `Questions (${form.questions?.length || 0})` },
            { key: "preview", label: "Preview" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition",
                activeTab === tab.key
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "details" && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 lg:col-span-2">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <FileText className="h-5 w-5 text-blue-300" /> Test Details
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Professional Path Mastery Assessment" />
                  <SelectField label="Category" value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                    {TEST_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-950">
                        {c}
                      </option>
                    ))}
                  </SelectField>
                  <InputField label="Duration (minutes)" type="number" min="1" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} />
                  <ToggleField label="Randomize Questions" checked={!!form.randomizeQuestions} onChange={(v) => updateField("randomizeQuestions", v)} />
                  <div className="md:col-span-2">
                    <TextAreaField label="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe the purpose of this assessment..." />
                  </div>
                  <ToggleField label="Test Active" checked={!!form.isActive} onChange={(v) => updateField("isActive", v)} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-violet-300" /> Live Summary
                </h2>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Title</span>
                    <span className="max-w-[180px] truncate text-slate-100">{form.title || "Untitled"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Category</span>
                    <Badge tone="blue">{form.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Duration</span>
                    <span>{form.duration || 0} min</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Questions</span>
                    <span>{form.questions?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <span>Status</span>
                    <Badge tone={form.isActive ? "green" : "red"}>{form.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "questions" && (
            <motion.div key="questions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Question Builder</h2>
                  <p className="text-sm text-slate-400">Add, reorder, and edit each question individually.</p>
                </div>
                <button onClick={addQuestion} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
                  <Plus className="h-4 w-4" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {(form.questions || []).map((q, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <QuestionCard
                        question={q}
                        index={index}
                        onChange={updateQuestion}
                        onRemove={removeQuestion}
                        onMoveUp={(i) => i > 0 && moveQuestion(i, i - 1)}
                        onMoveDown={(i) => i < form.questions.length - 1 && moveQuestion(i, i + 1)}
                        canMoveUp={index > 0}
                        canMoveDown={index < form.questions.length - 1}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-3 text-lg font-semibold text-white">Test Preview</h2>
                <div className="space-y-3 text-sm text-slate-300">
                  <p><span className="text-slate-500">Title:</span> {form.title || "Untitled"}</p>
                  <p><span className="text-slate-500">Category:</span> {form.category}</p>
                  <p><span className="text-slate-500">Description:</span> {form.description || "—"}</p>
                  <p><span className="text-slate-500">Duration:</span> {form.duration || 0} minutes</p>
                  <p><span className="text-slate-500">Question Count:</span> {form.questions?.length || 0}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
                <h2 className="mb-3 text-lg font-semibold text-white">First Question Preview</h2>
                {form.questions?.[0] ? (
                  <div className="space-y-3 text-sm text-slate-300">
                    <p className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">{form.questions[0].questionText || "Question text goes here"}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="blue">{form.questions[0].type}</Badge>
                      <Badge tone="purple">{form.questions[0].questionCategory}</Badge>
                      <Badge tone={form.questions[0].isActive ? "green" : "red"}>
                        {form.questions[0].isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-slate-500">Options: {(form.questions[0].options || []).length}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No questions available.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TestRow({ test, onOpen }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20 transition hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{test.title}</h3>
            <Badge tone={test.isActive ? "green" : "red"}>{test.isActive ? "Active" : "Inactive"}</Badge>
            <Badge tone="blue">{test.category}</Badge>
            <Badge tone="slate">{test.questionCount || test.questions?.length || 0} questions</Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">{test.description || "No description added."}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {test.duration || 0} min</span>
            <span className="inline-flex items-center gap-1"><Tag className="h-4 w-4" /> {test.totalMarks ?? 0} marks</span>
            <span className="inline-flex items-center gap-1"><FileText className="h-4 w-4" /> Updated {prettyDate(test.updatedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => onOpen(test)} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
            <Eye className="h-4 w-4" /> Open
          </button>
          <button onClick={() => onOpen(test)} className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-200 transition hover:bg-blue-500/20">
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TestDetailsPanel({ test, onClose, onEdit, onRefresh, onSoftDelete, onRestore, onHardDelete }) {
  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      className="sticky top-6 h-[calc(100vh-3rem)] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Selected Test</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{test.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-300 transition hover:bg-slate-800">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="custom-scrollbar h-[calc(100%-73px)] overflow-y-auto p-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone={test.isActive ? "green" : "red"}>{test.isActive ? "Active" : "Inactive"}</Badge>
          <Badge tone="blue">{test.category}</Badge>
          <Badge tone="slate">{test.questionCount || test.questions?.length || 0} Questions</Badge>
          <Badge tone="purple">{test.duration || 0} min</Badge>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Description</p>
            <p className="mt-2 leading-6 text-slate-200">{test.description || "No description provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Marks</p>
              <p className="mt-2 text-xl font-semibold text-white">{test.totalMarks ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Randomize</p>
              <p className="mt-2 text-xl font-semibold text-white">{test.randomizeQuestions ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created</p>
              <p className="mt-2 text-sm font-medium text-white">{prettyDate(test.createdAt)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</p>
              <p className="mt-2 text-sm font-medium text-white">{prettyDate(test.updatedAt)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Competency Profile</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(test.competencyProfile || {}).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="text-sm font-semibold text-white">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Personality Profile</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(test.personalityProfile || {}).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                  <p className="text-xs text-slate-500">{k}</p>
                  <p className="text-sm font-semibold text-white">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dominant Career Signals</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(test.dominantCareerSignals || []).length ? (
                test.dominantCareerSignals.map((s) => <Badge key={s} tone="blue">{s}</Badge>)
              ) : (
                <span className="text-sm text-slate-500">None</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <button onClick={() => onEdit(test)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
            <Edit3 className="h-4 w-4" /> Edit This Test
          </button>
          <button onClick={onRefresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
            <Copy className="h-4 w-4" /> Refresh Details
          </button>
          <button onClick={() => onSoftDelete(test)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20">
            <Ban className="h-4 w-4" /> Soft Delete
          </button>
          <button onClick={() => onRestore(test)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20">
            <RotateCcw className="h-4 w-4" /> Restore
          </button>
          <button onClick={() => onHardDelete(test)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20">
            <Trash2 className="h-4 w-4" /> Delete Permanently
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

export default function AdminTestManagementPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [mode, setMode] = useState("list"); // list | create | edit
  const [pageError, setPageError] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "all" });
  const [refreshing, setRefreshing] = useState(false);

  const fetchTests = async () => {
    setLoading(true);
    setPageError("");
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.status !== "all") params.set("isActive", filters.status === "active" ? "true" : "false");
      const data = await apiFetch(`${API_BASE}?${params.toString()}`);
      setTests(data.data || []);
    } catch (err) {
      setPageError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.status]);

  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter((t) => {
      return (
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    });
  }, [tests, search]);

  const stats = useMemo(() => {
    const total = tests.length;
    const active = tests.filter((t) => t.isActive).length;
    const inactive = total - active;
    const avgQuestions = total
      ? Math.round(
          tests.reduce((sum, t) => sum + (t.questionCount || t.questions?.length || 0), 0) / total
        )
      : 0;
    return { total, active, inactive, avgQuestions };
  }, [tests]);

  const openCreate = () => setMode("create");
  const openEdit = (test) => {
    setSelectedTest(test);
    setMode("edit");
  };
  const backToList = () => {
    setSelectedTest(null);
    setMode("list");
  };

  const handleSaved = async () => {
    await fetchTests();
    setMode("list");
    setSelectedTest(null);
  };

  const handleDeleted = async () => {
    await fetchTests();
    setMode("list");
    setSelectedTest(null);
  };

  const handleOpenTest = async (test) => {
    try {
      setRefreshing(true);
      const data = await apiFetch(`${API_BASE}/${test._id}`);
      setSelectedTest(data.data || data);
      setMode("edit");
    } catch (err) {
      setPageError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSoftDeleteFromPanel = async (test) => {
    try {
      await apiFetch(`${API_BASE}/${test._id}/soft-delete`, { method: "PATCH" });
      await fetchTests();
      const refreshed = await apiFetch(`${API_BASE}/${test._id}`);
      setSelectedTest(refreshed.data || refreshed);
    } catch (err) {
      setPageError(err.message);
    }
  };

  const handleRestoreFromPanel = async (test) => {
    try {
      await apiFetch(`${API_BASE}/${test._id}/restore`, { method: "PATCH" });
      await fetchTests();
      const refreshed = await apiFetch(`${API_BASE}/${test._id}`);
      setSelectedTest(refreshed.data || refreshed);
    } catch (err) {
      setPageError(err.message);
    }
  };

  const handleHardDeleteFromPanel = async (test) => {
    if (!confirm("Permanently delete this test?")) return;
    try {
      await apiFetch(`${API_BASE}/${test._id}`, { method: "DELETE" });
      await fetchTests();
      setSelectedTest(null);
      setMode("list");
    } catch (err) {
      setPageError(err.message);
    }
  };

  if (mode === "create") {
    return (
      <TestFormPage
        mode="create"
        initialTest={emptyTest()}
        onBack={backToList}
        onSaved={handleSaved}
      />
    );
  }

  if (mode === "edit" && selectedTest) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TestFormPage
            mode="edit"
            initialTest={selectedTest}
            onBack={backToList}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Test Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              See all tests, open any test to edit or delete it, or create a new test with full question and competency mapping.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> Add New Test
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileText} label="Total Tests" value={stats.total} hint="All assessments in the system" />
          <StatCard icon={CheckCircle2} label="Active Tests" value={stats.active} hint="Currently available assessments" />
          <StatCard icon={Ban} label="Inactive Tests" value={stats.inactive} hint="Soft deleted or disabled tests" />
          <StatCard icon={ListChecks} label="Avg Questions" value={stats.avgQuestions} hint="Average per test" />
        </div>

        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20">
          <div className="grid gap-3 lg:grid-cols-3">
            <label className="block lg:col-span-2">
              <span className="label">Search tests</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-11"
                  placeholder="Search by title, category, description..."
                />
              </div>
            </label>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <SelectField
                label="Category"
                value={filters.category}
                onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="" className="bg-slate-950">All Categories</option>
                {TEST_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-950">{c}</option>
                ))}
              </SelectField>
              <SelectField
                label="Status"
                value={filters.status}
                onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="all" className="bg-slate-950">All</option>
                <option value="active" className="bg-slate-950">Active</option>
                <option value="inactive" className="bg-slate-950">Inactive</option>
              </SelectField>
            </div>
          </div>
        </div>

        {pageError ? (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {pageError}
          </div>
        ) : null}

        <div className="">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">All Tests</h2>
                <p className="text-sm text-slate-400">Click any test to open its detail and edit actions.</p>
              </div>
              <button onClick={fetchTests} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
                {loading || refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
                  <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                  Loading tests...
                </div>
              ) : filteredTests.length ? (
                filteredTests.map((test) => (
                  <TestRow key={test._id} test={test} onOpen={handleOpenTest} />
                ))
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
                  <CircleAlert className="mx-auto mb-3 h-6 w-6 text-slate-500" />
                  No tests found.
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedTest ? (
              <TestDetailsPanel
                key={selectedTest._id}
                test={selectedTest}
                onClose={() => setSelectedTest(null)}
                onEdit={(test) => {
                  setSelectedTest(test);
                  setMode("edit");
                }}
                onRefresh={() => handleOpenTest(selectedTest)}
                onSoftDelete={handleSoftDeleteFromPanel}
                onRestore={handleRestoreFromPanel}
                onHardDelete={handleHardDeleteFromPanel}
              />
            ) : (
              null
              // <div className="flex h-full min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-slate-500">
              //   <div>
              //     <Eye className="mx-auto mb-3 h-8 w-8 text-slate-600" />
              //     <p className="text-sm">Select a test to open its full details.</p>
              //   </div>
              // </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
