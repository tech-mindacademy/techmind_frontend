import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Mail, Zap, Loader2, Send } from "lucide-react";
import api from "../api/axios";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you within 24 hours 🚀");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    {
      Icon: MapPin,
      title: "Office",
      desc: "Tech Minds HQ, India",
    },
    {
      Icon: Mail,
      title: "Email",
      desc: "support@techvidya.com",
    },
    {
      Icon: Zap,
      title: "Response Time",
      desc: "Within 24 hours",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-white text-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3">
              Get In Touch
            </p>
            <h1 className="text-5xl font-black text-[#1A56DB]">Let's Talk</h1>
            <p className="text-black/50 mt-3 max-w-xl mx-auto text-sm">
              Have questions, ideas, or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* FORM */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl p-8 shadow-sm"
            >
              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#0D1B3E]/10 text-black placeholder-black/30 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB]/30 outline-none transition text-sm disabled:opacity-50"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#0D1B3E]/10 text-black placeholder-black/30 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB]/30 outline-none transition text-sm disabled:opacity-50"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message..."
                  rows="5"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#0D1B3E]/10 text-black placeholder-black/30 focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB]/30 outline-none resize-none transition text-sm disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold transition-all shadow-lg shadow-[#1A56DB]/20 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* INFO CARDS */}
            <div className="space-y-5">
              {infoCards.map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#F7F5F0] border border-[#0D1B3E]/8 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all flex items-start gap-5"
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A56DB] text-white flex-shrink-0"
                    style={{
                      boxShadow: "0 6px 16px rgba(26,86,219,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0D1B3E] text-base">{title}</h3>
                    <p className="text-black/50 text-sm mt-1">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}