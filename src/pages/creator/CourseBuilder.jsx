import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  createCourse, updateCourse, fetchCourseForEdit,
  addSection, updateSection, deleteSection,
  addLesson, updateLesson, deleteLesson,
  togglePublish,
} from "../../api/services/course.service";

const LEVELS = ["beginner", "intermediate", "advanced", "all"];
const CATEGORIES = ["Web Development", "Mobile Development", "Data Science", "Design", "Business", "Marketing", "Personal Development", "Photography", "Music", "Other"];
const FINAL_SECTION_PATTERN = /final\s*(quiz|assessment|exam|test)/i;

function Input({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>}
      <input {...props} className={`w-full px-3 py-2.5 bg-gray-800 border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-teal-500 transition ${error ? "border-red-500" : "border-gray-700"}`} />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function SectionItem({ section, courseId, onUpdated, isExpanded, onToggle, isFinal }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const saveTitle = async () => {
    if (isFinal) return;
    if (!title.trim() || title === section.title) { setEditingTitle(false); return; }
    try {
      await updateSection(courseId, section._id, { title });
      onUpdated();
      setEditingTitle(false);
    } catch { toast.error("Failed to update section"); }
  };

  const handleDeleteSection = async () => {
    if (!confirm(`Delete section "${section.title}" and all its lessons?`)) return;
    try { await deleteSection(courseId, section._id); onUpdated(); toast.success("Section deleted"); }
    catch { toast.error("Failed to delete section"); }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return;
    try {
      await addLesson(courseId, section._id, { title: newLessonTitle.trim() });
      setNewLessonTitle("");
      setAddingLesson(false);
      onUpdated();
      toast.success("Lesson added");
    } catch { toast.error("Failed to add lesson"); }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;
    try { await deleteLesson(courseId, section._id, lessonId); onUpdated(); toast.success("Lesson deleted"); }
    catch { toast.error("Failed to delete lesson"); }
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${
      isFinal ? "bg-gray-800 border-purple-700/50" : "bg-gray-800 border-gray-700"
    }`}>
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-750">
        <button onClick={onToggle} className="text-gray-400 hover:text-white transition">
          <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
        {editingTitle && !isFinal ? (
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            onBlur={saveTitle} onKeyDown={e => e.key === "Enter" && saveTitle()}
            className="flex-1 bg-gray-700 border border-teal-500 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
        ) : (
          <button
            onClick={() => !isFinal && setEditingTitle(true)}
            className={`flex-1 text-left text-sm font-semibold transition flex items-center gap-2 ${
              isFinal ? "text-purple-300 cursor-default" : "text-gray-200 hover:text-white"
            }`}
          >
            {section.title}
            {isFinal && (
              <span className="text-xs font-normal bg-purple-900/40 text-purple-400 px-2 py-0.5 rounded-full border border-purple-700/40">
                Required
              </span>
            )}
          </button>
        )}
        <span className="text-xs text-gray-500">{section.lessons?.length || 0} lessons</span>
        {!isFinal && (
        <button onClick={handleDeleteSection} className="text-gray-600 hover:text-red-400 transition p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
        )}
      </div>

      {/* Lessons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="border-t border-gray-700">
              {section.lessons?.map(lesson => (
                <div key={lesson._id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-700/50 hover:bg-gray-700/30 transition group">
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span className="flex-1 text-sm text-gray-300">{lesson.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {lesson.video?.url && <span className="text-xs text-teal-500">📹</span>}
                    {lesson.quiz && <span className="text-xs text-purple-400">Q</span>}
                    {lesson.assignment && <span className="text-xs text-amber-400">A</span>}
                    <Link to={`/creator/courses/${courseId}/lessons/${lesson._id}`}
                      className="text-xs text-teal-400 hover:underline px-2">Edit</Link>
                    <button onClick={() => handleDeleteLesson(lesson._id, lesson.title)} className="text-gray-600 hover:text-red-400 transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add lesson */}
              {addingLesson ? (
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <input autoFocus value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddLesson(); if (e.key === "Escape") setAddingLesson(false); }}
                    placeholder="Lesson title..."
                    className="flex-1 bg-gray-700 border border-teal-500 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none" />
                  <button onClick={handleAddLesson} className="text-teal-400 hover:text-teal-300 text-sm font-semibold">Add</button>
                  <button onClick={() => setAddingLesson(false)} className="text-gray-500 hover:text-white text-sm">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setAddingLesson(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 hover:text-teal-400 hover:bg-gray-700/30 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add lesson
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CourseBuilder() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!courseId;

  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", shortDescription: "", category: "Web Development", level: "all", price: "", isFree: false, language: "English" });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [addingSectionTitle, setAddingSectionTitle] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info | content

  useEffect(() => {
    if (isEditing) {
      fetchCourseForEdit(courseId)
        .then(d => {
          setCourse(d.course);
          setForm({
            title: d.course.title || "",
            description: d.course.description || "",
            shortDescription: d.course.shortDescription || "",
            category: d.course.category || "Web Development",
            level: d.course.level || "all",
            price: d.course.price?.toString() || "",
            isFree: d.course.isFree || false,
            language: d.course.language || "English",
          });
          if (d.course.thumbnail?.url) setThumbnailPreview(d.course.thumbnail.url);
          const expanded = {};
          d.course.sections?.forEach(s => { expanded[s._id] = true; });
          setExpandedSections(expanded);
        })
        .catch(() => toast.error("Failed to load course"));
    }
  }, [courseId]);

  const refreshCourse = () => {
    if (courseId) {
      fetchCourseForEdit(courseId).then(d => setCourse(d.course)).catch(() => {});
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Category is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append("thumbnail", thumbnail);

      if (isEditing) {
        await updateCourse(courseId, fd);
        toast.success("Course saved ✓");
        refreshCourse();
      } else {
        const res = await createCourse(fd);
        toast.success("Course created!");
        navigate(`/creator/courses/${res.course._id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
  if (!course.isPublished) {
    const finalSection = course.sections?.find(s => FINAL_SECTION_PATTERN.test(s.title));

    if (!finalSection) {
      toast.error("A 'Final Quiz' section is required before publishing.");
      return;
    }
    if (!finalSection.lessons?.some(l => l.quiz)) {
      toast.error("Add a lesson with a quiz inside the Final Quiz section before publishing.");
      return;
    }
  }

  setIsPublishing(true);
  try {
    const res = await togglePublish(courseId);
    setCourse(prev => ({ ...prev, isPublished: res.isPublished, approvalStatus: res.approvalStatus || prev.approvalStatus }));
    toast.success(res.message || (res.isPublished ? "Submitted for review!" : "Course unpublished."));
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
  } finally { setIsPublishing(false); }
};

  const handleAddSection = async () => {
    if (!addingSectionTitle.trim()) return;
    try {
      await addSection(courseId, { title: addingSectionTitle.trim() });
      setAddingSectionTitle("");
      setShowAddSection(false);
      refreshCourse();
      toast.success("Section added");
    } catch { toast.error("Failed to add section"); }
  };

  const f = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); if (errors[k]) setErrors(p => ({ ...p, [k]: "" })); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/creator/courses" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{isEditing ? (course?.title || "Edit Course") : "New Course"}</h1>
            {isEditing && (
              <span className={`text-xs font-semibold ${course?.isPublished ? "text-green-400" : "text-gray-500"}`}>
                {course?.isPublished ? "● Published" : "○ Draft"}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={isSaving}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
            {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Save"}
          </button>
          {isEditing && (
            <button onClick={handlePublish} disabled={isPublishing}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${course?.isPublished ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
              {isPublishing ? "..." : course?.isPublished ? "Unpublish" : "Submit for Review"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {isEditing && (
        <div className="flex gap-1 bg-gray-800 p-1 rounded-xl w-fit">
          {["info", "content"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition ${activeTab === t ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}>
              {t === "info" ? "Course Info" : "Curriculum"}
            </button>
          ))}
        </div>
      )}

      {/* Course Info Tab */}
      {(!isEditing || activeTab === "info") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main fields */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Basic Information</h2>
              <Input label="Course Title *" value={form.title} onChange={f("title")} placeholder="e.g. Complete React Developer Bootcamp" error={errors.title} />
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea value={form.description} onChange={f("description")} rows={5} placeholder="What will students learn in this course?"
                  className={`w-full px-3 py-2.5 bg-gray-700 border rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-teal-500 resize-none transition ${errors.description ? "border-red-500" : "border-gray-600"}`} />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
              </div>
              <Input label="Short Description" value={form.shortDescription} onChange={f("shortDescription")} placeholder="One-line summary (shown in cards)" />
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category *</label>
                  <select value={form.category} onChange={f("category")}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Level</label>
                  <select value={form.level} onChange={f("level")}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition capitalize">
                    {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Language" value={form.language} onChange={f("language")} placeholder="English" />
            </div>
          </div>

          {/* Right: thumbnail + pricing */}
          <div className="space-y-5">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Thumbnail</h2>
              <label className="cursor-pointer block">
                <div className={`aspect-video rounded-xl border-2 border-dashed overflow-hidden transition ${thumbnailPreview ? "border-transparent" : "border-gray-600 hover:border-teal-500"}`}>
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <p className="text-xs">Click to upload (16:9)</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) { setThumbnail(file); setThumbnailPreview(URL.createObjectURL(file)); }
                }} />
              </label>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Pricing</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, isFree: !p.isFree }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isFree ? "bg-teal-500" : "bg-gray-600"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFree ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-300">Free course</span>
              </label>
              {!form.isFree && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.price} onChange={f("price")} min="0" placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-teal-500 transition" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {isEditing && activeTab === "content" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Course Curriculum</h2>
              <p className="text-xs text-gray-500 mt-0.5">{course?.sections?.length || 0} sections · {course?.stats?.totalLessons || 0} lessons</p>
            </div>
          </div>

          {/* Sections */}
          {course?.sections?.map(section => (
  <SectionItem
    key={section._id}
    section={section}
    courseId={courseId}
    onUpdated={refreshCourse}
    isExpanded={!!expandedSections[section._id]}
    onToggle={() => setExpandedSections(p => ({ ...p, [section._id]: !p[section._id] }))}
    isFinal={FINAL_SECTION_PATTERN.test(section.title)}
  />
))}

          {/* Add section */}
          {showAddSection ? (
            <div className="flex items-center gap-2 bg-gray-800 border border-teal-500 rounded-xl px-4 py-3">
              <input autoFocus value={addingSectionTitle} onChange={e => setAddingSectionTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddSection(); if (e.key === "Escape") setShowAddSection(false); }}
                placeholder="New section title..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none" />
              <button onClick={handleAddSection} className="text-teal-400 hover:text-teal-300 text-sm font-semibold">Add</button>
              <button onClick={() => setShowAddSection(false)} className="text-gray-500 hover:text-white text-sm">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowAddSection(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-teal-500 text-gray-500 hover:text-teal-400 rounded-xl py-4 text-sm transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add section
            </button>
          )}
        </div>
      )}
    </div>
  );
}
