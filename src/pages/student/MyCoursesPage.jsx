// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { fetchMyEnrollments } from "../../api/services/course.service";

// export default function MyCoursesPage() {
//   const [enrollments, setEnrollments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     fetchMyEnrollments()
//       .then(d => setEnrollments(d.enrollments || []))
//       .catch(() => {})
//       .finally(() => setIsLoading(false));
//   }, []);

//   const filtered = enrollments.filter(e => {
//     if (filter === "completed") return e.isCompleted;
//     if (filter === "in-progress") return !e.isCompleted && (e.progressPercent || 0) > 0;
//     if (filter === "not-started") return (e.progressPercent || 0) === 0;
//     return true;
//   });

//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled</p>
//         </div>
//         <Link to="/courses" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
//           + Browse more
//         </Link>
//       </motion.div>

//       {/* Filters */}
//       <div className="flex gap-2 flex-wrap">
//         {["all", "in-progress", "completed", "not-started"].map(f => (
//           <button key={f} onClick={() => setFilter(f)}
//             className={`px-4 py-2 text-sm font-medium rounded-xl transition-all capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"}`}>
//             {f.replace("-", " ")}
//           </button>
//         ))}
//       </div>

//       {isLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse"><div className="aspect-video bg-gray-200 dark:bg-gray-700" /><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"/><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"/></div></div>)}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
//           <div className="text-5xl mb-4">📖</div>
//           <p className="text-gray-500 dark:text-gray-400 mb-4">
//             {enrollments.length === 0 ? "No courses enrolled yet." : "No courses match this filter."}
//           </p>
//           <Link to="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
//             Explore courses →
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map(e => (
//             <motion.div key={e._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
//               <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
//                 {e.course.thumbnail?.url ? (
//                   <img src={e.course.thumbnail.url} alt={e.course.title} className="w-full h-full object-cover" />
//                 ) : <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>}
//                 {e.isCompleted && (
//                   <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Completed ✓</div>
//                 )}
//               </div>
//               <div className="p-4">
//                 <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{e.course.title}</p>
//                 <p className="text-xs text-gray-500 mt-1">by {e.course.creator?.name}</p>
//                 <div className="mt-3 mb-3">
//                   <div className="flex justify-between text-xs text-gray-400 mb-1">
//                     <span>Progress</span>
//                     <span>{e.progressPercent || 0}%</span>
//                   </div>
//                   <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
//                     <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${e.progressPercent || 0}%` }} />
//                   </div>
//                 </div>
//                 <Link to={`/student/learn/${e.course._id}`}
//                   className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
//                   {(e.progressPercent || 0) > 0 ? "Continue" : "Start"}
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Award, ImageOff } from "lucide-react";
import { fetchMyEnrollments } from "../../api/services/course.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const FILTERS = [
  ["all", "All"],
  ["in-progress", "In progress"],
  ["completed", "Completed"],
  ["not-started", "Not started"],
];

const matchesFilter = (e, filter) => {
  if (filter === "completed") return e.isCompleted;
  if (filter === "in-progress") return !e.isCompleted && (e.progressPercent || 0) > 0;
  if (filter === "not-started") return (e.progressPercent || 0) === 0;
  return true;
};

function CourseCard({ enrollment }) {
  const { course, progressPercent, isCompleted, certificateIssued } = enrollment;
  const percent = progressPercent || 0;
  const needsFinalQuiz = percent === 100 && !isCompleted && !certificateIssued;
  const label = isCompleted ? "Review course" : percent > 0 ? "Continue" : "Start learning";

  return (
    <article className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden hover:border-[#0D1B3E]/25 transition-colors">
      {/* Fixed 16:9 frame so every thumbnail is the same size */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0D1B3E]/5">
        {course.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-[#0D1B3E]/25" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#0D1B3E] truncate" title={course.title}>
              {course.title}
            </h3>
            {isCompleted && (
              <span className="shrink-0 whitespace-nowrap text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
                Completed
              </span>
            )}
            {needsFinalQuiz && (
              <span className="shrink-0 whitespace-nowrap text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                Final quiz due
              </span>
            )}
          </div>
          <p className="text-sm text-black/55 mt-1 truncate">by {course.creator?.name}</p>
        </div>

        <div>
          <div className="flex justify-between text-sm text-black/60 mb-1.5">
            <span>Progress</span>
            <span className="font-medium text-[#0D1B3E] tabular-nums">{percent}%</span>
          </div>
          <div
            className="w-full bg-[#0D1B3E]/10 rounded-full h-2"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${course.title} progress`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-700 ${isCompleted ? "bg-emerald-500" : "bg-[#1A56DB]"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* One row of actions, so every card has the same height */}
        <div className={`grid gap-2 ${certificateIssued ? "grid-cols-2" : "grid-cols-1"}`}>
          <Link
            to={`/student/learn/${course._id}`}
            className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition ${focusRing} ${
              isCompleted
                ? "border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5"
                : "bg-[#1A56DB] hover:bg-[#0D1B3E] text-white"
            }`}
          >
            {label}
          </Link>
          {certificateIssued && (
            <Link
              to={`/student/certificate/${course._id}`}
              className={`inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-[#1A56DB] border border-[#1A56DB]/30 hover:bg-[#1A56DB]/[0.06] rounded-lg transition ${focusRing}`}
            >
              <Award className="w-4 h-4" strokeWidth={1.75} />
              Certificate
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMyEnrollments()
      .then((d) => setEnrollments(d.enrollments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = enrollments.filter((e) => matchesFilter(e, filter));

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">My courses</h1>
          <p className="text-black/60 text-sm mt-1.5">
            {enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Link
          to="/courses"
          className={`inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition ${focusRing}`}
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Browse more
        </Link>
      </div>

      {/* Filters */}
      {enrollments.length > 0 && (
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter courses by status">
          {FILTERS.map(([key, label]) => {
            const count = enrollments.filter((e) => matchesFilter(e, key)).length;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${focusRing} ${
                  filter === key
                    ? "bg-[#0D1B3E] text-white border-[#0D1B3E]"
                    : "bg-white text-black/65 border-[#0D1B3E]/15 hover:border-[#0D1B3E]/40"
                }`}
              >
                {label} <span className={filter === key ? "text-white/70" : "text-black/40"}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[#0D1B3E]/10 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#0D1B3E]/5" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#0D1B3E]/5 rounded w-3/4" />
                <div className="h-3 bg-[#0D1B3E]/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-12 text-center">
          <p className="font-semibold text-[#0D1B3E]">
            {enrollments.length === 0 ? "No courses yet" : "No courses match this filter"}
          </p>
          <p className="text-sm text-black/60 mt-1">
            {enrollments.length === 0
              ? "You haven't enrolled in any courses yet."
              : "Try a different filter to see your other courses."}
          </p>
          {enrollments.length === 0 && (
            <Link
              to="/courses"
              className={`inline-flex items-center mt-5 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition ${focusRing}`}
            >
              Explore courses
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((e) => (
            <CourseCard key={e._id} enrollment={e} />
          ))}
        </div>
      )}
    </div>
  );
}