// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import useAuth from "../../hooks/useAuth";
// import { fetchMyCoursesCreator } from "../../api/services/course.service";
// import { fetchMyEarnings } from "../../api/services/payment.service";

// const fmt = (n) => (n || 0).toLocaleString("en-IN");

// function StatCard({ label, value, icon, color }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//       className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
//       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
//       <div>
//         <p className="text-2xl font-bold text-white">{value}</p>
//         <p className="text-sm text-gray-400">{label}</p>
//       </div>
//     </motion.div>
//   );
// }

// export default function CreatorDashboard() {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [earnings, setEarnings] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       fetchMyCoursesCreator().catch(() => ({ courses: [] })),
//       fetchMyEarnings().catch(() => null),
//     ]).then(([cRes, eRes]) => {
//       setCourses(cRes.courses || []);
//       setEarnings(eRes?.earnings || null);
//     }).finally(() => setIsLoading(false));
//   }, []);

//   const published = courses.filter(c => c.isPublished).length;
//   const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);

//   return (
//     <div className="space-y-8">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <h1 className="text-2xl font-bold text-white">Creator Studio</h1>
//         <p className="text-gray-400 mt-1 text-sm">Hello {user?.name?.split(" ")[0]} — manage your courses and earnings.</p>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="My Courses" value={courses.length} icon="📚" color="bg-teal-900/40" />
//         <StatCard label="Published" value={published} icon="🌐" color="bg-indigo-900/40" />
//         <StatCard label="Total Students" value={fmt(totalStudents)} icon="👥" color="bg-purple-900/40" />
//         <StatCard label="Earnings" value={`₹${fmt(earnings?.thisMonth)}`} icon="💰" color="bg-green-900/40" />
//       </div>

//       {/* Quick actions */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Link to="/creator/courses/new" className="bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800 rounded-2xl p-5 transition group">
//           <div className="text-3xl mb-3">➕</div>
//           <p className="font-semibold text-white group-hover:text-teal-300 transition">Create New Course</p>
//           <p className="text-xs text-gray-500 mt-1">Start building your content</p>
//         </Link>
//         <Link to="/creator/submissions" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-5 transition group">
//           <div className="text-3xl mb-3">📋</div>
//           <p className="font-semibold text-white group-hover:text-teal-300 transition">Grade Submissions</p>
//           <p className="text-xs text-gray-500 mt-1">Review student assignments</p>
//         </Link>
//         <Link to="/creator/analytics" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-5 transition group">
//           <div className="text-3xl mb-3">📊</div>
//           <p className="font-semibold text-white group-hover:text-teal-300 transition">View Analytics</p>
//           <p className="text-xs text-gray-500 mt-1">Track course performance</p>
//         </Link>
//       </div>

//       {/* My courses list */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-base font-semibold text-white">My Courses</h2>
//           <Link to="/creator/courses" className="text-sm text-teal-400 hover:underline">View all →</Link>
//         </div>
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[1,2,3].map(i => <div key={i} className="bg-gray-800 rounded-2xl aspect-video animate-pulse" />)}
//           </div>
//         ) : courses.length === 0 ? (
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
//             <div className="text-4xl mb-3">🗂️</div>
//             <p className="text-gray-400 mb-4">No courses yet.</p>
//             <Link to="/creator/courses/new" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
//               Create your first course →
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {courses.slice(0, 6).map(course => (
//               <div key={course._id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition">
//                 <div className="aspect-video bg-gray-700 relative">
//                   {course.thumbnail?.url ? (
//                     <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
//                   ) : <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>}
//                   <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-lg ${course.isPublished ? "bg-green-900/80 text-green-300" : "bg-gray-900/80 text-gray-300"}`}>
//                     {course.isPublished ? "Live" : "Draft"}
//                   </span>
//                 </div>
//                 <div className="p-3">
//                   <p className="text-sm font-semibold text-white truncate">{course.title}</p>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-xs text-gray-500">{course.stats?.totalStudents || 0} students</span>
//                     <Link to={`/creator/courses/${course._id}/edit`}
//                       className="text-xs text-teal-400 hover:underline">Edit →</Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Globe, Users, IndianRupee, Plus, ClipboardCheck, BarChart3, ChevronRight, ImageOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { fetchMyCoursesCreator } from "../../api/services/course.service";
import { fetchMyEarnings } from "../../api/services/payment.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const fmt = (n) => (n || 0).toLocaleString("en-IN");

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

function Stat({ label, value, Icon }) {
  return (
    <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-black/60">{label}</p>
        <p className="text-3xl font-bold text-[#0D1B3E] mt-1.5 tabular-nums">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

const ACTIONS = [
  { to: "/creator/submissions", Icon: ClipboardCheck, title: "Grade submissions", text: "Review student assignments" },
  { to: "/creator/analytics", Icon: BarChart3, title: "View analytics", text: "Track course performance" },
];

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyCoursesCreator().catch(() => ({ courses: [] })),
      fetchMyEarnings().catch(() => null),
    ])
      .then(([cRes, eRes]) => {
        setCourses(cRes.courses || []);
        setEarnings(eRes?.earnings || null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const published = courses.filter((c) => c.isPublished).length;
  const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);

  return (
    <div className="space-y-10 text-black">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">Creator Studio</h1>
          <p className="text-black/60 mt-1.5 text-sm">
            Hello {user?.name?.split(" ")[0]}, manage your courses and earnings.
          </p>
        </div>
        <Link
          to="/creator/courses/new"
          className={`inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition ${focusRing}`}
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Create new course
        </Link>
      </div>

      {/* Stats */}
      <section aria-label="Overview" className="bg-white border border-[#0D1B3E]/12 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-[#0D1B3E]/10 divide-x divide-y lg:divide-y-0">
        <Stat label="My courses" value={courses.length} Icon={BookOpen} />
        <Stat label="Published" value={published} Icon={Globe} />
        <Stat label="Total students" value={fmt(totalStudents)} Icon={Users} />
        <Stat label="Earnings this month" value={`₹${fmt(earnings?.thisMonth)}`} Icon={IndianRupee} />
      </section>

      {/* Courses + quick actions */}
      <div className="grid xl:grid-cols-[1fr_300px] gap-10">
        <section aria-labelledby="my-courses">
          <div className="flex items-center justify-between mb-4">
            <h2 id="my-courses" className="text-lg font-bold text-[#0D1B3E]">My courses</h2>
            <Link to="/creator/courses" className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}>
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-[#0D1B3E]/10 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-[#0D1B3E]/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-2/3 bg-[#0D1B3E]/5 rounded" />
                    <div className="h-3 w-1/3 bg-[#0D1B3E]/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-10 text-center">
              <p className="font-semibold text-[#0D1B3E]">No courses yet</p>
              <p className="text-sm text-black/60 mt-1">Create your first course to start teaching.</p>
              <Link
                to="/creator/courses/new"
                className={`inline-flex items-center gap-2 mt-5 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition ${focusRing}`}
              >
                <Plus className="w-4 h-4" strokeWidth={2.25} />
                Create course
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.slice(0, 6).map((course) => (
                <article key={course._id} className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden flex flex-col">
                  <div className="aspect-video bg-[#0D1B3E]/5 flex items-center justify-center">
                    {course.thumbnail?.url ? (
                      <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="w-7 h-7 text-[#0D1B3E]/25" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-[#0D1B3E] leading-snug line-clamp-2">{course.title}</h3>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-md ${
                          course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-[#0D1B3E]/8 text-[#0D1B3E]/70"
                        }`}
                      >
                        {course.isPublished ? "Live" : "Draft"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#0D1B3E]/10">
                      <span className="text-sm text-black/60">
                        {course.stats?.totalStudents || 0} students
                      </span>
                      <Link
                        to={`/creator/courses/${course._id}/edit`}
                        className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside aria-labelledby="quick-actions">
          <h2 id="quick-actions" className="text-lg font-bold text-[#0D1B3E] mb-4">Quick actions</h2>
          <ul className="bg-white border border-[#0D1B3E]/12 rounded-xl divide-y divide-[#0D1B3E]/10 overflow-hidden">
            {ACTIONS.map(({ to, Icon, title, text }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`group flex items-center gap-4 p-4 hover:bg-[#1A56DB]/[0.04] transition ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0D1B3E] text-sm">{title}</p>
                    <p className="text-sm text-black/55 mt-0.5">{text}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#0D1B3E]/30 group-hover:text-[#1A56DB] transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}