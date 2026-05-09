import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { adminFetchCourses, adminTogglePublish, adminDeleteCourse } from "../../api/services/admin.service";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = (params = {}) => {
    setIsLoading(true);
    adminFetchCourses({ search, isPublished: publishedFilter, page, limit: 20, ...params })
      .then(d => { setCourses(d.courses || []); setPagination(d.pagination); })
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [search, publishedFilter, page]);

  const handleToggle = async (courseId, isPublished) => {
    try {
      await adminTogglePublish(courseId);
      toast.success(isPublished ? "Course unpublished" : "Course published");
      load();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (courseId, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminDeleteCourse(courseId);
      toast.success("Course deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Course Management</h1>
        <p className="text-slate-400 text-sm mt-1">{pagination?.total || 0} total courses</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" />
        </div>
        <select value={publishedFilter} onChange={e => { setPublishedFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition">
          <option value="">All status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
        ) : courses.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No courses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {["Course", "Creator", "Category", "Price", "Students", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {courses.map(course => (
                  <tr key={course._id} className="hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="font-medium text-white text-xs truncate">{course.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      <p>{course.creator?.name}</p>
                      <p className="text-slate-600">{course.creator?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{course.category}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs whitespace-nowrap">
                      {course.isFree || course.price === 0 ? <span className="text-green-400">Free</span> : `₹${course.price?.toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{course.stats?.totalStudents || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${course.isPublished ? "bg-green-900/40 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggle(course._id, course.isPublished)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${course.isPublished ? "bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400" : "bg-green-900/30 hover:bg-green-900/60 text-green-400"}`}>
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => handleDelete(course._id, course.title)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/50 text-red-400 transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500">Page {page} of {pagination.pages} · {pagination.total} courses</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">Previous</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
