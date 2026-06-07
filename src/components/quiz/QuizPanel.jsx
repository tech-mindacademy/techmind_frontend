import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  startQuizAttempt,
  submitQuizAttempt,
  getMyAttempts,
} from "../../api/services/quiz.service";

// ─── Timer ────────────────────────────────────────────────────────────────────
const Timer = ({ seconds, onExpire }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (seconds === 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds, onExpire]);

  if (seconds === 0) return null;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isWarning = remaining < 60;

  return (
    <div
      className={`flex items-center gap-1.5 text-sm font-mono font-semibold px-3 py-1 rounded-lg ${
        isWarning
          ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      }`}
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {m}:{String(s).padStart(2, "0")}
    </div>
  );
};

// ─── Question component ───────────────────────────────────────────────────────
const Question = ({ question, index, total, answer, onChange }) => {
  const selected = answer?.selectedOptions || [];
  const text = answer?.textAnswer || "";

  const toggleOption = (optId) => {
    if (question.questionType === "true_false") {
      onChange({ selectedOptions: [optId], textAnswer: "" });
    } else {
      // MCQ — allow multi-select only if multiple correct (single for now)
      onChange({ selectedOptions: [optId], textAnswer: "" });
    }
  };

  return (
    <motion.div
      key={question._id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
          {question.questionText}
          <span className="ml-2 text-xs text-gray-400 font-normal">
            ({question.points} pt{question.points !== 1 ? "s" : ""})
          </span>
        </p>
      </div>

      {question.questionType === "short_answer" ? (
        <input
          type="text"
          value={text}
          onChange={(e) =>
            onChange({ selectedOptions: [], textAnswer: e.target.value })
          }
          placeholder="Type your answer..."
          className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt._id);
            return (
              <button
                key={opt._id}
                type="button"
                onClick={() => toggleOption(opt._id)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ─── Result view ──────────────────────────────────────────────────────────────
const ResultView = ({ result, questions, onRetry, attemptsRemaining }) => {
  const [expandedQ, setExpandedQ] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Score card */}
      <div
        className={`rounded-2xl p-5 text-center ${
          result.passed
            ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
        }`}
      >
        <div className="text-4xl mb-2">{result.passed ? "🎉" : "📚"}</div>
        <p
          className={`text-3xl font-bold mb-1 ${result.passed ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-400"}`}
        >
          {result.scorePercent}%
        </p>
        <p
          className={`text-sm font-medium ${result.passed ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
        >
          {result.passed ? "Passed!" : `Need ${result.passMark}% to pass`}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {result.earnedPoints} / {result.totalPoints} points
        </p>
      </div>

      {/* Answer review */}
      {questions && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Answer Review
          </p>
          {questions.map((q, i) => (
            <div
              key={q._id}
              className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    q.studentAnswer?.isCorrect
                      ? "bg-green-100 dark:bg-green-900 text-green-600"
                      : "bg-red-100 dark:bg-red-900 text-red-500"
                  }`}
                >
                  {q.studentAnswer?.isCorrect ? "✓" : "✗"}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 truncate">
                  {q.questionText}
                </span>
                <span className="text-xs text-gray-400">
                  {q.studentAnswer?.pointsEarned}/{q.points}pt
                </span>
              </button>

              <AnimatePresence>
                {expandedQ === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2 bg-gray-50 dark:bg-gray-900">
                      {q.options?.map((opt) => (
                        <div
                          key={opt._id}
                          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                            opt.isCorrect
                              ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                              : q.studentAnswer?.selectedOptions?.includes(
                                    opt._id,
                                  )
                                ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                                : "text-gray-500"
                          }`}
                        >
                          {opt.isCorrect
                            ? "✓"
                            : q.studentAnswer?.selectedOptions?.includes(
                                  opt._id,
                                )
                              ? "✗"
                              : "○"}{" "}
                          {opt.text}
                        </div>
                      ))}
                      {q.explanation && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 italic">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Retry */}
      {!result.passed && attemptsRemaining !== 0 && (
        <button
          onClick={onRetry}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          Try again{" "}
          {attemptsRemaining !== "unlimited" && `(${attemptsRemaining} left)`}
        </button>
      )}
    </motion.div>
  );
};

// ─── Main QuizPanel ───────────────────────────────────────────────────────────
export default function QuizPanel({ quizId, onComplete }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | taking | submitting | result | error
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0); // in minutes, from startAttempt response
  const [answers, setAnswers] = useState({}); // { [questionId]: { selectedOptions, textAnswer } }
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [resultQuestions, setResultQuestions] = useState(null);
  const [myAttempts, setMyAttempts] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Load attempt history on mount
  useEffect(() => {
    if (!quizId) return;
    getMyAttempts(quizId)
      .then((data) => {
        setMyAttempts(data);
        setQuiz(data.quiz);
      })
      .catch(() => {});
  }, [quizId]);

  const handleStart = async () => {
    setPhase("loading");
    try {
      const data = await startQuizAttempt(quizId);
      setAttempt(data.attempt);
      setQuestions(data.questions);
      setTimeLimit(data.timeLimit || 0); // minutes from server
      setAnswers({});
      setCurrentQ(0);
      setStartTime(Date.now());
      setPhase("taking");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start quiz");
      setPhase("idle");
    }
  };

  const handleAnswer = useCallback((qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const handleSubmit = async () => {
    setPhase("submitting");
    const formatted = questions.map((q) => ({
      questionId: q._id,
      selectedOptions: answers[q._id]?.selectedOptions || [],
      textAnswer: answers[q._id]?.textAnswer || "",
    }));
    const timeTakenSeconds = startTime
      ? Math.round((Date.now() - startTime) / 1000)
      : 0;

    try {
      const data = await submitQuizAttempt(quizId, {
        attemptId: attempt._id,
        answers: formatted,
        timeTakenSeconds,
      });
      setResult(data.result);
      setResultQuestions(data.questions);
      setPhase("result");
      if (data.result?.passed && onComplete) onComplete(); // ← add
      getMyAttempts(quizId)
        .then((d) => setMyAttempts(d))
        .catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
      setPhase("taking");
    }
  };

  const handleTimeExpire = () => {
    toast("⏰ Time's up! Submitting your answers...", { icon: "⏰" });
    handleSubmit();
  };

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k]?.selectedOptions?.length > 0 || answers[k]?.textAnswer,
  ).length;
  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  // ── Idle state ──────────────────────────────────────────────────────────────
  if (phase === "idle" || phase === "loading") {
    const hasPassed = myAttempts?.hasPassed;
    const attemptsUsed = myAttempts?.attemptsUsed || 0;
    const maxAttempts = myAttempts?.quiz?.maxAttempts || 3;
    const noAttemptsLeft = maxAttempts > 0 && attemptsUsed >= maxAttempts;

    return (
      <div className="space-y-4">
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">❓</span>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {myAttempts?.quiz?.title || "Quiz"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            {myAttempts?.quiz?.passMark && (
              <span>Pass mark: {myAttempts.quiz.passMark}%</span>
            )}
            {maxAttempts > 0 && (
              <span>
                Attempts: {attemptsUsed}/{maxAttempts}
              </span>
            )}
            {myAttempts?.bestScore == null || (
              <span>Best score: {myAttempts.bestScore}%</span>
            )}
          </div>
        </div>

        {hasPassed && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-xl px-3 py-2">
            <span>✅</span> You have already passed this quiz!
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={phase === "loading" || noAttemptsLeft}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          {phase === "loading" ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Starting...
            </>
          ) : noAttemptsLeft ? (
            "No attempts remaining"
          ) : hasPassed ? (
            "Retake quiz"
          ) : (
            "Start quiz"
          )}
        </button>
      </div>
    );
  }

  // ── Taking state ─────────────────────────────────────────────────────────────
  if (phase === "taking") {
    const q = questions[currentQ];
    const timeLimitSeconds = timeLimit * 60;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Question {currentQ + 1} of {questions.length}
          </span>
          <Timer seconds={timeLimitSeconds} onExpire={handleTimeExpire} />
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <Question
            key={q._id}
            question={q}
            index={currentQ}
            total={questions.length}
            answer={answers[q._id]}
            onChange={(val) => handleAnswer(q._id, val)}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition"
          >
            ← Back
          </button>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={phase === "submitting"}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {phase === "submitting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Grading...
                </>
              ) : (
                `Submit (${answeredCount}/${questions.length})`
              )}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {questions.map((qu, i) => {
            const hasAns =
              answers[qu._id]?.selectedOptions?.length > 0 ||
              answers[qu._id]?.textAnswer;
            return (
              <button
                key={qu._id}
                onClick={() => setCurrentQ(i)}
                className={`w-6 h-6 rounded-full text-xs font-medium transition ${
                  i === currentQ
                    ? "bg-indigo-600 text-white"
                    : hasAns
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Result state ─────────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <ResultView
        result={result}
        questions={resultQuestions}
        attemptsRemaining={myAttempts?.attemptsRemaining}
        onRetry={() => {
          setPhase("idle");
          setResult(null);
          setResultQuestions(null);
        }}
      />
    );
  }

  return null;
}
