import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchMyReviews,
  createReview,
  updateReview,
  deleteReview,
  selectMyReviews,
  selectReviewLoading,
  clearReviewError,
} from "../../store/slices/ReviewSlice";

// ─── Star Rating picker ───────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
        >
          <span
            className={
              star <= (hovered || value)
                ? "text-yellow-400"
                : "text-white/20"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Static star display ──────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="text-yellow-400 text-sm tracking-tight">
      {"★".repeat(rating)}
      <span className="text-white/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  course: {
    label: "Course",
    bg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
    icon: "🎓",
  },
  platform: {
    label: "Platform",
    bg: "bg-purple-500/15 border-purple-500/30 text-purple-300",
    icon: "🌐",
  },
  internship: {
    label: "Internship",
    bg: "bg-teal-500/15 border-teal-500/30 text-teal-300",
    icon: "💼",
  },
};

// ─── Review form ──────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  reviewType: "platform",
  course: "",
  internshipCompany: "",
  rating: 0,
  title: "",
  body: "",
};

function ReviewForm({ enrolledCourses = [], onSuccess, editing = null, onCancel }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectReviewLoading);

  const [form, setForm] = useState(
    editing
      ? {
          reviewType: editing.reviewType,
          course: editing.course?._id || "",
          internshipCompany: editing.internshipCompany || "",
          rating: editing.rating,
          title: editing.title,
          body: editing.body,
        }
      : EMPTY_FORM
  );

  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.rating) e.rating = "Please select a rating";
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.body.trim()) e.body = "Review is required";
    if (form.reviewType === "course" && !form.course) e.course = "Select a course";
    if (form.reviewType === "internship" && !form.internshipCompany.trim())
      e.internshipCompany = "Company name is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      reviewType: form.reviewType,
      rating: form.rating,
      title: form.title.trim(),
      body: form.body.trim(),
      ...(form.reviewType === "course" && { course: form.course }),
      ...(form.reviewType === "internship" && { internshipCompany: form.internshipCompany.trim() }),
    };

    const thunk = editing
      ? updateReview({ id: editing._id, ...payload })
      : createReview(payload);

    const result = await dispatch(thunk);

    if ((editing ? updateReview : createReview).fulfilled.match(result)) {
      toast.success(editing ? "Review updated!" : "Review submitted!");
      onSuccess?.();
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm placeholder:text-white/30 transition";

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Type selector — only shown on create */}
      {!editing && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Review type</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => set("reviewType", key)}
                className={`rounded-xl border p-3 text-left transition ${
                  form.reviewType === key
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{cfg.icon}</span>
                <p className="text-sm font-medium mt-1">{cfg.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Course selector */}
      {form.reviewType === "course" && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Course</label>
          <select
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
            className={inputClass + " bg-[#0c0e1a] [&>option]:bg-[#0c0e1a] [&>option]:text-gray-300"}
          >
            <option value="">Select a course…</option>
            {enrolledCourses.map((ec) => (
              <option key={ec.course._id} value={ec.course._id}>
                {ec.course.title}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="text-red-400 text-xs mt-1">{errors.course}</p>
          )}
        </div>
      )}

      {/* Internship company */}
      {form.reviewType === "internship" && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Company name</label>
          <input
            type="text"
            placeholder="e.g. Google, Infosys…"
            value={form.internshipCompany}
            onChange={(e) => set("internshipCompany", e.target.value)}
            className={inputClass}
          />
          {errors.internshipCompany && (
            <p className="text-red-400 text-xs mt-1">{errors.internshipCompany}</p>
          )}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Rating</label>
        <StarPicker value={form.rating} onChange={(v) => set("rating", v)} />
        {errors.rating && (
          <p className="text-red-400 text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Title</label>
        <input
          type="text"
          placeholder="Summarise your experience in a sentence"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          maxLength={100}
          className={inputClass}
        />
        {errors.title && (
          <p className="text-red-400 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Body */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">Your review</label>
        <textarea
          rows={4}
          placeholder="Share what you learned, what you liked or what could be improved…"
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          maxLength={1000}
          className={inputClass + " resize-none"}
        />
        <p className="text-xs text-white/30 text-right mt-1">
          {form.body.length}/1000
        </p>
        {errors.body && (
          <p className="text-red-400 text-xs mt-1">{errors.body}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-semibold text-sm transition disabled:opacity-60"
        >
          {isLoading ? "Saving…" : editing ? "Update Review" : "Submit Review"}
        </button>
        {(editing || onCancel) && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

// ─── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review, onEdit, onDelete }) {
  const cfg = TYPE_CONFIG[review.reviewType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${cfg.bg}`}
          >
            <span>{cfg.icon}</span>
            {cfg.label}
            {review.reviewType === "course" && review.course && (
              <span className="opacity-70">— {review.course.title}</span>
            )}
            {review.reviewType === "internship" && review.internshipCompany && (
              <span className="opacity-70">— {review.internshipCompany}</span>
            )}
          </span>
          <Stars rating={review.rating} />
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(review)}
            className="text-xs text-gray-400 hover:text-indigo-400 transition px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="text-xs text-gray-400 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-white/5"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="font-semibold text-sm text-white">{review.title}</p>
      <p className="text-sm text-gray-400 leading-relaxed">{review.body}</p>

      <p className="text-xs text-white/25 pt-1">
        {new Date(review.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ReviewSection({ enrolledCourses = [] }) {
  const dispatch = useDispatch();
  const reviews = useSelector(selectMyReviews);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMyReviews());
    return () => dispatch(clearReviewError());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    const result = await dispatch(deleteReview(id));
    if (deleteReview.fulfilled.match(result)) toast.success("Review deleted");
    else toast.error("Could not delete review");
  };

  const filtered =
    filter === "all" ? reviews : reviews.filter((r) => r.reviewType === filter);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">My Reviews</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Share your experience with courses, internships, and the platform
          </p>
        </div>

        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-sm font-semibold transition"
          >
            + Write a Review
          </button>
        )}
      </div>

      {/* New review form */}
      <AnimatePresence mode="wait">
        {showForm && !editing && (
          <motion.div
            key="new-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-5">
                Write a Review
              </h3>
              <ReviewForm
                enrolledCourses={enrolledCourses}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      {reviews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {["all", "course", "platform", "internship"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition border ${
                filter === tab
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                  : "border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-1.5 opacity-50">
                {tab === "all"
                  ? reviews.length
                  : reviews.filter((r) => r.reviewType === tab).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Reviews list */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 && !showForm ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-dashed border-white/10 rounded-2xl"
          >
            <p className="text-4xl mb-3">✍️</p>
            <p className="text-gray-400 text-sm">No reviews yet.</p>
            <p className="text-white/30 text-xs mt-1">
              Share your experience to help others learn better.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm transition"
            >
              Write your first review
            </button>
          </motion.div>
        ) : (
          filtered.map((review) =>
            editing?._id === review._id ? (
              <motion.div
                key={review._id + "-edit"}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/5 border border-purple-500/30 rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold text-white mb-5">
                  Edit Review
                </h3>
                <ReviewForm
                  enrolledCourses={enrolledCourses}
                  editing={editing}
                  onSuccess={handleFormSuccess}
                  onCancel={() => setEditing(null)}
                />
              </motion.div>
            ) : (
              <ReviewCard
                key={review._id}
                review={review}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            )
          )
        )}
      </AnimatePresence>
    </div>
  );
}