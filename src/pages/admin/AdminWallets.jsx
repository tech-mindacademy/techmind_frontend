import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchAllWallets, fetchPendingWithdrawals, completeWithdrawal } from "../../api/services/wallet.service";

const fmt = (n) => (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminWallets() {
  const [tab, setTab] = useState("withdrawals");
  const [wallets, setWallets] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [totalHeld, setTotalHeld] = useState(0);

  const loadWithdrawals = () => {
    setIsLoading(true);
    fetchPendingWithdrawals()
      .then(d => setWithdrawals(d.withdrawals || []))
      .catch(() => toast.error("Failed to load withdrawals"))
      .finally(() => setIsLoading(false));
  };

  const loadWallets = () => {
    setIsLoading(true);
    fetchAllWallets({ limit: 50 })
      .then(d => { setWallets(d.wallets || []); setTotalHeld(d.totalHeld || 0); })
      .catch(() => toast.error("Failed to load wallets"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (tab === "withdrawals") loadWithdrawals();
    else loadWallets();
  }, [tab]);

  const handleComplete = async (walletId, transactionId, userName, amount) => {
    if (!confirm(`Mark ₹${fmt(amount)} withdrawal for ${userName} as completed?`)) return;
    setProcessingId(transactionId);
    try {
      await completeWithdrawal(walletId, transactionId);
      toast.success("Withdrawal marked as completed");
      loadWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setProcessingId(null); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Wallet Management</h1>
        <p className="text-slate-400 text-sm mt-1">Manage creator earnings and withdrawal requests.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["withdrawals", "all wallets"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition capitalize ${tab === t ? "bg-orange-600 text-white" : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500"}`}>
            {t}
            {t === "withdrawals" && withdrawals.length > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {withdrawals.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === "withdrawals" ? (
        withdrawals.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-slate-400">No pending withdrawal requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.transactionId} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 flex-shrink-0">
                  {w.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{w.userName}</p>
                  <p className="text-xs text-slate-400">{w.userEmail}</p>
                  <p className="text-xs text-slate-500 mt-1">{w.description}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Requested {new Date(w.requestedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-orange-400">₹{fmt(w.amount)}</p>
                  <p className="text-xs text-slate-500">{w.withdrawalId}</p>
                </div>
                <button
                  onClick={() => handleComplete(w.walletId, w.transactionId, w.userName, w.amount)}
                  disabled={processingId === w.transactionId}
                  className="px-4 py-2.5 bg-green-900/40 hover:bg-green-900/70 disabled:opacity-50 border border-green-800 text-green-400 text-sm font-semibold rounded-xl transition flex items-center gap-2"
                >
                  {processingId === w.transactionId
                    ? <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    : "Mark Completed"}
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="text-sm font-semibold text-white">Total funds held across all wallets</p>
              <p className="text-xl font-bold text-teal-400">₹{fmt(totalHeld)}</p>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {["Creator", "Balance", "Total Earned", "Total Withdrawn"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {wallets.map(w => (
                    <tr key={w._id} className="hover:bg-slate-700/30 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{w.user?.name}</p>
                        <p className="text-xs text-slate-500">{w.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-teal-400">₹{fmt(w.balance)}</td>
                      <td className="px-4 py-3 text-green-400">₹{fmt(w.totalEarned)}</td>
                      <td className="px-4 py-3 text-orange-400">₹{fmt(w.totalWithdrawn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
