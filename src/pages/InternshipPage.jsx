import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TYPE_COLORS = {
  remote: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  onsite: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  hybrid: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [applying, setApplying] = useState(null); // internship being applied to
  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "",
    degree: "", year: "", whyApply: "", skills: "",
    linkedIn: "", github: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInternships();
  }, [search, typeFilter]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      const { data } = await axios.get("/api/internships", { params });
      setInternships(data.internships || []);
    } catch {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (internship) => {
    setApplying(internship);
    setSuccess(false);
    setError("");
    setForm({
      name: "", email: "", phone: "", college: "",
      degree: "", year: "", whyApply: "", skills: "",
      linkedIn: "", github: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await axios.post(`/api/internships/${applying._id}/apply`, form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isPastDeadline = (lastDate) => {
    return lastDate && new Date(lastDate) < new Date();
  };

  return (
    <>
        <Navbar/>
        <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 py-16 px-4 text-center">
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
            💼 Internship Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Launch Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Career
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Explore internship opportunities across tech domains. Apply directly and kickstart your professional journey.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search internships, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </section>

      {/* Listings */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-56" />
              ))}
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">💼</div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No internships found</p>
              <p className="text-sm mt-1 text-gray-400">Check back soon for new opportunities</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internships.map((intern, i) => (
                <motion.div
                  key={intern._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{intern.title}</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-0.5">{intern.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${TYPE_COLORS[intern.type]}`}>
                      {intern.type.charAt(0).toUpperCase() + intern.type.slice(1)}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {intern.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {intern.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {intern.stipend}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {intern.openings} opening{intern.openings > 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {intern.description}
                  </p>

                  {/* Skills */}
                  {intern.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {intern.skills.slice(0, 4).map((skill, j) => (
                        <span key={j} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                      {intern.skills.length > 4 && (
                        <span className="text-xs text-gray-400">+{intern.skills.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    {intern.lastDate && (
                      <span className={`text-xs font-medium ${isPastDeadline(intern.lastDate) ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
                        {isPastDeadline(intern.lastDate) ? "⛔ Deadline passed" : `📅 Apply by ${new Date(intern.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                      </span>
                    )}
                    <button
                      onClick={() => !isPastDeadline(intern.lastDate) && handleApply(intern)}
                      disabled={isPastDeadline(intern.lastDate)}
                      className={`ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        isPastDeadline(intern.lastDate)
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      }`}
                    >
                      {isPastDeadline(intern.lastDate) ? "Closed" : "Apply Now →"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {applying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">{applying.title}</h2>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm">{applying.company}</p>
              </div>
              <button onClick={() => setApplying(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">We've sent a confirmation to your email. Our team will get back to you within 3–5 business days.</p>
                <button onClick={() => setApplying(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name", required: true },
                    { label: "Email *", key: "email", type: "email", placeholder: "your@email.com", required: true },
                    { label: "Phone *", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX", required: true },
                    { label: "College / University *", key: "college", type: "text", placeholder: "Your college name", required: true },
                    { label: "Degree *", key: "degree", type: "text", placeholder: "B.Tech CSE, BCA, etc.", required: true },
                    { label: "Current Year *", key: "year", type: "select", options: ["1st", "2nd", "3rd", "4th", "Graduate"], required: true },
                  ].map((field) => (
                    <div key={field.key} className={field.key === "college" ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select year</option>
                          {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Why do you want to apply? *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your motivation, what you hope to learn, and what you'll bring to the team..."
                      value={form.whyApply}
                      onChange={(e) => setForm({ ...form, whyApply: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Node.js, Python, etc."
                      value={form.skills}
                      onChange={(e) => setForm({ ...form, skills: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedIn}
                      onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Profile</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplying(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
                  >
                    {submitting ? "Submitting..." : "Submit Application →"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
    <Footer/>
    </>
    
  );
}
