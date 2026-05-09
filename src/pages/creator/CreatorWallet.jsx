import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { fetchMyWallet, requestWithdrawal } from "../../api/services/wallet.service";

const txIcon = { credit: "💰", withdrawal: "📤", debit: "📉", refund_deduction: "↩️" };
const txColor = {
  credit: "text-green-400",
  withdrawal: "text-orange-400",
  debit: "text-red-400",
  refund_deduction: "text-yellow-400",
};
const fmt = (n) => (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CreatorWallet() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [form, setForm] = useState({ amount: "", upiId: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchMyWallet()
      .then(d => setWallet(d.wallet))
      .catch(() => toast.error("Failed to load wallet"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleWithdraw = async () => {
    const amount = Number(form.amount);
    if (!amount || amount < 100) { toast.error("Minimum withdrawal is ₹100"); return; }
    if (!form.upiId.trim()) { toast.error("UPI ID is required"); return; }
    setIsSubmitting(true);
    try {
      const res = await requestWithdrawal(amount, form.upiId.trim(), form.note);
      toast.success(res.message);
      setShowWithdraw(false);
      setForm({ amount: "", upiId: "", note: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Track earnings and request withdrawals.</p>
      </motion.div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Available Balance", value: `₹${fmt(wallet?.balance)}`, color: "from-teal-600 to-cyan-600", icon: "💳" },
          { label: "Total Earned", value: `₹${fmt(wallet?.totalEarned)}`, color: "from-indigo-600 to-violet-600", icon: "📈" },
          { label: "Total Withdrawn", value: `₹${fmt(wallet?.totalWithdrawn)}`, color: "from-orange-600 to-amber-600", icon: "📤" },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Withdraw button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
        <button
          onClick={() => setShowWithdraw(true)}
          disabled={!wallet?.balance || wallet.balance < 100}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Withdraw
        </button>
      </div>

      {/* Transaction list */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        {!wallet?.recentTransactions?.length ? (
          <div className="p-10 text-center text-gray-500 text-sm">No transactions yet.</div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {wallet.recentTransactions.map((txn, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-700/30 transition">
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                  {txIcon[txn.type] || "💱"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{txn.description || txn.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {txn.status === "pending" && <span className="ml-2 text-yellow-400">(Pending)</span>}
                  </p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${txColor[txn.type] || "text-white"}`}>
                  {txn.type === "credit" ? "+" : "-"}₹{fmt(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Request Withdrawal</h3>
              <button onClick={() => setShowWithdraw(false)} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4 bg-gray-800 rounded-xl px-3 py-2.5">
              Available balance: <span className="text-teal-400 font-bold">₹{fmt(wallet?.balance)}</span>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                <input type="number" value={form.amount} min={100} max={wallet?.balance}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="Minimum ₹100"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">UPI ID *</label>
                <input type="text" value={form.upiId}
                  onChange={e => setForm(p => ({ ...p, upiId: e.target.value }))}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Note (optional)</label>
                <input type="text" value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="Any notes for admin"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 mb-4">
              ⏱ Withdrawals are processed within 2–3 business days. Admin will send the amount to your UPI ID.
            </p>

            <div className="flex gap-2">
              <button onClick={handleWithdraw} disabled={isSubmitting}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                {isSubmitting
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing...</>
                  : "Submit Request"}
              </button>
              <button onClick={() => setShowWithdraw(false)}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-xl transition">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
