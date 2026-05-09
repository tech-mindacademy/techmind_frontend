import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchCourseForEdit, updateLesson,
  uploadLessonVideo, deleteLessonVideo,
  uploadLessonNote, deleteLessonNote,
} from "../../api/services/course.service";

function UploadZone({ accept, label, icon, onFile, isUploading, progress }) {
  const ref = useRef(null);
  return (
    <label className="cursor-pointer block">
      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${isUploading ? "border-teal-500 bg-teal-900/10" : "border-gray-700 hover:border-teal-500 hover:bg-gray-800/50"}`}>
        {isUploading ? (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-teal-400">Uploading... {progress}%</p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 max-w-xs mx-auto">
              <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xs text-gray-600 mt-1">{accept}</p>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
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
        const l = sec.lessons.find(l => l._id === lessonId);
        if (l) { setLesson(l); setSection(sec); setForm({ title: l.title, description: l.description || "", isFreePreview: l.isFreePreview }); break; }
      }
    } catch { toast.error("Failed to load lesson"); }
  };

  useEffect(() => { loadCourse(); }, [courseId, lessonId]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setIsSaving(true);
    try {
      await updateLesson(courseId, section._id, lessonId, form);
      toast.success("Lesson saved ✓");
      loadCourse();
    } catch { toast.error("Save failed"); }
    finally { setIsSaving(false); }
  };

  const handleVideoUpload = async (file) => {
    setVideoUploading(true); setVideoProgress(0);
    try {
      const fd = new FormData(); fd.append("video", file);
      // Use axios with progress via service
      const res = await uploadLessonVideo(courseId, section._id, lessonId, fd, p => setVideoProgress(p));
      toast.success("Video uploaded ✓");
      loadCourse();
    } catch { toast.error("Video upload failed"); }
    finally { setVideoUploading(false); }
  };

  const handleDeleteVideo = async () => {
    if (!confirm("Remove this video?")) return;
    try { await deleteLessonVideo(courseId, section._id, lessonId); toast.success("Video removed"); loadCourse(); }
    catch { toast.error("Failed"); }
  };

  const handleNoteUpload = async (file) => {
    setNoteUploading(true); setNoteProgress(0);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("title", file.name);
      await uploadLessonNote(courseId, section._id, lessonId, fd);
      toast.success("Note uploaded ✓");
      loadCourse();
    } catch { toast.error("Note upload failed"); }
    finally { setNoteUploading(false); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    try { await deleteLessonNote(courseId, section._id, lessonId, noteId); toast.success("Note deleted"); loadCourse(); }
    catch { toast.error("Failed"); }
  };

  if (!lesson) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to={`/creator/courses/${courseId}/edit`} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <p className="text-xs text-gray-500">{course?.title} · {section?.title}</p>
          <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="ml-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
          {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Save"}
        </button>
      </div>

      {/* Basic info */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Lesson Details</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description (optional)</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 resize-none focus:outline-none focus:border-teal-500 transition" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setForm(p => ({ ...p, isFreePreview: !p.isFreePreview }))}
            className={`w-10 h-5 rounded-full transition-colors relative ${form.isFreePreview ? "bg-teal-500" : "bg-gray-600"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFreePreview ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm text-gray-300">Free preview (visible without enrollment)</span>
        </label>
      </div>

      {/* Video */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Lesson Video</h2>
        {lesson.video?.url ? (
          <div className="space-y-3">
            <video src={lesson.video.url} controls className="w-full rounded-xl" style={{ maxHeight: 280 }} />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{lesson.video.duration ? `Duration: ${Math.floor(lesson.video.duration/60)}m ${lesson.video.duration%60}s` : "Video uploaded"}</span>
              <button onClick={handleDeleteVideo} className="text-red-400 hover:text-red-300 transition">Remove video</button>
            </div>
            <UploadZone accept="video/mp4,video/mov,video/webm" label="Upload new video (replaces current)" icon="🎬"
              onFile={handleVideoUpload} isUploading={videoUploading} progress={videoProgress} />
          </div>
        ) : (
          <UploadZone accept="video/mp4,video/mov,video/webm" label="Upload lesson video (MP4, MOV, WebM — max 500MB)" icon="🎬"
            onFile={handleVideoUpload} isUploading={videoUploading} progress={videoProgress} />
        )}
      </div>

      {/* Notes */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Lesson Notes / Materials</h2>
        {lesson.notes?.length > 0 && (
          <div className="space-y-2">
            {lesson.notes.map(note => (
              <div key={note._id} className="flex items-center gap-3 bg-gray-700 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span className="flex-1 text-sm text-gray-200 truncate">{note.title}</span>
                <span className="text-xs text-gray-500 uppercase">.{note.fileType}</span>
                <a href={note.url} target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:underline">Preview</a>
                <button onClick={() => handleDeleteNote(note._id)} className="text-gray-600 hover:text-red-400 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <UploadZone accept=".pdf,.doc,.docx,.ppt,.pptx" label="Upload PDF, Word, or PowerPoint notes (max 20MB)" icon="📄"
          onFile={handleNoteUpload} isUploading={noteUploading} progress={noteProgress} />
      </div>

      {/* Quiz & Assignment links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to={`/creator/courses/${courseId}/quiz/${lessonId}`}
          className={`bg-gray-800 border rounded-2xl p-5 hover:border-purple-500 transition group ${lesson.quiz ? "border-purple-600" : "border-gray-700"}`}>
          <div className="text-2xl mb-2">❓</div>
          <p className="font-semibold text-white group-hover:text-purple-300 transition">{lesson.quiz ? "Edit Quiz" : "Add Quiz"}</p>
          <p className="text-xs text-gray-500 mt-1">{lesson.quiz ? "Quiz attached · auto-graded" : "Create MCQ / true-false / short answer"}</p>
        </Link>
        <Link to={`/creator/courses/${courseId}/assignment/${lessonId}`}
          className={`bg-gray-800 border rounded-2xl p-5 hover:border-amber-500 transition group ${lesson.assignment ? "border-amber-600" : "border-gray-700"}`}>
          <div className="text-2xl mb-2">📝</div>
          <p className="font-semibold text-white group-hover:text-amber-300 transition">{lesson.assignment ? "Edit Assignment" : "Add Assignment"}</p>
          <p className="text-xs text-gray-500 mt-1">{lesson.assignment ? "Assignment attached · manual grading" : "Create assignment with file submission"}</p>
        </Link>
      </div>
    </div>
  );
}
