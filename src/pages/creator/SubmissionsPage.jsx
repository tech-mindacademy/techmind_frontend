import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchMyCoursesCreator, fetchCourseForEdit } from "../../api/services/course.service";
import { getAllSubmissions, gradeSubmission, requestResubmit } from "../../api/services/assignment.service";

const statusBadge = {
  submitted: "bg-blue-900/40 text-blue-400",
  graded: "bg-green-900/40 text-green-400",
  resubmit_requested: "bg-amber-900/40 text-amber-400",
};

function GradeModal({ submission, assignment, onClose, onGraded }) {
  const [grade, setGrade] = useState(submission.grade !== null ? submission.grade : "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleGrade = async () => {
    if (grade === "" || isNaN(grade)) { toast.error("Enter a valid grade"); return; }
    setIsSaving(true);
    try {
      await gradeSubmission(assignment._id, submission._id, { grade: Number(grade), feedback });
      toast.success("Graded ✓");
      onGraded();
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || "Grading failed"); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Grade Submission</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div className="bg-gray-700 rounded-xl p-3 text-sm text-gray-300">
          <p className="font-medium text-white">{submission.student?.name}</p>
          <p className="text-xs text-gray-500">{submission.student?.email}</p>
          {submission.textAnswer && <p className="mt-2 text-gray-300">{submission.textAnswer}</p>}
          {submission.files?.length > 0 && (
            <div className="mt-2 space-y-1">
              {submission.files.map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-teal-400 hover:underline">
                  📎 {f.originalName}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Grade (out of {assignment.maxMarks})</label>
          <input type="number" value={grade} onChange={e => setGrade(e.target.value)} min={0} max={assignment.maxMarks}
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Feedback</label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} placeholder="Optional feedback for the student..."
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 resize-none focus:outline-none focus:border-teal-500 transition" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleGrade} disabled={isSaving}
            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition">
            {isSaving ? "Saving..." : "Submit Grade"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-xl transition">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SubmissionsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMyCoursesCreator().then(d => setCourses(d.courses || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourseId) { setAssignments([]); return; }
    fetchCourseForEdit(selectedCourseId).then(d => {
      const allAssignments = [];
      d.course.sections?.forEach(sec => {
        sec.lessons?.forEach(lesson => {
          if (lesson.assignment) allAssignments.push({ _id: lesson.assignment, title: lesson.title });
        });
      });
      setAssignments(allAssignments);
    }).catch(() => {});
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedAssignmentId) { setSubmissions([]); setStats(null); return; }
    setIsLoading(true);
    getAllSubmissions(selectedAssignmentId)
      .then(d => { setSubmissions(d.submissions || []); setStats(d.stats); setSelectedAssignment(d.assignment); })
      .catch(() => toast.error("Failed to load submissions"))
      .finally(() => setIsLoading(false));
  }, [selectedAssignmentId]);

  const refreshSubmissions = () => {
    if (selectedAssignmentId) {
      getAllSubmissions(selectedAssignmentId).then(d => { setSubmissions(d.submissions || []); setStats(d.stats); }).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Submissions</h1>
        <p className="text-gray-400 text-sm mt-1">Review and grade student assignment submissions.</p>
      </motion.div>

      {/* Selectors */}
      <div className="flex gap-3 flex-wrap">
        <select value={selectedCourseId} onChange={e => { setSelectedCourseId(e.target.value); setSelectedAssignmentId(""); }}
          className="flex-1 min-w-48 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition">
          <option value="">Select a course...</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        {assignments.length > 0 && (
          <select value={selectedAssignmentId} onChange={e => setSelectedAssignmentId(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition">
            <option value="">Select an assignment...</option>
            {assignments.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
          </select>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Pending", value: stats.submitted, color: "text-blue-400" },
            { label: "Graded", value: stats.graded, color: "text-green-400" },
            { label: "Avg Grade", value: stats.avgGrade !== null ? `${stats.avgGrade}/${selectedAssignment?.maxMarks}` : "—", color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submissions list */}
      {isLoading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"/></div>
      ) : submissions.length > 0 ? (
        <div className="space-y-3">
          {submissions.map(sub => (
            <div key={sub._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
                {sub.student?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{sub.student?.name}</p>
                <p className="text-xs text-gray-500">{sub.student?.email}</p>
                <p className="text-xs text-gray-600 mt-0.5">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusBadge[sub.status]}`}>
                  {sub.status === "resubmit_requested" ? "Resubmit" : sub.status}
                </span>
                {sub.grade !== null && (
                  <span className="text-sm font-bold text-white">{sub.grade}/{selectedAssignment?.maxMarks}</span>
                )}
                {sub.files?.length > 0 && (
                  <span className="text-xs text-gray-500">{sub.files.length} file(s)</span>
                )}
                <button onClick={() => setGradingSubmission(sub)}
                  className="px-3 py-1.5 bg-teal-900/50 hover:bg-teal-800 text-teal-400 text-xs font-semibold rounded-lg transition">
                  {sub.status === "graded" ? "Re-grade" : "Grade"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : selectedAssignmentId ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📬</div>
          <p className="text-gray-400">No submissions yet for this assignment.</p>
        </div>
      ) : !selectedCourseId ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400">Select a course and assignment to view submissions.</p>
        </div>
      ) : null}

      {/* Grade modal */}
      {gradingSubmission && selectedAssignment && (
        <GradeModal submission={gradingSubmission} assignment={selectedAssignment}
          onClose={() => setGradingSubmission(null)} onGraded={refreshSubmissions} />
      )}
    </div>
  );
}
