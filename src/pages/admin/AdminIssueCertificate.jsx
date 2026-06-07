import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const COURSE_TYPES = [
  { value: "web-development", label: "Web Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning & AI" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "mobile-development", label: "Mobile App Development" },
  { value: "other", label: "Other" },
];

const CERT_TYPES = [
  {
    value: "completion",
    label: "Certificate of Completion",
    desc: "Standard certificate for completing the course",
    icon: "🎓",
    color: "from-indigo-500 to-violet-500",
    badge: "Most Popular",
  },
  {
    value: "excellence",
    label: "Certificate of Excellence",
    desc: "Premium certificate for outstanding performance",
    icon: "🏆",
    color: "from-amber-500 to-orange-500",
    badge: "Premium",
  },
  {
    value: "participation",
    label: "Certificate of Participation",
    desc: "Certificate acknowledging course participation",
    icon: "📜",
    color: "from-emerald-500 to-teal-500",
    badge: "Basic",
  },
];

export default function AdminIssueCertificate() {
  // add to initial state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseName: "",
    courseType: "",
    startDate: "", // ← add
    completionDate: "",
    certificateType: "completion",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const selectedCert = CERT_TYPES.find((c) => c.value === form.certificateType);

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("certificates/admin/issue", form);
      setSuccess({
        certificateNumber: data.certificateNumber,
        name: form.name,
        courseName: form.courseName,
        certType: selectedCert.label,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      courseName: "",
      courseType: "",
      completionDate: "",
      certificateType: "completion",
    });
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto text-center mt-10"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Certificate Issued!
        </h1>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
          The certificate has been generated and sent to{" "}
          <strong className="text-white">{success.name}</strong>'s email.
        </p>
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Student</span>
            <span className="font-semibold text-white">{success.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Course</span>
            <span className="font-semibold text-white text-right max-w-48 truncate">
              {success.courseName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Certificate</span>
            <span className="font-semibold text-white">{success.certType}</span>
          </div>
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Certificate Number</p>
            <p className="font-mono text-sm font-bold text-orange-400 tracking-wider">
              {success.certificateNumber}
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl transition text-sm"
        >
          Issue Another Certificate
        </button>
      </motion.div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="pb-6">
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Issue Certificate</h1>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the student details to generate and send a certificate
          directly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleIssue} className="space-y-5">
            {/* Personal Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Student full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Course Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Web Development Bootcamp"
                    value={form.courseName}
                    onChange={(e) =>
                      setForm({ ...form, courseName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Domain / Category *
                    </label>
                    <select
                      required
                      value={form.courseType}
                      onChange={(e) =>
                        setForm({ ...form, courseType: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select domain</option>
                      {COURSE_TYPES.map((ct) => (
                        <option key={ct.value} value={ct.value}>
                          {ct.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Completion Date *
                    </label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      value={form.completionDate}
                      onChange={(e) =>
                        setForm({ ...form, completionDate: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Type */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Certificate Type
              </h2>
              <div className="space-y-3">
                {CERT_TYPES.map((cert) => (
                  <label
                    key={cert.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.certificateType === cert.value
                        ? "border-orange-500 bg-orange-900/20"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="certType"
                      value={cert.value}
                      checked={form.certificateType === cert.value}
                      onChange={(e) =>
                        setForm({ ...form, certificateType: e.target.value })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-xl flex-shrink-0`}
                    >
                      {cert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">
                          {cert.label}
                        </p>
                        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                          {cert.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cert.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Generating & Sending...
                </>
              ) : (
                <>
                  <span>🎓</span> Issue Certificate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">
            <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Certificate Preview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-200">Type</span>
                  <span className="font-semibold">{selectedCert?.label}</span>
                </div>
                {form.name && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Student</span>
                    <span className="font-semibold">{form.name}</span>
                  </div>
                )}
                {form.courseName && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Course</span>
                    <span className="font-semibold text-right max-w-32 truncate">
                      {form.courseName}
                    </span>
                  </div>
                )}
                {form.startDate && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Start Date</span>
                    <span className="font-semibold">
                      {new Date(form.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {form.completionDate && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Date</span>
                    <span className="font-semibold">
                      {new Date(form.completionDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                )}
                {/* <div className="border-t border-white/20 pt-3">
                  <span className="text-orange-200 text-xs">Payment</span>
                  <p className="font-bold text-emerald-300 mt-0.5">Free — Admin Issue</p>
                </div> */}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-semibold text-white text-sm">
                What happens next
              </h4>
              {[
                "Certificate PDF is generated instantly",
                "Sent directly to student's email",
                "Unique certificate number assigned",
                "Logged in certificate orders",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <svg
                    className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
