import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { fetchMyEnrollments } from "../../api/services/course.service";
import Navbar from "../../components/Navbar";

const card = "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700";

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${card} p-4 flex flex-col items-center text-center gap-2 sm:flex-row sm:text-left sm:gap-4 sm:p-5`}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
      </div>
    </motion.div>
  );
}

function CourseCard({ enrollment }) {
  const { course, progressPercent, lastAccessedLesson } = enrollment;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`${card} overflow-hidden hover:shadow-md transition-shadow`}>
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {course.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
        )}
        {progressPercent === 100 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Completed ✓
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          by {course.creator?.name}
        </p>
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progressPercent || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent || 0}%` }} />
          </div>
        </div>
        <Link
          to={lastAccessedLesson
            ? `/student/learn/${course._id}/lesson/${lastAccessedLesson}`
            : `/student/learn/${course._id}`}
          className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
          {progressPercent > 0 ? "Continue" : "Start learning"}
        </Link>
      </div>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyEnrollments()
      .then(d => setEnrollments(d.enrollments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const completed = enrollments.filter(e => e.isCompleted).length;
  const inProgress = enrollments.filter(e => !e.isCompleted && (e.progressPercent || 0) > 0).length;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* <Navbar/> */}
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Keep going — every lesson brings you closer to your goal.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Enrolled" value={enrollments.length} icon="📚" color="bg-indigo-50 dark:bg-indigo-950" />
        <StatCard label="Completed" value={completed} icon="✅" color="bg-green-50 dark:bg-green-950" />
        <StatCard label="In Progress" value={inProgress} icon="⏳" color="bg-yellow-50 dark:bg-yellow-950" />
        <Link to="/student/certificate/:courseId">
          <StatCard label="Certificates" value={completed} icon="🏆" color="bg-purple-50 dark:bg-purple-950" />
        </Link>
      </div>

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Learning</h2>
          <Link to="/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Browse more →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`${card} overflow-hidden animate-pulse`}>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className={`${card} p-12 text-center`}>
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
              Explore courses →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map(e => <CourseCard key={e._id} enrollment={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
