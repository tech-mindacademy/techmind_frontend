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
  Film, CheckCircle, Award, BarChart2, FileText, MessageSquare,
  Users, BookOpen, GraduationCap, Star, ArrowRight,
  MonitorPlay, ClipboardList, Download, BadgeCheck, MessagesSquare,
  LayoutTemplate, PenLine, LineChart, Banknote, BrainCircuit,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

const features = [
  { Icon: Film,          title: "HD Video Lessons",    desc: "Crystal-clear streaming with adaptive quality for any connection speed.",        color: "from-[#1A56DB] to-[#0D1B3E]" },
  { Icon: CheckCircle,   title: "Smart Quizzes",       desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts.",         color: "from-[#2563EB] to-[#1A56DB]" },
  { Icon: Award,         title: "Certificates",        desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily.",  color: "from-[#0D1B3E] to-[#1A56DB]" },
  { Icon: BarChart2,     title: "Analytics",           desc: "Deep insights into student progress and creator revenue in real time.",           color: "from-[#1A56DB] to-[#0D1B3E]" },
  { Icon: FileText,      title: "Notes & Resources",   desc: "Attach PDFs, slides, and files directly to any lesson for download.",            color: "from-[#2563EB] to-[#1A56DB]" },
  { Icon: MessageSquare, title: "Community Q&A",       desc: "Per-course discussion boards so students can help each other grow.",             color: "from-[#0D1B3E] to-[#2563EB]" },
];

const studentFeatures = [
  { Icon: MonitorPlay,    text: "HD video lessons with subtitles" },
  { Icon: ClipboardList,  text: "Auto-graded quizzes & progress tracking" },
  { Icon: Download,       text: "Downloadable notes & resources" },
  { Icon: BadgeCheck,     text: "Verified completion certificates" },
  { Icon: MessagesSquare, text: "Community discussions per course" },
];

const creatorFeatures = [
  { Icon: LayoutTemplate, text: "Course builder with drag-drop sections" },
  { Icon: Film,           text: "Video + PDF/PPTX notes per lesson" },
  { Icon: PenLine,        text: "Auto-graded quizzes + manual grading" },
  { Icon: LineChart,      text: "Student analytics and earnings reports" },
  { Icon: Banknote,       text: "Payout dashboard with instant transfers" },
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
          if (start >= num) { setCount(num); clearInterval(timer); }
          else setCount(start);
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
            <img src={course.thumbnail?.url || course.thumbnail} alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <div className="h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#1A56DB]/30" />
            </div>
          )}
          {(course.isFree || course.price === 0) && (
            <span className="absolute top-3 left-3 text-xs bg-[#1A56DB] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">FREE</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#0D1B3E] line-clamp-2 group-hover:text-[#1A56DB] transition text-sm leading-snug">{course.title}</h3>
          <p className="text-xs text-[#0D1B3E]/45 mt-1 font-medium">
            {course.creator?.name || course.instructor?.name || "Tech Mind Academy"}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0D1B3E]/6">
            {avgRating > 0 ? (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[#0D1B3E] font-bold text-xs">{Number(avgRating).toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-xs text-[#0D1B3E]/35">New</span>
            )}
            <div className="font-black text-[#1A56DB] text-sm">
              {course.isFree || course.price === 0 ? "Free" : `₹${(course.discountPrice || course.price || "").toLocaleString()}`}
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
    { value: "...", label: "Courses published",  Icon: BookOpen },
    { value: "...", label: "Expert creators",    Icon: GraduationCap },
    { value: "4.9", label: "Average rating",   Icon: Star },
  ]);

  useEffect(() => {
    api.get("/stats/public").then(({ data }) => {
      setStats([
        { value: `${data.students}+`, label: "Students enrolled", Icon: Users },
        { value: `${data.courses}+`,  label: "Courses published",  Icon: BookOpen },
        { value: `${data.creators}+`, label: "Expert creators",    Icon: GraduationCap },
        { value: "4.9",             label: "Average rating",     Icon: Star },
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get("/courses").then(({ data }) => {
      const raw = data.courses || data?.data || [];
      if (!Array.isArray(raw)) { setCoursesLoading(false); return; }
      setTopCourses(raw.slice(0, 4).map((c) => ({
        id: c._id, title: c.title, slug: c.slug,
        creator: c.creator, thumbnail: c.thumbnail,
        isFree: c.isFree, price: c.price, discountPrice: c.discountPrice,
        stats: c.stats, rating: c.stats?.avgRating || 0,
      })));
    }).catch(() => {}).finally(() => setCoursesLoading(false));
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
          <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.6+i*0.1 }}
                className="flex flex-col items-center gap-1">
                <s.Icon className="w-4 h-4 text-[#1A56DB] mb-0.5" />
                <p className="text-2xl font-black text-black">{s.value}</p>
                <p className="text-xs text-black/60 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative w-full max-h-[550px] overflow-hidden">
          <HeroCarousel onHasImages={setHasImages} />
        </div>
      </section>

      {/* ── Top Courses ── */}
      <section className="py-20 px-4 bg-white relative">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3">
              Top Rated This Month
            </motion.p>
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="text-3xl sm:text-4xl font-black text-[#1A56DB]">
              Courses Students Love
            </motion.h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm">
              Handpicked, high-quality, and loved by students.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coursesLoading
              ? [...Array(4)].map((_, i) => <div key={i} className="h-[300px] rounded-2xl bg-[#0D1B3E]/6 animate-pulse" />)
              : topCourses.map((course) => <LandingCourseCard key={course.id} course={course} />)}
          </div>

          <div className="text-center mt-10">
            <Link to="/techmind-courses"
              className="inline-flex items-center gap-2 border-2 border-[#1A56DB] text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-[#F7F5F0] relative">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="text-3xl sm:text-4xl font-black text-[#1A56DB]">
              Everything You Need to Succeed
            </motion.h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm">
              A fully featured platform with all the tools for effective online learning.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.08 }}
                className="group relative bg-white border border-[#0D1B3E]/8 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#1A56DB]/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-sm`}>
                  <f.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#0D1B3E] mb-2">{f.title}</h3>
                <p className="text-sm text-[#0D1B3E]/50 leading-relaxed">{f.desc}</p>
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
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
            <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
              <GraduationCap className="w-3.5 h-3.5" /> For Students
            </div>
            <h3 className="text-2xl font-black text-[#1A56DB] mb-3">Build Skills. Earn Certificates.</h3>
            <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
              Access expert-led courses. Learn at your pace, test yourself with quizzes, and earn certificates that recruiters respect.
            </p>
            <ul className="space-y-3 mb-8">
              {studentFeatures.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#0D1B3E]/70">
                  <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20">
              {user?.role === "student" ? "Go to Dashboard →" : "Start for Free →"}
            </Link>
          </motion.div>

          {/* Creator card */}
          <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
            <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
              <BrainCircuit className="w-3.5 h-3.5" /> For Creators
            </div>
            <h3 className="text-2xl font-black text-[#1A56DB] mb-3">Teach the World. Earn While You Sleep.</h3>
            <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
              Build and publish courses using our powerful creator tools. Reach thousands of eager students.
            </p>
            <ul className="space-y-3 mb-8">
              {creatorFeatures.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#0D1B3E]/70">
                  <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/register?role=creator"
              className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20">
              Become a Creator →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 relative overflow-hidden bg-white">
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black text-[#60A5FA]">
              Ready to transform your career?
            </h2>
            <p className="text-black text-lg">
              Join students already building their future with Tech Mind Academy.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register"
                className="bg-[#1A56DB] hover:bg-[#2563EB] text-white font-black px-10 py-4 rounded-2xl transition shadow-2xl shadow-blue-900/50 text-base">
                {user ? "Go to Dashboard →" : "Create Free Account →"}
              </Link>
              <Link to="/techmind-courses"
                className="bg-[#1A56DB] hover:bg-[#2563EB] text-white border-2 border-[#1A56DB] px-8 py-4 rounded-2xl transition font-bold text-base">
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
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-7">
      <motion.div>
        <span className="inline-flex items-center gap-2.5 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-black text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
          </span>
          The Modern Learning with Tech Mind Academy
        </span>
      </motion.div>

      <motion.h1 variants={fadeUp}
        className="text-5xl sm:text-7xl font-black text-[#60A5FA] leading-[1.08] tracking-tight">
        Learn Fast.
        <span className="relative ml-3">
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#1A56DB] bg-clip-text text-transparent">
            Land Faster.
          </span>
        </span>
      </motion.h1>

      <motion.p variants={fadeUp} className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed font-light">
        Expert-led courses, real projects, verified certificates — everything you need to go from student to professional.
      </motion.p>

      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap pt-2">
        <Link to="/register"
          className="group relative bg-[#1A56DB] hover:bg-[#2563EB] text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-blue-900/60 overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            Start Learning
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        <Link to="/techmind-courses"
          className="flex items-center gap-2 bg-[#1A56DB] hover:bg-[#2563EB] border border-[#1A56DB] text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm">
          <BookOpen className="w-5 h-5 text-blue-300" />
          Explore Courses
        </Link>
      </motion.div>
    </motion.div>
  );
}
//nk } from "react-router-dom";
// import { useMemo } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import useAuth from "../hooks/useAuth";
// import Footer from "../components/Footer";
// import HeroCarousel from "../components/HeroCarousel";
// import api from "../api/axios";
// import TestimonialsSection from "../components/TestimonialSection";

// /* ── Brand tokens ───────────────────────────────────────────────
//    Navy  : #0D1B3E   (dark, primary text / backgrounds)
//    Blue  : #1A56DB   (accent, buttons, highlights)
//    Cream : #F4F6FF   (page background)
//    White : #FFFFFF
// ─────────────────────────────────────────────────────────────── */

// const fadeUp = {
//   initial: { opacity: 0, y: 32 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
// };
// const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

// const features = [
//   { icon: "🎬", title: "HD Video Lessons",    desc: "Crystal-clear streaming with adaptive quality for any connection speed.",         color: "from-[#1A56DB] to-[#0D1B3E]" },
//   { icon: "✅", title: "Smart Quizzes",       desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts.",          color: "from-[#2563EB] to-[#1A56DB]" },
//   { icon: "🏆", title: "Certificates",        desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily.",   color: "from-[#0D1B3E] to-[#1A56DB]" },
//   { icon: "📊", title: "Analytics",           desc: "Deep insights into student progress and creator revenue in real time.",            color: "from-[#1A56DB] to-[#0D1B3E]" },
//   { icon: "📄", title: "Notes & Resources",   desc: "Attach PDFs, slides, and files directly to any lesson for download.",             color: "from-[#2563EB] to-[#1A56DB]" },
//   { icon: "💬", title: "Community Q&A",       desc: "Per-course discussion boards so students can help each other grow.",              color: "from-[#0D1B3E] to-[#2563EB]" },
// ];

// function CountUp({ target }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         const num = parseInt(target.replace(/\D/g, ""));
//         let start = 0;
//         const step = Math.ceil(num / 60);
//         const timer = setInterval(() => {
//           start += step;
//           if (start >= num) { setCount(num); clearInterval(timer); }
//           else setCount(start);
//         }, 20);
//         observer.disconnect();
//       }
//     });
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [target]);
//   return <span ref={ref}>{count.toLocaleString()}</span>;
// }

// function LandingCourseCard({ course }) {
//   const avgRating = course.stats?.avgRating || course.rating;
//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.01 }}
//       transition={{ duration: 0.2 }}
//       className="group bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 transition"
//     >
//       <Link to={`/courses/${course.slug || course.id}`}>
//         <div className="relative aspect-[16/10] overflow-hidden bg-blue-50">
//           {course.thumbnail?.url || course.thumbnail ? (
//             <img src={course.thumbnail?.url || course.thumbnail} alt={course.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
//           ) : (
//             <div className="h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-navy-50">📚</div>
//           )}
//           {(course.isFree || course.price === 0) && (
//             <span className="absolute top-3 left-3 text-xs bg-[#1A56DB] text-white px-2.5 py-1 rounded-full font-semibold">FREE</span>
//           )}
//         </div>
//         <div className="p-4">
//           <h3 className="font-semibold text-[#0D1B3E] line-clamp-2 group-hover:text-[#1A56DB] transition text-sm">
//             {course.title}
//           </h3>
//           <p className="text-xs text-slate-500 mt-1">{course.creator?.name || course.instructor?.name || "Tech Mind Academy"}</p>
//           <div className="flex items-center justify-between mt-3">
//             {avgRating > 0 ? (
//               <div className="flex items-center gap-1 text-sm">
//                 <span className="text-amber-400">★</span>
//                 <span className="text-[#0D1B3E] font-medium text-xs">{Number(avgRating).toFixed(1)}</span>
//               </div>
//             ) : <span className="text-xs text-slate-400">New</span>}
//             <div className="font-bold text-[#1A56DB] text-sm">
//               {course.isFree || course.price === 0 ? "Free" : `₹${(course.discountPrice || course.price || "").toLocaleString()}`}
//             </div>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

// export default function LandingPage() {
//   const { user } = useAuth();
//   const [hasImages, setHasImages] = useState(false);
//   const [topCourses, setTopCourses] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(true);
//   const heroRef = useRef(null);
//   const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
//   const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

//   const [stats, setStats] = useState([
//     { value: "...", label: "Students enrolled",  icon: "👨‍🎓" },
//     { value: "...", label: "Courses published",   icon: "📚" },
//     { value: "...", label: "Expert creators",     icon: "🎓" },
//     { value: "4.9★", label: "Average rating",    icon: "⭐" },
//   ]);

//   useEffect(() => {
//     api.get("/stats/public").then(({ data }) => {
//       setStats([
//         { value: `${data.students}+`, label: "Students enrolled", icon: "👨‍🎓" },
//         { value: `${data.courses}+`,  label: "Courses published",  icon: "📚" },
//         { value: `${data.creators}+`, label: "Expert creators",    icon: "🎓" },
//         { value: "4.9★",             label: "Average rating",     icon: "⭐" },
//       ]);
//     }).catch(() => {});
//   }, []);

//   useEffect(() => {
//     api.get("/courses").then(({ data }) => {
//       const raw = data.courses || data?.data || [];
//       if (!Array.isArray(raw)) { setCoursesLoading(false); return; }
//       setTopCourses(raw.slice(0, 4).map((c, i) => ({
//         id: c._id, title: c.title, slug: c.slug,
//         creator: c.creator, thumbnail: c.thumbnail,
//         isFree: c.isFree, price: c.price, discountPrice: c.discountPrice,
//         stats: c.stats, rating: c.stats?.avgRating || 0,
//       })));
//     }).catch(() => {}).finally(() => setCoursesLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#F4F6FF] overflow-x-hidden">
//       <Navbar />

//       {/* ── Hero ── */}
//       <section
//         ref={heroRef}
//         className={`relative overflow-hidden w-full flex flex-col ${
//           hasImages ? "pt-0 pb-0 bg-[#0D1B3E]" : "min-h-[88vh] justify-center pt-20 pb-28 bg-[#0D1B3E]"
//         }`}
//       >
//         {/* Background pattern */}
//         {!hasImages && (
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,86,219,0.25),transparent_60%)]" />
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(26,86,219,0.12),transparent_60%)]" />
//             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]" />
//             <motion.div animate={{ scale: [1,1.1,1], opacity:[0.1,0.18,0.1] }} transition={{ duration: 8, repeat: Infinity }}
//               className="absolute top-16 right-1/4 w-80 h-80 bg-[#1A56DB] rounded-full blur-[110px]" />
//             <motion.div animate={{ scale: [1,1.15,1], opacity:[0.07,0.13,0.07] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
//               className="absolute bottom-20 left-1/4 w-72 h-72 bg-[#2563EB] rounded-full blur-[90px]" />
//           </div>
//         )}

//         {hasImages ? (
//           <>
//             <HeroCarousel onHasImages={setHasImages} />
//             <motion.div className="relative w-full max-w-5xl mx-auto text-center z-10 pt-14 pb-18 px-4">
//               <HeroContent user={user} stagger={stagger} fadeUp={fadeUp} />
//             </motion.div>
//           </>
//         ) : (
//           <>
//             <motion.div style={{ y: heroY, opacity: heroOpacity }}
//               className="relative w-full max-w-5xl mx-auto text-center z-10 px-4">
//               <HeroContent user={user} stagger={stagger} fadeUp={fadeUp} />
//             </motion.div>
//             <div className="relative w-full mt-10">
//               <HeroCarousel onHasImages={setHasImages} />
//             </div>
//           </>
//         )}

//         {/* Stats bar */}
//         <div className="border-t border-white/[0.07] bg-white/[0.04] backdrop-blur-sm w-full mt-auto">
//           <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
//             {stats.map((s, i) => (
//               <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.6+i*0.1 }}>
//                 <p className="text-2xl font-black text-[#60A5FA]">{s.value}</p>
//                 <p className="text-xs text-blue-200/60 mt-0.5">{s.label}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Top Courses ── */}
//       <section className="py-20 px-4 bg-[#F4F6FF]">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
//               className="text-xs font-bold uppercase tracking-widest text-[#1A56DB] mb-3">
//               Top Rated This Month
//             </motion.p>
//             <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
//               className="text-3xl sm:text-4xl font-black text-[#0D1B3E]">
//               Courses Students Love
//             </motion.h2>
//             <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
//               className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
//               Handpicked, high-quality, and loved by students.
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {coursesLoading
//               ? [...Array(4)].map((_, i) => <div key={i} className="h-[300px] rounded-2xl bg-blue-100 animate-pulse" />)
//               : topCourses.map((course) => <LandingCourseCard key={course.id} course={course} />)}
//           </div>

//           <div className="text-center mt-10">
//             <Link to="/techmind-courses"
//               className="inline-flex items-center gap-2 border-2 border-[#1A56DB] text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all">
//               View All Courses
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Features ── */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
//               className="text-3xl sm:text-4xl font-black text-[#0D1B3E]">
//               Everything You Need to{" "}
//               <span className="bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E] bg-clip-text text-transparent">Succeed</span>
//             </motion.h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {features.map((f, i) => (
//               <motion.div key={i}
//                 initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.08 }}
//                 className="group relative bg-[#F4F6FF] border border-blue-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-100/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
//                 <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
//                 <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white text-2xl mb-4`}>
//                   {f.icon}
//                 </div>
//                 <h3 className="font-bold text-[#0D1B3E] mb-2">{f.title}</h3>
//                 <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <TestimonialsSection />

//       {/* ── For Students & Creators ── */}
//       <section className="py-20 px-4 bg-[#F4F6FF]">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Student */}
//           <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
//             className="bg-white border border-blue-100 rounded-3xl p-8 relative overflow-hidden shadow-sm">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
//             <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1A56DB] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
//               👨‍🎓 For Students
//             </div>
//             <h3 className="text-2xl font-black text-[#0D1B3E] mb-3">Build Skills. Earn Certificates.</h3>
//             <p className="text-slate-500 text-sm leading-relaxed mb-6">
//               Access expert-led courses. Learn at your pace, test yourself with quizzes, and earn certificates that recruiters respect.
//             </p>
//             <ul className="space-y-3 mb-8">
//               {["HD video lessons with subtitles","Auto-graded quizzes & progress tracking","Downloadable notes & resources","Verified completion certificates","Community discussions per course"].map((item, i) => (
//                 <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
//                   <div className="w-5 h-5 rounded-full bg-[#1A56DB] flex items-center justify-center flex-shrink-0">
//                     <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <Link to="/register"
//               className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition">
//               {user?.role === "student" ? "Go to Dashboard →" : "Start for Free →"}
//             </Link>
//           </motion.div>

//           {/* Creator */}
//           <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
//             className="bg-[#0D1B3E] border border-blue-900/40 rounded-3xl p-8 relative overflow-hidden shadow-sm">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" />
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_60%)]" />
//             <div className="relative">
//               <div className="inline-flex items-center gap-2 bg-blue-900/40 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
//                 🎓 For Creators
//               </div>
//               <h3 className="text-2xl font-black text-white mb-3">Teach the World. Earn While You Sleep.</h3>
//               <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
//                 Build and publish courses using our powerful creator tools. Reach thousands of eager students.
//               </p>
//               <ul className="space-y-3 mb-8">
//                 {["Course builder with drag-drop sections","Video + PDF/PPTX notes per lesson","Auto-graded quizzes + manual grading","Student analytics and earnings reports","Payout dashboard with instant transfers"].map((item, i) => (
//                   <li key={i} className="flex items-center gap-3 text-sm text-blue-100/80">
//                     <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
//                       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register?role=creator"
//                 className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1A56DB] text-white font-bold px-6 py-3 rounded-xl transition">
//                 Become a Creator →
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="py-20 px-4 relative overflow-hidden bg-[#0D1B3E]">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,86,219,0.2),transparent_70%)]" />
//         <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
//         <div className="relative max-w-3xl mx-auto text-center">
//           <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="space-y-6">
//             <h2 className="text-4xl sm:text-5xl font-black text-white">Ready to transform your career?</h2>
//             <p className="text-blue-200/70 text-lg">
//               Join students already building their future with Tech Mind Academy.
//             </p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Link to="/register"
//                 className="bg-[#1A56DB] hover:bg-[#2563EB] text-white font-black px-10 py-4 rounded-2xl transition shadow-2xl shadow-blue-900/50 text-base">
//                 {user ? "Go to Dashboard →" : "Create Free Account →"}
//               </Link>
//               <Link to="/techmind-courses"
//                 className="text-white border-2 border-white/20 hover:border-[#1A56DB] hover:bg-[#1A56DB]/10 px-8 py-4 rounded-2xl transition font-bold text-base">
//                 Browse Courses
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }

// /* ── Extracted hero text — used in both carousel/no-carousel layouts ── */
// function HeroContent({ user, stagger, fadeUp }) {
//   return (
//     <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-7">
//       <motion.div variants={fadeUp}>
//         <span className="inline-flex items-center gap-2.5 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-blue-300 text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
//           <span className="relative flex h-2 w-2">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
//           </span>
//           The Modern Learning Platform for Tech Students
//         </span>
//       </motion.div>

//       <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-black text-white leading-[1.08] tracking-tight">
//         Learn Fast.
//         <span className="relative ml-3">
//           <span className="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#1A56DB] bg-clip-text text-transparent">
//             Land Faster.
//           </span>
//         </span>
//       </motion.h1>

//       <motion.p variants={fadeUp} className="text-xl text-blue-200/70 max-w-2xl mx-auto leading-relaxed font-light">
//         Expert-led courses, real projects, verified certificates — everything you need to go from student to professional.
//       </motion.p>

//       <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap pt-2">
//         <Link to="/register"
//           className="group relative bg-[#1A56DB] hover:bg-[#2563EB] text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-blue-900/60 overflow-hidden">
//           <span className="relative z-10 flex items-center gap-2">
//             Start Learning
//             <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//             </svg>
//           </span>
//         </Link>
//         <Link to="/techmind-courses"
//           className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#1A56DB]/50 text-gray-200 font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm">
//           <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//           </svg>
//           Explore Courses
//         </Link>
//       </motion.div>
//     </motion.div>
//   );
// }
// import { Link } from "react-router-dom";
// import { useMemo } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import useAuth from "../hooks/useAuth";
// import Footer from "../components/Footer";
// import HeroCarousel from "../components/HeroCarousel";
// import api from "../api/axios";
// import TestimonialsSection from "../components/TestimonialSection";

// const fadeUp = {
//   initial: { opacity: 0, y: 32 },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
//   },
// };
// const stagger = { animate: { transition: { staggerChildren: 0.12 } } };
// const fadeIn = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1, transition: { duration: 0.7 } },
// };

// // const stats = [
// //   { value: "10+", label: "Students enrolled", icon: "👨‍🎓" },
// //   { value: "2+", label: "Courses published", icon: "📚" },
// //   { value: "10+", label: "Expert creators", icon: "🎓" },
// //   { value: "4.9★", label: "Average rating", icon: "⭐" },
// // ];

// const features = [
//   {
//     icon: "🎬",
//     title: "HD Video Lessons",
//     desc: "Crystal-clear streaming with adaptive quality for any connection speed.",
//     color: "from-blue-500 to-indigo-500",
//   },
//   {
//     icon: "✅",
//     title: "Smart Quizzes",
//     desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts.",
//     color: "from-green-500 to-emerald-500",
//   },
//   {
//     icon: "🏆",
//     title: "Certificates",
//     desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily.",
//     color: "from-yellow-500 to-orange-500",
//   },
//   {
//     icon: "📊",
//     title: "Analytics",
//     desc: "Deep insights into student progress and creator revenue in real time.",
//     color: "from-purple-500 to-violet-500",
//   },
//   {
//     icon: "📄",
//     title: "Notes & Resources",
//     desc: "Attach PDFs, slides, and files directly to any lesson for download.",
//     color: "from-pink-500 to-rose-500",
//   },
//   {
//     icon: "💬",
//     title: "Community Q&A",
//     desc: "Per-course discussion boards so students can help each other grow.",
//     color: "from-teal-500 to-cyan-500",
//   },
// ];

// const reviews = [
//   {
//     name: "Arjun Mehta",
//     role: "Software Engineer at Infosys",
//     avatar: "AM",
//     avatarColor: "from-blue-500 to-indigo-600",
//     review:
//       "The Full Stack course completely transformed my career. The structured curriculum and hands-on projects gave me the confidence to crack my dream job interview.",
//     rating: 5,
//     course: "Full Stack Web Development",
//   },
//   {
//     name: "Priya Joshi",
//     role: "Data Analyst at TCS",
//     avatar: "PJ",
//     avatarColor: "from-purple-500 to-pink-600",
//     review:
//       "Best investment I made in 2024! The Python for Data Science course is incredibly well-structured. I went from zero to landing a data analyst role in just 4 months.",
//     rating: 5,
//     course: "Python for Data Science",
//   },
//   {
//     name: "Rohan Kumar",
//     role: "UI Designer at Zomato",
//     avatar: "RK",
//     avatarColor: "from-teal-500 to-emerald-600",
//     review:
//       "I was a complete beginner in design. Now I'm a professional UI/UX designer. The certificate helped me stand out in interviews. Highly recommend TechMinds!",
//     rating: 5,
//     course: "UI/UX Design Masterclass",
//   },
//   {
//     name: "Sneha Reddy",
//     role: "Cloud Engineer at Wipro",
//     avatar: "SR",
//     avatarColor: "from-orange-500 to-red-600",
//     review:
//       "The DevOps course content is cutting-edge. The instructors explain complex concepts so simply. Got placed within 2 weeks of completing the course!",
//     rating: 5,
//     course: "DevOps & Cloud Engineering",
//   },
//   {
//     name: "Vikram Singh",
//     role: "Full Stack Dev at Startup",
//     avatar: "VS",
//     avatarColor: "from-cyan-500 to-blue-600",
//     review:
//       "Tech Minds has changed the way I learn. The community, the quality of content, and the certificates are all top-notch. I recommend it to every student.",
//     rating: 5,
//     course: "Full Stack Web Development",
//   },
//   {
//     name: "Kavya Nair",
//     role: "ML Engineer at Accenture",
//     avatar: "KN",
//     avatarColor: "from-violet-500 to-purple-600",
//     review:
//       "Amazing platform. The ML course with real projects got me into my dream company. The instructors are super responsive and the content is always updated.",
//     rating: 5,
//     course: "Python for Data Science & ML",
//   },
// ];

// function CountUp({ target, suffix = "" }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         const num = parseInt(target.replace(/\D/g, ""));
//         let start = 0;
//         const step = Math.ceil(num / 60);
//         const timer = setInterval(() => {
//           start += step;
//           if (start >= num) {
//             setCount(num);
//             clearInterval(timer);
//           } else setCount(start);
//         }, 20);
//         observer.disconnect();
//       }
//     });
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [target]);
//   return (
//     <span ref={ref}>
//       {count.toLocaleString()}
//       {suffix}
//     </span>
//   );
// }

// function StarRating({ rating }) {
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((i) => (
//         <svg
//           key={i}
//           className={`w-4 h-4 ${i <= rating ? "text-amber-400" : "text-gray-300"}`}
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// function LandingCourseCard({ course }) {
//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.01 }}
//       transition={{ duration: 0.2 }}
//       className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition"
//     >
//       <Link to={`/courses/${course.slug || course.id}`}>
//         <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
//           {course.thumbnail?.url || course.thumbnail ? (
//             <img
//               src={course.thumbnail?.url || course.thumbnail}
//               alt={course.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//             />
//           ) : (
//             <div className="h-full flex items-center justify-center text-4xl">
//               📚
//             </div>
//           )}

//           {(course.isFree || course.price === 0) && (
//             <span className="absolute top-3 left-3 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
//               FREE
//             </span>
//           )}
//         </div>

//         <div className="p-4">
//           <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition">
//             {course.title}
//           </h3>

//           <p className="text-xs text-gray-500 mt-1">
//             {course.creator?.name || course.instructor?.name || "Tech Minds"}
//           </p>

//           <div className="flex items-center justify-between mt-3">
//             <div className="flex items-center gap-1 text-sm">
//               <span className="text-yellow-500">★</span>
//               <span>{course.rating || 4.5}</span>
//             </div>

//             <div className="font-bold text-indigo-600">
//               {course.isFree || course.price === 0
//                 ? "Free"
//                 : `${(course.discountPrice || course.price).toLocaleString()}`}
//             </div>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

// export default function LandingPage() {
//   const { user } = useAuth();
//   // const [activeReview, setActiveReview] = useState(0);
//   const [hasImages, setHasImages] = useState(false);
//   const [topCourses, setTopCourses] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(true);
//   const heroRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"],
//   });
//   const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

//   const [stats, setStats] = useState([
//     { value: "...", label: "Students enrolled", icon: "👨‍🎓" },
//     { value: "...", label: "Courses published", icon: "📚" },
//     { value: "...", label: "Expert creators", icon: "🎓" },
//     { value: "4.9★", label: "Average rating", icon: "⭐" },
//   ]);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await api.get("/stats/public");
//         setStats([
//           {
//             value: `${data.students}+`,
//             label: "Students enrolled",
//             icon: "👨‍🎓",
//           },
//           { value: `${data.courses}+`, label: "Courses published", icon: "📚" },
//           { value: `${data.creators}+`, label: "Expert creators", icon: "🎓" },
//           { value: "4.9★", label: "Average rating", icon: "⭐" },
//         ]);
//       } catch (err) {
//         console.log("Stats fetch failed", err);
//       }
//     };
//     fetchStats();
//   }, []);

//   // Auto-rotate reviews
//   // useEffect(() => {
//   //   const t = setInterval(
//   //     () => setActiveReview((p) => (p + 1) % reviews.length),
//   //     4000,
//   //   );
//   //   return () => clearInterval(t);
//   // }, []);
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const { data } = await api.get("/courses");

//         const raw = data.courses || data?.data || [];
// if (!Array.isArray(raw)) {
//   setCoursesLoading(false);
//   return;
// }
// const latestCourses = raw.slice(0, 4).map((course, index) => ({
//   id: course._id,
//   title: course.title,
//   instructor: course.creator?.name || course.instructor?.name || "Tech Minds",
//   rating: course.rating || 4.8,
//   students: course.studentsEnrolled?.length || course.enrollments?.length || "0",
//   duration: course.duration || "20 hrs",
//   level: course.level || "Beginner",
//   price: course.price ? `₹${course.price}` : "Free",
//   badge: ["Bestseller", "Trending", "Hot", "New"][index] || "New",
//   badgeColor: ["bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-emerald-500"][index] || "bg-emerald-500",
//   gradient: ["from-blue-600 to-indigo-600", "from-purple-600 to-pink-600", "from-pink-600 to-rose-600", "from-teal-600 to-cyan-600"][index % 4],
//   tags: Array.isArray(course.tags) && course.tags.length > 0
//   ? course.tags.slice(0, 3)
//   : [course.category || "Programming"],
//   icon: ["💻", "🤖", "🎨", "☁️"][index % 4],
//   thumbnail: course.thumbnail,
//   slug: course.slug,
// }));
// setTopCourses(latestCourses);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setCoursesLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
//       <Navbar />

//       {/* ── Hero ── */}
//       {/* ── Hero ── */}
//       {/* ── Hero ── */}
//       {/* ───────────────── Hero ───────────────── */}
//       {/* ───────────────── Hero ───────────────── */}
//       {/* ───────────────── Hero ───────────────── */}
//       <section
//         ref={heroRef}
//         className={`relative overflow-hidden bg-[#070B14] w-full flex flex-col ${
//           hasImages ? "pt-0 pb-0" : "min-h-[90vh] justify-center pt-20 pb-28"
//         }`}
//       >
//         {/* Background only when no carousel */}
//         {!hasImages && (
//           <div className="absolute inset-0">
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.2),transparent_60%)]" />

//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_60%)]" />

//             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

//             <motion.div
//               animate={{
//                 scale: [1, 1.1, 1],
//                 opacity: [0.08, 0.14, 0.08],
//               }}
//               transition={{
//                 duration: 8,
//                 repeat: Infinity,
//               }}
//               className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"
//             />

//             <motion.div
//               animate={{
//                 scale: [1, 1.15, 1],
//                 opacity: [0.06, 0.1, 0.06],
//               }}
//               transition={{
//                 duration: 10,
//                 repeat: Infinity,
//                 delay: 2,
//               }}
//               className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet-500 rounded-full blur-[100px]"
//             />
//           </div>
//         )}

//         {/* ───── WITH CAROUSEL ───── */}
//         {hasImages ? (
//           <>
//             <HeroCarousel onHasImages={setHasImages} />

//             <motion.div className="relative w-full max-w-5xl mx-auto text-center z-10 pt-16 pb-20">
//               <motion.div
//                 variants={stagger}
//                 initial="initial"
//                 animate="animate"
//                 className="space-y-7"
//               >
//                 <motion.div variants={fadeUp}>
//                   <span className="inline-flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
//                     <span className="relative flex h-2 w-2">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />

//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
//                     </span>
//                     The Modern Learning Platform for Tech Students
//                   </span>
//                 </motion.div>

//                 <motion.h1
//                   variants={fadeUp}
//                   className="text-5xl sm:text-7xl font-black text-white leading-[1.08] tracking-tight"
//                 >
//                   Learn Fast.
//                   <span className="relative ml-3">
//                     <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
//                       Land Faster.
//                     </span>
//                   </span>
//                 </motion.h1>

//                 <motion.p
//                   variants={fadeUp}
//                   className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
//                 >
//                   Expert-led courses, real projects, verified certificates —
//                   everything you need to go from student to professional in
//                   record time.
//                 </motion.p>
//                 <motion.div
//                   variants={fadeUp}
//                   className="flex items-center justify-center gap-4 flex-wrap pt-2"
//                 >
//                   <Link
//                     to="/register"
//                     className="group relative bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-indigo-900/50 overflow-hidden"
//                   >
//                     <span className="relative z-10 flex items-center gap-2">
//                       Start Learning
//                       <svg
//                         className="w-5 h-5 group-hover:translate-x-1 transition-transform"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2.5}
//                           d="M13 7l5 5m0 0l-5 5m5-5H6"
//                         />
//                       </svg>
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </Link>
//                   <Link
//                     to="/courses"
//                     className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-gray-200 font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                       />
//                     </svg>
//                     Explore Courses
//                   </Link>
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </>
//         ) : (
//           <>
//             {/* ───── WITHOUT CAROUSEL ───── */}
//             <motion.div
//               style={{ y: heroY, opacity: heroOpacity }}
//               className="relative w-full max-w-5xl mx-auto text-center z-10"
//             >
//               <motion.div
//                 variants={stagger}
//                 initial="initial"
//                 animate="animate"
//                 className="space-y-7"
//               >
//                 <motion.div variants={fadeUp}>
//                   <span className="inline-flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
//                     <span className="relative flex h-2 w-2">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />

//                       <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
//                     </span>
//                     The Modern Learning Platform for Tech Students
//                   </span>
//                 </motion.div>

//                 <motion.h1
//                   variants={fadeUp}
//                   className="text-5xl sm:text-7xl font-black text-white leading-[1.08] tracking-tight"
//                 >
//                   Learn Fast.
//                   <span className="relative ml-3">
//                     <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
//                       Land Faster.
//                     </span>
//                   </span>
//                 </motion.h1>

//                 <motion.p
//                   variants={fadeUp}
//                   className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
//                 >
//                   Expert-led courses, real projects, verified certificates —
//                   everything you need to go from student to professional in
//                   record time.
//                 </motion.p>
//                 <motion.div
//                   variants={fadeUp}
//                   className="flex items-center justify-center gap-4 flex-wrap pt-2"
//                 >
//                   <Link
//                     to="/register"
//                     className="group relative bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-indigo-900/50 overflow-hidden"
//                   >
//                     <span className="relative z-10 flex items-center gap-2">
//                       Start Learning
//                       <svg
//                         className="w-5 h-5 group-hover:translate-x-1 transition-transform"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2.5}
//                           d="M13 7l5 5m0 0l-5 5m5-5H6"
//                         />
//                       </svg>
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </Link>
//                   <Link
//                     to="/courses"
//                     className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-gray-200 font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
//                   >
//                     <svg
//                       className="w-5 h-5 text-indigo-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                       />
//                     </svg>
//                     Explore Courses
//                   </Link>
//                 </motion.div>
//               </motion.div>
//             </motion.div>

//             <div className="relative w-full">
//               <HeroCarousel onHasImages={setHasImages} />
//             </div>
//           </>
//         )}

//         {/* ───── Stats ───── */}
//         <div className="border-t border-white/[0.05] bg-white/[0.02] backdrop-blur-sm w-full mt-auto">
//           <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
//             {stats.map((s, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 + i * 0.1 }}
//               >
//                 <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
//                   {s.value}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3"
//             >
//               Top Rated This Month
//             </motion.p>

//             <motion.h2
//               initial={{ opacity: 0, y: 16 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-4xl font-black text-gray-900 dark:text-white"
//             >
//               Courses Students Love
//             </motion.h2>

//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto"
//             >
//               Handpicked by our team. High-quality, updated, and loved by
//               thousands.
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {coursesLoading
//               ? [...Array(4)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-[320px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
//                   />
//                 ))
//               : topCourses.map((course) => (
//                   <LandingCourseCard key={course.id} course={course} />
//                 ))}
//           </div>

//           <div className="text-center mt-10">
//             <Link
//               to="/techmind-courses"
//               className="inline-flex items-center gap-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
//             >
//               View All Courses
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </section>
//       {/* ── Features ── */}
//       <section className="py-24 px-4 bg-white dark:bg-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <motion.h2
//               initial={{ opacity: 0, y: 16 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-4xl font-black text-gray-900 dark:text-white"
//             >
//               Everything You Need to{" "}
//               <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//                 Succeed
//               </span>
//             </motion.h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((f, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 24 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.08 }}
//                 className="group relative bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
//               >
//                 <div
//                   className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`}
//                 />
//                 <div
//                   className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white text-2xl mb-4`}
//                 >
//                   {f.icon}
//                 </div>
//                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">
//                   {f.title}
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
//                   {f.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

{
  /* ── Reviews ── */
}
{
  /* <section className="py-24 px-4 bg-[#070B14] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3"
            >
              Student Success Stories
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-white"
            >
              Real Students, Real Results
            </motion.h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRating rating={5} />
              <span className="text-white font-bold">4.9</span>
              <span className="text-gray-500 text-sm">from 8,000+ reviews</span>
            </div>
          </div>

          
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 text-6xl opacity-20">
                  "
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${reviews[activeReview].avatarColor} flex items-center justify-center text-white font-black text-lg`}
                  >
                    {reviews[activeReview].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">
                      {reviews[activeReview].name}
                    </p>
                    <p className="text-indigo-200 text-sm">
                      {reviews[activeReview].role}
                    </p>
                    <StarRating rating={reviews[activeReview].rating} />
                  </div>
                </div>
                <blockquote className="text-white text-lg font-light leading-relaxed mb-4">
                  "{reviews[activeReview].review}"
                </blockquote>
                <p className="text-indigo-300 text-sm">
                  📚 {reviews[activeReview].course}
                </p>
              </motion.div>

              
              <div className="flex flex-col gap-4">
                {reviews
                  .filter((_, i) => i !== activeReview)
                  .slice(0, 3)
                  .map((review, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReview(reviews.indexOf(review))}
                      className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
                        >
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">
                            {review.name}
                          </p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        "{review.review}"
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`h-2 rounded-full transition-all ${i === activeReview ? "w-8 bg-indigo-500" : "w-2 bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */
}

// <TestimonialsSection />

{
  /* ── For Students & Creators ── */
}
//       <section className="py-24 px-4 bg-white dark:bg-gray-950">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Student */}
//           <motion.div
//             initial={{ opacity: 0, x: -24 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-3xl p-8 relative overflow-hidden"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
//             <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
//               👨‍🎓 For Students
//             </div>
//             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
//               Build Skills. Earn Certificates.
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
//               Access 1,200+ expert-led courses. Learn at your pace, test
//               yourself with quizzes, and earn certificates that recruiters
//               actually respect.
//             </p>
//             <ul className="space-y-3 mb-8">
//               {[
//                 "HD video lessons with subtitles",
//                 "Auto-graded quizzes & progress tracking",
//                 "Downloadable notes & resources",
//                 "Verified completion certificates",
//                 "Community discussions per course",
//               ].map((item, i) => (
//                 <li
//                   key={i}
//                   className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
//                 >
//                   <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
//                     <svg
//                       className="w-3 h-3 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={3}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   </div>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               to="/register"
//               className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition"
//             >
//               {user?.role === "student"
//                 ? "Go to Dashboard →"
//                 : "Start for Free →"}
//             </Link>
//           </motion.div>

//           {/* Creator */}
//           <motion.div
//             initial={{ opacity: 0, x: 24 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-100 dark:border-teal-900/50 rounded-3xl p-8 relative overflow-hidden"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
//             <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
//               🎓 For Creators
//             </div>
//             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
//               Teach the World. Earn While You Sleep.
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
//               Build and publish courses using our powerful creator tools. Reach
//               thousands of eager students and earn on every enrollment.
//             </p>
//             <ul className="space-y-3 mb-8">
//               {[
//                 "Course builder with drag-drop sections",
//                 "Video + PDF/PPTX notes per lesson",
//                 "Auto-graded quizzes + manual grading",
//                 "Student analytics and earnings reports",
//                 "Payout dashboard with instant transfers",
//               ].map((item, i) => (
//                 <li
//                   key={i}
//                   className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
//                 >
//                   <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
//                     <svg
//                       className="w-3 h-3 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={3}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   </div>
//                   {item}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               to="/register?role=creator"
//               className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition"
//             >
//               Become a Creator →
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── CTA Banner ── */}
//       <section className="py-24 px-4 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
//         <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
//         <div className="relative max-w-3xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="space-y-6"
//           >
//             <h2 className="text-4xl sm:text-5xl font-black text-white">
//               Ready to transform your career?
//             </h2>
//             <p className="text-indigo-200 text-lg">
//               Join, 10+ students already building their future with Tech
//               Mind Academy.
//             </p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Link
//                 to="/register"
//                 className="bg-white hover:bg-gray-50 text-indigo-600 font-black px-10 py-4 rounded-2xl transition shadow-2xl text-lg"
//               >
//                 {user ? "Go to Dashboard →" : "Create Free Account →"}
//               </Link>
//               <Link
//                 to="/courses"
//                 className="text-white border-2 border-white/40 hover:border-white hover:bg-white/10 px-8 py-4 rounded-2xl transition font-bold"
//               >
//                 Browse Courses
//               </Link>
//             </div>

//           </motion.div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// const features = [
//   { icon: "🎬", title: "Video lessons", desc: "HD video with auto-resume and playback controls" },
//   { icon: "❓", title: "Auto-graded quizzes", desc: "MCQ, true/false, short answer with instant feedback" },
//   { icon: "📝", title: "Assignments", desc: "File submissions with manual grading and feedback" },
//   { icon: "📄", title: "Lesson notes", desc: "Download PDF, Word, and PowerPoint materials" },
//   { icon: "🏆", title: "Certificates", desc: "Auto-issued on course completion" },
//   { icon: "📊", title: "Progress tracking", desc: "Visual progress bar and lesson completion status" },
// ];

// const stats = [
//   { value: "10K+", label: "Students" },
//   { value: "500+", label: "Courses" },
//   { value: "200+", label: "Creators" },
//   { value: "98%", label: "Satisfaction" },
// ];

// const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
// const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950">
//       {/* Navbar */}
//       <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//             Tech Minds
//           </Link>
//           <div className="flex items-center gap-3">
//             <Link to="/courses" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block">
//               Browse courses
//             </Link>
//             <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
//               Sign in
//             </Link>
//             <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
//               Get started free
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pt-20 pb-24 px-4">
//         {/* Background decoration */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-40" />
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 dark:bg-violet-900/30 rounded-full blur-3xl opacity-40" />
//         </div>

//         <div className="relative max-w-4xl mx-auto text-center">
//           <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
//             <motion.div variants={fadeUp}>
//               <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
//                 🚀 The modern learning platform
//               </span>
//             </motion.div>
//             <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
//               Learn anything,{" "}
//               <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//                 master everything
//               </span>
//             </motion.h1>
//             <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//               A complete SaaS learning platform with video lessons, quizzes, assignments, and certificates.
//               Built for students who want to grow and creators who want to teach.
//             </motion.p>
//             <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
//               <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-200 dark:shadow-none">
//                 Start learning for free →
//               </Link>
//               <Link to="/courses" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 text-gray-700 dark:text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition text-base">
//                 Browse courses
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
//         <div className="max-w-4xl mx-auto px-4">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
//             {stats.map((s, i) => (
//               <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{s.value}</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
//               className="text-3xl font-bold text-gray-900 dark:text-white">
//               Everything you need to learn
//             </motion.h2>
//             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
//               className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
//               A fully featured LMS with all the tools for effective online education
//             </motion.p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((f, i) => (
//               <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }} transition={{ delay: i * 0.08 }}
//                 className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
//                 <div className="text-3xl mb-3">{f.icon}</div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* For creators */}
//       <section className="py-20 px-4 bg-white dark:bg-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
//               <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">For creators</span>
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
//                 Build your course.<br/>Grow your audience.
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
//                 Upload videos, create quizzes and assignments, attach notes, and watch your students learn. Full analytics and earnings dashboard included.
//               </p>
//               <ul className="space-y-2">
//                 {["Course builder with drag-drop sections", "Video + PDF/PPTX notes per lesson", "Auto-graded quizzes + manual assignment grading", "Student analytics and earnings reports"].map((item, i) => (
//                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                     <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
//                       <svg className="w-3 h-3 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register?role=creator" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition">
//                 Become a creator →
//               </Link>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
//               className="bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-950/50 dark:to-indigo-950/50 rounded-3xl p-8 border border-teal-100 dark:border-teal-900">
//               <div className="space-y-3">
//                 {["Upload lesson video", "Add quiz (auto-graded)", "Attach PDF notes", "Set assignment", "Publish course"].map((step, i) => (
//                   <div key={i} className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border transition ${i === 1 ? "border-teal-400 shadow-sm shadow-teal-100 dark:shadow-none" : "border-gray-100 dark:border-gray-700"}`}>
//                     <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 2 ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>{i + 1}</div>
//                     <span className={`text-sm font-medium ${i < 2 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{step}</span>
//                     {i < 2 && <svg className="w-4 h-4 text-teal-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>}
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-violet-600">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
//             <h2 className="text-3xl font-bold text-white">Ready to start learning?</h2>
//             <p className="text-indigo-200 text-lg">Join thousands of students already learning on Tech Minds.</p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Link to="/register" className="bg-white hover:bg-gray-50 text-indigo-600 font-bold px-8 py-3.5 rounded-2xl transition shadow-lg">
//                 Create free account →
//               </Link>
//               <Link to="/courses" className="text-white border border-white/30 hover:border-white px-8 py-3.5 rounded-2xl transition font-semibold">
//                 Browse courses
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 px-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
//         <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
//           <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tech Minds</span>
//           <p className="text-sm text-gray-400">© {new Date().getFullYear()} Tech Minds. Built with MERN Stack.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Navbar from "../components/Navbar";
// import useAuth from "../hooks/useAuth";
// import Footer from "../components/Footer";

// // ─── Animation variants ────────────────────────────────────────────────────
// const fadeUp = {
//   initial: { opacity: 0, y: 28 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
// };

// const stagger = {
//   animate: { transition: { staggerChildren: 0.1 } },
// };

// // ─── Data ──────────────────────────────────────────────────────────────────
// const stats = [
//   { value: "50K+",   label: "Students enrolled" },
//   { value: "1,200+", label: "Courses published" },
//   { value: "800+",   label: "Expert creators" },
//   { value: "4.9★",   label: "Average rating" },
// ];

// const features = [
//   { icon: "🎬", title: "HD Video Lessons",  desc: "Crystal-clear streaming with adaptive quality for any connection speed." },
//   { icon: "✅", title: "Smart Quizzes",     desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts." },
//   { icon: "🏆", title: "Certificates",      desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily." },
//   { icon: "📊", title: "Analytics",         desc: "Deep insights into student progress and creator revenue in real time." },
//   { icon: "📄", title: "Notes & Resources", desc: "Attach PDFs, slides, and files directly to any lesson for download." },
//   { icon: "💬", title: "Community Q&A",     desc: "Per-course discussion boards so students can help each other grow." },
// ];

// const studentFeatures = [
//   "HD video lessons with subtitles",
//   "Auto-graded quizzes & progress tracking",
//   "Downloadable notes & resources",
//   "Verified completion certificates",
//   "Community discussions per course",
// ];

// const creatorFeatures = [
//   "Course builder with drag-drop sections",
//   "Video + PDF/PPTX notes per lesson",
//   "Auto-graded quizzes + manual assignment grading",
//   "Student analytics and earnings reports",
//   "Payout dashboard with instant transfers",
// ];

// const steps = [
//   { num: "01", title: "Create your account", desc: "Sign up free as a student or apply as a creator — no credit card needed." },
//   { num: "02", title: "Browse or build",     desc: "Students explore courses; creators use our builder to launch their first course." },
//   { num: "03", title: "Learn or earn",       desc: "Students complete lessons and earn certificates. Creators earn on every enrollment." },
//   { num: "04", title: "Grow together",       desc: "Track progress, collect feedback, and level up — as a student or a creator." },
// ];

// // ─── Component ─────────────────────────────────────────────────────────────
// export default function LandingPage() {

//     const { user } = useAuth();
//    console.log(user)
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950">

//       {/* Navbar */}
//       {/* <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//           <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//             Tech Minds
//           </Link>
//           <div className="flex items-center gap-3">
//             <Link to="/courses" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block">
//               Browse courses
//             </Link>
//             <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
//               Sign in
//             </Link>
//             <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
//               Get started free
//             </Link>
//           </div>
//         </div>
//       </nav> */}

//       <Navbar/>

//       {/* Hero */}
//       <section className="relative overflow-hidden bg-gray-950 pt-24 pb-28 px-4">
//         {/* Grid pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
//         {/* Glow blobs */}
//         <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600 opacity-10 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-violet-600 opacity-[0.07] rounded-full blur-3xl pointer-events-none" />

//         <div className="relative max-w-4xl mx-auto text-center">
//           <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
//             <motion.div variants={fadeUp}>
//               <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
//                 🚀 The modern learning platform
//               </span>
//             </motion.div>
//             <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
//               Learn anything,{" "}
//               <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent italic">
//                 master everything.
//               </span>
//             </motion.h1>
//             <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
//               A complete SaaS learning platform with video lessons, quizzes, assignments, and certificates.
//               Built for students who want to grow and creators who want to teach.
//             </motion.p>
//             <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
//               <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-900/40">
//                 Start learning for free →
//               </Link>
//               <Link to="/courses" className="bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition text-base">
//                 Browse courses
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Stats — moved inside hero */}
//         <div className="relative max-w-4xl mx-auto mt-16 pt-10 border-t border-white/[0.07]">
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
//             {stats.map((s, i) => (
//               <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 + i * 0.1 }}>
//                 <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{s.value}</p>
//                 <p className="text-sm text-gray-500 mt-1">{s.label}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Dual Audience — Student + Creator */}
//       <section className="bg-white dark:bg-gray-950 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl -mt-6 relative z-10">

//             {/* For Students */}
//             <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }} transition={{ duration: 0.5 }}
//               className="bg-white dark:bg-gray-900 p-8 lg:p-10 relative">
//               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-violet-600" />
//               <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-3">
//                 For Students
//               </span>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
//                 Build real skills,<br />earn real certificates.
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
//                 Access hundreds of expert-led courses. Learn at your own pace, test your knowledge with quizzes,
//                 and earn certificates that actually matter.
//               </p>
//               <ul className="space-y-2.5 mb-7">
//                 {studentFeatures.map((item, i) => (
//                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                     <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
//                       <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm inline-flex items-center gap-2">
//                 {user?.role === "student" ? "dashboard" :" Create student account →"}
//               </Link>
//             </motion.div>

//             {/* For Creators */}
//             <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
//               className="bg-white dark:bg-gray-900 p-8 lg:p-10 relative">
//               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
//               <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 block mb-3">
//                 For Creators
//               </span>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
//                 Build your course.<br />Grow your audience.
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
//                 Upload videos, create quizzes and assignments, attach notes, and watch your students learn.
//                 Full analytics and earnings dashboard included.
//               </p>
//               <ul className="space-y-2.5 mb-6">
//                 {creatorFeatures.map((item, i) => (
//                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                     <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
//                       <svg className="w-3 h-3 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//               {/* Builder preview */}
//               <div className="bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-950/50 dark:to-indigo-950/50 rounded-2xl p-5 border border-teal-100 dark:border-teal-900 mb-6">
//                 <div className="space-y-2">
//                   {["Upload lesson video", "Add quiz (auto-graded)", "Attach PDF notes", "Set assignment", "Publish course"].map((step, i) => (
//                     <div key={i} className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 border transition ${i === 1 ? "border-teal-400 shadow-sm shadow-teal-100 dark:shadow-none" : "border-gray-100 dark:border-gray-700"}`}>
//                       <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 2 ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>{i + 1}</div>
//                       <span className={`text-xs font-medium ${i < 2 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{step}</span>
//                       {i < 2 && (
//                         <svg className="w-3.5 h-3.5 text-teal-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                         </svg>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <Link to="/register?role=creator" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
//                 Become a creator →
//               </Link>
//             </motion.div>

//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
//               className="text-3xl font-bold text-gray-900 dark:text-white">
//               Everything you need to learn
//             </motion.h2>
//             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
//               className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
//               A fully featured LMS with all the tools for effective online education
//             </motion.p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((f, i) => (
//               <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }} transition={{ delay: i * 0.08 }}
//                 className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
//                 <div className="text-3xl mb-3">{f.icon}</div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-20 px-4 bg-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-14">
//             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
//               className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
//               How it works
//             </motion.p>
//             <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
//               className="text-3xl font-bold text-white">
//               From zero to enrolled in minutes.
//             </motion.h2>
//             <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
//               className="text-gray-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
//               Whether you're a student or creator, getting started takes just a few steps.
//             </motion.p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {steps.map((s, i) => (
//               <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }} transition={{ delay: i * 0.1 }}
//                 className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6">
//                 <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent opacity-40 mb-4 leading-none">
//                   {s.num}
//                 </p>
//                 <h3 className="font-semibold text-white text-sm mb-2">{s.title}</h3>
//                 <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* For Creators — detailed section */}
//       <section className="py-20 px-4 bg-white dark:bg-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
//               <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">For creators</span>
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
//                 Build your course.<br />Grow your audience.
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
//                 Upload videos, create quizzes and assignments, attach notes, and watch your students learn.
//                 Full analytics and earnings dashboard included.
//               </p>
//               <ul className="space-y-2">
//                 {creatorFeatures.map((item, i) => (
//                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
//                     <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
//                       <svg className="w-3 h-3 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//               <Link to="/register?role=creator" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition">
//                 Become a creator →
//               </Link>
//             </motion.div>
//             <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
//               className="bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-950/50 dark:to-indigo-950/50 rounded-3xl p-8 border border-teal-100 dark:border-teal-900">
//               <div className="space-y-3">
//                 {["Upload lesson video", "Add quiz (auto-graded)", "Attach PDF notes", "Set assignment", "Publish course"].map((step, i) => (
//                   <div key={i} className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border transition ${i === 1 ? "border-teal-400 shadow-sm shadow-teal-100 dark:shadow-none" : "border-gray-100 dark:border-gray-700"}`}>
//                     <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < 2 ? "bg-teal-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>{i + 1}</div>
//                     <span className={`text-sm font-medium ${i < 2 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{step}</span>
//                     {i < 2 && (
//                       <svg className="w-4 h-4 text-teal-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//                       </svg>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-violet-600">
//         <div className="max-w-3xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-5">
//             <h2 className="text-3xl font-bold text-white">Ready to start learning?</h2>
//             <p className="text-indigo-200 text-lg">Join thousands of students already learning on Tech Minds.</p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Link to="/register" className="bg-white hover:bg-gray-50 text-indigo-600 font-bold px-8 py-3.5 rounded-2xl transition shadow-lg">
//                 {user ? "Start your journey" :"Create free account →"}
//               </Link>
//               <Link to="/courses" className="text-white border border-white/30 hover:border-white px-8 py-3.5 rounded-2xl transition font-semibold">
//                 Browse courses
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 px-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
//         {/* <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
//           <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Tech Minds</span>
//           <p className="text-sm text-gray-400">© {new Date().getFullYear()} Tech Minds. Built with MERN Stack.</p>
//         </div> */}
//         <Footer/>
//       </footer>

//     </div>
//   );
// }
