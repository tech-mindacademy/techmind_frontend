import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";

const INITIAL_FORM = {
  title: "",
  company: "",
  location: "",
  duration: "",
  stipend: "",
  description: "",
  requirements: "",
  skills: "",
  type: "remote",
  domain: "",
  openings: 1,
  lastDate: "",
  isActive: true,
};
const Field = ({ label, children }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
};
const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
export default function InternshipManagement() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [viewApps, setViewApps] = useState(null); // internship whose apps we're viewing
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [tab, setTab] = useState("internships");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data } = await api.get("/internships/admin/all");
      setInternships(data.internships || []);
    } catch {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (intern) => {
    setViewApps(intern);
    setAppsLoading(true);
    try {
      const { data } = await api.get(`/internships/${intern._id}/applications`);
      setApplications(data.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleEdit = (intern) => {
    setEditId(intern._id);
    setForm({
      ...intern,
      skills: Array.isArray(intern.skills)
        ? intern.skills.join(", ")
        : intern.skills || "",
      lastDate: intern.lastDate ? intern.lastDate.split("T")[0] : "",
    });
    setShowForm(true);
    setFormError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    try {
      await api.delete(`/internships/${id}`);
      fetchInternships();
    } catch {
      alert("Delete failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editId) {
        await api.put(`/internships/${editId}`, form);
      } else {
        await api.post("/internships", form);
      }
      setShowForm(false);
      setEditId(null);
      setForm(INITIAL_FORM);
      fetchInternships();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save internship.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Applications Drawer */}
      {viewApps && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewApps(null)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto flex flex-col"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {viewApps.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {viewApps.company} · {applications.length} application
                  {applications.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setViewApps(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {appsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-28"
                    />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">📭</div>
                  <p>No applications yet</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {app.name}
                        </p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">
                          {app.email} · {app.phone}
                        </p>
                      </div>
                      <select
                        value={app.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await api.put(
                              `/internships/applications/${app._id}/status`,
                              { status: newStatus },
                            );
                            setApplications((prev) =>
                              prev.map((a) =>
                                a._id === app._id
                                  ? { ...a, status: newStatus }
                                  : a,
                              ),
                            );
                          } catch {
                            alert("Failed to update status.");
                          }
                        }}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer appearance-none text-center ${
                          app.status === "pending"
                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                            : app.status === "reviewed"
                              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                              : app.status === "shortlisted"
                                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                : app.status === "rejected"
                                  ? "bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400"
                                  : ""
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>🎓 {app.college}</span>
                      <span>
                        📚 {app.degree} · Year {app.year}
                      </span>
                      {app.skills && (
                        <span className="col-span-2">🛠️ {app.skills}</span>
                      )}
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                        Why they want to join:
                      </p>
                      {app.whyApply}
                    </div>
                    <div className="flex gap-3 text-xs">
                      {app.linkedIn && (
                        <a
                          href={app.linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn ↗
                        </a>
                      )}
                      {app.github && (
                        <a
                          href={app.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-600 dark:text-gray-300 hover:underline"
                        >
                          GitHub ↗
                        </a>
                      )}
                      <span className="ml-auto text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Internship Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Post internships and review student applications
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(INITIAL_FORM);
            setFormError("");
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Post Internship
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-6 shadow-sm"
        >
          <h2 className="font-bold text-gray-900 dark:text-white mb-5">
            {editId ? "Edit Internship" : "Post New Internship"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <Field label="Job Title *">
              <input
                type="text"
                required
                placeholder="e.g. Frontend Developer Intern"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Company *">
              <input
                type="text"
                required
                placeholder="Company name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Location *">
              <input
                type="text"
                required
                placeholder="e.g. Ludhiana, Punjab"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Domain *">
              <input
                type="text"
                required
                placeholder="e.g. Web Development, Data Science"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Duration *">
              <input
                type="text"
                required
                placeholder="e.g. 2 months, 6 weeks"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Stipend">
              <input
                type="text"
                placeholder="e.g. ₹5000/month or Unpaid"
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
              >
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
            <Field label="Openings">
              <input
                type="number"
                min="1"
                value={form.openings}
                onChange={(e) =>
                  setForm({ ...form, openings: Number(e.target.value) })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Last Date to Apply *">
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.lastDate}
                onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Skills (comma separated)">
              <input
                type="text"
                placeholder="React, Node.js, Python"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description *">
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the internship role, responsibilities..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Requirements">
                <textarea
                  rows={3}
                  placeholder="Skills, qualifications, eligibility..."
                  value={form.requirements}
                  onChange={(e) =>
                    setForm({ ...form, requirements: e.target.value })
                  }
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Active (visible to students)
              </label>
            </div>
            {formError && (
              <div className="sm:col-span-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition"
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Internship"
                    : "Post Internship"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-40"
            />
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">💼</div>
          <p className="font-medium text-gray-500 dark:text-gray-400">
            No internships posted yet
          </p>
          <p className="text-sm mt-1">Click "Post Internship" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((intern) => (
            <div
              key={intern._id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {intern.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${intern.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}
                    >
                      {intern.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    {intern.company} · {intern.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>⏱ {intern.duration}</span>
                <span>💰 {intern.stipend || "Unpaid"}</span>
                <span>👥 {intern.openings} openings</span>
                <span>
                  📅{" "}
                  {intern.lastDate
                    ? new Date(intern.lastDate).toLocaleDateString("en-IN")
                    : "—"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchApplications(intern)}
                  className="flex-1 py-2 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  View Applications
                </button>
                <button
                  onClick={() => handleEdit(intern)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(intern._id)}
                  className="px-3 py-2 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
