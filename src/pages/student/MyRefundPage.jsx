import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyRefunds, cancelRefund } from "../../api/services/refund.service";

const STATUS_STYLES = {
  pending:  { pill: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",  dot: "bg-amber-500",  label: "Pending" },
  approved: { pill: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",  dot: "bg-green-500",  label: "Approved" },
  rejected: { pill: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",           dot: "bg-red-500",    label: "Rejected" },
};

export default function MyRefundPage() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    setLoading(true);
    getMyRefunds()
      .then((d) => setRefunds(Array.isArray(d) ? d : d?.refunds || []))
      .catch(() => toast.error("Failed to load refunds"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (refundId) => {
    if (!window.confirm("Cancel this refund request?")) return;
    setCancelling(refundId);
    try {
      await cancelRefund(refundId);
      toast.success("Refund request cancelled.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel.");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Refund Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Track the status of your refund requests.</p>
        </div>

        {refunds.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">💸</div>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">No refund requests</p>
            <p className="text-sm text-gray-400">You haven't requested any refunds yet.</p>
            <Link to="/courses" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">Browse courses →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {refunds.map((refund) => {
              const s = STATUS_STYLES[refund.status];
              return (
                <div key={refund._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <div className="flex items-start gap-4">
                    {/* Course thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                      {refund.course?.thumbnail?.url ? (
                        <img src={refund.course.thumbnail.url} alt={refund.course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{refund.course?.title || "Course"}</p>
                        {/* Status pill */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${s.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>Amount: <span className="font-medium text-gray-700 dark:text-gray-300">₹{refund.amountPaid?.toLocaleString()}</span></span>
                        <span>Progress at request: <span className="font-medium text-gray-700 dark:text-gray-300">{refund.progressPercentAtRequest}%</span></span>
                        <span>Submitted: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(refund.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                      </div>

                      {/* Reason */}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 line-clamp-2">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Reason: </span>{refund.reason}
                      </p>

                      {/* Admin note (approved/rejected) */}
                      {refund.adminNote && (
                        <div className={`mt-2 text-xs rounded-lg px-3 py-2 ${
                          refund.status === "approved"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}>
                          <span className="font-medium">Admin note: </span>{refund.adminNote}
                        </div>
                      )}

                      {refund.status === "approved" && (
                        <div className="mt-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg px-3 py-2">
                          ✓ Refund of <strong>₹{refund.refundAmount?.toLocaleString()}</strong> approved on {new Date(refund.resolvedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. Please allow 5–10 business days for the amount to reflect.
                        </div>
                      )}

                      {/* Cancel action */}
                      {refund.status === "pending" && (
                        <button
                          onClick={() => handleCancel(refund._id)}
                          disabled={cancelling === refund._id}
                          className="mt-3 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition disabled:opacity-50"
                        >
                          {cancelling === refund._id ? "Cancelling..." : "Cancel request"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}