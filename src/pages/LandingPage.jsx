import { Link } from "react-router-dom";
import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import api from "../api/axios";
import TestimonialsSection from "../components/TestimonialSection";
import {
  Film,
  CheckCircle,
  Award,
  BarChart2,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  GraduationCap,
  Star,
  ArrowRight,
  MonitorPlay,
  ClipboardList,
  Download,
  BadgeCheck,
  MessagesSquare,
  LayoutTemplate,
  PenLine,
  LineChart,
  Banknote,
  BrainCircuit,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

const features = [
  {
    Icon: Film,
    title: "HD Video Lessons",
    desc: "Crystal-clear streaming with adaptive quality for any connection speed.",
    color: "from-[#1A56DB] to-[#0D1B3E]",
  },
  {
    Icon: CheckCircle,
    title: "Smart Quizzes",
    desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts.",
    color: "from-[#2563EB] to-[#1A56DB]",
  },
  {
    Icon: Award,
    title: "Certificates",
    desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily.",
    color: "from-[#0D1B3E] to-[#1A56DB]",
  },
  {
    Icon: BarChart2,
    title: "Analytics",
    desc: "Deep insights into student progress and creator revenue in real time.",
    color: "from-[#1A56DB] to-[#0D1B3E]",
  },
  {
    Icon: FileText,
    title: "Notes & Resources",
    desc: "Attach PDFs, slides, and files directly to any lesson for download.",
    color: "from-[#2563EB] to-[#1A56DB]",
  },
  {
    Icon: MessageSquare,
    title: "Community Q&A",
    desc: "Per-course discussion boards so students can help each other grow.",
    color: "from-[#0D1B3E] to-[#2563EB]",
  },
];

const studentFeatures = [
  { Icon: MonitorPlay, text: "HD video lessons with subtitles" },
  { Icon: ClipboardList, text: "Auto-graded quizzes & progress tracking" },
  { Icon: Download, text: "Downloadable notes & resources" },
  { Icon: BadgeCheck, text: "Verified completion certificates" },
  { Icon: MessagesSquare, text: "Community discussions per course" },
];

const creatorFeatures = [
  { Icon: LayoutTemplate, text: "Course builder with drag-drop sections" },
  { Icon: Film, text: "Video + PDF/PPTX notes per lesson" },
  { Icon: PenLine, text: "Auto-graded quizzes + manual grading" },
  { Icon: LineChart, text: "Student analytics and earnings reports" },
  { Icon: Banknote, text: "Payout dashboard with instant transfers" },
];

function CountUp({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const num = parseInt(target.replace(/\D/g, ""));
        let start = 0;
        const step = Math.ceil(num / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= num) {
            setCount(num);
            clearInterval(timer);
          } else setCount(start);
        }, 20);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function LandingCourseCard({ course }) {
  const avgRating = course.stats?.avgRating || course.rating;
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0D1B3E]/8 shadow-sm hover:shadow-xl hover:shadow-[#1A56DB]/10 transition-all duration-300"
    >
      <Link to={`/courses/${course.slug || course.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
          {course.thumbnail?.url || course.thumbnail ? (
            <img
              src={course.thumbnail?.url || course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#1A56DB]/30" />
            </div>
          )}
          {(course.isFree || course.price === 0) && (
            <span className="absolute top-3 left-3 text-xs bg-[#1A56DB] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
              FREE
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#0D1B3E] line-clamp-2 group-hover:text-[#1A56DB] transition text-sm leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-[#0D1B3E]/45 mt-1 font-medium">
            {course.creator?.name ||
              course.instructor?.name ||
              "Tech Mind Academy"}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0D1B3E]/6">
            {avgRating > 0 ? (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[#0D1B3E] font-bold text-xs">
                  {Number(avgRating).toFixed(1)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-[#0D1B3E]/35">New</span>
            )}
            <div className="font-black text-[#1A56DB] text-sm">
              {course.isFree || course.price === 0
                ? "Free"
                : `₹${(course.discountPrice || course.price || "").toLocaleString()}`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [hasImages, setHasImages] = useState(false);
  const [topCourses, setTopCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [stats, setStats] = useState([
    { value: "...", label: "Students enrolled", Icon: Users },
    { value: "...", label: "Courses published", Icon: BookOpen },
    { value: "...", label: "Expert creators", Icon: GraduationCap },
    { value: "4.9", label: "Average rating", Icon: Star },
  ]);

  useEffect(() => {
    api
      .get("/stats/public")
      .then(({ data }) => {
        setStats([
          {
            value: `${data.students}+`,
            label: "Students enrolled",
            Icon: Users,
          },
          {
            value: `${data.courses}+`,
            label: "Courses published",
            Icon: BookOpen,
          },
          {
            value: `${data.creators}+`,
            label: "Expert creators",
            Icon: GraduationCap,
          },
          { value: "4.9", label: "Average rating", Icon: Star },
        ]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get("/courses")
      .then(({ data }) => {
        const raw = data.courses || data?.data || [];
        if (!Array.isArray(raw)) {
          setCoursesLoading(false);
          return;
        }
        setTopCourses(
          raw.slice(0, 4).map((c) => ({
            id: c._id,
            title: c.title,
            slug: c.slug,
            creator: c.creator,
            thumbnail: c.thumbnail,
            isFree: c.isFree,
            price: c.price,
            discountPrice: c.discountPrice,
            stats: c.stats,
            rating: c.stats?.avgRating || 0,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white w-full">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center pt-20 pb-12 px-4">
          <HeroContent user={user} stagger={stagger} fadeUp={fadeUp} />
        </div>

        <div className="relative z-10 border-t border-black/10 bg-black/[0.02] w-full">
          <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <s.Icon className="w-7 h-7 text-[#1A56DB] mb-0.5" />
                <p className="text-2xl font-black text-black">{s.value}</p>
                <p className="text-xs text-black/60 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <HeroCarousel onHasImages={setHasImages} />
        </div>
      </section>

      {/* ── Top Courses ── */}
      <section className="py-20 px-4 bg-white relative">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
            >
              Top Rated This Month
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black text-[#1A56DB]"
            >
              Courses Students Love
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm"
            >
              Handpicked, high-quality, and loved by students.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coursesLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] rounded-2xl bg-[#0D1B3E]/6 animate-pulse"
                  />
                ))
              : topCourses.map((course) => (
                  <LandingCourseCard key={course.id} course={course} />
                ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/techmind-courses"
              className="inline-flex items-center gap-2 border-2 border-[#1A56DB] text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
            >
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black text-[#1A56DB]"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm"
            >
              A fully featured platform with all the tools for effective online
              learning.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(26, 86, 219, 0.12)",
                  boxShadow:
                    "0 4px 24px rgba(26, 86, 219, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                {/* <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`}
                /> */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A56DB]/10 mb-4`}
                >
                  <f.Icon className="w-6 h-6 text-[#1A56DB]" />
                </div>
                <h3 className="font-black text-[#0D1B3E] mb-2">{f.title}</h3>
                <p className="text-sm text-[#0D1B3E]/50 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── For Students & Creators ── */}
      <section className="py-20 px-4 bg-white relative">
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
            <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
              <GraduationCap className="w-3.5 h-3.5" /> For Students
            </div>
            <h3 className="text-2xl font-black text-[#1A56DB] mb-3">
              Build Skills. Earn Certificates.
            </h3>
            <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
              Access expert-led courses. Learn at your pace, test yourself with
              quizzes, and earn certificates that recruiters respect.
            </p>
            <ul className="space-y-3 mb-8">
              {studentFeatures.map(({ Icon, text }, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-[#0D1B3E]/70"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20"
            >
              {user?.role === "student"
                ? "Go to Dashboard →"
                : "Start for Free →"}
            </Link>
          </motion.div>

          {/* Creator card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
            <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
              <BrainCircuit className="w-3.5 h-3.5" /> For Creators
            </div>
            <h3 className="text-2xl font-black text-[#1A56DB] mb-3">
              Teach the World. Earn While You Sleep.
            </h3>
            <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
              Build and publish courses using our powerful creator tools. Reach
              thousands of eager students.
            </p>
            <ul className="space-y-3 mb-8">
              {creatorFeatures.map(({ Icon, text }, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-[#0D1B3E]/70"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Link
              to="/auth?role=creator"
              className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20"
            >
              Become a Creator →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 relative overflow-hidden bg-white">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-[#1A56DB]">
              Ready to transform your career?
            </h2>
            <p className="text-black text-lg">
              Join students already building their future with Tech Mind
              Academy.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/auth"
                className="bg-[#1A56DB] hover:bg-[#2563EB] text-white font-black px-10 py-4 rounded-2xl transition shadow-2xl shadow-blue-900/50 text-base"
              >
                {user ? "Go to Dashboard →" : "Create Free Account →"}
              </Link>
              <Link
                to="/techmind-courses"
                className="bg-[#1A56DB] hover:bg-[#2563EB] text-white border-2 border-[#1A56DB] px-8 py-4 rounded-2xl transition font-bold text-base"
              >
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Hero text component ── */
function HeroContent({ user, stagger, fadeUp }) {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-7"
    >
      <motion.div>
        <span className="inline-flex items-center gap-2.5 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-black text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
          </span>
          The Modern Learning with Tech Mind Academy
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-5xl sm:text-7xl font-black text-[#1A56DB] leading-[1.08] tracking-tight"
      >
        Learn Fast.
        <span className="ml-3">Land Faster.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed font-light"
      >
        Expert-led courses, real projects, verified certificates — everything
        you need to go from student to professional.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="flex items-center justify-center gap-4 flex-wrap pt-2"
      >
        <Link
          to="/auth"
          className="group relative bg-[#1A56DB] hover:bg-[#2563EB] text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-blue-900/60 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Learning
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        <Link
          to="/techmind-courses"
          className="flex items-center gap-2 bg-[#1A56DB] hover:bg-[#2563EB] border border-[#1A56DB] text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
        >
          <BookOpen className="w-5 h-5 text-blue-300" />
          Explore Courses
        </Link>
      </motion.div>
    </motion.div>
  );
}
