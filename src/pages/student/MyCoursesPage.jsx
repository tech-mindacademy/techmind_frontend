import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchMyEnrollments } from "../../api/services/course.service";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMyEnrollments()
      .then(d => setEnrollments(d.enrollments || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = enrollments.filter(e => {
    if (filter === "completed") return e.isCompleted;
    if (filter === "in-progress") return !e.isCompleted && (e.progressPercent || 0) > 0;
    if (filter === "not-started") return (e.progressPercent || 0) === 0;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled</p>
        </div>
        <Link to="/courses" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          + Browse more
        </Link>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "in-progress", "completed", "not-started"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all capitalize ${filter === f ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"}`}>
            {f.replace("-", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse"><div className="aspect-video bg-gray-200 dark:bg-gray-700" /><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"/><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"/></div></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {enrollments.length === 0 ? "No courses enrolled yet." : "No courses match this filter."}
          </p>
          <Link to="/courses" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            Explore courses →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(e => (
            <motion.div key={e._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                {e.course.thumbnail?.url ? (
                  <img src={e.course.thumbnail.url} alt={e.course.title} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>}
                {e.isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Completed ✓</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{e.course.title}</p>
                <p className="text-xs text-gray-500 mt-1">by {e.course.creator?.name}</p>
                <div className="mt-3 mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{e.progressPercent || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${e.progressPercent || 0}%` }} />
                  </div>
                </div>
                <Link to={`/student/learn/${e.course._id}`}
                  className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
                  {(e.progressPercent || 0) > 0 ? "Continue" : "Start"}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
