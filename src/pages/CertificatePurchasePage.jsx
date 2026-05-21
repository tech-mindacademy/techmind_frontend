import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    price: 299,
    desc: "Standard certificate for completing the course",
    icon: "🎓",
    color: "from-indigo-500 to-violet-500",
    badge: "Most Popular",
  },
  {
    value: "excellence",
    label: "Certificate of Excellence",
    price: 499,
    desc: "Premium certificate for outstanding performance",
    icon: "🏆",
    color: "from-amber-500 to-orange-500",
    badge: "Premium",
  },
  {
    value: "participation",
    label: "Certificate of Participation",
    price: 199,
    desc: "Certificate acknowledging course participation",
    icon: "📜",
    color: "from-emerald-500 to-teal-500",
    badge: "Basic",
  },
];

export default function CertificatePurchasePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseName: "",
    courseType: "",
    completionDate: "",
    certificateType: "completion",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const selectedCert = CERT_TYPES.find((c) => c.value === form.certificateType);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const { data } = await axios.post("/api/certificates/create-order", form);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Tech Vidya",
        description: `${selectedCert.label} — ${form.courseName}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post("/api/certificates/verify-payment", {
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
            setError(err.response?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Your certificate is being processed. You'll receive it via email within <strong>1–2 business days</strong>.
          </p>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Student</span>
              <span className="font-semibold text-gray-900 dark:text-white">{success.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Course</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right max-w-48 truncate">{success.courseName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Certificate</span>
              <span className="font-semibold text-gray-900 dark:text-white">{success.certType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{success.amount}</span>
            </div>
            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-800">
              <p className="text-xs text-gray-400 mb-1">Certificate Number</p>
              <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">{success.certificateNumber}</p>
            </div>
          </div>

          <Link to="/" className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl transition text-sm">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950 py-14 px-4 text-center">
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-sm font-semibold px-4 py-2 rounded-full">
            🏆 Official Certificates
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Get Your{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Certificate
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Official certificates from Tech Vidya to showcase your skills and achievements to the world.
          </p>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handlePay} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Course Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Web Development Bootcamp"
                    value={form.courseName}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Domain / Category *</label>
                    <select
                      required
                      value={form.courseType}
                      onChange={(e) => setForm({ ...form, courseType: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select domain</option>
                      {COURSE_TYPES.map((ct) => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Completion Date *</label>
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      value={form.completionDate}
                      onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Type */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                Certificate Type
              </h2>
              <div className="space-y-3">
                {CERT_TYPES.map((cert) => (
                  <label
                    key={cert.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.certificateType === cert.value
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="certType"
                      value={cert.value}
                      checked={form.certificateType === cert.value}
                      onChange={(e) => setForm({ ...form, certificateType: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {cert.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{cert.label}</p>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{cert.badge}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.desc}</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-base flex-shrink-0">₹{cert.price}</p>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>🔒</span>
                  Pay ₹{selectedCert?.price} with Razorpay
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">Secured by Razorpay · UPI · Cards · Net Banking</p>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Certificate Type</span>
                  <span className="font-semibold">{selectedCert?.label}</span>
                </div>
                {form.courseName && (
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Course</span>
                    <span className="font-semibold text-right max-w-32 truncate">{form.courseName}</span>
                  </div>
                )}
                <div className="border-t border-white/20 pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl">₹{selectedCert?.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">What's included</h4>
              {[
                "Official Tech Vidya digital certificate",
                "Unique certificate number",
                "Verifiable online",
                "Delivered to your email in 1–2 days",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  {item}
                </div>
              ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              💡 <strong>Note:</strong> Please ensure all details are correct before payment. Certificates are issued based on the information provided.
            </div>
          </div>
        </div>
      </div>

      
    </div>
    <Footer/>
    </>
    
  );
}
