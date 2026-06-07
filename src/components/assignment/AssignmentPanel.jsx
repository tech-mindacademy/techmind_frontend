import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  getAssignment,
  submitAssignment,
} from "../../api/services/assignment.service";

const statusColors = {
  submitted: "bg-blue-900/40 text-blue-400",
  graded: "bg-green-900/40 text-green-400",
  resubmit_requested: "bg-amber-900/40 text-amber-400",
};

const statusLabels = {
  submitted: "Submitted — awaiting grade",
  graded: "Graded",
  resubmit_requested: "Resubmission requested",
};

export default function AssignmentPanel({
  assignmentId,
  courseId,
  onComplete,
}) {
  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!assignmentId) return;
    setIsLoading(true);
    getAssignment(assignmentId)
      .then((data) => {
        setAssignment(data.assignment);
        setMySubmission(data.assignment.mySubmission || null);
      })
      .catch(() => toast.error("Failed to load assignment"))
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (files.length === 0 && !textAnswer.trim()) {
      toast.error("Please attach a file or write an answer");
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      fd.append("textAnswer", textAnswer);

      const res = await submitAssignment(assignmentId, fd, (pct) =>
        setUploadProgress(pct),
      );
      setMySubmission(res.submission);
      setFiles([]);
      setTextAnswer("");
      toast.success(res.message || "Assignment submitted!");
      if (onComplete) onComplete(); // ← add
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!assignment)
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Assignment not found.
      </p>
    );

  const isOverdue =
    assignment.dueDate &&
    !assignment.allowLateSubmission &&
    new Date() > new Date(assignment.dueDate);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-white">{assignment.title}</h3>
        {assignment.dueDate && (
          <p
            className={`text-xs mt-1 ${isOverdue ? "text-red-400" : "text-gray-500"}`}
          >
            Due: {new Date(assignment.dueDate).toLocaleDateString()}{" "}
            {isOverdue && "— Overdue"}
          </p>
        )}
        <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
          <span>
            Max marks:{" "}
            <span className="text-gray-300">{assignment.maxMarks}</span>
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-800 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Instructions
        </p>
        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
          {assignment.description}
        </p>
      </div>

      {/* Creator attachments */}
      {assignment.attachments?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Reference Files
          </p>
          <div className="space-y-1.5">
            {assignment.attachments.map((att) => (
              <a
                key={att._id}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition"
              >
                <svg
                  className="w-4 h-4 text-indigo-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-200 truncate">
                  {att.title}
                </span>
                <span className="text-xs text-gray-500 uppercase ml-auto">
                  .{att.fileType}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* My submission status */}
      {mySubmission && (
        <div className={`rounded-xl p-3 ${statusColors[mySubmission.status]}`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">
              {statusLabels[mySubmission.status]}
            </p>
            {mySubmission.grade !== null && (
              <span className="text-sm font-bold">
                {mySubmission.grade} / {assignment.maxMarks}
              </span>
            )}
          </div>
          {mySubmission.feedback && (
            <p className="text-xs mt-2 opacity-90">{mySubmission.feedback}</p>
          )}
          {mySubmission.submittedAt && (
            <p className="text-xs mt-1 opacity-60">
              Submitted{" "}
              {new Date(mySubmission.submittedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Submission form — always shown (allow resubmission) */}
      {!isOverdue && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {mySubmission ? "Update submission" : "Your submission"}
          </p>

          {/* Text answer */}
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Write your answer here (optional)..."
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none transition"
          />

          {/* File upload */}
          <div>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              accept={
                assignment.allowedFileTypes?.map((t) => `.${t}`).join(",") ||
                "*"
              }
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl py-3 text-sm text-gray-400 hover:text-indigo-400 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Attach files"}
            </button>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-gray-400 bg-gray-800 rounded-lg px-2 py-1.5"
                  >
                    <span className="truncate">{f.name}</span>
                    <button
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, j) => j !== i))
                      }
                      className="text-gray-500 hover:text-red-400 ml-2 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                Uploading...
              </>
            ) : mySubmission ? (
              "Resubmit"
            ) : (
              "Submit Assignment"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
