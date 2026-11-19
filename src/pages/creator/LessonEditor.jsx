// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import {
//   fetchCourseForEdit, updateLesson,
//   uploadLessonVideo, deleteLessonVideo,
//   uploadLessonNote, deleteLessonNote,
// } from "../../api/services/course.service";

// function UploadZone({ accept, label, icon, onFile, isUploading, progress }) {
//   const ref = useRef(null);
//   return (
//     <label className="cursor-pointer block">
//       <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${isUploading ? "border-teal-500 bg-teal-900/10" : "border-gray-700 hover:border-teal-500 hover:bg-gray-800/50"}`}>
//         {isUploading ? (
//           <div className="space-y-2">
//             <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
//             <p className="text-sm text-teal-400">Uploading... {progress}%</p>
//             <div className="w-full bg-gray-700 rounded-full h-1.5 max-w-xs mx-auto">
//               <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="text-3xl mb-2">{icon}</div>
//             <p className="text-sm text-gray-400">{label}</p>
//             <p className="text-xs text-gray-600 mt-1">{accept}</p>
//           </>
//         )}
//       </div>
//       <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
//     </label>
//   );
// }

// export default function LessonEditor() {
//   const { courseId, lessonId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [lesson, setLesson] = useState(null);
//   const [section, setSection] = useState(null);
//   const [form, setForm] = useState({ title: "", description: "", isFreePreview: false });
//   const [isSaving, setIsSaving] = useState(false);
//   const [videoUploading, setVideoUploading] = useState(false);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [noteUploading, setNoteUploading] = useState(false);
//   const [noteProgress, setNoteProgress] = useState(0);

//   const loadCourse = async () => {
//     try {
//       const d = await fetchCourseForEdit(courseId);
//       setCourse(d.course);
//       for (const sec of d.course.sections || []) {
//         const l = sec.lessons.find(l => l._id === lessonId);
//         if (l) { setLesson(l); setSection(sec); setForm({ title: l.title, description: l.description || "", isFreePreview: l.isFreePreview }); break; }
//       }
//     } catch { toast.error("Failed to load lesson"); }
//   };

//   useEffect(() => { loadCourse(); }, [courseId, lessonId]);

//   const handleSave = async () => {
//     if (!form.title.trim()) { toast.error("Title is required"); return; }
//     setIsSaving(true);
//     try {
//       await updateLesson(courseId, section._id, lessonId, form);
//       toast.success("Lesson saved ✓");
//       loadCourse();
//     } catch { toast.error("Save failed"); }
//     finally { setIsSaving(false); }
//   };

//   const handleVideoUpload = async (file) => {
//     setVideoUploading(true); setVideoProgress(0);
//     try {
//       const fd = new FormData(); fd.append("video", file);
//       // Use axios with progress via service
//       const res = await uploadLessonVideo(courseId, section._id, lessonId, fd, p => setVideoProgress(p));
//       toast.success("Video uploaded ✓");
//       loadCourse();
//     } catch { toast.error("Video upload failed"); }
//     finally { setVideoUploading(false); }
//   };

//   const handleDeleteVideo = async () => {
//     if (!confirm("Remove this video?")) return;
//     try { await deleteLessonVideo(courseId, section._id, lessonId); toast.success("Video removed"); loadCourse(); }
//     catch { toast.error("Failed"); }
//   };

//   const handleNoteUpload = async (file) => {
//     setNoteUploading(true); setNoteProgress(0);
//     try {
//       const fd = new FormData(); fd.append("file", file); fd.append("title", file.name);
//       await uploadLessonNote(courseId, section._id, lessonId, fd);
//       toast.success("Note uploaded ✓");
//       loadCourse();
//     } catch { toast.error("Note upload failed"); }
//     finally { setNoteUploading(false); }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!confirm("Delete this note?")) return;
//     try { await deleteLessonNote(courseId, section._id, lessonId, noteId); toast.success("Note deleted"); loadCourse(); }
//     catch { toast.error("Failed"); }
//   };

//   if (!lesson) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="space-y-6 max-w-3xl">
//       {/* Header */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <Link to={`/creator/courses/${courseId}/edit`} className="text-gray-400 hover:text-white transition">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
//         </Link>
//         <div>
//           <p className="text-xs text-gray-500">{course?.title} · {section?.title}</p>
//           <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
//         </div>
//         <button onClick={handleSave} disabled={isSaving} className="ml-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
//           {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Save"}
//         </button>
//       </div>

//       {/* Basic info */}
//       <div className="bg-white-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-black">Lesson Details</h2>
//         <div>
//           <label className="block text-xs font-semibold text-black-400 uppercase tracking-wider mb-1.5">Title</label>
//           <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
//             className="w-full px-3 py-2.5 bg-white-700 border border-gray-600 rounded-xl text-sm text-black-200 focus:outline-none focus:border-teal-500 transition" />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-black-400 uppercase tracking-wider mb-1.5">Description (optional)</label>
//           <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
//             className="w-full px-3 py-2.5 bg-white-700 border border-gray-600 rounded-xl text-sm text-black-200 resize-none focus:outline-none focus:border-teal-500 transition" />
//         </div>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <div onClick={() => setForm(p => ({ ...p, isFreePreview: !p.isFreePreview }))}
//             className={`w-10 h-5 rounded-full transition-colors relative ${form.isFreePreview ? "bg-teal-500" : "bg-gray-600"}`}>
//             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFreePreview ? "translate-x-5" : "translate-x-0.5"}`} />
//           </div>
//           <span className="text-sm text-black-300">Free preview (visible without enrollment)</span>
//         </label>
//       </div>

//       {/* Video */}
//       <div className="bg-white-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-black">Lesson Video</h2>
//         {lesson.video?.url ? (
//           <div className="space-y-3">
//             <video src={lesson.video.url} controls className="w-full rounded-xl" style={{ maxHeight: 280 }} />
//             <div className="flex items-center justify-between text-xs text-black-500">
//               <span>{lesson.video.duration ? `Duration: ${Math.floor(lesson.video.duration/60)}m ${lesson.video.duration%60}s` : "Video uploaded"}</span>
//               <button onClick={handleDeleteVideo} className="text-red-400 hover:text-red-300 transition">Remove video</button>
//             </div>
//             <UploadZone accept="video/mp4,video/mov,video/webm" label="Upload new video (replaces current)" icon="🎬"
//               onFile={handleVideoUpload} isUploading={videoUploading} progress={videoProgress} />
//           </div>
//         ) : (
//           <UploadZone accept="video/mp4,video/mov,video/webm" label="Upload lesson video (MP4, MOV, WebM — max 500MB)" icon="🎬"
//             onFile={handleVideoUpload} isUploading={videoUploading} progress={videoProgress} />
//         )}
//       </div>

//       {/* Notes */}
//       <div className="bg-white-800 border border-gray-700 rounded-2xl p-5 space-y-4">
//         <h2 className="text-sm font-semibold text-black">Lesson Notes / Materials</h2>
//         {lesson.notes?.length > 0 && (
//           <div className="space-y-2">
//             {lesson.notes.map(note => (
//               <div key={note._id} className="flex items-center gap-3 bg-gray-700 rounded-xl px-3 py-2.5">
//                 <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
//                 <span className="flex-1 text-sm text-black-200 truncate">{note.title}</span>
//                 <span className="text-xs text-black-500 uppercase">.{note.fileType}</span>
//                 <a href={note.url} target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:underline">Preview</a>
//                 <button onClick={() => handleDeleteNote(note._id)} className="text-gray-600 hover:text-red-400 transition">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         <UploadZone accept=".pdf,.doc,.docx,.ppt,.pptx" label="Upload PDF, Word, or PowerPoint notes (max 20MB)" icon="📄"
//           onFile={handleNoteUpload} isUploading={noteUploading} progress={noteProgress} />
//       </div>

//       {/* Quiz & Assignment links */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <Link to={`/creator/courses/${courseId}/quiz/${lessonId}`}
//           className={`bg-white-800 border rounded-2xl p-5 hover:border-purple-500 transition group ${lesson.quiz ? "border-purple-600" : "border-gray-700"}`}>
//           <div className="text-2xl mb-2">❓</div>
//           <p className="font-semibold text-black group-hover:text-purple-300 transition">{lesson.quiz ? "Edit Quiz" : "Add Quiz"}</p>
//           <p className="text-xs text-black-500 mt-1">{lesson.quiz ? "Quiz attached · auto-graded" : "Create MCQ / true-false / short answer"}</p>
//         </Link>
//         <Link to={`/creator/courses/${courseId}/assignment/${lessonId}`}
//           className={`bg-white-800 border rounded-2xl p-5 hover:border-amber-500 transition group ${lesson.assignment ? "border-amber-600" : "border-gray-700"}`}>
//           <div className="text-2xl mb-2">📝</div>
//           <p className="font-semibold text-black group-hover:text-amber-300 transition">{lesson.assignment ? "Edit Assignment" : "Add Assignment"}</p>
//           <p className="text-xs text-black-500 mt-1">{lesson.assignment ? "Assignment attached · manual grading" : "Create assignment with file submission"}</p>
//         </Link>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useId } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft, ChevronRight, Loader2, Film, FileText, Trash2, UploadCloud, HelpCircle, ClipboardList,
} from "lucide-react";
import {
  fetchCourseForEdit, updateLesson,
  uploadLessonVideo, deleteLessonVideo,
  uploadLessonNote, deleteLessonNote,
} from "../../api/services/course.service";

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

function Field({ label, children }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#0D1B3E] mb-1.5">{label}</label>
      {children(id)}
    </div>
  );
}

function UploadZone({ accept, label, hint, onFile, isUploading, progress }) {
  return (
    <label className="block cursor-pointer">
      <input
        type="file"
        accept={accept}
        className="peer sr-only"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = ""; // allow picking the same file again
        }}
      />
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#1A56DB] peer-focus-visible:ring-offset-2 ${
          isUploading
            ? "border-[#1A56DB] bg-[#1A56DB]/[0.05]"
            : "border-[#0D1B3E]/25 hover:border-[#1A56DB] hover:bg-[#1A56DB]/[0.03]"
        }`}
      >
        {isUploading ? (
          <div className="space-y-3" role="status">
            <Loader2 className="w-6 h-6 text-[#1A56DB] animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#1A56DB]">
              Uploading{progress > 0 ? `... ${progress}%` : "..."}
            </p>
            {progress > 0 && (
              <div className="w-full bg-[#0D1B3E]/10 rounded-full h-1.5 max-w-xs mx-auto">
                <div className="bg-[#1A56DB] h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        ) : (
          <>
            <UploadCloud className="w-7 h-7 text-[#0D1B3E]/40 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-[#0D1B3E]">{label}</p>
            {hint && <p className="text-xs text-black/50 mt-1">{hint}</p>}
          </>
        )}
      </div>
    </label>
  );
}

export default function LessonEditor() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [section, setSection] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", isFreePreview: false });
  const [isSaving, setIsSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [noteUploading, setNoteUploading] = useState(false);
  const [noteProgress, setNoteProgress] = useState(0);

  const loadCourse = async () => {
    try {
      const d = await fetchCourseForEdit(courseId);
      setCourse(d.course);
      for (const sec of d.course.sections || []) {
        const l = sec.lessons.find((l) => l._id === lessonId);
        if (l) {
          setLesson(l);
          setSection(sec);
          setForm({ title: l.title, description: l.description || "", isFreePreview: l.isFreePreview });
          break;
        }
      }
    } catch {
      toast.error("Failed to load lesson");
    }
  };

  useEffect(() => { loadCourse(); }, [courseId, lessonId]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setIsSaving(true);
    try {
      await updateLesson(courseId, section._id, lessonId, form);
      toast.success("Lesson saved");
      loadCourse();
    } catch {
      toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = async (file) => {
    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const fd = new FormData();
      fd.append("video", file);
      await uploadLessonVideo(courseId, section._id, lessonId, fd, (p) => setVideoProgress(p));
      toast.success("Video uploaded");
      loadCourse();
    } catch {
      toast.error("Video upload failed");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!confirm("Remove this video?")) return;
    try {
      await deleteLessonVideo(courseId, section._id, lessonId);
      toast.success("Video removed");
      loadCourse();
    } catch {
      toast.error("Failed");
    }
  };

  const handleNoteUpload = async (file) => {
    setNoteUploading(true);
    setNoteProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", file.name);
      await uploadLessonNote(courseId, section._id, lessonId, fd);
      toast.success("Note uploaded");
      loadCourse();
    } catch {
      toast.error("Note upload failed");
    } finally {
      setNoteUploading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteLessonNote(courseId, section._id, lessonId, noteId);
      toast.success("Note deleted");
      loadCourse();
    } catch {
      toast.error("Failed");
    }
  };

  if (!lesson)
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading lesson">
        <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const attachCards = [
    {
      to: `/creator/courses/${courseId}/quiz/${lessonId}`,
      Icon: HelpCircle,
      attached: !!lesson.quiz,
      title: lesson.quiz ? "Edit quiz" : "Add quiz",
      text: lesson.quiz ? "Quiz attached, auto-graded" : "Create MCQ, true/false or short answer questions",
    },
    {
      to: `/creator/courses/${courseId}/assignment/${lessonId}`,
      Icon: ClipboardList,
      attached: !!lesson.assignment,
      title: lesson.assignment ? "Edit assignment" : "Add assignment",
      text: lesson.assignment ? "Assignment attached, manual grading" : "Create an assignment with file submission",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl text-black">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to={`/creator/courses/${courseId}/edit`}
          aria-label="Back to course"
          className={`p-2 -ml-2 text-[#0D1B3E]/55 hover:text-[#0D1B3E] hover:bg-[#0D1B3E]/5 rounded-lg transition ${focusRing}`}
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-black/55 truncate">
            {course?.title}
            {section?.title && <> <span aria-hidden="true">/</span> {section.title}</>}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D1B3E] tracking-tight truncate">{lesson.title}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition ${focusRing}`}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Basic info */}
      <Card title="Lesson details">
        <Field label="Title">
          {(id) => (
            <input
              id={id}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Description (optional)">
          {(id) => (
            <textarea
              id={id}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          )}
        </Field>
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.isFreePreview}
            aria-labelledby="preview-label"
            onClick={() => setForm((p) => ({ ...p, isFreePreview: !p.isFreePreview }))}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${focusRing} ${
              form.isFreePreview ? "bg-[#1A56DB]" : "bg-[#0D1B3E]/25"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.isFreePreview ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span id="preview-label" className="text-sm font-medium text-[#0D1B3E]">
            Free preview <span className="font-normal text-black/55">(visible without enrollment)</span>
          </span>
        </div>
      </Card>

      {/* Video */}
      <Card title="Lesson video">
        {lesson.video?.url ? (
          <div className="space-y-4">
            <video
              src={lesson.video.url}
              controls
              className="w-full rounded-lg bg-[#0D1B3E]"
              style={{ maxHeight: 320 }}
            />
            <div className="flex items-center justify-between gap-4 text-sm text-black/60">
              <span>
                {lesson.video.duration
                  ? `Duration: ${Math.floor(lesson.video.duration / 60)}m ${lesson.video.duration % 60}s`
                  : "Video uploaded"}
              </span>
              <button
                onClick={handleDeleteVideo}
                className={`inline-flex items-center gap-1.5 font-semibold text-red-600 hover:underline rounded ${focusRing}`}
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                Remove video
              </button>
            </div>
            <UploadZone
              accept="video/mp4,video/mov,video/webm"
              label="Upload a new video"
              hint="Replaces the current video. MP4, MOV or WebM."
              onFile={handleVideoUpload}
              isUploading={videoUploading}
              progress={videoProgress}
            />
          </div>
        ) : (
          <UploadZone
            accept="video/mp4,video/mov,video/webm"
            label="Upload lesson video"
            hint="MP4, MOV or WebM, up to 500 MB."
            onFile={handleVideoUpload}
            isUploading={videoUploading}
            progress={videoProgress}
          />
        )}
      </Card>

      {/* Notes */}
      <Card title="Lesson notes and materials">
        {lesson.notes?.length > 0 && (
          <ul className="border border-[#0D1B3E]/12 rounded-lg divide-y divide-[#0D1B3E]/10 overflow-hidden">
            {lesson.notes.map((note) => (
              <li key={note._id} className="flex items-center gap-3 px-4 py-3">
                <FileText className="w-4 h-4 text-[#1A56DB] shrink-0" strokeWidth={1.75} />
                <span className="flex-1 text-sm font-medium text-[#0D1B3E] truncate">{note.title}</span>
                <span className="text-xs font-semibold uppercase bg-[#0D1B3E]/8 text-[#0D1B3E]/70 px-2 py-0.5 rounded-md">
                  {note.fileType}
                </span>
                <a
                  href={note.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}
                >
                  Preview
                </a>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  aria-label={`Delete note ${note.title}`}
                  className={`p-1.5 text-black/40 hover:text-red-600 hover:bg-red-50 rounded-md transition ${focusRing}`}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <UploadZone
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          label="Upload notes"
          hint="PDF, Word or PowerPoint, up to 20 MB."
          onFile={handleNoteUpload}
          isUploading={noteUploading}
          progress={noteProgress}
        />
      </Card>

      {/* Quiz and assignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attachCards.map(({ to, Icon, attached, title, text }) => (
          <Link
            key={to}
            to={to}
            className={`group bg-white border rounded-xl p-5 flex items-start gap-4 transition hover:border-[#1A56DB] ${focusRing} ${
              attached ? "border-[#1A56DB]/60" : "border-[#0D1B3E]/12"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0D1B3E]">{title}</p>
              <p className="text-sm text-black/55 mt-1">{text}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0D1B3E]/30 group-hover:text-[#1A56DB] transition-colors mt-1 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}