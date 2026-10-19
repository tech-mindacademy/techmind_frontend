// import { useEffect, useRef } from "react";
// import { motion, useAnimationFrame } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFeaturedReviews,
//   selectFeatured,
//   selectReviewLoading,
// } from "../store/slices/ReviewSlice";

// const TYPE_CONFIG = {
//   course: {
//     label: "Course",
//     color: "text-[#1A56DB]",
//     dot: "bg-[#1A56DB]",
//     badge: "bg-blue-50 border-blue-200",
//   },
//   platform: {
//     label: "Platform",
//     color: "text-[#0D1B3E]",
//     dot: "bg-[#0D1B3E]",
//     badge: "bg-slate-50 border-slate-200",
//   },
//   internship: {
//     label: "Internship",
//     color: "text-[#2563EB]",
//     dot: "bg-[#2563EB]",
//     badge: "bg-indigo-50 border-indigo-200",
//   },
// };

// function Stars({ rating }) {
//   return (
//     <span className="text-amber-400 text-sm tracking-tight">
//       {"★".repeat(rating)}
//       <span className="text-[#0D1B3E]/15">{"★".repeat(5 - rating)}</span>
//     </span>
//   );
// }

// function Avatar({ user }) {
//   if (user?.avatar?.url) {
//     return (
//       <img
//         src={user.avatar.url}
//         alt={user.name}
//         className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1A56DB]/20"
//       />
//     );
//   }
//   const initials = user?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
//   return (
//     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D1B3E] to-[#1A56DB] flex items-center justify-center text-sm font-bold text-white ring-2 ring-[#1A56DB]/20">
//       {initials}
//     </div>
//   );
// }

// function ReviewCard({ review }) {
//   const cfg = TYPE_CONFIG[review.reviewType] || TYPE_CONFIG.platform;
//   return (
//     <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md hover:shadow-[#1A56DB]/10 transition-shadow duration-300">
//       <div className="flex items-center justify-between">
//         <span className={`text-xs font-semibold flex items-center gap-1.5 ${cfg.color}`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//           {cfg.label}
//           {review.reviewType === "course" && review.course?.title && (
//             <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
//               — {review.course.title}
//             </span>
//           )}
//           {review.reviewType === "internship" && review.internshipCompany && (
//             <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
//               — {review.internshipCompany}
//             </span>
//           )}
//         </span>
//         <Stars rating={review.rating} />
//       </div>
//       <p className="font-semibold text-sm text-[#0D1B3E] leading-snug line-clamp-2">
//         {review.title}
//       </p>
//       <p className="text-[#0D1B3E]/55 text-xs leading-relaxed line-clamp-3">
//         {review.body}
//       </p>
//       <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
//         <Avatar user={review.user} />
//         <div>
//           <p className="text-sm font-semibold text-[#0D1B3E] leading-tight">
//             {review.user?.name || "Anonymous"}
//           </p>
//           <p className="text-xs text-[#0D1B3E]/35">
//             {new Date(review.createdAt).toLocaleDateString("en-IN", {
//               month: "short",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MarqueeRow({ reviews = [], reverse = false, speed = 0.4 }) {
//   const trackRef = useRef(null);
//   const xRef = useRef(0);
//   const pauseUntilRef = useRef(0);
//   const safeReviews = Array.isArray(reviews) ? reviews : [];
//   const repeatCount = Math.max(Math.ceil(6 / safeReviews.length), 2);
//   const items = Array(repeatCount).fill(safeReviews).flat();

//   useAnimationFrame((time, delta) => {
//     if (!trackRef.current || items.length === 0) return;

//     // If we're in a pause window, do nothing
//     if (time < pauseUntilRef.current) return;

//     const dir = reverse ? 1 : -1;
//     xRef.current += dir * speed * (delta / 16);
//     const singleSetWidth = trackRef.current.scrollWidth / repeatCount;

//     if (!reverse && xRef.current <= -singleSetWidth) {
//       xRef.current = 0;
//       pauseUntilRef.current = time + 10000; // 6 second pause
//     }
//     if (reverse && xRef.current >= 0) {
//       xRef.current = -singleSetWidth;
//       pauseUntilRef.current = time + 10000; // 6 second pause
//     }

//     trackRef.current.style.transform = `translateX(${xRef.current}px)`;
//   });

//   if (items.length === 0) return null;

//   return (
//     <div className="overflow-hidden">
//       <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
//         {items.map((review, i) => (
//           <ReviewCard key={review._id + "-" + i} review={review} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 animate-pulse">
//       <div className="flex justify-between">
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-16" />
//       </div>
//       <div className="h-4 bg-[#0D1B3E]/8 rounded w-4/5" />
//       <div className="space-y-1.5">
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-full" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-5/6" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-3/4" />
//       </div>
//       <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
//         <div className="w-10 h-10 rounded-full bg-[#0D1B3E]/8" />
//         <div className="space-y-1.5">
//           <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
//           <div className="h-2.5 bg-[#0D1B3E]/8 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   const dispatch = useDispatch();
//   const rawReviews = useSelector(selectFeatured);
//   const isLoading = useSelector(selectReviewLoading);
//   const reviews = Array.isArray(rawReviews) ? rawReviews : [];

//   useEffect(() => {
//     dispatch(fetchFeaturedReviews());
//   }, [dispatch]);

//   const half = Math.ceil(reviews.length / 2);
//   const row1 = reviews.slice(0, half);
//   const row2 = reviews.slice(half);
//   const showTwoRows = reviews.length >= 6;

//   const avgRating =
//     reviews.length > 0
//       ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//       : "0.0";
//   const recommendPct =
//     reviews.length > 0
//       ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
//       : 0;

//   return (
//     <section className="py-24 relative overflow-hidden bg-[#F7F5F0]">
//       {/* Dot-grid texture */}
//       <div
//         className="absolute inset-0 opacity-30"
//         style={{
//           backgroundImage: `radial-gradient(circle, #0D1B3E22 1px, transparent 1px)`,
//           backgroundSize: "28px 28px",
//         }}
//       />
//       {/* Grey grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(156,163,175,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(156,163,175,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
//       {/* Top accent line */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#0D1B3E] to-[#1A56DB]" />

//       <div className="relative z-10">
//         {/* Heading */}
//         <div className="text-center mb-14 px-4">
//           <motion.span
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A56DB]/8 border border-[#1A56DB]/20 text-sm text-[#1A56DB] font-medium mb-5"
//           >
//             <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
//             What learners say
//           </motion.span>

//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-black text-[#1A56DB] leading-tight tracking-tight"
//           >
//             Loved by thousands of{" "}
//             {/* <span className="relative inline-block"> */}
//                 learners
//               {/* <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#1A56DB]/15 rounded-full -z-0" /> */}
//             {/* </span> */}
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-black/60 mt-4 max-w-xl mx-auto text-sm leading-relaxed"
//           >
//             Real reviews from students, creators, and interns who built their
//             careers on Tech Minds.
//           </motion.p>
//         </div>

//         {/* Marquee rows */}
//         {isLoading ? (
//           <div className="space-y-4">
//             {[0, 1].map((row) => (
//               <div key={row} className="flex gap-4 overflow-hidden px-4">
//                 {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
//               </div>
//             ))}
//           </div>
//         ) : reviews.length === 0 ? (
//           <p className="text-center text-[#0D1B3E]/40 text-sm py-8">
//             No reviews yet — be the first!
//           </p>
//         ) : (
//           <div className="space-y-4">
//             <div className="relative">
//               <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//               <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//               <MarqueeRow reviews={showTwoRows ? row1 : reviews} speed={0.35} />
//             </div>
//             {showTwoRows && (
//               <div className="relative">
//                 <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//                 <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//                 <MarqueeRow reviews={row2} reverse speed={0.28} />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Stats */}
//         {reviews.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//             className="flex justify-center gap-6 mt-14 px-4 flex-wrap"
//           >
//             {[
//               { label: "Average rating", value: `${avgRating} ★` },
//               { label: "Total reviews", value: `${reviews.length}+` },
//               { label: "Would recommend", value: `${recommendPct}%` },
//             ].map((stat) => (
//               <div
//                 key={stat.label}
//                 className="text-center bg-white border border-[#0D1B3E]/8 rounded-2xl px-8 py-5 shadow-sm"
//               >
//                 <p className="text-2xl font-black text-[#1A56DB]">{stat.value}</p>
//                 <p className="text-xs text-black/50 mt-1 font-medium">{stat.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import HeroCarousel from "../components/HeroCarousel";
import api from "../api/axios";
import TestimonialsSection from "../components/TestimonialSection";
import {
  Film, CheckCircle, Award, BarChart2, FileText, MessageSquare, Users,
  BookOpen, GraduationCap, Star, ArrowRight, MonitorPlay, ClipboardList,
  Download, BadgeCheck, MessagesSquare, LayoutTemplate, PenLine, LineChart,
  Banknote, Search, PlayCircle, Trophy, Check,
} from "lucide-react";

/*
  Add once in index.html <head> (optional but recommended):
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
*/
const FONT = { fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif" };

const features = [
  { Icon: Film, title: "HD video lessons", desc: "Adaptive streaming that stays smooth on any connection." },
  { Icon: CheckCircle, title: "Quizzes with instant feedback", desc: "Auto-graded after every lesson, with unlimited retries." },
  { Icon: Award, title: "Verified certificates", desc: "Share on LinkedIn the moment you finish a course." },
  { Icon: BarChart2, title: "Progress analytics", desc: "See what you have learned and what is left, in real time." },
  { Icon: FileText, title: "Notes and resources", desc: "PDFs and slides attached to each lesson for download." },
  { Icon: MessageSquare, title: "Course Q&A", desc: "Ask questions and learn from other students in each course." },
];

const steps = [
  { Icon: Search, title: "Pick a course", desc: "Browse industry-focused courses and start free or paid." },
  { Icon: PlayCircle, title: "Learn by doing", desc: "Watch lessons, take quizzes, and build real projects." },
  { Icon: Trophy, title: "Get certified", desc: "Earn a verified certificate and add it to your profile." },
];

const studentFeatures = [
  { Icon: MonitorPlay, text: "HD video lessons with subtitles" },
  { Icon: ClipboardList, text: "Auto-graded quizzes and progress tracking" },
  { Icon: Download, text: "Downloadable notes and resources" },
  { Icon: BadgeCheck, text: "Verified completion certificates" },
  { Icon: MessagesSquare, text: "Community discussion in every course" },
];

const creatorFeatures = [
  { Icon: LayoutTemplate, text: "Drag-and-drop course builder" },
  { Icon: Film, text: "Video plus PDF/PPTX notes per lesson" },
  { Icon: PenLine, text: "Auto-graded and manual quizzes" },
  { Icon: LineChart, text: "Student analytics and earnings reports" },
  { Icon: Banknote, text: "Payout dashboard" },
];

function CountUp({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const num = parseInt(String(value).replace(/\D/g, ""), 10);
  const suffix = String(value).replace(/[\d.,]/g, "");
  const isNum = !Number.isNaN(num) && !String(value).includes(".");

  useEffect(() => {
    if (!isNum) return;
    const el = ref.current;
    if (!el) return;
    let timer;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0;
      const step = Math.max(1, Math.ceil(num / 50));
      timer = setInterval(() => {
        n += step;
        if (n >= num) { setDisplay(num); clearInterval(timer); } else setDisplay(n);
      }, 24);
      io.disconnect();
    });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [num, isNum]);

  if (!isNum) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

function CourseCard({ course }) {
  const avg = course.stats?.avgRating || course.rating;
  const free = course.isFree || course.price === 0;
  const thumb = course.thumbnail?.url || course.thumbnail;
  return (
    <Link
      to={`/courses/${course.slug || course.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-600/10 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <div className="relative aspect-[16/10] bg-blue-50 overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={course.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="h-full flex items-center justify-center"><BookOpen className="w-12 h-12 text-blue-300" /></div>
        )}
        {free && <span className="absolute top-3 left-3 text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-bold">Free</span>}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">{course.title}</h3>
        <p className="text-sm text-slate-500 mt-1">{course.creator?.name || course.instructor?.name || "Tech Mind Academy"}</p>
        <div className="flex items-center justify-between mt-auto pt-4">
          {avg > 0 ? (
            <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
              <Star className="w-4 h-4 fill-blue-600 text-blue-600" />{Number(avg).toFixed(1)}
            </span>
          ) : (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New</span>
          )}
          <span className="font-extrabold text-blue-600">
            {free ? "Free" : `₹${(course.discountPrice || course.price || "").toLocaleString()}`}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Heading({ title, sub, center = true }) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className={`mt-3 text-slate-600 max-w-xl ${center ? "mx-auto" : ""}`}>{sub}</p>}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [hasImages, setHasImages] = useState(false);
  const [topCourses, setTopCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [audience, setAudience] = useState("student");
  const [stats, setStats] = useState([
    { value: "...", label: "Students enrolled", Icon: Users },
    { value: "...", label: "Courses published", Icon: BookOpen },
    { value: "...", label: "Expert creators", Icon: GraduationCap },
    { value: "4.9", label: "Average rating", Icon: Star },
  ]);

  useEffect(() => {
    api.get("/stats/public")
      .then(({ data }) => {
        setStats([
          { value: `${data.students}+`, label: "Students enrolled", Icon: Users },
          { value: `${data.courses}+`, label: "Courses published", Icon: BookOpen },
          { value: `${data.creators}+`, label: "Expert creators", Icon: GraduationCap },
          { value: "4.9", label: "Average rating", Icon: Star },
        ]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.get("/courses")
      .then(({ data }) => {
        const raw = data.courses || data?.data || [];
        if (!Array.isArray(raw)) return;
        setTopCourses(
          raw.slice(0, 4).map((c) => ({
            id: c._id, title: c.title, slug: c.slug, creator: c.creator,
            thumbnail: c.thumbnail, isFree: c.isFree, price: c.price,
            discountPrice: c.discountPrice, stats: c.stats,
            rating: c.stats?.avgRating || 0,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  const list = audience === "student" ? studentFeatures : creatorFeatures;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden text-slate-900" style={FONT}>
      {/* ── Hero ── */}
      <section className="relative bg-white">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_80%_0%,rgba(26,86,219,0.10),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1.5 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              Courses, internships and certifications
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
              Learn fast.<br /><span className="text-blue-600">Land faster.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg leading-relaxed">
              Expert-led courses, real projects, and verified certificates. Everything you need to go from student to professional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition">
                {user ? "Go to dashboard" : "Start learning free"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/techmind-courses" className="inline-flex items-center gap-2 bg-white text-blue-700 border-2 border-blue-600 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl transition">
                <BookOpen className="w-4 h-4" /> Explore courses
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {["No credit card needed", "Learn at your pace", "Certificate on completion"].map((t) => (
                <li key={t} className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-600" />{t}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-blue-600/10" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden border border-blue-100 bg-blue-50 shadow-2xl shadow-blue-600/15">
              <HeroCarousel onHasImages={setHasImages} />
              {!hasImages && (
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-blue-900 p-8 flex flex-col justify-end text-white">
                  <GraduationCap className="w-14 h-14 mb-4 text-blue-200" />
                  <p className="text-2xl font-extrabold leading-snug">Build skills that companies hire for.</p>
                  <p className="mt-2 text-blue-100 text-sm">Courses, projects, and certificates in one place.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats band */}
        <div className="relative bg-blue-600">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <s.Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none"><CountUp value={s.value} /></p>
                  <p className="text-xs text-blue-100 mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top courses ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Heading title="Courses students love" sub="Top rated this month. Handpicked and highly reviewed." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coursesLoading
              ? [...Array(4)].map((_, i) => <div key={i} className="h-[300px] rounded-2xl bg-blue-50 animate-pulse" />)
              : topCourses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/techmind-courses" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-3.5 rounded-xl transition">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 bg-blue-50/60">
        <div className="max-w-6xl mx-auto">
          <Heading title="From first lesson to certificate in three steps" />
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ Icon, title, desc }, i) => (
              <div key={title} className="relative bg-white rounded-2xl p-7 border border-blue-100">
                <span className="absolute top-5 right-6 text-5xl font-extrabold text-blue-100 select-none">{i + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Heading title="Everything you need to finish what you start" sub="One platform for watching, practising, asking, and proving what you know." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 border border-blue-100 bg-white hover:bg-blue-600 hover:border-blue-600 group transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-white/15 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-white transition-colors">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 group-hover:text-blue-100 leading-relaxed transition-colors">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Students & Creators (toggle) ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Heading title="Made for learners and for teachers" />
          <div role="tablist" className="mx-auto mb-8 flex w-fit rounded-xl bg-blue-50 p-1">
            {[["student", "I want to learn"], ["creator", "I want to teach"]].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={audience === key}
                onClick={() => setAudience(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${audience === key ? "bg-blue-600 text-white shadow" : "text-blue-700 hover:bg-white"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl border border-blue-100 p-8 sm:p-10 bg-gradient-to-br from-white to-blue-50">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {audience === "student" ? "Build skills. Earn certificates." : "Teach the world. Get paid for it."}
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {audience === "student"
                  ? "Learn from experts at your own pace, test yourself with quizzes, and earn certificates that recruiters trust."
                  : "Build and publish courses with our creator tools and reach thousands of students."}
              </p>
              <Link
                to={audience === "student" ? "/auth" : "/auth?role=creator"}
                className="mt-7 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition"
              >
                {audience === "student"
                  ? user?.role === "student" ? "Go to dashboard" : "Start for free"
                  : "Become a creator"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="space-y-3">
              {list.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 bg-white border border-blue-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-20 bg-white">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-14 text-center text-white shadow-2xl shadow-blue-600/25">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to start your next chapter?</h2>
          <p className="mt-3 text-blue-100 max-w-lg mx-auto">Join students already building their future with Tech Mind Academy.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl transition">
              {user ? "Go to dashboard" : "Create free account"}
            </Link>
            <Link to="/techmind-courses" className="border-2 border-white/60 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition">
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}