import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  CheckCircle,
  Sparkles,
  Users,
  Rocket,
  Globe,
  ArrowRight,
  MapPin,
  Mail,
  BadgeCheck,
  Award,
  Zap,
  Loader2,
  Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

export default function AboutUs() {
  const [stats, setStats] = useState([
    { num: "...", label: "Students Learning" },
    { num: "...", label: "Published Courses" },
    { num: "...", label: "Expert Educators" },
    { num: "4.9★", label: "Average Rating" },
  ]);

  useEffect(() => {
    api
      .get("/stats/public")
      .then(({ data }) => {
        setStats([
          { num: `${data.students}+`, label: "Students Learning" },
          { num: `${data.courses}+`, label: "Published Courses" },
          { num: `${data.creators}+`, label: "Expert Educators" },
          { num: "4.9★", label: "Average Rating" },
        ]);
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "HD Video Learning",
      desc: "Learn through high-quality video lessons with subtitle support.",
      gradient: "from-[#1A56DB] to-[#0D1B3E]",
    },
    {
      icon: CheckCircle,
      title: "Interactive Assessments",
      desc: "Quizzes, assignments and instant feedback to improve learning.",
      gradient: "from-[#2563EB] to-[#1A56DB]",
    },
    {
      icon: Sparkles,
      title: "Verified Certificates",
      desc: "Earn certificates that validate your skills and achievements.",
      gradient: "from-[#0D1B3E] to-[#2563EB]",
    },
  ];

  const audiences = [
    {
      icon: GraduationCap,
      title: "Students",
      desc: "Learn new skills and earn certificates.",
    },
    {
      icon: Users,
      title: "Professionals",
      desc: "Upskill and advance your career.",
    },
    {
      icon: Rocket,
      title: "Educators",
      desc: "Create courses and share your expertise.",
    },
    {
      icon: Globe,
      title: "Organizations",
      desc: "Train teams through scalable learning programs.",
    },
  ];

  const checklistItems = [
    "Expert-led courses across multiple domains",
    "Interactive quizzes and assessments",
    "Downloadable learning resources",
    "Verified completion certificates",
    "Progress tracking and analytics",
    "Powerful tools for educators",
  ];

  // const contactInfo = [
  //   { icon: MapPin, title: "Office", desc: "Tech Mind Academy HQ, Punjab, India", gradient: "from-[#1A56DB] to-[#0D1B3E]" },
  //   { icon: Mail, title: "Email", desc: "support@techmindacademy.in", gradient: "from-[#2563EB] to-[#1A56DB]" },
  //   // { icon: Link2, title: "Phone", desc: "https://www.linkedin.com/company/tech-mind-academy/", gradient: "from-[#0D1B3E] to-[#2563EB]" },

  // ];
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
      toast.error(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
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
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 overflow-hidden text-center pt-28 pb-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-[#1A56DB] text-sm font-semibold px-5 py-2.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
                Modern Learning Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black leading-tight max-w-5xl mx-auto text-[#1A56DB]"
            >
              Learn, Teach & Grow Together
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-black/70 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Tech Mind Academy is a modern online learning platform where
              students discover expert-led courses, build valuable skills, and
              achieve their goals — while educators create, publish, and share
              knowledge with learners around the world.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4 pt-2"
            >
              <Link
                to="/auth"
                className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20 flex items-center gap-2"
              >
                Start Learning <ArrowRight size={18} />
              </Link>
              <Link
                to="/techmind-courses"
                className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20 flex items-center gap-2"
              >
                Browse Courses <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Story + Stats ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3">
            About Us
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1A56DB] leading-tight">
            Empowering Learning Through Technology & Knowledge
          </h2>
          <p className="mt-6 text-black/70 leading-relaxed">
            Tech Mind Academy is a modern online learning platform that connects
            learners with expert educators. Our goal is to make quality
            education accessible, engaging, and practical for everyone.
          </p>
          <p className="mt-4 text-black/70 leading-relaxed">
            Students can explore expert-led courses, develop real-world skills,
            and earn verified certificates — while educators can create,
            publish, and manage courses that inspire learners around the world.
          </p>

          <div className="mt-8 space-y-3">
            {checklistItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-6 h-6 rounded-full bg-[#1A56DB] from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: "0 4px 12px rgba(26,86,219,0.3)" }}
                >
                  <CheckCircle
                    size={13}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-black/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-[32px] p-10 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-5">
            {stats.map(({ num, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-[#0D1B3E]/8 rounded-2xl p-6 text-center shadow-sm"
              >
                <h3 className="text-3xl font-black text-[#1A56DB]">{num}</h3>
                <p className="text-black/50 mt-2 text-xs">{label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 bg-[#1A56DB]/8 border border-[#1A56DB]/15 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl bg-[#1A56DB] from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center flex-shrink-0"
                // style={{ boxShadow: "0 8px 20px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              >
                <GraduationCap
                  className="text-white"
                  size={24}
                  strokeWidth={1.8}
                />
              </div>
              <div>
                <h3 className="font-black text-[#0D1B3E]">
                  Learn • Teach • Grow
                </h3>
                <p className="text-black/50 text-sm mt-1">
                  A complete learning platform for students and educators.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MSME Section ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 flex flex-col items-center gap-3"
            >
              <div
                className="w-24 h-24 rounded-3xl bg-[#1A56DB] from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center"
                // style={{ boxShadow: "0 12px 32px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              >
                <Award size={44} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#1A56DB] bg-[#1A56DB]/10 border border-[#1A56DB]/20 px-3 py-1 rounded-full">
                Govt. Registered
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-2">
                MSME Registered
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-[#1A56DB]">
                Recognized by the Government of India
              </h2>
              <p className="text-black/70 mt-3 leading-relaxed text-sm max-w-2xl">
                Tech Mind Academy is officially registered under the{" "}
                <strong className="text-[#0D1B3E]">
                  Ministry of Micro, Small & Medium Enterprises (MSME)
                </strong>
                , Government of India. This recognition reflects our commitment
                to providing quality education and building a legitimate,
                trusted platform for learners and educators across the country.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  "MSME Certified",
                  "Govt. of India",
                  "Trusted Platform",
                  "Quality Education",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A56DB] bg-[#1A56DB]/10 border border-[#1A56DB]/20 px-3 py-1.5 rounded-full"
                  >
                    <BadgeCheck size={13} strokeWidth={2.5} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
          >
            Why Choose Tech Mind Academy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#1A56DB]"
          >
            Everything You Need To Learn And Grow
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, gradient }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#1A56DB]/8 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A56DB] text-white mb-6`}
                // style={{ boxShadow: "0 8px 20px rgba(240, 11, 11, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)" }}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-black text-[#1A56DB] mb-3">
                {title}
              </h3>
              <p className="text-black/70 leading-relaxed text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-[40px] p-10 md:p-16 shadow-sm">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
            >
              Who We Serve
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-[#1A56DB]"
            >
              Built For Learners, Educators & Organizations
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#0D1B3E]/8 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-[#1A56DB] from-[#1A56DB] to-[#0D1B3E] flex items-center justify-center mb-4"
                  // style={{ boxShadow: "0 8px 20px rgba(26,86,219,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                >
                  <Icon size={22} className="text-white" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-black text-[#1A56DB] mb-2">
                  {title}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Info ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
          >
            Get In Touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#1A56DB]"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-black/70 mt-3 text-sm max-w-xl mx-auto"
          >
            Have questions or need help? Reach out to us — we're here for you.
          </motion.p>
        </div>

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
                    boxShadow:
                      "0 6px 16px rgba(26,86,219,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-black text-[#0D1B3E] text-base">
                    {title}
                  </h3>
                  <p className="text-black/50 text-sm mt-1">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-10 mb-16"
      >
        <div className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl py-24 px-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-4">
            Get Started
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A56DB] leading-tight max-w-3xl mx-auto">
            Ready To Start Your Learning Journey?
          </h2>
          <p className="text-black/70 mt-6 text-sm max-w-2xl mx-auto">
            Join thousands of learners and educators already using Tech Mind
            Academy. Discover courses, develop valuable skills, and achieve your
            goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              to="/auth"
              className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20 flex items-center gap-2"
            >
              Start Learning <ArrowRight size={18} />
            </Link>
            <Link
              to="/techmind-courses"
              className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-[#1A56DB]/20 flex items-center gap-2"
            >
              Browse Courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
