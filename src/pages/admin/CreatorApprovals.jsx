import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchCreatorRequests,
  approveCreator,
  rejectCreator,
  fetchUsers,
  changeUserRole,
} from "../../api/services/admin.service";

const STATUS_TABS = ["pending", "approved", "rejected"];

const statusStyle = {
  approved: "bg-green-900/40 text-green-400 border border-green-800",
  rejected:  "bg-red-900/40 text-red-400 border border-red-800",
  pending:   "bg-yellow-900/40 text-yellow-400 border border-yellow-800",
};

export default function CreatorApprovals() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [requests, setRequests]         = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [actionId, setActionId]         = useState(null);

  // Direct promote modal
  const [showPromote, setShowPromote]   = useState(false);
  const [allUsers, setAllUsers]         = useState([]);
  const [userSearch, setUserSearch]     = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // ── Load creator requests ──────────────────────────────────────────────────
  const load = useCallback(async (status) => {
    setIsLoading(true);
    try {
      const data = await fetchCreatorRequests(status);
      setRequests(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load requests");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(statusFilter); }, [statusFilter, load]);

  // ── Approve / Reject ───────────────────────────────────────────────────────
  const handleApprove = async (userId, name) => {
    setActionId(userId);
    try {
      await approveCreator(userId);
      toast.success(`${name} approved as creator ✓`);
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally { setActionId(null); }
  };

  const handleReject = async (userId, name) => {
    setActionId(userId);
    try {
      await rejectCreator(userId);
      toast.success(`${name}'s request rejected`);
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally { setActionId(null); }
  };

  // ── Direct promote any user ───────────────────────────────────────────────
  const loadUsers = async (search = "") => {
    setUsersLoading(true);
    try {
      const data = await fetchUsers({ search, role: "student", limit: 20 });
      setAllUsers(data.users || []);
    } catch { setAllUsers([]); }
    finally { setUsersLoading(false); }
  };

  const handlePromote = async (userId, name) => {
    setActionId(userId);
    try {
      await changeUserRole(userId, "creator");
      toast.success(`${name} promoted to creator ✓`);
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      // Refresh the approved list if on that tab
      if (statusFilter === "approved") load("approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Promotion failed");
    } finally { setActionId(null); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Approvals</h1>
          <p className="text-slate-400 text-sm mt-1">
            Users who registered as creators appear here as pending.
          </p>
        </div>
        <button
          onClick={() => { setShowPromote(true); loadUsers(); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Promote a user
        </button>
      </motion.div>

      {/* Info banner */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-400 flex items-start gap-3">
        <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>
          Users who sign up with the <strong className="text-white">Creator</strong> role
          automatically appear here as <strong className="text-yellow-400">pending</strong>.
          You can also manually promote any student using the button above.
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition capitalize ${
              statusFilter === s
                ? "bg-orange-600 text-white"
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-slate-700 rounded-xl" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-14 text-center">
          <div className="text-5xl mb-4">
            {statusFilter === "pending" ? "📬" : statusFilter === "approved" ? "✅" : "❌"}
          </div>
          <p className="text-slate-300 font-semibold mb-2">
            No {statusFilter} creator requests
          </p>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            {statusFilter === "pending"
              ? "When users register with the Creator role, they'll appear here for approval."
              : `No ${statusFilter} requests to show.`}
          </p>
          {statusFilter === "pending" && (
            <button
              onClick={() => { setShowPromote(true); loadUsers(); }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Manually promote a user →
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {requests.map((user) => (
              <motion.div key={user._id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                  {statusFilter !== "pending" && (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusStyle[user.creatorRequestStatus] || statusStyle.pending}`}>
                      {user.creatorRequestStatus}
                    </span>
                  )}
                </div>

                {statusFilter === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(user._id, user.name)}
                      disabled={actionId === user._id}
                      className="flex-1 py-2.5 bg-green-900/40 hover:bg-green-900/70 disabled:opacity-50 border border-green-800 text-green-400 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5">
                      {actionId === user._id
                        ? <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Approve</>}
                    </button>
                    <button onClick={() => handleReject(user._id, user.name)}
                      disabled={actionId === user._id}
                      className="flex-1 py-2.5 bg-red-900/20 hover:bg-red-900/50 disabled:opacity-50 border border-red-900 text-red-400 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5">
                      {actionId === user._id
                        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>Reject</>}
                    </button>
                  </div>
                )}

                {statusFilter !== "pending" && (
                  <div className={`text-center py-2 rounded-xl text-xs font-semibold capitalize ${statusStyle[user.creatorRequestStatus] || statusStyle.pending}`}>
                    {user.creatorRequestStatus}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Direct promote modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showPromote && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPromote(false)}
              className="fixed inset-0 bg-black/60 z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md pointer-events-auto shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Promote user to Creator</h3>
                  <button onClick={() => setShowPromote(false)} className="text-slate-500 hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Search for any student and directly grant them creator access. This bypasses the approval request flow.
                </p>

                <input
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); loadUsers(e.target.value); }}
                  placeholder="Search by name or email..."
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition mb-3"
                />

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {usersLoading ? (
                    <div className="py-6 text-center">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : allUsers.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-6">No students found.</p>
                  ) : (
                    allUsers.map((user) => (
                      <div key={user._id} className="flex items-center gap-3 bg-slate-800 rounded-xl px-3 py-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handlePromote(user._id, user.name)}
                          disabled={actionId === user._id}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition flex-shrink-0 flex items-center gap-1">
                          {actionId === user._id
                            ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : "Promote"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
