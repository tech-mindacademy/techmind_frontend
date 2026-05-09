import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAssignmentByLesson,
  createAssignment,
  updateAssignment,
  deleteAssignmentAttachment,
} from "../../api/services/assignment.service";

export default function AssignmentBuilder() {
  const { courseId, lessonId } = useParams();
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMarks: 100,
    dueDate: "",
    allowLateSubmission: true,
    allowedFileTypes: "pdf,doc,docx,zip,png,jpg",
  });
  const [attachments, setAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    getAssignmentByLesson(lessonId)
      .then((d) => {
        const a = d.assignment;
        setExisting(a);
        setForm({
          title: a.title,
          description: a.description,
          maxMarks: a.maxMarks,
          dueDate: a.dueDate
            ? new Date(a.dueDate).toISOString().split("T")[0]
            : "",
          allowLateSubmission: a.allowLateSubmission,
          allowedFileTypes: a.allowedFileTypes?.join(",") || "pdf,doc,docx",
        });
        setAttachments(a.attachments || []);
      })
      .catch(() => {});
  }, [lessonId]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("courseId", courseId);
      fd.append("lessonId", lessonId);
      Object.entries(form).forEach(([k, v]) => {
        if (k === "allowedFileTypes") return; // ❌ skip wrong format
        fd.append(k, v);
      });
      fd.append(
        "allowedFileTypes",
        JSON.stringify(form.allowedFileTypes.split(",").map((s) => s.trim())),
      );
      newFiles.forEach((f) => fd.append("attachments", f));

      if (existing) {
        await updateAssignment(existing._id, fd);
        toast.success("Assignment updated ✓");
      } else {
        await createAssignment(fd);
        toast.success("Assignment created ✓");
      }

      setNewFiles([]);
      getAssignmentByLesson(lessonId)
        .then((d) => {
          setExisting(d.assignment);
          setAttachments(d.assignment.attachments || []);
        })
        .catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAttachment = async (attId) => {
    if (!confirm("Delete this attachment?")) return;
    try {
      await deleteAssignmentAttachment(existing._id, attId);
      setAttachments((prev) => prev.filter((a) => a._id !== attId));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const f = (k) => (e) =>
    setForm((p) => ({
      ...p,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to={`/creator/courses/${courseId}/lessons/${lessonId}`}
          className="text-gray-400 hover:text-white transition"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-white flex-1">
          {existing ? "Edit Assignment" : "Create Assignment"}
        </h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Assignment Details</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Title *
          </label>
          <input
            value={form.title}
            onChange={f("title")}
            placeholder="e.g. Build a REST API"
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Instructions *
          </label>
          <textarea
            value={form.description}
            onChange={f("description")}
            rows={6}
            placeholder="Describe what students need to do, what to submit, grading criteria..."
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Max Marks
            </label>
            <input
              type="number"
              value={form.maxMarks}
              onChange={f("maxMarks")}
              min={1}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={f("dueDate")}
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Allowed file types (comma separated)
          </label>
          <input
            value={form.allowedFileTypes}
            onChange={f("allowedFileTypes")}
            placeholder="pdf,doc,docx,zip"
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.allowLateSubmission}
            onChange={f("allowLateSubmission")}
            className="w-4 h-4 accent-teal-500"
          />
          <span className="text-sm text-gray-300">Allow late submission</span>
        </label>
      </div>

      {/* Attachments */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">
          Reference Files for Students
        </h2>
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((att) => (
              <div
                key={att._id}
                className="flex items-center gap-3 bg-gray-700 rounded-xl px-3 py-2.5"
              >
                <svg
                  className="w-4 h-4 text-amber-400 flex-shrink-0"
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
                <span className="flex-1 text-sm text-gray-200 truncate">
                  {att.title}
                </span>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-teal-400 hover:underline"
                >
                  Preview
                </a>
                <button
                  onClick={() => handleDeleteAttachment(att._id)}
                  className="text-gray-600 hover:text-red-400 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {newFiles.length > 0 && (
          <div className="space-y-1">
            {newFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-teal-400 bg-teal-900/20 rounded-lg px-3 py-2"
              >
                <span className="truncate flex-1">{f.name}</span>
                <button
                  onClick={() =>
                    setNewFiles((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="text-gray-500 hover:text-red-400 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) =>
            setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
          }
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-amber-500 text-gray-500 hover:text-amber-400 rounded-xl py-4 text-sm transition"
        >
          <svg
            className="w-4 h-4"
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
          Attach reference files
        </button>
      </div>
    </div>
  );
}
