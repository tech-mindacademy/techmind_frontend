import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  markLessonComplete,
  updateLastAccessed,
  fetchEnrollment,
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

// Tab button for the video area switcher
const ContentTab = ({ active, onClick, color = "indigo", children }) => {
  const activeColors = {
    indigo: "border-indigo-500 text-white bg-gray-800",
    purple: "border-purple-500 text-white bg-gray-800",
    amber: "border-amber-500  text-white bg-gray-800",
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

export default function CoursePlayerPage() {
  const { courseId, lessonId: lessonIdParam } = useParams();
  const navigate = useNavigate();

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

  // "video" | "quiz" | "assignment"
  const [contentTab, setContentTab] = useState("video");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const courseRes = await api
          .get(`/courses/${courseId}`)
          .then((r) => r.data);
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
        // Auto-switch: no video → land on quiz, then assignment, then video placeholder
        if (!lesson.video?.url && lesson.quiz) {
          setContentTab("quiz");
        } else if (!lesson.video?.url && lesson.assignment) {
          setContentTab("assignment");
        } else {
          setContentTab("video");
        }
        return;
      }
    }
  };

  const selectLesson = (lessonId) => {
    selectLessonFromCourse(lessonId, course);
    navigate(`/student/learn/${courseId}/lesson/${lessonId}`, {
      replace: true,
    });
    updateLastAccessed(courseId, lessonId).catch(() => {});
  };

  const handleMarkComplete = async () => {
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

  const allLessons = course?.sections?.flatMap((s) => s.lessons) || [];
  const currentIdx = allLessons.findIndex(
    (l) =>
      l._id === activeLessonId ||
      l._id?.toString() === activeLessonId?.toString(),
  );
  const progress =
    allLessons.length > 0
      ? Math.round((completedLessons.size / allLessons.length) * 100)
      : 0;

  const isDone = (id) =>
    completedLessons.has(id) || completedLessons.has(id?.toString());

  const hasQuiz = !!activeLesson?.quiz;
  const hasAssignment = !!activeLesson?.assignment;
  const hasExtras = hasQuiz || hasAssignment;

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
          onClick={() => navigate("/student/my-courses")}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
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
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition"
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
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ── Switchable content panel (video / quiz / assignment) ── */}
          <div
            className="flex-shrink-0 w-full flex flex-col bg-gray-900"
            style={{ maxHeight: "62vh" }}
          >
            {/* Tab bar — only rendered when lesson has quiz or assignment */}
            {activeLesson && hasExtras && (
              <div className="flex items-center bg-gray-900 border-b border-gray-800 flex-shrink-0 px-1">
                {/* Only show Video tab if lesson actually has a video */}
                {activeLesson?.video?.url && (
                  <ContentTab
                    active={contentTab === "video"}
                    color="indigo"
                    onClick={() => setContentTab("video")}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
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
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
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
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Assignment
                    </span>
                  </ContentTab>
                )}
              </div>
            )}

            {/* ── Video panel ── always kept mounted, hidden via CSS when not active
                  This prevents HLS from restarting when switching tabs back */}
            <div
              className={`w-full bg-black ${contentTab === "video" ? "block" : "hidden"}`}
              style={{ aspectRatio: "16/9", maxHeight: "62vh" }}
            >
              {activeLesson?.video?.url ? (
                <VideoPlayer
                  key={activeLesson._id}
                  src={activeLesson.video.url}
                  onEnded={handleMarkComplete}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-700">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm">
                    {activeLesson
                      ? "No video for this lesson"
                      : "Select a lesson to begin"}
                  </p>
                </div>
              )}
            </div>

            {/* ── Quiz panel ── */}
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

          {/* ── Lesson info (below the panel) ── */}
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
                    {/* Quiz / Assignment badge hints */}
                    {hasExtras && (
                      <div className="flex gap-2 mt-2">
                        {hasQuiz && (
                          <button
                            onClick={() => setContentTab("quiz")}
                            className="text-xs bg-purple-900/40 hover:bg-purple-900/70 text-purple-400 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Take Quiz
                          </button>
                        )}
                        {hasAssignment && (
                          <button
                            onClick={() => setContentTab("assignment")}
                            className="text-xs bg-amber-900/40 hover:bg-amber-900/70 text-amber-400 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View Assignment
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isDone(activeLessonId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                      isDone(activeLessonId)
                        ? "bg-green-900/40 text-green-400 cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {isDone(activeLessonId) ? "✓ Done" : "Mark complete"}
                  </button>
                </div>

                {/* Notes / Materials */}
                {activeLesson.notes?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Lesson Materials
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeLesson.notes.map((note) => (
                        <a
                          key={note._id}
                          href={note.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-2 rounded-lg transition"
                        >
                          <svg
                            className="w-4 h-4 text-indigo-400"
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
                          {note.title}
                          <span className="text-xs text-gray-500 uppercase">
                            .{note.fileType}
                          </span>
                        </a>
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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

        {/* ── Sidebar (course content list only) ── */}
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
                {/* Sidebar header */}
                <div className="p-2.5 border-b border-gray-800 flex gap-1">
                  <SidebarTab active onClick={() => {}}>
                    Course Content
                  </SidebarTab>
                </div>

                {/* Lesson list */}
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
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
                            expandedSections[section._id] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
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
                              return (
                                <button
                                  key={lesson._id}
                                  onClick={() => selectLesson(lesson._id)}
                                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${
                                    isActive
                                      ? "bg-indigo-900/30 border-r-2 border-indigo-500"
                                      : "hover:bg-gray-800/50"
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {done ? (
                                      <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-green-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                    ) : (
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
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm leading-snug ${
                                        isActive
                                          ? "text-indigo-300 font-medium"
                                          : done
                                            ? "text-gray-500"
                                            : "text-gray-300"
                                      }`}
                                    >
                                      {lesson.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      {lesson.video?.duration > 0 && (
                                        <span className="text-xs text-gray-600">
                                          {fmtDuration(lesson.video.duration)}
                                        </span>
                                      )}
                                      {lesson.quiz && (
                                        <span className="text-xs bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded">
                                          Quiz
                                        </span>
                                      )}
                                      {lesson.assignment && (
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
