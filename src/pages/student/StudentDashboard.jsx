// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import useAuth from "../../hooks/useAuth";
// import { fetchMyEnrollments } from "../../api/services/course.service";

// const card = "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700";

// function StatCard({ label, value, icon, color }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`${card} p-4 flex flex-col items-center text-center gap-2 sm:flex-row sm:text-left sm:gap-4 sm:p-5`}
//     >
//       <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${color}`}>
//         {icon}
//       </div>
//       <div className="min-w-0">
//         <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
//         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
//       </div>
//     </motion.div>
//   );
// }

// function CourseCard({ enrollment }) {
//   const { course, progressPercent, lastAccessedLesson, isCompleted, certificateIssued } = enrollment;
//   return (
//     <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//       className={`${card} overflow-hidden hover:shadow-md transition-shadow`}>
//       <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
//         {course.thumbnail?.url ? (
//           <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
//         )}
//         {/* Show Completed badge only when truly completed (cert issued) */}
//         {isCompleted && certificateIssued && (
//           <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//             Completed ✓
//           </div>
//         )}
//         {/* Show "Pending Quiz" badge when all lessons done but final quiz not passed */}
//         {progressPercent === 100 && !isCompleted && !certificateIssued && (
//           <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
//             Take Final Quiz
//           </div>
//         )}
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
//           {course.title}
//         </h3>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
//           by {course.creator?.name}
//         </p>
//         {/* Progress bar */}
//         <div className="mb-3">
//           <div className="flex justify-between text-xs text-gray-400 mb-1">
//             <span>Progress</span>
//             <span>{progressPercent || 0}%</span>
//           </div>
//           <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
//             <div
//               className={`h-1.5 rounded-full transition-all duration-700 ${
//                 isCompleted ? "bg-green-500" : "bg-indigo-500"
//               }`}
//               style={{ width: `${progressPercent || 0}%` }}
//             />
//           </div>
//         </div>
//         <Link
//           to={lastAccessedLesson
//             ? `/student/learn/${course._id}/lesson/${lastAccessedLesson}`
//             : `/student/learn/${course._id}`}
//           className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
//           {isCompleted ? "Review course" : progressPercent > 0 ? "Continue" : "Start learning"}
//         </Link>
//       </div>
//     </motion.div>
//   );
// }

// export default function StudentDashboard() {
//   const { user } = useAuth();
//   const [enrollments, setEnrollments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchMyEnrollments()
//       .then(d => setEnrollments(d.enrollments || []))
//       .catch(() => {})
//       .finally(() => setIsLoading(false));
//   }, []);

//   // completed = truly done (cert issued or isCompleted for non-quiz courses)
//   const completed = enrollments.filter(e => e.isCompleted).length;
//   // certificates = only where cert was actually issued
//   const certificates = enrollments.filter(e => e.certificateIssued).length;
//   // inProgress = started but not completed and no cert yet
//   const inProgress = enrollments.filter(e =>
//     !e.isCompleted &&
//     !e.certificateIssued &&
//     (e.progressPercent || 0) > 0
//   ).length;

//   return (
//     <div className="p-6 lg:p-8 space-y-8">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Welcome back, {user?.name?.split(" ")[0]} 👋
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
//           Keep going — every lesson brings you closer to your goal.
//         </p>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         <StatCard label="Enrolled" value={enrollments.length} icon="📚" color="bg-indigo-50 dark:bg-indigo-950" />
//         <StatCard label="Completed" value={completed} icon="✅" color="bg-green-50 dark:bg-green-950" />
//         <StatCard label="In Progress" value={inProgress} icon="⏳" color="bg-yellow-50 dark:bg-yellow-950" />
//         <Link to="/student/certificate/:courseId">
//           <StatCard label="Certificates" value={certificates} icon="🏆" color="bg-purple-50 dark:bg-purple-950" />
//         </Link>
//       </div>

//       {/* Courses */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Learning</h2>
//           <Link to="/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
//             Browse more →
//           </Link>
//         </div>

//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className={`${card} overflow-hidden animate-pulse`}>
//                 <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
//                 <div className="p-4 space-y-2">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : enrollments.length === 0 ? (
//           <div className={`${card} p-12 text-center`}>
//             <div className="text-5xl mb-4">🎓</div>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
//             <Link to="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
//               Explore courses →
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {enrollments.map(e => <CourseCard key={e._id} enrollment={e} />)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Clock, Award, ImageOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { fetchMyEnrollments } from "../../api/services/course.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

function Stat({ label, value, Icon }) {
  return (
    <div className="p-4 sm:p-6 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-black/60">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] mt-1.5 tabular-nums">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function CourseCard({ enrollment }) {
  const { course, progressPercent, lastAccessedLesson, isCompleted, certificateIssued } = enrollment;
  const percent = progressPercent || 0;
  const needsFinalQuiz = percent === 100 && !isCompleted && !certificateIssued;

  const href = lastAccessedLesson
    ? `/student/learn/${course._id}/lesson/${lastAccessedLesson}`
    : `/student/learn/${course._id}`;

  const label = isCompleted ? "Review course" : percent > 0 ? "Continue" : "Start learning";
  const isPrimary = !isCompleted;

  return (
    <article className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden hover:border-[#0D1B3E]/25 transition-colors">
      {/* Fixed 16:9 frame. The image is positioned absolutely so its own size can never change the card layout. */}
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
            {isCompleted && certificateIssued && (
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

        {/* Progress */}
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

        {/* Actions: always one row, so every card has the same height */}
        <div className={`grid gap-2 ${certificateIssued ? "grid-cols-2" : "grid-cols-1"}`}>
          <Link
            to={href}
            className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition ${focusRing} ${
              isPrimary
                ? "bg-[#1A56DB] hover:bg-[#0D1B3E] text-white"
                : "border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5"
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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments()
      .then((d) => setEnrollments(d.enrollments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // completed = truly done (cert issued or isCompleted for non-quiz courses)
  const completed = enrollments.filter((e) => e.isCompleted).length;
  // certificates = only where cert was actually issued
  const certificates = enrollments.filter((e) => e.certificateIssued).length;
  // inProgress = started but not completed and no cert yet
  const inProgress = enrollments.filter(
    (e) => !e.isCompleted && !e.certificateIssued && (e.progressPercent || 0) > 0
  ).length;

  return (
    <div className="space-y-10 text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-black/60 mt-1.5 text-sm">
          Keep going. Every lesson brings you closer to your goal.
        </p>
      </div>

      {/* Stats */}
      <section
        aria-label="Overview"
        className="bg-white border border-[#0D1B3E]/12 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-[#0D1B3E]/10 divide-x divide-y lg:divide-y-0"
      >
        <Stat label="Enrolled" value={enrollments.length} Icon={BookOpen} />
        <Stat label="Completed" value={completed} Icon={CheckCircle2} />
        <Stat label="In progress" value={inProgress} Icon={Clock} />
        <Stat label="Certificates" value={certificates} Icon={Award} />
      </section>

      {/* Courses */}
      <section aria-labelledby="my-learning">
        <div className="flex items-center justify-between mb-5">
          <h2 id="my-learning" className="text-lg font-bold text-[#0D1B3E]">My learning</h2>
          <Link to="/courses" className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}>
            Browse more
          </Link>
        </div>

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
        ) : enrollments.length === 0 ? (
          <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-12 text-center">
            <p className="font-semibold text-[#0D1B3E]">No courses yet</p>
            <p className="text-sm text-black/60 mt-1">You haven't enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className={`inline-flex items-center mt-5 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition ${focusRing}`}
            >
              Explore courses
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((e) => (
              <CourseCard key={e._id} enrollment={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}