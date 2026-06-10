import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { selectUserRole } from "../../store/slices/authSlice";
import {
  markLessonComplete,
  updateLastAccessed,
  fetchEnrollment,
  fetchLessonStreamUrl,
} from "../../api/services/course.service";
import QuizPanel from "../../components/quiz/QuizPanel";
import VideoPlayer from "../../components/ui/VideoPlayer";
import AssignmentPanel from "../../components/assignment/AssignmentPanel";

const fmtDuration = (s) => {
  if (!s) return "";
  const m = Math.floor(s / 60),
    sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* ─────────────────────────────────────────
   3-D SVG Icon Components
   Each icon uses layered paths + a subtle
   bottom-face / shadow to give depth.
───────────────────────────────────────── */
const Icon3D = ({ children, size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// Back arrow  ←
export const IconChevronLeft = ({ size = 18, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M16 20l-8-8 8-8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.25"
      transform="translate(1,1)"
    />
    <path
      d="M16 20l-8-8 8-8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon3D>
);

// Right arrow →
export const IconChevronRight = ({ size = 18, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M8 4l8 8-8 8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.25"
      transform="translate(1,1)"
    />
    <path
      d="M8 4l8 8-8 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon3D>
);

// Down chevron ↓
export const IconChevronDown = ({ size = 16, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M5 9l7 7 7-7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.25"
      transform="translate(0.5,1)"
    />
    <path
      d="M5 9l7 7 7-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon3D>
);

// Hamburger menu ≡
export const IconMenu = ({ size = 20, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M4 7h16M4 12h16M4 17h10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.25"
      transform="translate(0.5,0.5)"
    />
    <path
      d="M4 7h16M4 12h16M4 17h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon3D>
);

// Play ▶
export const IconPlay = ({ size = 16, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M6 4.5l13 7.5-13 7.5V4.5z"
      fill="currentColor"
      opacity="0.2"
      transform="translate(0.5,0.5)"
    />
    <path
      d="M6 4.5l13 7.5-13 7.5V4.5z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </Icon3D>
);

// Play circle ▶ (large empty state)
export const IconPlayCircle = ({ size = 64, className = "" }) => (
  <Icon3D size={size} className={className}>
    <circle cx="12" cy="13" r="9" fill="currentColor" opacity="0.1" />
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M10 8.5l6 3.5-6 3.5V8.5z"
      fill="currentColor"
      opacity="0.4"
      transform="translate(0.3,0.3)"
    />
    <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor" />
  </Icon3D>
);

// Question mark circle ?
export const IconQuiz = ({ size = 14, className = "" }) => (
  <Icon3D size={size} className={className}>
    <circle cx="12" cy="13" r="9" fill="currentColor" opacity="0.1" />
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-1.5 2-2.5 2.75V13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16.5" r="0.75" fill="currentColor" />
  </Icon3D>
);

// Document / assignment
export const IconAssignment = ({ size = 14, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M6 22h12a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v16a2 2 0 002 2z"
      fill="currentColor"
      opacity="0.1"
      transform="translate(0.3,0.3)"
    />
    <path
      d="M6 22h12a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v16a2 2 0 002 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v5h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 12h6M9 16h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon3D>
);

// Check ✓
export const IconCheck = ({ size = 14, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M4 13l4.5 4.5L20 6"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.2"
      transform="translate(0.5,0.5)"
    />
    <path
      d="M4 13l4.5 4.5L20 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon3D>
);

// Download ↓ box
export const IconDownload = ({ size = 16, className = "" }) => (
  <Icon3D size={size} className={className}>
    <path
      d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.25"
      transform="translate(0.4,0.4)"
    />
    <path
      d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="4"
      y="17"
      width="16"
      height="3"
      rx="1"
      fill="currentColor"
      opacity="0.15"
      transform="translate(0.3,0.3)"
    />
    <rect
      x="4"
      y="17"
      width="16"
      height="3"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </Icon3D>
);

// Eye 👁 (admin preview)
export const IconEye = ({ size = 14, className = "" }) => (
  <Icon3D size={size} className={className}>
    <ellipse cx="12" cy="13" rx="9" ry="5" fill="currentColor" opacity="0.1" />
    <path
      d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="2.5"
      fill="currentColor"
      opacity="0.3"
      transform="translate(0.2,0.2)"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </Icon3D>
);

// Lock 🔒 — used for locked lessons
export const IconLock = ({ size = 16, className = "" }) => (
  <Icon3D size={size} className={className}>
    {/* shadow body */}
    <rect
      x="5.5"
      y="11.5"
      width="13"
      height="10"
      rx="2"
      fill="currentColor"
      opacity="0.15"
      transform="translate(0.4,0.4)"
    />
    {/* shackle shadow */}
    <path
      d="M8 11V7a4 4 0 018 0v4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.15"
      transform="translate(0.4,0.4)"
    />
    {/* body */}
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      fill="currentColor"
      opacity="0.18"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* shackle */}
    <path
      d="M8 11V7a4 4 0 018 0v4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* keyhole */}
    <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.7" />
    <path
      d="M12 17.5v1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
    />
  </Icon3D>
);

/* ─────────────────────────────────────────
   Tab components
───────────────────────────────────────── */
const SidebarTab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
      active
        ? "bg-indigo-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {children}
  </button>
);

const ContentTab = ({ active, onClick, color = "indigo", children }) => {
  const activeColors = {
    indigo: "border-indigo-500 text-white bg-gray-800",
    purple: "border-purple-500 text-white bg-gray-800",
    amber: "border-amber-500 text-white bg-gray-800",
  };
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
        active
          ? activeColors[color]
          : "border-transparent text-gray-400 hover:text-white hover:bg-gray-800/60"
      }`}
    >
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function CoursePlayerPage() {
  const { courseId, lessonId: lessonIdParam } = useParams();
  const navigate = useNavigate();
  const role = useSelector(selectUserRole);
  const isAdmin = role === "admin";

  const [course, setCourse] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(lessonIdParam || null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );
  const [expandedSections, setExpandedSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [contentTab, setContentTab] = useState("video");
  const [streamUrl, setStreamUrl] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        // Admins hit a dedicated endpoint that bypasses approval/publish gates.
        // Students hit the normal public endpoint.
        // Admin hits /courses/preview/:courseId (protect middleware, no approval gate)
        // Student hits /courses/:slug (optionalAuth, approval gate applies)
        const courseEndpoint = isAdmin
          ? `/courses/preview/${courseId}`
          : `/courses/${courseId}`;
        const courseRes = await api.get(courseEndpoint).then((r) => r.data);
        if (!courseRes.success) {
          toast.error("Course not found");
          return;
        }
        setCourse(courseRes.course);

        const expanded = {};
        courseRes.course?.sections?.forEach((s) => {
          expanded[s._id] = true;
        });
        setExpandedSections(expanded);

        if (isAdmin) {
          // Admins bypass enrollment — just open the first lesson directly
          const first = courseRes.course?.sections?.[0]?.lessons?.[0]?._id;
          if (first) selectLessonFromCourse(first, courseRes.course);
        } else {
          const enrollRes = await fetchEnrollment(courseId).catch(() => null);
          if (enrollRes?.enrollment) {
            const done = new Set(
              enrollRes.enrollment.completedLessons?.map((cl) =>
                cl.lesson?.toString(),
              ) || [],
            );
            setCompletedLessons(done);
            const lastId = enrollRes.enrollment.lastAccessedLesson?.toString();
            const firstId = courseRes.course.sections?.[0]?.lessons?.[0]?._id;
            const target = lastId || firstId;
            if (target) selectLessonFromCourse(target, courseRes.course);
          } else {
            const first = courseRes.course?.sections?.[0]?.lessons?.[0]?._id;
            if (first) selectLessonFromCourse(first, courseRes.course);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [courseId]);

  const selectLessonFromCourse = (lessonId, courseData) => {
    for (const sec of courseData.sections || []) {
      const lesson = sec.lessons.find(
        (l) => l._id === lessonId || l._id?.toString() === lessonId?.toString(),
      );
      if (lesson) {
        setActiveLessonId(lesson._id);
        setActiveLesson(lesson);
        setActiveSection(sec);
        setStreamUrl(null);

        // Use public_id to detect video existence, not url
        if (lesson.video?.public_id) {
  setStreamLoading(true);
  const proxyUrl = `/api/courses/${courseId}/sections/${sec._id}/lessons/${lesson._id}/proxy?_cb=${Date.now()}`;
  setStreamUrl(proxyUrl);
  setStreamLoading(false);
}

        if (!lesson.video?.public_id && lesson.quiz) {
          setContentTab("quiz");
        } else if (!lesson.video?.public_id && lesson.assignment) {
          setContentTab("assignment");
        } else {
          setContentTab("video");
        }
        return;
      }
    }
  };

  /* flat list of all lessons across all sections */
  const allLessons = course?.sections?.flatMap((s) => s.lessons) || [];

  const isDone = (id) =>
    completedLessons.has(id) || completedLessons.has(id?.toString());

  /* ── Sequential lock logic ── */
  const isCourseCompleted =
    allLessons.length > 0 && completedLessons.size >= allLessons.length;

  const isUnlocked = (lessonId) => {
    if (isAdmin) return true;
    if (isCourseCompleted) return true; // course finished — all lessons open
    const idx = allLessons.findIndex(
      (l) => l._id === lessonId || l._id?.toString() === lessonId?.toString(),
    );
    if (idx <= 0) return true; // first lesson always open
    return isDone(allLessons[idx - 1]._id);
  };

  const selectLesson = (lessonId) => {
    if (!isUnlocked(lessonId)) {
      toast.error("Complete the previous lesson to unlock this one 🔒");
      return;
    }
    selectLessonFromCourse(lessonId, course);
    const basePath = isAdmin
      ? `/admin/preview/learn/${courseId}/lesson/${lessonId}`
      : `/student/learn/${courseId}/lesson/${lessonId}`;
    navigate(basePath, { replace: true });
    if (!isAdmin) updateLastAccessed(courseId, lessonId).catch(() => {});
  };

  const handleMarkComplete = async () => {
    if (isAdmin) return;
    if (!activeLessonId || completedLessons.has(activeLessonId?.toString()))
      return;
    try {
      const res = await markLessonComplete(courseId, activeLessonId);
      setCompletedLessons(
        (prev) => new Set([...prev, activeLessonId?.toString()]),
      );
      if (res.isCompleted)
        toast.success("🎉 Course complete! Certificate issued.");
      else toast.success("Lesson marked complete ✓");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark complete");
    }
  };

  const currentIdx = allLessons.findIndex(
    (l) =>
      l._id === activeLessonId ||
      l._id?.toString() === activeLessonId?.toString(),
  );
  const progress =
    allLessons.length > 0
      ? Math.round((completedLessons.size / allLessons.length) * 100)
      : 0;

  const hasQuiz = !!activeLesson?.quiz;
  const hasAssignment = !!activeLesson?.assignment;
  const hasExtras = hasQuiz || hasAssignment;

  const forceDownload = async (url, title, fileType = "pdf") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title}.${fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">Course not found.</p>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* ── Top bar ── */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 flex-shrink-0 z-10">
        <button
          onClick={() =>
            navigate(
              isAdmin ? "/admin/course-approvals" : "/student/my-courses",
            )
          }
          className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition"
        >
          <IconChevronLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {course.title}
          </p>
          {activeLesson && (
            <p className="text-xs text-gray-500 truncate">
              {activeSection?.title} · {activeLesson.title}
            </p>
          )}
        </div>

        {isAdmin && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-orange-900/40 text-orange-400 px-3 py-1 rounded-full border border-orange-800">
            <IconEye size={14} /> Admin Preview
          </span>
        )}

        {!isAdmin && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-28 bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-9 text-right">
              {progress}%
            </span>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition"
        >
          <IconMenu size={20} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ── Switchable content panel ── */}
          <div
            className="flex-shrink-0 w-full flex flex-col bg-gray-900"
            style={{ maxHeight: "62vh" }}
          >
            {/* Tab bar */}
            {activeLesson && hasExtras && (
              <div className="flex items-center bg-gray-900 border-b border-gray-800 flex-shrink-0 px-1">
                {activeLesson?.video?.url && (
                  <ContentTab
                    active={contentTab === "video"}
                    color="indigo"
                    onClick={() => setContentTab("video")}
                  >
                    <span className="flex items-center gap-1.5">
                      <IconPlay size={13} />
                      Video
                    </span>
                  </ContentTab>
                )}
                {hasQuiz && (
                  <ContentTab
                    active={contentTab === "quiz"}
                    color="purple"
                    onClick={() => setContentTab("quiz")}
                  >
                    <span className="flex items-center gap-1.5">
                      <IconQuiz size={13} />
                      Quiz
                    </span>
                  </ContentTab>
                )}
                {hasAssignment && (
                  <ContentTab
                    active={contentTab === "assignment"}
                    color="amber"
                    onClick={() => setContentTab("assignment")}
                  >
                    <span className="flex items-center gap-1.5">
                      <IconAssignment size={13} />
                      Assignment
                    </span>
                  </ContentTab>
                )}
              </div>
            )}

            {/* Video panel */}
            <div
              className={`w-full bg-black ${contentTab === "video" ? "block" : "hidden"}`}
              style={{ aspectRatio: "16/9", maxHeight: "62vh" }}
            >
              {streamLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : streamUrl ? (
                <VideoPlayer
                  key={activeLessonId}
                  src={streamUrl}
                  onEnded={handleMarkComplete}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-700">
                  <IconPlayCircle size={64} />
                  <p className="text-sm">
                    {activeLesson
                      ? "No video for this lesson"
                      : "Select a lesson to begin"}
                  </p>
                </div>
              )}
            </div>

            {/* Quiz panel */}
            {contentTab === "quiz" && hasQuiz && (
              <div
                className="w-full overflow-y-auto bg-gray-950 p-5"
                style={{ aspectRatio: "16/9", maxHeight: "62vh" }}
              >
                <QuizPanel
                  quizId={activeLesson.quiz}
                  courseId={courseId}
                  lessonId={activeLessonId}
                  onComplete={handleMarkComplete}
                />
              </div>
            )}

            {/* Assignment panel */}
            {contentTab === "assignment" && hasAssignment && (
              <div
                className="w-full overflow-y-auto bg-gray-950 p-5"
                style={{ aspectRatio: "16/9", maxHeight: "62vh" }}
              >
                <AssignmentPanel
                  assignmentId={activeLesson.assignment}
                  courseId={courseId}
                  onComplete={handleMarkComplete}
                />
              </div>
            )}
          </div>

          {/* ── Lesson info ── */}
          <div className="flex-1 overflow-y-auto bg-gray-950 p-4 lg:p-6">
            {activeLesson ? (
              <div className="max-w-2xl">
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h1 className="text-base font-bold text-white">
                      {activeLesson.title}
                    </h1>
                    {activeLesson.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {activeLesson.description}
                      </p>
                    )}
                    {hasExtras && (
                      <div className="flex gap-2 mt-2">
                        {hasQuiz && (
                          <button
                            onClick={() => setContentTab("quiz")}
                            className="text-xs bg-purple-900/40 hover:bg-purple-900/70 text-purple-400 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <IconQuiz size={12} />
                            Take Quiz
                          </button>
                        )}
                        {hasAssignment && (
                          <button
                            onClick={() => setContentTab("assignment")}
                            className="text-xs bg-amber-900/40 hover:bg-amber-900/70 text-amber-400 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <IconAssignment size={12} />
                            View Assignment
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {!isAdmin ? (
                    <button
                      onClick={handleMarkComplete}
                      disabled={isDone(activeLessonId)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                        isDone(activeLessonId)
                          ? "bg-green-900/40 text-green-400 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isDone(activeLessonId) ? (
                        <>
                          <IconCheck size={14} /> Done
                        </>
                      ) : (
                        "Mark complete"
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold bg-orange-900/30 text-orange-400 px-3 py-1.5 rounded-xl border border-orange-800/50 flex-shrink-0">
                      <IconEye size={13} /> Admin View
                    </span>
                  )}
                </div>

                {/* Notes / Materials */}
                {activeLesson.notes?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Lesson Materials
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeLesson.notes.map((note) => (
                        <button
                          key={note._id}
                          onClick={() =>
                            forceDownload(
                              note.url,
                              note.title,
                              note.fileType || "pdf",
                            )
                          }
                          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg transition"
                        >
                          <IconDownload size={15} className="text-indigo-400" />
                          {note.title}
                          <span className="text-xs text-gray-500 uppercase">
                            .{note.fileType}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prev / Next */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      const prev = allLessons[currentIdx - 1];
                      if (prev) selectLesson(prev._id);
                    }}
                    disabled={currentIdx <= 0}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <IconChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-xs text-gray-600">
                    {currentIdx + 1} / {allLessons.length}
                  </span>
                  <button
                    onClick={() => {
                      const next = allLessons[currentIdx + 1];
                      if (next) selectLesson(next._id);
                    }}
                    disabled={currentIdx >= allLessons.length - 1}
                    className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition"
                  >
                    Next
                    <IconChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <p className="text-sm">Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/60 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 340 }}
                exit={{ width: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 280 }}
                className="fixed right-0 top-0 h-full z-30 md:relative md:z-auto flex-shrink-0 border-l border-gray-800 bg-gray-900 flex flex-col overflow-hidden"
                style={{ minWidth: 0 }}
              >
                <div className="p-2.5 border-b border-gray-800 flex gap-1">
                  <SidebarTab active onClick={() => {}}>
                    Course Content
                  </SidebarTab>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {course?.sections?.map((section) => (
                    <div
                      key={section._id}
                      className="border-b border-gray-800/60"
                    >
                      <button
                        onClick={() =>
                          setExpandedSections((p) => ({
                            ...p,
                            [section._id]: !p[section._id],
                          }))
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/40 transition"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-200">
                            {section.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {section.lessons.length} lessons ·{" "}
                            {
                              section.lessons.filter((l) => isDone(l._id))
                                .length
                            }{" "}
                            done
                          </p>
                        </div>
                        <IconChevronDown
                          size={16}
                          className={`text-gray-500 transition-transform flex-shrink-0 ${
                            expandedSections[section._id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedSections[section._id] && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {section.lessons.map((lesson) => {
                              const isActive =
                                lesson._id === activeLessonId ||
                                lesson._id?.toString() ===
                                  activeLessonId?.toString();
                              const done = isDone(lesson._id);
                              const unlocked = isUnlocked(lesson._id);
                              const locked = !unlocked;

                              return (
                                <button
                                  key={lesson._id}
                                  onClick={() => selectLesson(lesson._id)}
                                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${
                                    locked
                                      ? "opacity-50 cursor-not-allowed"
                                      : isActive
                                        ? "bg-indigo-900/30 border-r-2 border-indigo-500"
                                        : "hover:bg-gray-800/50"
                                  }`}
                                >
                                  {/* Status icon */}
                                  <div className="mt-0.5 flex-shrink-0">
                                    {locked ? (
                                      /* 🔒 locked lesson */
                                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                                        <IconLock
                                          size={12}
                                          className="text-gray-500"
                                        />
                                      </div>
                                    ) : done ? (
                                      /* ✓ completed */
                                      <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center">
                                        <IconCheck
                                          size={12}
                                          className="text-green-400"
                                        />
                                      </div>
                                    ) : (
                                      /* ○ unlocked, not done */
                                      <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                          isActive
                                            ? "border-indigo-400"
                                            : "border-gray-600"
                                        }`}
                                      >
                                        {isActive && (
                                          <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Lesson info */}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm leading-snug ${
                                        locked
                                          ? "text-gray-600"
                                          : isActive
                                            ? "text-indigo-300 font-medium"
                                            : done
                                              ? "text-gray-500"
                                              : "text-gray-300"
                                      }`}
                                    >
                                      {lesson.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      {lesson.video?.public_id &&
                                        lesson.video?.duration > 0 && (
                                          <span className="text-xs text-gray-600">
                                            {fmtDuration(lesson.video.duration)}
                                          </span>
                                        )}
                                      {locked && (
                                        <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                                          <IconLock size={10} /> Locked
                                        </span>
                                      )}
                                      {lesson.quiz && !locked && (
                                        <span className="text-xs bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded">
                                          Quiz
                                        </span>
                                      )}
                                      {lesson.assignment && !locked && (
                                        <span className="text-xs bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded">
                                          Assignment
                                        </span>
                                      )}
                                      {lesson.isFreePreview && (
                                        <span className="text-xs bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded">
                                          Free
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
