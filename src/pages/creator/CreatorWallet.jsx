// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { fetchMyWallet, requestWithdrawal } from "../../api/services/wallet.service";

// const txIcon = { credit: "💰", withdrawal: "📤", debit: "📉", refund_deduction: "↩️" };
// const txColor = {
//   credit: "text-green-400",
//   withdrawal: "text-orange-400",
//   debit: "text-red-400",
//   refund_deduction: "text-yellow-400",
// };
// const fmt = (n) => (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// export default function CreatorWallet() {
//   const [wallet, setWallet] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   const [form, setForm] = useState({ amount: "", upiId: "", note: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const load = () => {
//     setIsLoading(true);
//     fetchMyWallet()
//       .then(d => setWallet(d.wallet))
//       .catch(() => toast.error("Failed to load wallet"))
//       .finally(() => setIsLoading(false));
//   };

//   useEffect(() => { load(); }, []);

//   const handleWithdraw = async () => {
//     const amount = Number(form.amount);
//     if (!amount || amount < 100) { toast.error("Minimum withdrawal is ₹100"); return; }
//     if (!form.upiId.trim()) { toast.error("UPI ID is required"); return; }
//     setIsSubmitting(true);
//     try {
//       const res = await requestWithdrawal(amount, form.upiId.trim(), form.note);
//       toast.success(res.message);
//       setShowWithdraw(false);
//       setForm({ amount: "", upiId: "", note: "" });
//       load();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Withdrawal failed");
//     } finally { setIsSubmitting(false); }
//   };

//   if (isLoading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <h1 className="text-2xl font-bold text-white">My Wallet</h1>
//         <p className="text-gray-400 text-sm mt-1">Track earnings and request withdrawals.</p>
//       </motion.div>

//       {/* Balance cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         {[
//           { label: "Available Balance", value: `₹${fmt(wallet?.balance)}`, color: "from-teal-600 to-cyan-600", icon: "💳" },
//           { label: "Total Earned", value: `₹${fmt(wallet?.totalEarned)}`, color: "from-indigo-600 to-violet-600", icon: "📈" },
//           { label: "Total Withdrawn", value: `₹${fmt(wallet?.totalWithdrawn)}`, color: "from-orange-600 to-amber-600", icon: "📤" },
//         ].map((card, i) => (
//           <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
//             className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white`}>
//             <div className="text-2xl mb-2">{card.icon}</div>
//             <p className="text-2xl font-bold">{card.value}</p>
//             <p className="text-sm opacity-80 mt-0.5">{card.label}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Withdraw button */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
//         <button
//           onClick={() => setShowWithdraw(true)}
//           disabled={!wallet?.balance || wallet.balance < 100}
//           className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
//           </svg>
//           Withdraw
//         </button>
//       </div>

//       {/* Transaction list */}
//       <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
//         {!wallet?.recentTransactions?.length ? (
//           <div className="p-10 text-center text-gray-500 text-sm">No transactions yet.</div>
//         ) : (
//           <div className="divide-y divide-gray-700/50">
//             {wallet.recentTransactions.map((txn, i) => (
//               <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-700/30 transition">
//                 <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-lg flex-shrink-0">
//                   {txIcon[txn.type] || "💱"}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-white truncate">{txn.description || txn.type}</p>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
//                     {txn.status === "pending" && <span className="ml-2 text-yellow-400">(Pending)</span>}
//                   </p>
//                 </div>
//                 <p className={`text-sm font-bold flex-shrink-0 ${txColor[txn.type] || "text-white"}`}>
//                   {txn.type === "credit" ? "+" : "-"}₹{fmt(txn.amount)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Withdrawal modal */}
//       {showWithdraw && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
//             className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-base font-bold text-white">Request Withdrawal</h3>
//               <button onClick={() => setShowWithdraw(false)} className="text-gray-500 hover:text-white transition">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
//                 </svg>
//               </button>
//             </div>

//             <p className="text-xs text-gray-400 mb-4 bg-gray-800 rounded-xl px-3 py-2.5">
//               Available balance: <span className="text-teal-400 font-bold">₹{fmt(wallet?.balance)}</span>
//             </p>

//             <div className="space-y-3">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Amount (₹) *</label>
//                 <input type="number" value={form.amount} min={100} max={wallet?.balance}
//                   onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
//                   placeholder="Minimum ₹100"
//                   className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">UPI ID *</label>
//                 <input type="text" value={form.upiId}
//                   onChange={e => setForm(p => ({ ...p, upiId: e.target.value }))}
//                   placeholder="yourname@upi"
//                   className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Note (optional)</label>
//                 <input type="text" value={form.note}
//                   onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
//                   placeholder="Any notes for admin"
//                   className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition" />
//               </div>
//             </div>

//             <p className="text-xs text-gray-500 mt-3 mb-4">
//               ⏱ Withdrawals are processed within 2–3 business days. Admin will send the amount to your UPI ID.
//             </p>

//             <div className="flex gap-2">
//               <button onClick={handleWithdraw} disabled={isSubmitting}
//                 className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
//                 {isSubmitting
//                   ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing...</>
//                   : "Submit Request"}
//               </button>
//               <button onClick={() => setShowWithdraw(false)}
//                 className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-xl transition">
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowDownToLine, ArrowUpFromLine, Minus, Undo2, X, Loader2, Wallet, TrendingUp, Banknote } from "lucide-react";
import { fetchMyWallet, requestWithdrawal } from "../../api/services/wallet.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const MIN_WITHDRAWAL = 100;

const txMeta = {
  credit: { Icon: ArrowDownToLine, color: "text-emerald-700", tile: "bg-emerald-50 text-emerald-700", sign: "+" },
  withdrawal: { Icon: ArrowUpFromLine, color: "text-[#0D1B3E]", tile: "bg-[#0D1B3E]/8 text-[#0D1B3E]", sign: "-" },
  debit: { Icon: Minus, color: "text-red-600", tile: "bg-red-50 text-red-600", sign: "-" },
  refund_deduction: { Icon: Undo2, color: "text-amber-700", tile: "bg-amber-50 text-amber-700", sign: "-" },
};

const fmt = (n) =>
  (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Shorten long order ids: "Order 6a2987c0…d5b5" becomes "Order #4d5b5"
const prettyDescription = (txn) =>
  (txn.description || txn.type).replace(/Order\s+([a-f0-9]{24})/i, (_, id) => `Order #${id.slice(-6)}`);

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const inputCls =
  "w-full px-3.5 py-3 border border-[#0D1B3E]/15 rounded-lg bg-white text-black text-sm placeholder-black/35 " +
  "hover:border-[#0D1B3E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition";

function Stat({ label, value, Icon }) {
  return (
    <div className="bg-white border border-[#0D1B3E]/12 rounded-xl p-5 sm:p-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-black/60">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] mt-1.5 tabular-nums">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

export default function CreatorWallet() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [form, setForm] = useState({ amount: "", upiId: "", note: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchMyWallet()
      .then((d) => setWallet(d.wallet))
      .catch(() => toast.error("Failed to load wallet"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Close modal with Escape
  useEffect(() => {
    if (!showWithdraw) return;
    const onKey = (e) => e.key === "Escape" && !isSubmitting && setShowWithdraw(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showWithdraw, isSubmitting]);

  const handleWithdraw = async (e) => {
    e?.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount < MIN_WITHDRAWAL) { toast.error(`Minimum withdrawal is ₹${MIN_WITHDRAWAL}`); return; }
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading wallet">
        <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const canWithdraw = wallet?.balance >= MIN_WITHDRAWAL;

  return (
    <div className="space-y-8 max-w-4xl text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">My wallet</h1>
        <p className="text-black/60 text-sm mt-1.5">Track earnings and request withdrawals.</p>
      </div>

      {/* Balance */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3 lg:col-span-1 bg-[#0D1B3E] rounded-xl p-5 sm:p-6 text-white flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/65">Available balance</p>
              <p className="text-3xl font-bold mt-1.5 tabular-nums">₹{fmt(wallet?.balance)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowWithdraw(true)}
              disabled={!canWithdraw}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A56DB] hover:bg-white hover:text-[#0D1B3E] disabled:opacity-40 disabled:hover:bg-[#1A56DB] disabled:hover:text-white disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
            >
              <Banknote className="w-4 h-4" strokeWidth={2} />
              Withdraw
            </button>
            {!canWithdraw && (
              <p className="text-xs text-white/55 mt-2">Withdrawals start at ₹{MIN_WITHDRAWAL}.</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3 lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <Stat label="Total earned" value={`₹${fmt(wallet?.totalEarned)}`} Icon={TrendingUp} />
          <Stat label="Total withdrawn" value={`₹${fmt(wallet?.totalWithdrawn)}`} Icon={ArrowUpFromLine} />
        </div>
      </div>

      {/* Transactions */}
      <section aria-labelledby="transactions" className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden">
        <h2 id="transactions" className="px-5 sm:px-6 py-4 text-base font-bold text-[#0D1B3E] border-b border-[#0D1B3E]/10">
          Recent transactions
        </h2>
        {!wallet?.recentTransactions?.length ? (
          <p className="p-10 text-center text-black/55 text-sm">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-[#0D1B3E]/10">
            {wallet.recentTransactions.map((txn, i) => {
              const meta = txMeta[txn.type] || txMeta.debit;
              const { Icon } = meta;
              return (
                <li key={i} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.tile}`}>
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0D1B3E] truncate" title={txn.description}>
                      {prettyDescription(txn)}
                    </p>
                    <p className="text-xs text-black/55 mt-0.5 flex items-center gap-2 flex-wrap">
                      {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                      {txn.status === "pending" && (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Pending</span>
                      )}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold shrink-0 tabular-nums ${meta.color}`}>
                    {meta.sign}₹{fmt(txn.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Withdrawal modal */}
      {showWithdraw && (
        <div
          className="fixed inset-0 bg-[#0D1B3E]/50 z-50 flex items-center justify-center p-4"
          onClick={() => !isSubmitting && setShowWithdraw(false)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-title"
            onSubmit={handleWithdraw}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="withdraw-title" className="text-lg font-bold text-[#0D1B3E]">Request withdrawal</h3>
              <button
                type="button"
                onClick={() => setShowWithdraw(false)}
                aria-label="Close"
                className={`p-1.5 rounded-md text-black/45 hover:text-[#0D1B3E] hover:bg-[#0D1B3E]/5 ${focusRing}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-black/70 bg-[#1A56DB]/[0.06] rounded-lg px-3.5 py-3 mb-5">
              Available balance: <span className="font-bold text-[#0D1B3E]">₹{fmt(wallet?.balance)}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="w-amount" className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Amount (₹) *</label>
                <input
                  id="w-amount" type="number" autoFocus required
                  min={MIN_WITHDRAWAL} max={wallet?.balance}
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder={`Minimum ₹${MIN_WITHDRAWAL}`}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="w-upi" className="block text-sm font-medium text-[#0D1B3E] mb-1.5">UPI ID *</label>
                <input
                  id="w-upi" type="text" required
                  value={form.upiId}
                  onChange={(e) => setForm((p) => ({ ...p, upiId: e.target.value }))}
                  placeholder="yourname@upi"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="w-note" className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Note (optional)</label>
                <input
                  id="w-note" type="text"
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Any notes for admin"
                  className={inputCls}
                />
              </div>
            </div>

            <p className="text-sm text-black/55 mt-4 mb-5">
              Withdrawals are processed within 2 to 3 business days. Admin will send the amount to your UPI ID.
            </p>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2.5 bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition inline-flex items-center justify-center gap-2 ${focusRing}`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Submit request"}
              </button>
              <button
                type="button"
                onClick={() => setShowWithdraw(false)}
                disabled={isSubmitting}
                className={`px-5 py-2.5 border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 text-sm font-semibold rounded-lg transition ${focusRing}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}