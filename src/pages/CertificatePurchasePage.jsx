import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  ScrollText,
  Lock,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import api from "../api/axios";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

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
    price: 1499,
    desc: "Standard certificate for completing the course",
    icon: GraduationCap,
    gradient: "from-[#1A56DB] to-[#0D1B3E]",
    badge: "Official",
  },
];

const inputClass =
  "w-full px-4 py-3 border border-[#0D1B3E]/10 rounded-xl bg-white text-black text-sm placeholder-black/30 focus:outline-none focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB]/30 transition";

const labelClass = "block text-sm font-semibold text-[#0D1B3E] mb-1.5";

export default function CertificatePurchasePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseName: "",
    courseType: "",
    startDate: "",
    completionDate: "",
    certificateType: "completion",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const selectedCert = CERT_TYPES.find((c) => c.value === form.certificateType);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError(
          "Failed to load payment gateway. Please check your internet connection.",
        );
        setLoading(false);
        return;
      }
      const { data } = await api.post("certificates/create-order", form);
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Tech Mind Academy",
        description: `${selectedCert.label} — ${form.courseName}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("certificates/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              certOrderId: data.certOrderId,
            });
            setSuccess({
              certificateNumber: verifyRes.data.certificateNumber,
              name: form.name,
              courseName: form.courseName,
              certType: selectedCert.label,
              amount: selectedCert.price,
            });
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Payment verification failed. Please contact support.",
            );
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#1A56DB" },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center mx-auto mb-5"
            style={{
              boxShadow:
                "0 8px 20px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <BadgeCheck size={32} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-black text-[#1A56DB] mb-2">
            Payment Successful!
          </h1>
          <p className="text-black/60 mb-6 text-sm leading-relaxed">
            Your certificate is being processed. You'll receive it via email
            within <strong className="text-[#0D1B3E]">1–2 business days</strong>
            .
          </p>

          <div className="bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 mb-6 text-left space-y-3">
            {[
              ["Student", success.name],
              ["Course", success.courseName],
              ["Certificate", success.certType],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-black/50">{label}</span>
                <span className="font-semibold text-[#0D1B3E] text-right max-w-48 truncate">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-black/50">Amount Paid</span>
              <span className="font-black text-[#1A56DB]">
                ₹{success.amount}
              </span>
            </div>
            <div className="pt-3 border-t border-[#0D1B3E]/8">
              <p className="text-xs text-black/40 mb-1">Certificate Number</p>
              <p className="font-mono text-sm font-black text-[#1A56DB] tracking-wider">
                {success.certificateNumber}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="block bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden text-center pt-20 pb-16 px-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="space-y-5"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-[#1A56DB] text-sm font-semibold px-5 py-2.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                  </span>
                  Official Certificates
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-black text-[#1A56DB]"
              >
                Get Your <span className="text-[#0D1B3E]">Certificate</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-black/70 text-lg max-w-xl mx-auto"
              >
                Official certificates from Tech Mind Academy to showcase your
                skills and achievements to the world.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── Form + Sidebar ── */}
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-5 gap-8 pb-20">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handlePay} className="space-y-5">
              {/* Personal Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-2xl p-6"
              >
                <h2 className="font-black text-[#1A56DB] mb-5 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] text-white text-xs flex items-center justify-center font-black"
                    style={{ boxShadow: "0 4px 12px rgba(26,86,219,0.3)" }}
                  >
                    1
                  </span>
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Course Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-2xl p-6"
              >
                <h2 className="font-black text-[#1A56DB] mb-5 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] text-white text-xs flex items-center justify-center font-black"
                    style={{ boxShadow: "0 4px 12px rgba(26,86,219,0.3)" }}
                  >
                    2
                  </span>
                  Course Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Course Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Stack Web Development Bootcamp"
                      value={form.courseName}
                      onChange={(e) =>
                        setForm({ ...form, courseName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Domain / Category *</label>
                      <select
                        required
                        value={form.courseType}
                        onChange={(e) =>
                          setForm({ ...form, courseType: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="">Select domain</option>
                        {COURSE_TYPES.map((ct) => (
                          <option key={ct.value} value={ct.value}>
                            {ct.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
                    <div>
                      <label className={labelClass}>Start Date *</label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split("T")[0]}
                        value={form.startDate}
                        onChange={(e) =>
                          setForm({ ...form, startDate: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Completion Date *</label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split("T")[0]}
                        value={form.completionDate}
                        onChange={(e) =>
                          setForm({ ...form, completionDate: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </motion.div>

              {/* Certificate Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-2xl p-6"
              >
                <h2 className="font-black text-[#1A56DB] mb-5 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] text-white text-xs flex items-center justify-center font-black"
                    style={{ boxShadow: "0 4px 12px rgba(26,86,219,0.3)" }}
                  >
                    3
                  </span>
                  Certificate Type
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#1A56DB] bg-[#1A56DB]/5">
                  <div
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center flex-shrink-0"
                    style={{
                      boxShadow:
                        "0 6px 16px rgba(26,86,219,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <GraduationCap
                      size={20}
                      className="text-white"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-[#0D1B3E] text-sm">
                        Certificate of Completion
                      </p>
                      <span className="text-xs bg-[#1A56DB]/10 text-[#1A56DB] font-bold px-2 py-0.5 rounded-full border border-[#1A56DB]/20">
                        Official
                      </span>
                    </div>
                    <p className="text-xs text-black/50 mt-0.5">
                      Standard certificate for completing the course
                    </p>
                  </div>
                  <p className="font-black text-[#1A56DB] text-base flex-shrink-0">
                    ₹1499
                  </p>
                </div>
              </motion.div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20 flex items-center justify-center gap-2 text-base"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} strokeWidth={2.5} />
                    Pay ₹{selectedCert?.price} with Razorpay
                  </>
                )}
              </button>
              <p className="text-center text-xs text-black/40">
                Secured by Razorpay · UPI · Cards · Net Banking
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-2xl p-6"
              >
                <h3 className="font-black text-[#1A56DB] text-lg mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50">Certificate Type</span>
                    <span className="font-bold text-[#0D1B3E]">
                      {selectedCert?.label}
                    </span>
                  </div>
                  {form.courseName && (
                    <div className="flex justify-between">
                      <span className="text-black/50">Course</span>
                      <span className="font-bold text-[#0D1B3E] text-right max-w-32 truncate">
                        {form.courseName}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-[#0D1B3E]/8 pt-3 flex justify-between text-base">
                    <span className="font-bold text-[#0D1B3E]">Total</span>
                    <span className="font-black text-xl text-[#1A56DB]">
                      ₹{selectedCert?.price}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* What's included */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3"
              >
                <h4 className="font-black text-[#1A56DB] text-sm">
                  What's included
                </h4>
                {[
                  "Official Tech Mind Academy digital certificate",
                  "Unique certificate number",
                  "Verifiable online",
                  "Delivered to your email in 1–2 days",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-black/60"
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ boxShadow: "0 3px 8px rgba(26,86,219,0.3)" }}
                    >
                      <CheckCircle
                        size={11}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    {item}
                  </div>
                ))}
              </motion.div>

              {/* Note */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#1A56DB]/8 border border-[#1A56DB]/20 rounded-2xl p-4 text-xs text-[#1A56DB] leading-relaxed"
              >
                <strong>Note:</strong> Please ensure all details are correct
                before payment. Certificates are issued based on the information
                provided.
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
}
