// import { Link } from "react-router-dom";
// import { useMemo } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import useAuth from "../hooks/useAuth";
// import HeroCarousel from "../components/HeroCarousel";
// import api from "../api/axios";
// import TestimonialsSection from "../components/TestimonialSection";
// import {
//   Film,
//   CheckCircle,
//   Award,
//   BarChart2,
//   FileText,
//   MessageSquare,
//   Users,
//   BookOpen,
//   GraduationCap,
//   Star,
//   ArrowRight,
//   MonitorPlay,
//   ClipboardList,
//   Download,
//   BadgeCheck,
//   MessagesSquare,
//   LayoutTemplate,
//   PenLine,
//   LineChart,
//   Banknote,
//   BrainCircuit,
// } from "lucide-react";

// const fadeUp = {
//   initial: { opacity: 0, y: 32 },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
//   },
// };
// const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

// const features = [
//   {
//     Icon: Film,
//     title: "HD Video Lessons",
//     desc: "Crystal-clear streaming with adaptive quality for any connection speed.",
//     color: "from-[#1A56DB] to-[#0D1B3E]",
//   },
//   {
//     Icon: CheckCircle,
//     title: "Smart Quizzes",
//     desc: "Auto-graded quizzes with instant feedback and unlimited retry attempts.",
//     color: "from-[#2563EB] to-[#1A56DB]",
//   },
//   {
//     Icon: Award,
//     title: "Certificates",
//     desc: "Shareable, verified certificates on course completion. Add to LinkedIn easily.",
//     color: "from-[#0D1B3E] to-[#1A56DB]",
//   },
//   {
//     Icon: BarChart2,
//     title: "Analytics",
//     desc: "Deep insights into student progress and creator revenue in real time.",
//     color: "from-[#1A56DB] to-[#0D1B3E]",
//   },
//   {
//     Icon: FileText,
//     title: "Notes & Resources",
//     desc: "Attach PDFs, slides, and files directly to any lesson for download.",
//     color: "from-[#2563EB] to-[#1A56DB]",
//   },
//   {
//     Icon: MessageSquare,
//     title: "Community Q&A",
//     desc: "Per-course discussion boards so students can help each other grow.",
//     color: "from-[#0D1B3E] to-[#2563EB]",
//   },
// ];

// const studentFeatures = [
//   { Icon: MonitorPlay, text: "HD video lessons with subtitles" },
//   { Icon: ClipboardList, text: "Auto-graded quizzes & progress tracking" },
//   { Icon: Download, text: "Downloadable notes & resources" },
//   { Icon: BadgeCheck, text: "Verified completion certificates" },
//   { Icon: MessagesSquare, text: "Community discussions per course" },
// ];

// const creatorFeatures = [
//   { Icon: LayoutTemplate, text: "Course builder with drag-drop sections" },
//   { Icon: Film, text: "Video + PDF/PPTX notes per lesson" },
//   { Icon: PenLine, text: "Auto-graded quizzes + manual grading" },
//   { Icon: LineChart, text: "Student analytics and earnings reports" },
//   { Icon: Banknote, text: "Payout dashboard with instant transfers" },
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
//   return <span ref={ref}>{count.toLocaleString()}</span>;
// }

// function LandingCourseCard({ course }) {
//   const avgRating = course.stats?.avgRating || course.rating;
//   return (
//     <motion.div
//       whileHover={{ y: -6, scale: 1.01 }}
//       transition={{ duration: 0.2 }}
//       className="group bg-white rounded-2xl overflow-hidden border border-[#0D1B3E]/8 shadow-sm hover:shadow-xl hover:shadow-[#1A56DB]/10 transition-all duration-300"
//     >
//       <Link to={`/courses/${course.slug || course.id}`}>
//         <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
//           {course.thumbnail?.url || course.thumbnail ? (
//             <img
//               src={course.thumbnail?.url || course.thumbnail}
//               alt={course.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
//             />
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <BookOpen className="w-12 h-12 text-[#1A56DB]/30" />
//             </div>
//           )}
//           {(course.isFree || course.price === 0) && (
//             <span className="absolute top-3 left-3 text-xs bg-[#1A56DB] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
//               FREE
//             </span>
//           )}
//         </div>
//         <div className="p-4">
//           <h3 className="font-semibold text-[#0D1B3E] line-clamp-2 group-hover:text-[#1A56DB] transition text-sm leading-snug">
//             {course.title}
//           </h3>
//           <p className="text-xs text-[#0D1B3E]/45 mt-1 font-medium">
//             {course.creator?.name ||
//               course.instructor?.name ||
//               "Tech Mind Academy"}
//           </p>
//           <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0D1B3E]/6">
//             {avgRating > 0 ? (
//               <div className="flex items-center gap-1 text-sm">
//                 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
//                 <span className="text-[#0D1B3E] font-bold text-xs">
//                   {Number(avgRating).toFixed(1)}
//                 </span>
//               </div>
//             ) : (
//               <span className="text-xs text-[#0D1B3E]/35">New</span>
//             )}
//             <div className="font-black text-[#1A56DB] text-sm">
//               {course.isFree || course.price === 0
//                 ? "Free"
//                 : `₹${(course.discountPrice || course.price || "").toLocaleString()}`}
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

//   const [stats, setStats] = useState([
//     { value: "...", label: "Students enrolled", Icon: Users },
//     { value: "...", label: "Courses published", Icon: BookOpen },
//     { value: "...", label: "Expert creators", Icon: GraduationCap },
//     { value: "4.9", label: "Average rating", Icon: Star },
//   ]);

//   useEffect(() => {
//     api
//       .get("/stats/public")
//       .then(({ data }) => {
//         setStats([
//           {
//             value: `${data.students}+`,
//             label: "Students enrolled",
//             Icon: Users,
//           },
//           {
//             value: `${data.courses}+`,
//             label: "Courses published",
//             Icon: BookOpen,
//           },
//           {
//             value: `${data.creators}+`,
//             label: "Expert creators",
//             Icon: GraduationCap,
//           },
//           { value: "4.9", label: "Average rating", Icon: Star },
//         ]);
//       })
//       .catch(() => {});
//   }, []);

//   useEffect(() => {
//     api
//       .get("/courses")
//       .then(({ data }) => {
//         const raw = data.courses || data?.data || [];
//         if (!Array.isArray(raw)) {
//           setCoursesLoading(false);
//           return;
//         }
//         setTopCourses(
//           raw.slice(0, 4).map((c) => ({
//             id: c._id,
//             title: c.title,
//             slug: c.slug,
//             creator: c.creator,
//             thumbnail: c.thumbnail,
//             isFree: c.isFree,
//             price: c.price,
//             discountPrice: c.discountPrice,
//             stats: c.stats,
//             rating: c.stats?.avgRating || 0,
//           })),
//         );
//       })
//       .catch(() => {})
//       .finally(() => setCoursesLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-white overflow-x-hidden">
//       {/* ── Hero ── */}
//       <section className="relative overflow-hidden bg-white w-full">
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
//         </div>

//         <div className="relative z-10 w-full max-w-5xl mx-auto text-center pt-20 pb-12 px-4">
//           <HeroContent user={user} stagger={stagger} fadeUp={fadeUp} />
//         </div>

//         <div className="relative z-10 border-t border-black/10 bg-black/[0.02] w-full">
//           <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
//             {stats.map((s, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 + i * 0.1 }}
//                 className="flex flex-col items-center gap-1"
//               >
//                 <s.Icon className="w-7 h-7 text-[#1A56DB] mb-0.5" />
//                 <p className="text-2xl font-black text-black">{s.value}</p>
//                 <p className="text-xs text-black/60 mt-0.5">{s.label}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <div className="relative w-full overflow-hidden">
//           <HeroCarousel onHasImages={setHasImages} />
//         </div>
//       </section>

//       {/* ── Top Courses ── */}
//       <section className="py-20 px-4 bg-white relative">
//         <div className="relative max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
//             >
//               Top Rated This Month
//             </motion.p>
//             <motion.h2
//               initial={{ opacity: 0, y: 16 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-3xl sm:text-4xl font-black text-[#1A56DB]"
//             >
//               Courses Students Love
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm"
//             >
//               Handpicked, high-quality, and loved by students.
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {coursesLoading
//               ? [...Array(4)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-[300px] rounded-2xl bg-[#0D1B3E]/6 animate-pulse"
//                   />
//                 ))
//               : topCourses.map((course) => (
//                   <LandingCourseCard key={course.id} course={course} />
//                 ))}
//           </div>
//           {/* <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex flex-col items-center justify-center py-20 gap-4"
//           >
//             <div className="w-16 h-16 rounded-2xl bg-[#1A56DB]/10 flex items-center justify-center mb-2">
//               <BookOpen className="w-8 h-8 text-[#1A56DB]" />
//             </div>
//             <h3 className="text-2xl font-black text-[#1A56DB]">Coming Soon</h3>
//             <p className="text-[#0D1B3E]/45 text-sm max-w-xs text-center">
//               We're curating the best courses for you. Check back shortly!
//             </p>
//           </motion.div> */}

//           <div className="text-center mt-10">
//             <Link
//               to="/techmind-courses"
//               className="inline-flex items-center gap-2 border-2 border-[#1A56DB] text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
//             >
//               View All Courses
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Features ── */}
//       <section className="py-20 px-4 bg-white relative">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
//         <div className="relative max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <motion.h2
//               initial={{ opacity: 0, y: 16 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-3xl sm:text-4xl font-black text-[#1A56DB]"
//             >
//               Everything You Need to Succeed
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               className="text-[#0D1B3E]/45 mt-3 max-w-xl mx-auto text-sm"
//             >
//               A fully featured platform with all the tools for effective online
//               learning.
//             </motion.p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {features.map((f, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 24 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.08 }}
//                 className="group relative rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
//                 style={{
//                   background: "rgba(255, 255, 255, 0.5)",
//                   backdropFilter: "blur(12px)",
//                   WebkitBackdropFilter: "blur(12px)",
//                   border: "1px solid rgba(26, 86, 219, 0.12)",
//                   boxShadow:
//                     "0 4px 24px rgba(26, 86, 219, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
//                 }}
//               >
//                 {/* <div
//                   className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`}
//                 /> */}
//                 <div
//                   className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A56DB]/10 mb-4`}
//                 >
//                   <f.Icon className="w-6 h-6 text-[#1A56DB]" />
//                 </div>
//                 <h3 className="font-black text-[#0D1B3E] mb-2">{f.title}</h3>
//                 <p className="text-sm text-[#0D1B3E]/50 leading-relaxed">
//                   {f.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Testimonials ── */}
//       <TestimonialsSection />

//       {/* ── For Students & Creators ── */}
//       <section className="py-20 px-4 bg-white relative">
//         <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Student card */}
//           <motion.div
//             initial={{ opacity: 0, x: -24 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
//             <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
//               <GraduationCap className="w-3.5 h-3.5" /> For Students
//             </div>
//             <h3 className="text-2xl font-black text-[#1A56DB] mb-3">
//               Build Skills. Earn Certificates.
//             </h3>
//             <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
//               Access expert-led courses. Learn at your pace, test yourself with
//               quizzes, and earn certificates that recruiters respect.
//             </p>
//             <ul className="space-y-3 mb-8">
//               {studentFeatures.map(({ Icon, text }, i) => (
//                 <li
//                   key={i}
//                   className="flex items-center gap-3 text-sm text-[#0D1B3E]/70"
//                 >
//                   <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
//                     <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
//                   </div>
//                   {text}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               to="/auth"
//               className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20"
//             >
//               {user?.role === "student"
//                 ? "Go to Dashboard →"
//                 : "Start for Free →"}
//             </Link>
//           </motion.div>

//           {/* Creator card */}
//           <motion.div
//             initial={{ opacity: 0, x: 24 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-white border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
//           >
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A56DB] to-[#0D1B3E]" />
//             <div className="inline-flex items-center gap-2 bg-[#1A56DB]/8 text-[#1A56DB] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-[#1A56DB]/15">
//               <BrainCircuit className="w-3.5 h-3.5" /> For Creators
//             </div>
//             <h3 className="text-2xl font-black text-[#1A56DB] mb-3">
//               Teach the World. Earn While You Sleep.
//             </h3>
//             <p className="text-[#0D1B3E]/50 text-sm leading-relaxed mb-6">
//               Build and publish courses using our powerful creator tools. Reach
//               thousands of eager students.
//             </p>
//             <ul className="space-y-3 mb-8">
//               {creatorFeatures.map(({ Icon, text }, i) => (
//                 <li
//                   key={i}
//                   className="flex items-center gap-3 text-sm text-[#0D1B3E]/70"
//                 >
//                   <div className="w-7 h-7 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
//                     <Icon className="w-3.5 h-3.5 text-[#1A56DB]" />
//                   </div>
//                   {text}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               to="/auth?role=creator"
//               className="inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-[#1A56DB]/20"
//             >
//               Become a Creator →
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="py-20 px-4 relative overflow-hidden bg-white">
//         <div className="relative max-w-3xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="space-y-6"
//           >
//             <h2 className="text-4xl sm:text-5xl font-black text-[#1A56DB]">
//               Ready to transform your career?
//             </h2>
//             <p className="text-black text-lg">
//               Join students already building their future with Tech Mind
//               Academy.
//             </p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Link
//                 to="/auth"
//                 className="bg-[#1A56DB] hover:bg-[#2563EB] text-white font-black px-10 py-4 rounded-2xl transition shadow-2xl shadow-blue-900/50 text-base"
//               >
//                 {user ? "Go to Dashboard →" : "Create Free Account →"}
//               </Link>
//               <Link
//                 to="/techmind-courses"
//                 className="bg-[#1A56DB] hover:bg-[#2563EB] text-white border-2 border-[#1A56DB] px-8 py-4 rounded-2xl transition font-bold text-base"
//               >
//                 Browse Courses
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ── Hero text component ── */
// function HeroContent({ user, stagger, fadeUp }) {
//   return (
//     <motion.div
//       variants={stagger}
//       initial="initial"
//       animate="animate"
//       className="space-y-7"
//     >
//       <motion.div>
//         <span className="inline-flex items-center gap-2.5 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-black text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
//           <span className="relative flex h-2 w-2">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
//           </span>
//           The Modern Learning with Tech Mind Academy
//         </span>
//       </motion.div>

//       <motion.h1
//         variants={fadeUp}
//         className="text-5xl sm:text-7xl font-black text-[#1A56DB] leading-[1.08] tracking-tight"
//       >
//         Learn Fast.
//         <span className="ml-3">Land Faster.</span>
//       </motion.h1>

//       <motion.p
//         variants={fadeUp}
//         className="text-xl text-black/70 max-w-2xl mx-auto leading-relaxed font-light"
//       >
//         Expert-led courses, real projects, verified certificates — everything
//         you need to go from student to professional.
//       </motion.p>

//       <motion.div
//         variants={fadeUp}
//         className="flex items-center justify-center gap-4 flex-wrap pt-2"
//       >
//         <Link
//           to="/auth"
//           className="group relative bg-[#1A56DB] hover:bg-[#2563EB] text-white font-bold px-10 py-4 rounded-2xl transition-all text-base shadow-2xl shadow-blue-900/60 overflow-hidden"
//         >
//           <span className="relative z-10 flex items-center gap-2">
//             Start Learning
//             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//           </span>
//         </Link>
//         <Link
//           to="/techmind-courses"
//           className="flex items-center gap-2 bg-[#1A56DB] hover:bg-[#2563EB] border border-[#1A56DB] text-white font-semibold px-8 py-4 rounded-2xl transition-all text-base backdrop-blur-sm"
//         >
//           <BookOpen className="w-5 h-5 text-blue-300" />
//           Explore Courses
//         </Link>
//       </motion.div>
//     </motion.div>
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
  Banknote, Search, PlayCircle, Trophy, Check, Code2, Database, Palette,
  ShieldCheck, Cpu, Briefcase, Rocket, Sparkles, ChevronDown, Cloud,
  BarChart3, Smartphone, Bot, FileUser, Mic, Layers,
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

const categories = [
  { Icon: Code2, name: "Web development", desc: "HTML, React, Node.js, MERN" },
  { Icon: Cpu, name: "AI and machine learning", desc: "Python, ML, deep learning" },
  { Icon: Database, name: "Data science", desc: "SQL, analytics, visualisation" },
  { Icon: Smartphone, name: "App development", desc: "Android, Flutter, React Native" },
  { Icon: Cloud, name: "Cloud and DevOps", desc: "AWS, Docker, CI/CD" },
  { Icon: ShieldCheck, name: "Cyber security", desc: "Ethical hacking, networks" },
  { Icon: Palette, name: "UI/UX design", desc: "Figma, design systems" },
  { Icon: BarChart3, name: "Career skills", desc: "Resume, interviews, English" },
];

const aiFeatures = [
  { Icon: Bot, title: "AI doubt solver", desc: "Stuck on a lesson? Ask a question and get a step-by-step explanation any time." },
  { Icon: Sparkles, title: "Personalised learning path", desc: "Suggestions for what to study next, based on your goals and quiz results." },
  { Icon: FileUser, title: "Resume help", desc: "Turn your courses and projects into clear resume points." },
  { Icon: Mic, title: "Interview practice", desc: "Rehearse common technical and HR questions and get instant feedback." },
];

const programs = [
  {
    Icon: Briefcase,
    title: "Internships",
    desc: "Work on guided, project-based tasks with mentor feedback and finish with an internship certificate.",
    points: ["Real-time project work", "Mentor reviews", "Internship certificate"],
    to: "/techmind-courses",
  },
  {
    Icon: Rocket,
    title: "Tech projects",
    desc: "Build portfolio-ready projects such as e-commerce sites, dashboards and chat apps, step by step.",
    points: ["Source code included", "Beginner to advanced", "Add to GitHub and resume"],
    to: "/techmind-courses",
  },
  {
    Icon: Layers,
    title: "Certification courses",
    desc: "Structured courses with quizzes and a final assessment, ending in a verified certificate.",
    points: ["Quizzes after each module", "Verified and shareable", "Lifetime access"],
    to: "/techmind-courses",
  },
];

const whyPoints = [
  "Learn at your own pace, on phone or laptop",
  "Short lessons that fit around college or work",
  "Practice quizzes with instant results",
  "Projects you can show to recruiters",
];

const faqs = [
  { q: "Is Tech Mind Academy free to join?", a: "Yes. Creating an account is free, and the platform has free courses you can start right away. Paid courses show their price on the course card." },
  { q: "Will I get a certificate?", a: "Yes. When you complete a course you receive a verified certificate that you can download and share on LinkedIn." },
  { q: "Do I need any prior experience?", a: "No. Many courses start from the basics. Each course page lists its level so you can pick one that suits you." },
  { q: "Can I learn on my phone?", a: "Yes. The site works on phones, tablets and laptops, and video quality adjusts to your connection." },
  { q: "How do internships and projects work?", a: "You work through guided tasks, submit your work for review, and receive an internship certificate when you finish." },
  { q: "I want to teach. How do I start?", a: "Choose Become a creator, build your course with the course builder, add videos, notes and quizzes, and publish it for students to enrol." },
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
  const [openFaq, setOpenFaq] = useState(0);
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

      {/* ── Categories ── */}
      <section className="py-20 px-4 bg-blue-50/60">
        <div className="max-w-6xl mx-auto">
          <Heading title="Explore by category" sub="Pick the area you want to grow in. New courses are added regularly." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ Icon, name, desc }) => (
              <Link
                key={name}
                to={`/techmind-courses?category=${encodeURIComponent(name)}`}
                className="group bg-white rounded-2xl border border-blue-100 p-5 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/10 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{name}</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4 bg-white">
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

      {/* ── AI-powered learning ── */}
      <section className="py-20 px-4 bg-blue-50/60">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white text-blue-700 text-sm font-semibold px-4 py-1.5 border border-blue-100">
              <Sparkles className="w-4 h-4" /> AI-powered learning
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">A study partner that is always available</h2>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-lg">
              Get help when you need it, practise for interviews, and always know what to learn next.
            </p>
            <ul className="mt-6 space-y-3">
              {whyPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition">
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {aiFeatures.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-blue-100 p-5">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{desc}</p>
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

      {/* ── Internships, projects, certifications ── */}
      <section className="py-20 px-4 bg-[#0D1B3E]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Learn, build, and get proof of it</h2>
            <p className="mt-3 text-blue-200 max-w-xl mx-auto">Three ways to turn what you learn into something you can show an employer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map(({ Icon, title, desc, points, to }) => (
              <div key={title} className="rounded-2xl bg-white/5 border border-white/10 p-7 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">{desc}</p>
                <ul className="mt-5 space-y-2 text-sm text-blue-100">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-300 shrink-0" />{p}</li>
                  ))}
                </ul>
                <Link to={to} className="mt-7 pt-1 inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
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

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-blue-50/60">
        <div className="max-w-3xl mx-auto">
          <Heading title="Frequently asked questions" sub="Can't find your answer? Create an account and ask in any course." />
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => {
              const open = openFaq === i;
              return (
                <div key={q} className={`bg-white rounded-2xl border transition-colors ${open ? "border-blue-400" : "border-blue-100"}`}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 font-semibold text-slate-900 rounded-2xl focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    {q}
                    <ChevronDown className={`w-5 h-5 text-blue-600 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <p className="overflow-hidden px-5 text-slate-600 text-sm leading-relaxed">
                      <span className="block pb-5">{a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-20 bg-white">
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