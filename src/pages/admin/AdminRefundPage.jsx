import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getAllRefunds,
  resolveRefund,
  getRefundStats,
} from "../../api/services/refund.service";

const STATUS_STYLES = {
  pending: {
    pill: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  approved: {
    pill: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
  rejected: {
    pill: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
};

function ResolveModal({ refund, onClose, onResolved }) {
  const [action, setAction] = useState("approve");
  const [adminNote, setAdminNote] = useState("");
  const [refundAmount, setRefundAmount] = useState(refund.amountPaid || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await resolveRefund(refund._id, {
        action,
        adminNote,
        ...(action === "approve" ? { refundAmount: Number(refundAmount) } : {}),
      });
      toast.success(
        `Refund ${action === "approve" ? "approved" : "rejected"}.`,
      );
      onResolved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Resolve Refund Request
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
              {refund.course?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Student info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Student</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {refund.student?.name}
            </p>
            <p className="text-xs text-gray-500">{refund.student?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Amount Paid</p>
            <p className="font-semibold text-gray-800 dark:text-white text-base">
              ₹{refund.amountPaid?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Progress at Request</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {refund.progressPercentAtRequest}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
            <p className="font-medium text-gray-800 dark:text-white capitalize">
              {refund.paymentMethod || "—"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mb-0.5">Student's Reason</p>
            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
              {refund.reason}
            </p>
          </div>
        </div>

        {/* Action selector */}
        <div className="flex gap-3 mb-4">
          {["approve", "reject"].map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                action === a
                  ? a === "approve"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-red-600 text-white border-red-600"
                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {a === "approve" ? "✓ Approve" : "✗ Reject"}
            </button>
          ))}
        </div>

        {/* Refund amount (only for approve) */}
        {action === "approve" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Refund Amount (₹)
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) =>
                setRefundAmount(
                  Math.min(Number(e.target.value), refund.amountPaid),
                )
              }
              min={0}
              max={refund.amountPaid}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Max: ₹{refund.amountPaid?.toLocaleString()}. Reduce for a partial
              refund.
            </p>
          </div>
        )}

        {/* Admin note */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Note to Student{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder={
              action === "approve"
                ? "e.g. Refund approved. Amount will be credited in 5–7 business days."
                : "e.g. Refund rejected because progress exceeds the eligible threshold."
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition flex items-center justify-center gap-2 disabled:opacity-50 ${
              action === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {action === "approve" ? "Approve Refund" : "Reject Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRefundPage() {
  const [refunds, setRefunds] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // refund being resolved
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const load = useCallback(
    (page = 1) => {
      setLoading(true);
      Promise.all([
        getAllRefunds({ status: statusFilter || undefined, page, limit: 15 }),
        getRefundStats(),
      ])
        .then(([refundData, statsData]) => {
          setRefunds(Array.isArray(refundData) ? refundData : refundData?.refunds || []);
          setPagination(
            refundData?.pagination || {
              page: 1,
              pages: 1,
              total: 0,
            },
          );
          setStats(statsData?.stats);
        })
        .catch(() => toast.error("Failed to load refunds"))
        .finally(() => setLoading(false));
    },
    [statusFilter],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const filters = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Refund Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and resolve student refund requests.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Pending",
                value: stats.pending,
                color: "text-amber-500",
              },
              {
                label: "Approved",
                value: stats.approved,
                color: "text-green-500",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                color: "text-red-500",
              },
              {
                label: "Total Refunded",
                value: `₹${stats.totalRefunded?.toLocaleString()}`,
                color: "text-indigo-500",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-1 mb-6 w-fit">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                statusFilter === f.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : refunds.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-500">No {statusFilter} refund requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {refunds.map((refund) => {
              const s = STATUS_STYLES[refund.status] || STATUS_STYLES.pending;
              return (
                <div
                  key={refund._id}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Course thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                      {refund.course?.thumbnail?.url ? (
                        <img
                          src={refund.course.thumbnail.url}
                          alt={refund.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          📚
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {refund.course?.title || "Course"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {refund.student?.avatar?.url ? (
                              <img
                                src={refund.student.avatar.url}
                                className="w-4 h-4 rounded-full"
                                alt=""
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600">
                                {refund.student?.name?.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-gray-500">
                              {refund.student?.name} · {refund.student?.email}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${s.pill}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {(refund.status || "pending").charAt(0).toUpperCase() + (refund.status || "pending").slice(1)}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>
                          Paid:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            ₹{refund.amountPaid?.toLocaleString()}
                          </span>
                        </span>
                        <span>
                          Progress:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {refund.progressPercentAtRequest}%
                          </span>
                        </span>
                        <span>
                          Method:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">
                            {refund.paymentMethod}
                          </span>
                        </span>
                        <span>
                          Requested:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {new Date(refund.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-1.5">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          Reason:{" "}
                        </span>
                        {refund.reason}
                      </p>

                      {refund.adminNote && (
                        <p
                          className={`mt-1.5 text-xs rounded-lg px-3 py-1.5 ${
                            refund.status === "approved"
                              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <span className="font-medium">Admin note: </span>
                          {refund.adminNote}
                        </p>
                      )}
                    </div>

                    {/* Resolve button */}
                    {refund.status === "pending" && (
                      <button
                        onClick={() => setSelected(refund)}
                        className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6 text-sm">
            <p className="text-gray-500">{pagination.total} total requests</p>
            <div className="flex gap-2">
              <button
                onClick={() => load(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-gray-500 text-xs">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => load(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resolve modal */}
      {selected && (
        <ResolveModal
          refund={selected}
          onClose={() => setSelected(null)}
          onResolved={() => {
            setSelected(null);
            load(pagination.page);
          }}
        />
      )}
    </div>
  );
}
