import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const TYPE_COLORS = {
  course: "bg-blue-900/40 text-blue-400",
  platform: "bg-purple-900/40 text-purple-400",
  internship: "bg-teal-900/40 text-teal-400",
};

export default function ReviewApprovalsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/reviews/admin/pending")
      .then((r) => setReviews(r.data.reviews))
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setIsLoading(false));
  }, []);

  const handle = async (id, approved) => {
    try {
      await api.patch(`/reviews/${id}/approve`, { approved });
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success(approved ? "Review approved!" : "Review rejected.");
    } catch {
      toast.error("Action failed");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Review Approvals</h1>
        <p className="text-gray-400 text-sm mt-1">
          {reviews.length} pending review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-400 text-sm">All caught up — no pending reviews.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {review.user?.avatar?.url ? (
                    <img src={review.user.avatar.url} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                      {review.user?.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{review.user?.name}</p>
                    <p className="text-xs text-gray-500">{review.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[review.reviewType]}`}>
                    {review.reviewType}
                  </span>
                  <span className="text-yellow-400 text-sm">{"★".repeat(review.rating)}</span>
                </div>
              </div>

              {/* Content */}
              <p className="font-semibold text-white text-sm">{review.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{review.body}</p>
              {review.course && (
                <p className="text-xs text-indigo-400">Course: {review.course.title}</p>
              )}
              {review.internshipCompany && (
                <p className="text-xs text-teal-400">Company: {review.internshipCompany}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handle(review._id, true)}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handle(review._id, false)}
                  className="flex-1 py-2 bg-red-600/80 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}