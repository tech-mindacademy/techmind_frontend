// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import {
//   getAssignmentByLesson,
//   createAssignment,
//   updateAssignment,
//   deleteAssignmentAttachment,
// } from "../../api/services/assignment.service";

// export default function AssignmentBuilder() {
//   const { courseId, lessonId } = useParams();
//   const [existing, setExisting] = useState(null);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     maxMarks: 100,
//     dueDate: "",
//     allowLateSubmission: true,
//     allowedFileTypes: "pdf,doc,docx,zip,png,jpg",
//   });
//   const [attachments, setAttachments] = useState([]);
//   const [newFiles, setNewFiles] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const fileRef = useRef(null);

//   useEffect(() => {
//     getAssignmentByLesson(lessonId)
//       .then((d) => {
//         const a = d.assignment;
//         setExisting(a);
//         setForm({
//           title: a.title,
//           description: a.description,
//           maxMarks: a.maxMarks,
//           dueDate: a.dueDate
//             ? new Date(a.dueDate).toISOString().split("T")[0]
//             : "",
//           allowLateSubmission: a.allowLateSubmission,
//           allowedFileTypes: a.allowedFileTypes?.join(",") || "pdf,doc,docx",
//         });
//         setAttachments(a.attachments || []);
//       })
//       .catch(() => {});
//   }, [lessonId]);

//   const handleSave = async () => {
//     if (!form.title.trim()) {
//       toast.error("Title is required");
//       return;
//     }
//     if (!form.description.trim()) {
//       toast.error("Description is required");
//       return;
//     }
//     setIsSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("courseId", courseId);
//       fd.append("lessonId", lessonId);
//       Object.entries(form).forEach(([k, v]) => {
//         if (k === "allowedFileTypes") return; // ❌ skip wrong format
//         fd.append(k, v);
//       });
//       fd.append(
//         "allowedFileTypes",
//         JSON.stringify(form.allowedFileTypes.split(",").map((s) => s.trim())),
//       );
//       newFiles.forEach((f) => fd.append("attachments", f));

//       if (existing) {
//         await updateAssignment(existing._id, fd);
//         toast.success("Assignment updated ✓");
//       } else {
//         await createAssignment(fd);
//         toast.success("Assignment created ✓");
//       }

//       setNewFiles([]);
//       getAssignmentByLesson(lessonId)
//         .then((d) => {
//           setExisting(d.assignment);
//           setAttachments(d.assignment.attachments || []);
//         })
//         .catch(() => {});
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteAttachment = async (attId) => {
//     if (!confirm("Delete this attachment?")) return;
//     try {
//       await deleteAssignmentAttachment(existing._id, attId);
//       setAttachments((prev) => prev.filter((a) => a._id !== attId));
//       toast.success("Deleted");
//     } catch {
//       toast.error("Failed");
//     }
//   };

//   const f = (k) => (e) =>
//     setForm((p) => ({
//       ...p,
//       [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
//     }));

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <div className="flex items-center gap-3 flex-wrap">
//         <Link
//           to={`/creator/courses/${courseId}/lessons/${lessonId}`}
//           className="text-gray-400 hover:text-white transition"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </Link>
//         <h1 className="text-xl font-bold text-white flex-1">
//           {existing ? "Edit Assignment" : "Create Assignment"}
//         </h1>
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2"
//         >
//           {isSaving ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               Saving...
//             </>
//           ) : (
//             "Save"
//           )}
//         </button>
//       </div>

//       <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-white">Assignment Details</h2>
//         <div>
//           <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
//             Title *
//           </label>
//           <input
//             value={form.title}
//             onChange={f("title")}
//             placeholder="e.g. Build a REST API"
//             className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
//             Instructions *
//           </label>
//           <textarea
//             value={form.description}
//             onChange={f("description")}
//             rows={6}
//             placeholder="Describe what students need to do, what to submit, grading criteria..."
//             className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-teal-500 transition"
//           />
//         </div>
//       </div>

//       <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-white">Settings</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
//               Max Marks
//             </label>
//             <input
//               type="number"
//               value={form.maxMarks}
//               onChange={f("maxMarks")}
//               min={1}
//               className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
//               Due Date
//             </label>
//             <input
//               type="date"
//               value={form.dueDate}
//               onChange={f("dueDate")}
//               className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
//             Allowed file types (comma separated)
//           </label>
//           <input
//             value={form.allowedFileTypes}
//             onChange={f("allowedFileTypes")}
//             placeholder="pdf,doc,docx,zip"
//             className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
//           />
//         </div>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={form.allowLateSubmission}
//             onChange={f("allowLateSubmission")}
//             className="w-4 h-4 accent-teal-500"
//           />
//           <span className="text-sm text-gray-300">Allow late submission</span>
//         </label>
//       </div>

//       {/* Attachments */}
//       <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-white">
//           Reference Files for Students
//         </h2>
//         {attachments.length > 0 && (
//           <div className="space-y-2">
//             {attachments.map((att) => (
//               <div
//                 key={att._id}
//                 className="flex items-center gap-3 bg-gray-700 rounded-xl px-3 py-2.5"
//               >
//                 <svg
//                   className="w-4 h-4 text-amber-400 flex-shrink-0"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                   />
//                 </svg>
//                 <span className="flex-1 text-sm text-gray-200 truncate">
//                   {att.title}
//                 </span>
//                 <a
//                   href={att.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-xs text-teal-400 hover:underline"
//                 >
//                   Preview
//                 </a>
//                 <button
//                   onClick={() => handleDeleteAttachment(att._id)}
//                   className="text-gray-600 hover:text-red-400 transition"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {newFiles.length > 0 && (
//           <div className="space-y-1">
//             {newFiles.map((f, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-2 text-xs text-teal-400 bg-teal-900/20 rounded-lg px-3 py-2"
//               >
//                 <span className="truncate flex-1">{f.name}</span>
//                 <button
//                   onClick={() =>
//                     setNewFiles((prev) => prev.filter((_, j) => j !== i))
//                   }
//                   className="text-gray-500 hover:text-red-400 flex-shrink-0"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         <input
//           ref={fileRef}
//           type="file"
//           multiple
//           className="hidden"
//           onChange={(e) =>
//             setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
//           }
//         />
//         <button
//           onClick={() => fileRef.current?.click()}
//           className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-amber-500 text-gray-500 hover:text-amber-400 rounded-xl py-4 text-sm transition"
//         >
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//             />
//           </svg>
//           Attach reference files
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef, useId } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeft, Paperclip, Trash2, X, Loader2 } from "lucide-react";
import {
  getAssignmentByLesson,
  createAssignment,
  updateAssignment,
  deleteAssignmentAttachment,
} from "../../api/services/assignment.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const inputCls =
  "w-full px-3.5 py-3 border border-[#0D1B3E]/15 rounded-lg bg-white text-black text-sm placeholder-black/35 " +
  "hover:border-[#0D1B3E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition";

function Card({ title, children }) {
  return (
    <section className="bg-white border border-[#0D1B3E]/12 rounded-xl p-5 sm:p-6 space-y-5">
      <h2 className="text-base font-bold text-[#0D1B3E]">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#0D1B3E] mb-1.5">{label}</label>
      {children(id)}
      {hint && <p className="text-xs text-black/50 mt-1.5">{hint}</p>}
    </div>
  );
}

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
          dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split("T")[0] : "",
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
        if (k === "allowedFileTypes") return; // sent below in the JSON format the API expects
        fd.append(k, v);
      });
      fd.append(
        "allowedFileTypes",
        JSON.stringify(form.allowedFileTypes.split(",").map((s) => s.trim())),
      );
      newFiles.forEach((f) => fd.append("attachments", f));

      if (existing) {
        await updateAssignment(existing._id, fd);
        toast.success("Assignment updated");
      } else {
        await createAssignment(fd);
        toast.success("Assignment created");
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
    <div className="space-y-6 max-w-3xl text-black">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to={`/creator/courses/${courseId}/lessons/${lessonId}`}
          aria-label="Back to lesson"
          className={`p-2 -ml-2 text-[#0D1B3E]/55 hover:text-[#0D1B3E] hover:bg-[#0D1B3E]/5 rounded-lg transition ${focusRing}`}
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B3E] tracking-tight flex-1">
          {existing ? "Edit assignment" : "Create assignment"}
        </h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition ${focusRing}`}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Details */}
      <Card title="Assignment details">
        <Field label="Title *">
          {(id) => (
            <input
              id={id}
              value={form.title}
              onChange={f("title")}
              placeholder="e.g. Build a REST API"
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Instructions *">
          {(id) => (
            <textarea
              id={id}
              value={form.description}
              onChange={f("description")}
              rows={6}
              placeholder="Describe what students need to do, what to submit, and the grading criteria."
              className={`${inputCls} resize-none`}
            />
          )}
        </Field>
      </Card>

      {/* Settings */}
      <Card title="Settings">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Max marks">
            {(id) => (
              <input id={id} type="number" min={1} value={form.maxMarks} onChange={f("maxMarks")} className={inputCls} />
            )}
          </Field>
          <Field label="Due date">
            {(id) => (
              <input id={id} type="date" value={form.dueDate} onChange={f("dueDate")} className={inputCls} />
            )}
          </Field>
        </div>
        <Field label="Allowed file types" hint="Separate file types with commas, for example pdf, doc, docx, zip.">
          {(id) => (
            <input
              id={id}
              value={form.allowedFileTypes}
              onChange={f("allowedFileTypes")}
              placeholder="pdf,doc,docx,zip"
              className={inputCls}
            />
          )}
        </Field>
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.allowLateSubmission}
            onChange={f("allowLateSubmission")}
            className="w-4 h-4 accent-[#1A56DB]"
          />
          <span className="text-sm font-medium text-[#0D1B3E]">Allow late submission</span>
        </label>
      </Card>

      {/* Attachments */}
      <Card title="Reference files for students">
        {attachments.length > 0 && (
          <ul className="border border-[#0D1B3E]/12 rounded-lg divide-y divide-[#0D1B3E]/10 overflow-hidden">
            {attachments.map((att) => (
              <li key={att._id} className="flex items-center gap-3 px-4 py-3">
                <Paperclip className="w-4 h-4 text-[#1A56DB] shrink-0" strokeWidth={1.75} />
                <span className="flex-1 text-sm font-medium text-[#0D1B3E] truncate">{att.title}</span>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}
                >
                  Preview
                </a>
                <button
                  onClick={() => handleDeleteAttachment(att._id)}
                  aria-label={`Delete attachment ${att.title}`}
                  className={`p-1.5 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-md transition ${focusRing}`}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {newFiles.length > 0 && (
          <div>
            <p className="text-sm font-medium text-[#0D1B3E] mb-2">
              Ready to upload <span className="font-normal text-black/55">(saved when you click Save)</span>
            </p>
            <ul className="space-y-2">
              {newFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-[#1A56DB] bg-[#1A56DB]/[0.06] rounded-lg px-4 py-2.5"
                >
                  <span className="truncate flex-1 font-medium">{file.name}</span>
                  <button
                    onClick={() => setNewFiles((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={`Remove ${file.name}`}
                    className={`p-1 text-[#1A56DB]/70 hover:text-red-600 rounded shrink-0 ${focusRing}`}
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
            e.target.value = ""; // allow picking the same file again
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#0D1B3E]/20 hover:border-[#1A56DB] text-[#0D1B3E]/65 hover:text-[#1A56DB] rounded-lg py-4 text-sm font-semibold transition ${focusRing}`}
        >
          <Paperclip className="w-4 h-4" strokeWidth={2} />
          Attach reference files
        </button>
      </Card>
    </div>
  );
}