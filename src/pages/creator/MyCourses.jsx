// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { fetchMyCoursesCreator, togglePublish, deleteCourse } from "../../api/services/course.service";

// export default function MyCourses() {
//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const load = () => {
//     setIsLoading(true);
//     fetchMyCoursesCreator().then(d => setCourses(d.courses || [])).catch(() => {}).finally(() => setIsLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const handleToggle = async (courseId) => {
//     try { const r = await togglePublish(courseId); toast.success(r.message); load(); }
//     catch (err) { toast.error(err.response?.data?.message || "Failed"); }
//   };

//   const handleDelete = async (courseId, title) => {
//     if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
//     try { await deleteCourse(courseId); toast.success("Deleted"); load(); }
//     catch { toast.error("Delete failed"); }
//   };

//   return (
//     <div className="space-y-6">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-white">My Courses</h1>
//           <p className="text-gray-400 text-sm mt-1">{courses.length} course{courses.length !== 1 ? "s" : ""}</p>
//         </div>
//         <Link to="/creator/courses/new" className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
//           + New Course
//         </Link>
//       </motion.div>

//       {isLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[1,2,3].map(i => <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden animate-pulse"><div className="aspect-video bg-gray-700"/><div className="p-4 space-y-2"><div className="h-4 bg-gray-700 rounded w-3/4"/></div></div>)}
//         </div>
//       ) : courses.length === 0 ? (
//         <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
//           <div className="text-4xl mb-3">🗂️</div>
//           <p className="text-gray-400 mb-4">No courses yet.</p>
//           <Link to="/creator/courses/new" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">Create your first →</Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {courses.map(course => (
//             <motion.div key={course._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//               className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition">
//               <div className="aspect-video bg-gray-700 relative overflow-hidden">
//                 {course.thumbnail?.url ? <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>}
//                 <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-lg ${course.isPublished ? "bg-green-900/80 text-green-300" : "bg-gray-900/80 text-gray-400"}`}>
//                   {course.isPublished ? "Live" : "Draft"}
//                 </span>
//               </div>
//               <div className="p-4">
//                 <p className="font-semibold text-white text-sm mb-1 line-clamp-2">{course.title}</p>
//                 <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
//                   <span>👥 {course.stats?.totalStudents || 0}</span>
//                   {course.price > 0 && <span>₹{course.price.toLocaleString()}</span>}
//                   {course.isFree && <span className="text-green-400">Free</span>}
//                 </div>
//                 <div className="flex gap-2">
//                   <Link to={`/creator/courses/${course._id}/edit`} className="flex-1 text-center py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold rounded-xl transition">Edit</Link>
//                   <button onClick={() => handleToggle(course._id)} className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${course.isPublished ? "bg-yellow-900/40 hover:bg-yellow-900/70 text-yellow-400" : "bg-teal-900/40 hover:bg-teal-900/70 text-teal-400"}`}>
//                     {course.isPublished ? "Unpublish" : "Submit for Review"}
//                   </button>
//                   <button onClick={() => handleDelete(course._id, course.title)} className="p-2 bg-red-900/20 hover:bg-red-900/50 text-red-400 rounded-xl transition">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
//                   </button>
//                 </div>
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
import toast from "react-hot-toast";
import { Plus, Users, Trash2, ImageOff } from "lucide-react";
import { fetchMyCoursesCreator, togglePublish, deleteCourse } from "../../api/services/course.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const FILTERS = [
  ["all", "All"],
  ["live", "Live"],
  ["draft", "Draft"],
];

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setIsLoading(true);
    fetchMyCoursesCreator()
      .then((d) => setCourses(d.courses || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (courseId) => {
    try {
      const r = await togglePublish(courseId);
      toast.success(r.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (courseId, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(courseId);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const visible = courses.filter((c) =>
    filter === "all" ? true : filter === "live" ? c.isPublished : !c.isPublished
  );

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">My courses</h1>
          <p className="text-black/60 text-sm mt-1.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/creator/courses/new"
          className={`inline-flex items-center gap-2 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition ${focusRing}`}
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          New course
        </Link>
      </div>

      {/* Filter */}
      {courses.length > 0 && (
        <div className="flex gap-2" role="group" aria-label="Filter courses by status">
          {FILTERS.map(([key, label]) => (
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
              {label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[#0D1B3E]/10 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#0D1B3E]/5" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#0D1B3E]/5 rounded w-3/4" />
                <div className="h-3 bg-[#0D1B3E]/5 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-12 text-center">
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
      ) : visible.length === 0 ? (
        <p className="text-sm text-black/60 py-8">
          No {filter === "live" ? "live" : "draft"} courses.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((course) => (
            <article
              key={course._id}
              className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-[#0D1B3E]/5 flex items-center justify-center overflow-hidden">
                {course.thumbnail?.url ? (
                  <img src={course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="w-8 h-8 text-[#0D1B3E]/25" strokeWidth={1.5} />
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-[#0D1B3E] leading-snug line-clamp-2">{course.title}</h2>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-md ${
                      course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-[#0D1B3E]/8 text-[#0D1B3E]/70"
                    }`}
                  >
                    {course.isPublished ? "Live" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-black/60 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4" strokeWidth={1.75} />
                    {course.stats?.totalStudents || 0}
                  </span>
                  {course.isFree ? (
                    <span className="font-medium text-emerald-700">Free</span>
                  ) : course.price > 0 ? (
                    <span className="font-medium text-[#0D1B3E]">₹{course.price.toLocaleString("en-IN")}</span>
                  ) : null}
                </div>

                <div className="flex gap-2 mt-5 pt-4 border-t border-[#0D1B3E]/10">
                  <Link
                    to={`/creator/courses/${course._id}/edit`}
                    className={`flex-1 text-center py-2 border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 text-sm font-semibold rounded-lg transition ${focusRing}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggle(course._id)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${focusRing} ${
                      course.isPublished
                        ? "border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5"
                        : "bg-[#1A56DB] hover:bg-[#0D1B3E] text-white"
                    }`}
                  >
                    {course.isPublished ? "Unpublish" : "Submit for review"}
                  </button>
                  <button
                    onClick={() => handleDelete(course._id, course.title)}
                    aria-label={`Delete ${course.title}`}
                    className={`p-2.5 text-black/45 hover:text-red-600 hover:bg-red-50 rounded-lg transition ${focusRing}`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}