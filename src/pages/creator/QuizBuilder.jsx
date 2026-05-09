import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuizByLesson, createQuiz, updateQuiz } from "../../api/services/quiz.service";
import { fetchCourseForEdit } from "../../api/services/course.service";

const EMPTY_OPTION = () => ({ text: "", isCorrect: false });
const EMPTY_QUESTION = () => ({ questionText: "", questionType: "mcq", options: [EMPTY_OPTION(), EMPTY_OPTION(), EMPTY_OPTION(), EMPTY_OPTION()], correctAnswers: [], explanation: "", points: 1 });

function QuestionCard({ q, idx, onChange, onDelete }) {
  const updateOption = (oi, field, val) => {
    const opts = q.options.map((o, i) => i === oi ? { ...o, [field]: val } : o);
    if (field === "isCorrect" && q.questionType === "true_false") {
      onChange({ ...q, options: opts.map((o, i) => ({ ...o, isCorrect: i === oi ? val : false })) });
    } else {
      onChange({ ...q, options: opts });
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-gray-500 bg-gray-700 px-2.5 py-1 rounded-lg mt-0.5 flex-shrink-0">Q{idx + 1}</span>
        <div className="flex-1 space-y-3">
          <input value={q.questionText} onChange={e => onChange({ ...q, questionText: e.target.value })}
            placeholder="Enter your question..."
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
          <div className="flex gap-3 flex-wrap">
            <select value={q.questionType} onChange={e => onChange({ ...q, questionType: e.target.value, options: e.target.value === "true_false" ? [{ text: "True", isCorrect: false }, { text: "False", isCorrect: false }] : q.options, correctAnswers: [] })}
              className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-teal-500 transition">
              <option value="mcq">Multiple Choice</option>
              <option value="true_false">True / False</option>
              <option value="short_answer">Short Answer</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Points:</span>
              <input type="number" value={q.points} min={1} onChange={e => onChange({ ...q, points: parseInt(e.target.value) || 1 })}
                className="w-16 bg-gray-700 border border-gray-600 rounded-xl px-2 py-2 text-xs text-gray-300 text-center focus:outline-none focus:border-teal-500 transition" />
            </div>
          </div>
        </div>
        <button onClick={onDelete} className="text-gray-600 hover:text-red-400 transition flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>

      {/* MCQ / True-False options */}
      {(q.questionType === "mcq" || q.questionType === "true_false") && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Options (check correct answer{q.questionType === "mcq" ? "s" : ""})</p>
          {q.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input type={q.questionType === "true_false" ? "radio" : "checkbox"} checked={opt.isCorrect}
                onChange={e => updateOption(oi, "isCorrect", e.target.checked)}
                className="w-4 h-4 accent-teal-500 flex-shrink-0" />
              <input value={opt.text} onChange={e => updateOption(oi, "text", e.target.value)}
                placeholder={q.questionType === "true_false" ? opt.text : `Option ${oi + 1}...`}
                disabled={q.questionType === "true_false"}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-teal-500 disabled:opacity-60 transition" />
              {q.questionType === "mcq" && q.options.length > 2 && (
                <button onClick={() => onChange({ ...q, options: q.options.filter((_, i) => i !== oi) })} className="text-gray-600 hover:text-red-400 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          ))}
          {q.questionType === "mcq" && q.options.length < 6 && (
            <button onClick={() => onChange({ ...q, options: [...q.options, EMPTY_OPTION()] })}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add option
            </button>
          )}
        </div>
      )}

      {/* Short answer */}
      {q.questionType === "short_answer" && (
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Accepted answers (comma separated, case-insensitive)</p>
          <input value={q.correctAnswers?.join(", ") || ""} onChange={e => onChange({ ...q, correctAnswers: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="e.g. React, react.js, ReactJS"
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
        </div>
      )}

      {/* Explanation */}
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Explanation (shown after answer)</p>
        <textarea value={q.explanation || ""} onChange={e => onChange({ ...q, explanation: e.target.value })} rows={2} placeholder="Why is this the correct answer? (optional)"
          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none transition" />
      </div>
    </div>
  );
}

export default function QuizBuilder() {
  const { courseId, lessonId } = useParams();
  const [existing, setExisting] = useState(null);
  const [title, setTitle] = useState("Lesson Quiz");
  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
  const [settings, setSettings] = useState({ timeLimit: 0, passMark: 70, maxAttempts: 3, shuffleQuestions: false, showAnswersAfter: "immediately" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getQuizByLesson(lessonId).then(d => {
      setExisting(d.quiz);
      setTitle(d.quiz.title);
      setQuestions(d.quiz.questions?.length ? d.quiz.questions : [EMPTY_QUESTION()]);
      setSettings({ timeLimit: d.quiz.timeLimit, passMark: d.quiz.passMark, maxAttempts: d.quiz.maxAttempts, shuffleQuestions: d.quiz.shuffleQuestions, showAnswersAfter: d.quiz.showAnswersAfter });
    }).catch(() => {});
  }, [lessonId]);

  const handleSave = async () => {
    if (!questions.every(q => q.questionText.trim())) { toast.error("All questions must have text"); return; }
    for (const q of questions) {
      if (q.questionType !== "short_answer" && !q.options.some(o => o.isCorrect)) {
        toast.error(`Question "${q.questionText}" needs at least one correct answer`); return;
      }
    }
    setIsSaving(true);
    try {
      const payload = { courseId, lessonId, title, questions, ...settings };
      if (existing) { await updateQuiz(existing._id, payload); toast.success("Quiz updated ✓"); }
      else { await createQuiz(payload); toast.success("Quiz created ✓"); }
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
    finally { setIsSaving(false); }
  };

  const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to={`/creator/courses/${courseId}/lessons/${lessonId}`} className="text-gray-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-xl font-bold text-white flex-1">{existing ? "Edit Quiz" : "Create Quiz"}</h1>
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg">{questions.length} questions · {totalPoints} pts</span>
        <button onClick={handleSave} disabled={isSaving}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
          {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Save Quiz"}
        </button>
      </div>

      {/* Quiz title + settings */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz title"
          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-base font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Time limit (min)", key: "timeLimit", type: "number", hint: "0 = no limit" },
            { label: "Pass mark (%)", key: "passMark", type: "number" },
            { label: "Max attempts", key: "maxAttempts", type: "number", hint: "0 = unlimited" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
              <input type={f.type} value={settings[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: parseInt(e.target.value) || 0 }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-200 text-center focus:outline-none focus:border-teal-500 transition" />
              {f.hint && <p className="text-xs text-gray-600 mt-0.5">{f.hint}</p>}
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Show answers</label>
            <select value={settings.showAnswersAfter} onChange={e => setSettings(p => ({ ...p, showAnswersAfter: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-2 py-2 text-xs text-gray-300 focus:outline-none focus:border-teal-500 transition">
              <option value="immediately">Immediately</option>
              <option value="after_pass">After passing</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.shuffleQuestions} onChange={e => setSettings(p => ({ ...p, shuffleQuestions: e.target.checked }))} className="accent-teal-500" />
          <span className="text-sm text-gray-300">Shuffle question order</span>
        </label>
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <QuestionCard key={i} q={q} idx={i}
          onChange={updated => setQuestions(qs => qs.map((x, j) => j === i ? updated : x))}
          onDelete={() => questions.length > 1 && setQuestions(qs => qs.filter((_, j) => j !== i))} />
      ))}

      <button onClick={() => setQuestions(qs => [...qs, EMPTY_QUESTION()])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-teal-500 text-gray-500 hover:text-teal-400 rounded-2xl py-4 text-sm transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
        Add question
      </button>
    </div>
  );
}
