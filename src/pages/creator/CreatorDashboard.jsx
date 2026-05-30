import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { fetchMyCoursesCreator } from "../../api/services/course.service";
import { fetchMyEarnings } from "../../api/services/payment.service";

const fmt = (n) => (n || 0).toLocaleString("en-IN");

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyCoursesCreator().catch(() => ({ courses: [] })),
      fetchMyEarnings().catch(() => null),
    ]).then(([cRes, eRes]) => {
      setCourses(cRes.courses || []);
      setEarnings(eRes?.earnings || null);
    }).finally(() => setIsLoading(false));
  }, []);

  const published = courses.filter(c => c.isPublished).length;
  const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Creator Studio</h1>
        <p className="text-gray-400 mt-1 text-sm">Hello {user?.name?.split(" ")[0]} — manage your courses and earnings.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={courses.length} icon="📚" color="bg-teal-900/40" />
        <StatCard label="Published" value={published} icon="🌐" color="bg-indigo-900/40" />
        <StatCard label="Total Students" value={fmt(totalStudents)} icon="👥" color="bg-purple-900/40" />
        <StatCard label="Earnings" value={`₹${fmt(earnings?.thisMonth)}`} icon="💰" color="bg-green-900/40" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/creator/courses/new" className="bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800 rounded-2xl p-5 transition group">
          <div className="text-3xl mb-3">➕</div>
          <p className="font-semibold text-white group-hover:text-teal-300 transition">Create New Course</p>
          <p className="text-xs text-gray-500 mt-1">Start building your content</p>
        </Link>
        <Link to="/creator/submissions" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-5 transition group">
          <div className="text-3xl mb-3">📋</div>
          <p className="font-semibold text-white group-hover:text-teal-300 transition">Grade Submissions</p>
          <p className="text-xs text-gray-500 mt-1">Review student assignments</p>
        </Link>
        <Link to="/creator/analytics" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-5 transition group">
          <div className="text-3xl mb-3">📊</div>
          <p className="font-semibold text-white group-hover:text-teal-300 transition">View Analytics</p>
          <p className="text-xs text-gray-500 mt-1">Track course performance</p>
        </Link>
      </div>

      {/* My courses list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">My Courses</h2>
          <Link to="/creator/courses" className="text-sm text-teal-400 hover:underline">View all →</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-gray-800 rounded-2xl aspect-video animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-gray-400 mb-4">No courses yet.</p>
            <Link to="/creator/courses/new" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              Create your first course →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map(course => (
              <div key={course._id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition">
                <div className="aspect-video bg-gray-700 relative">
                  {course.thumbnail?.url ? (
                    <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>}
                  <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-lg ${course.isPublished ? "bg-green-900/80 text-green-300" : "bg-gray-900/80 text-gray-300"}`}>
                    {course.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-white truncate">{course.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{course.stats?.totalStudents || 0} students</span>
                    <Link to={`/creator/courses/${course._id}/edit`}
                      className="text-xs text-teal-400 hover:underline">Edit →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
