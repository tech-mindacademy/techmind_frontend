import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchMyCoursesCreator } from "../../api/services/course.service";
// import { fetchCourseStudents } from "../../api/services/course.service";
import { fetchCourseStudents, issueCertificate } from "../../api/services/wallet.service";

export default function CertificateManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [issuingId, setIssuingId] = useState(null);

  useEffect(() => {
    fetchMyCoursesCreator()
      .then(d => setCourses(d.courses || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourse) { setStudents([]); return; }
    setIsLoading(true);
    fetchCourseStudents(selectedCourse)
      .then(d => setStudents(d.enrollments || []))
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setIsLoading(false));
  }, [selectedCourse]);

  const handleIssue = async (studentId, studentName) => {
    if (!confirm(`Issue certificate to ${studentName}?`)) return;
    setIssuingId(studentId);
    try {
      await issueCertificate(selectedCourse, studentId);
      toast.success(`Certificate issued to ${studentName} ✓`);
      // Update local state
      setStudents(prev => prev.map(e =>
        e.student._id === studentId
          ? { ...e, certificateIssued: true, certificateIssuedAt: new Date().toISOString(), isCompleted: true }
          : e
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to issue certificate");
    } finally { setIssuingId(null); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Certificate Manager</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manually issue certificates to students. Auto-issued at 100% completion.
        </p>
      </motion.div>

      {/* Course selector */}
      <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
        className="w-full sm:w-auto px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition min-w-64">
        <option value="">Select a course...</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>

      {/* Students list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !selectedCourse ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <p className="text-gray-400">Select a course to manage certificates.</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-400">No students enrolled in this course yet.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <span>👥 {students.length} students</span>
            <span>✅ {students.filter(s => s.certificateIssued).length} certificates issued</span>
            <span>🏁 {students.filter(s => s.isCompleted).length} completed</span>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    {["Student", "Progress", "Completed", "Certificate", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/40">
                  {students.map(enrollment => (
                    <tr key={enrollment._id} className="hover:bg-gray-700/30 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                            {enrollment.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{enrollment.student?.name}</p>
                            <p className="text-xs text-gray-500">{enrollment.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-1.5">
                            <div className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${enrollment.progressPercent || 0}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{enrollment.progressPercent || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {enrollment.isCompleted ? (
                          <span className="text-xs text-green-400">
                            {enrollment.completedAt
                              ? new Date(enrollment.completedAt).toLocaleDateString("en-IN")
                              : "Yes"}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">In progress</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {enrollment.certificateIssued ? (
                          <div>
                            <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2.5 py-1 rounded-lg">
                              Issued ✓
                            </span>
                            {enrollment.certificateIssuedAt && (
                              <p className="text-xs text-gray-600 mt-1">
                                {new Date(enrollment.certificateIssuedAt).toLocaleDateString("en-IN")}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Not issued</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {enrollment.certificateIssued ? (
                          <Link
                            to={`/student/certificate/${selectedCourse}`}
                            target="_blank"
                            className="text-xs text-indigo-400 hover:underline"
                          >
                            View →
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleIssue(enrollment.student._id, enrollment.student.name)}
                            disabled={issuingId === enrollment.student._id}
                            className="text-xs font-semibold px-3 py-1.5 bg-teal-900/40 hover:bg-teal-900/70 border border-teal-800 text-teal-400 rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {issuingId === enrollment.student._id
                              ? <div className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                              : "Issue Certificate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
