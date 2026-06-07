import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchPendingCourses, approveCourse, rejectCourse } from "../../api/services/admin.service";

const STATUS_TABS = ["pending", "approved", "rejected"];

const statusStyle = {
  approved: "bg-green-900/40 text-green-400 border border-green-800",
  rejected:  "bg-red-900/40 text-red-400 border border-red-800",
  pending:   "bg-yellow-900/40 text-yellow-400 border border-yellow-800",
};

const levelColor = {
  beginner:     "bg-green-900/30 text-green-400",
  intermediate: "bg-yellow-900/30 text-yellow-400",
  advanced:     "bg-red-900/30 text-red-400",
  all:          "bg-blue-900/30 text-blue-400",
};

function RejectModal({ course, onClose, onRejected }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectCourse(course._id, note);
      toast.success(`"${course.title}" rejected`);
      onRejected(course._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-base font-bold text-white mb-1">Reject Course</h3>
        <p className="text-sm text-slate-400 mb-4 truncate">"{course.title}"</p>

        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Reason for rejection (shown to creator)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. Content needs improvement, video quality too low..."
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none transition mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : "Reject Course"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CourseApprovals() {
  const [statusFilter, setStatusFilter]       = useState("pending");
  const [courses, setCourses]                 = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [actionId, setActionId]               = useState(null);
  const [rejectingCourse, setRejectingCourse] = useState(null);
  const [pagination, setPagination]           = useState(null);
  const [page, setPage]                       = useState(1);

  const load = useCallback(async (status, pg = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchPendingCourses({ status, page: pg, limit: 12 });
      setCourses(data.courses || []);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(statusFilter, 1);
  }, [statusFilter, load]);

  const handleApprove = async (courseId, title) => {
    setActionId(courseId);
    try {
      await approveCourse(courseId);
      toast.success(`"${title}" is now live ✓`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setActionId(null);
    }
  };

  const handleRejected = (courseId) => {
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Course Approvals</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review courses submitted by creators before they go live.
        </p>
      </motion.div>

      {/* Info banner */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p className="text-sm text-slate-400">
          When a creator publishes a course it appears here as <strong className="text-yellow-400">pending</strong>.
          Approved courses go live in the catalogue. Rejected courses are unpublished and the creator sees your note.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition capitalize ${
              statusFilter === s
                ? "bg-orange-600 text-white"
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
            }`}
          >
            {s}
            {s === "pending" && pagination?.total > 0 && statusFilter === "pending" && (
              <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pagination.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
                <div className="h-8 bg-slate-700 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-14 text-center"
        >
          <div className="text-5xl mb-4">
            {statusFilter === "pending" ? "📬" : statusFilter === "approved" ? "✅" : "❌"}
          </div>
          <p className="text-slate-300 font-semibold mb-2">No {statusFilter} courses</p>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {statusFilter === "pending"
              ? "When creators publish courses, they'll appear here for your review."
              : `No ${statusFilter} courses to show.`}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                  className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Thumbnail — clicking goes to course detail */}
                  <Link
                    to={`/courses/${course._id}`}
                    rel="noreferrer"
                    className="aspect-video bg-slate-700 relative overflow-hidden flex-shrink-0 block group"
                  >
                    {course.thumbnail?.url ? (
                      <img
                        src={course.thumbnail.url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Preview Course
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg capitalize ${levelColor[course.level] || levelColor.all}`}>
                        {course.level}
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Title links to course detail */}
                    <Link
                      to={`/courses/${course._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white text-sm leading-snug mb-1 line-clamp-2 hover:text-indigo-400 transition-colors"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs text-slate-500 mb-1">{course.category}</p>

                    {/* Creator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {course.creator?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400 truncate">{course.creator?.name}</span>
                      <span className="text-xs text-slate-600 ml-auto">
                        {course.isFree || course.price === 0
                          ? <span className="text-green-400">Free</span>
                          : `₹${course.price?.toLocaleString("en-IN")}`}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>👥 {course.stats?.totalStudents || 0} students</span>
                      <span>📹 {course.stats?.totalLessons || 0} lessons</span>
                    </div>

                    {/* Rejection note */}
                    {course.approvalNote && (
                      <div className="bg-red-900/20 border border-red-900/40 rounded-xl px-3 py-2 mb-3">
                        <p className="text-xs text-red-400">
                          <span className="font-semibold">Note: </span>{course.approvalNote}
                        </p>
                      </div>
                    )}

                    {/* Status badge for non-pending */}
                    {statusFilter !== "pending" && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize mb-3 self-start ${statusStyle[course.approvalStatus] || statusStyle.pending}`}>
                        {course.approvalStatus}
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-auto">
                      {/* Preview button — always visible */}
                      <Link
                        to={`/courses/${course._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Preview Course
                      </Link>

                      {/* Approve / Reject — only for pending */}
                      {statusFilter === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(course._id, course.title)}
                            disabled={actionId === course._id}
                            className="flex-1 py-2.5 bg-green-900/40 hover:bg-green-900/70 disabled:opacity-50 border border-green-800 text-green-400 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            {actionId === course._id ? (
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                                </svg>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setRejectingCourse(course)}
                            disabled={actionId === course._id}
                            className="flex-1 py-2.5 bg-red-900/20 hover:bg-red-900/50 disabled:opacity-50 border border-red-900 text-red-400 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {page} of {pagination.pages} · {pagination.total} courses
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPage(p => p - 1); load(statusFilter, page - 1); }}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => { setPage(p => p + 1); load(statusFilter, page + 1); }}
                  disabled={page === pagination.pages}
                  className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectingCourse && (
        <RejectModal
          course={rejectingCourse}
          onClose={() => setRejectingCourse(null)}
          onRejected={handleRejected}
        />
      )}
    </div>
  );
}