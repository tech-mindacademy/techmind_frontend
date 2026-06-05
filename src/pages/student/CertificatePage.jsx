import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const fmtDuration = (s) => {
  const h = Math.floor(s / 3600);
  return h > 0 ? `${h}h` : `${Math.floor(s / 60)}m`;
};

export default function MyCertificatesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [downloading, setDownloading] = useState(null); // courseId currently being fetched

  useEffect(() => {
    api
      .get("/enrollments/my-certificates")
      .then((r) => setEnrollments(r.data.enrollments || []))
      .catch(() => toast.error("Failed to load certificates"))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchCertificateBlob = async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}/certificate`, {
      responseType: "blob",
    });
    return new Blob([response.data], { type: "application/pdf" });
  };

  const handleView = async (enrollment) => {
    const courseId = enrollment.course?._id;
    if (!courseId || downloading) return;
    setDownloading(courseId);
    try {
      const blob = await fetchCertificateBlob(courseId);
      const url  = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      toast.error("Could not open certificate. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownload = async (enrollment) => {
    const courseId = enrollment.course?._id;
    if (!courseId || downloading) return;
    setDownloading(courseId);
    try {
      const blob     = await fetchCertificateBlob(courseId);
      const url      = URL.createObjectURL(blob);
      const link     = document.createElement("a");
      const safeName = (enrollment.course?.title || "certificate").replace(/\s+/g, "_");
      link.href      = url;
      link.download  = `${safeName}_certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Certificate downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (enrollments.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="text-7xl mb-5">🎓</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No certificates yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
          Complete a course and get approved by the instructor to earn your certificate.
        </p>
        <Link
          to="/courses"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          Browse courses →
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {enrollments.length} certificate{enrollments.length !== 1 ? "s" : ""} earned
        </p>
      </motion.div>

      <div className="space-y-3">
        {enrollments.map((enrollment, i) => {
          const course  = enrollment.course;
          const isBusy  = downloading === course?._id;

          return (
            <motion.div
              key={enrollment._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex gap-4 items-start"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                  {course?.title}
                </p>

                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {course?.creator?.name && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {course.creator.name}
                    </span>
                  )}
                  {course?.stats?.totalDuration > 0 && (
                    <span className="text-xs text-gray-400">
                      ⏱ {fmtDuration(course.stats.totalDuration)}
                    </span>
                  )}
                  {course?.stats?.totalLessons > 0 && (
                    <span className="text-xs text-gray-400">
                      📹 {course.stats.totalLessons} lessons
                    </span>
                  )}
                </div>

                <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  Issued on {fmtDate(enrollment.certificateIssuedAt)}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {/* View */}
                  <button
                    onClick={() => handleView(enrollment)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 px-3.5 py-1.5 rounded-lg transition"
                  >
                    {isBusy ? (
                      <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                    View certificate
                  </button>

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(enrollment)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg transition"
                  >
                    {isBusy ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    )}
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}