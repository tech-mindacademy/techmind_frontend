import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { fetchUsers } from "../../api/services/admin.service.js";
import {
  createLiveClass, fetchLiveClasses, updateLiveClass,
  cancelLiveClass, deleteLiveClass, endLiveClass, fetchAttendance,
} from "../../api/services/liveClass.service.js";

const INITIAL_FORM = {
  title: "", description: "", internship: "", batch: "", mentor: "",
  scheduledDate: "", scheduledStartTime: "", scheduledEndTime: "",
  recordingEnabled: false, minAttendanceMinutes: 10,
  settings: {
    micOnJoin: false, cameraOnJoin: false, allowStudentScreenShare: false,
    allowChat: true, allowRaiseHand: true, maxParticipants: 100,
  },
};

const STATUS_STYLE = {
  scheduled: "bg-indigo-100 text-indigo-700",
  live: "bg-red-100 text-red-600",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

const fmtDateTime = (c) =>
  `${new Date(c.scheduledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · ${c.scheduledStartTime}–${c.scheduledEndTime}`;

const fmtDuration = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
};

export default function LiveClassManagement() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [attendanceFor, setAttendanceFor] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [internRes, usersRes, classesRes] = await Promise.all([
          api.get("/internships/admin/all"),
          fetchUsers({ role: "admin" }).catch(() => ({ users: [] })),
          fetchLiveClasses(),
        ]);
        setInternships(internRes.data.internships || []);
        setAdmins((usersRes.users || usersRes.data?.users || []).filter((u) => u.role === "admin"));
        setLiveClasses(classesRes.liveClasses || []);
      } catch {
        setInternships([]);
        setLiveClasses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshClasses = async () => {
    const { liveClasses: list } = await fetchLiveClasses();
    setLiveClasses(list || []);
  };

  const selectedInternship = internships.find((i) => i._id === form.internship);

  const openCreate = () => {
    setEditId(null);
    setForm(INITIAL_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditId(c._id);
    setForm({
      title: c.title,
      description: c.description || "",
      internship: c.internship._id,
      batch: c.batch || "",
      mentor: c.mentor._id,
      scheduledDate: c.scheduledDate.split("T")[0],
      scheduledStartTime: c.scheduledStartTime,
      scheduledEndTime: c.scheduledEndTime,
      recordingEnabled: c.recordingEnabled,
      minAttendanceMinutes: c.minAttendanceMinutes,
      settings: c.settings,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editId) {
        await updateLiveClass(editId, form);
      } else {
        await createLiveClass(form);
      }
      setShowForm(false);
      await refreshClasses();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save live class.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (c) => {
    if (!window.confirm("Cancel this live class? Enrolled students will not be notified further.")) return;
    await cancelLiveClass(c._id, "Cancelled by admin");
    refreshClasses();
  };

  const handleDelete = async (c) => {
    if (!window.confirm("Permanently delete this live class and its attendance records?")) return;
    try {
      await deleteLiveClass(c._id);
      refreshClasses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleEnd = async (c) => {
    if (!window.confirm("End this live class now?")) return;
    await endLiveClass(c._id);
    refreshClasses();
  };

  const openAttendance = async (c) => {
    setAttendanceFor(c);
    setAttendanceLoading(true);
    try {
      const { attendance: list } = await fetchAttendance(c._id);
      setAttendance(list || []);
    } catch {
      setAttendance([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Attendance drawer */}
      {attendanceFor && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setAttendanceFor(null)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30 }}
            className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{attendanceFor.title}</h2>
                <p className="text-xs text-gray-500">{attendance.length} attendance record{attendance.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setAttendanceFor(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-3">
              {attendanceLoading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : attendance.length === 0 ? (
                <p className="text-sm text-gray-400">No attendance records yet.</p>
              ) : (
                attendance.map((a) => (
                  <div key={a._id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {a.user?.name} {a.role === "host" && <span className="text-indigo-500 text-xs">(Host)</span>}
                      </p>
                      <p className="text-xs text-gray-500">{a.user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {a.sessions?.length || 0} session{a.sessions?.length !== 1 ? "s" : ""} · {fmtDuration(a.totalDurationSeconds)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        a.status === "present" ? "bg-emerald-100 text-emerald-700"
                        : a.status === "late" ? "bg-amber-100 text-amber-700"
                        : a.status === "absent" ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Class Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Schedule and run live sessions for internship batches
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
        >
          + Schedule Live Class
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-6 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 dark:text-white mb-5">
            {editId ? "Edit Live Class" : "Schedule New Live Class"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Title *">
              <input
                required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls} placeholder="e.g. Week 2 — React Fundamentals"
              />
            </Field>
            <Field label="Internship *">
              <select
                required disabled={!!editId} value={form.internship}
                onChange={(e) => setForm({ ...form, internship: e.target.value, batch: "" })}
                className={inputCls}
              >
                <option value="">Select internship</option>
                {internships.map((i) => (
                  <option key={i._id} value={i._id}>{i.title} — {i.company}</option>
                ))}
              </select>
            </Field>
            <Field label="Batch (optional)">
              <select
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className={inputCls}
              >
                <option value="">All batches</option>
                {(selectedInternship?.batches || []).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Host (Admin) *">
              <select
                required value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                className={inputCls}
              >
                <option value="">Select host</option>
                {admins.map((a) => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Date *">
              <input
                type="date" required min={new Date().toISOString().split("T")[0]}
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Time *">
                <input
                  type="time" required value={form.scheduledStartTime}
                  onChange={(e) => setForm({ ...form, scheduledStartTime: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="End Time *">
                <input
                  type="time" required value={form.scheduledEndTime}
                  onChange={(e) => setForm({ ...form, scheduledEndTime: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>

            <Field label="Min. Attendance (minutes)">
              <input
                type="number" min="0" value={form.minAttendanceMinutes}
                onChange={(e) => setForm({ ...form, minAttendanceMinutes: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Max Participants">
              <input
                type="number" min="2" value={form.settings.maxParticipants}
                onChange={(e) => setForm({ ...form, settings: { ...form.settings, maxParticipants: Number(e.target.value) } })}
                className={inputCls}
              />
            </Field>

            <div className="sm:col-span-2 flex flex-wrap gap-4">
              {[
                ["recordingEnabled", "Enable Recording", form.recordingEnabled, (v) => setForm({ ...form, recordingEnabled: v })],
                ["allowChat", "Allow Chat", form.settings.allowChat, (v) => setForm({ ...form, settings: { ...form.settings, allowChat: v } })],
                ["allowRaiseHand", "Allow Raise Hand", form.settings.allowRaiseHand, (v) => setForm({ ...form, settings: { ...form.settings, allowRaiseHand: v } })],
                ["allowStudentScreenShare", "Students Can Screen Share", form.settings.allowStudentScreenShare, (v) => setForm({ ...form, settings: { ...form.settings, allowStudentScreenShare: v } })],
              ].map(([key, label, checked, onChange]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                  {label}
                </label>
              ))}
            </div>

            {formError && (
              <div className="sm:col-span-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition"
              >
                {saving ? "Saving..." : editId ? "Update Class" : "Schedule Class"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-40" />)}
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎥</div>
          <p className="font-medium text-gray-500 dark:text-gray-400">No live classes scheduled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveClasses.map((c) => (
            <div key={c._id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{c.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLE[c.status]}`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                {c.internship?.title} · {c.internship?.company} {c.batch && `· Batch: ${c.batch}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {fmtDateTime(c)} · Host: {c.mentor?.name}
              </p>

              <div className="flex flex-wrap gap-2">
                {c.status === "scheduled" && (
                  <>
                    <button onClick={() => navigate(`/classroom/${c._id}`)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition">
                      Start Class
                    </button>
                    <button onClick={() => openEdit(c)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      Edit
                    </button>
                    <button onClick={() => handleCancel(c)} className="px-3 py-1.5 border border-amber-200 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-50 transition">
                      Cancel
                    </button>
                  </>
                )}
                {c.status === "live" && (
                  <>
                    <button onClick={() => navigate(`/classroom/${c._id}`)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition">
                      Enter Classroom
                    </button>
                    <button onClick={() => handleEnd(c)} className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition">
                      End Class
                    </button>
                  </>
                )}
                <button onClick={() => openAttendance(c)} className="px-3 py-1.5 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">
                  Attendance
                </button>
                {(c.status === "scheduled" || c.status === "cancelled") && (
                  <button onClick={() => handleDelete(c)} className="px-3 py-1.5 border border-red-200 dark:border-red-900 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}