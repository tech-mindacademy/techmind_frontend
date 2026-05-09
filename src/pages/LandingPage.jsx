import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: "🎬", title: "Video lessons", desc: "HD video with auto-resume and playback controls" },
  { icon: "❓", title: "Auto-graded quizzes", desc: "MCQ, true/false, short answer with instant feedback" },
  { icon: "📝", title: "Assignments", desc: "File submissions with manual grading and feedback" },
  { icon: "📄", title: "Lesson notes", desc: "Download PDF, Word, and PowerPoint materials" },
  { icon: "🏆", title: "Certificates", desc: "Auto-issued on course completion" },
  { icon: "📊", title: "Progress tracking", desc: "Visual progress bar and lesson completion status" },
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "200+", label: "Creators" },
  { value: "98%", label: "Satisfaction" },
];

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Tech Vidya
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/courses" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block">
              Browse courses
            </Link>
            <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Sign in
            </Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pt-20 pb-24 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 dark:bg-violet-900/30 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
                🚀 The modern learning platform
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Learn anything,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                master everything
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A complete SaaS learning platform with video lessons, quizzes, assignments, and certificates.
              Built for students who want to grow and creators who want to teach.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-200 dark:shadow-none">
                Start learning for free →
              </Link>
              <Link to="/courses" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition text-base">
                Browse courses
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything you need to learn
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              A fully featured LMS with all the tools for effective online education
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For creators */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
              <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">For creators</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Build your course.<br/>Grow your audience.
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Upload videos, create quizzes and assignments, attach notes, and watch your students learn. Full analytics and earnings dashboard included.
              </p>
              <ul className="space-y-2">
                {["Course builder with drag-drop sections", "Video + PDF/PPTX notes per lesson", "Auto-graded quizzes + manual assignment grading", "Student analytics and earnings reports"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register?role=creator" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                Become a creator →
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-950/50 dark:to-indigo-950/50 rounded-3xl p-8 border border-teal-100 dark:border-teal-900">
              <div className="space-y-3">
                {["Upload lesson video", "Add quiz (auto-graded)", "Attach PDF notes", "Set assignment", "Publish course"].map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border transition ${i === 1 ? "border-teal-400 shadow-sm shadow-teal-100 dark:shadow-none" : "border-gray-100 dark:border-gray-700"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 2 ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>{i + 1}</div>
                    <span className={`text-sm font-medium ${i < 2 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{step}</span>
                    {i < 2 && <svg className="w-4 h-4 text-teal-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
            <h2 className="text-3xl font-bold text-white">Ready to start learning?</h2>
            <p className="text-indigo-200 text-lg">Join thousands of students already learning on Tech Vidya.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="bg-white hover:bg-gray-50 text-indigo-600 font-bold px-8 py-3.5 rounded-2xl transition shadow-lg">
                Create free account →
              </Link>
              <Link to="/courses" className="text-white border border-white/30 hover:border-white px-8 py-3.5 rounded-2xl transition font-semibold">
                Browse courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tech Vidya</span>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Tech Vidya. Built with MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
}
