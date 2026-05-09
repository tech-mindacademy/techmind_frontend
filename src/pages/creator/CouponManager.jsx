import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { fetchCoupons, createCoupon, toggleCoupon, deleteCoupon } from "../../api/services/wallet.service";

const EMPTY_FORM = {
  code: "", description: "", discountType: "percentage", discountValue: "",
  applicableTo: "all", minOrderAmount: "", maxDiscount: "",
  usageLimit: "", perUserLimit: "1", validFrom: "", validUntil: "",
};

function Badge({ active }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${active ? "bg-green-900/40 text-green-400 border border-green-800" : "bg-gray-700 text-gray-400"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const load = () => {
    setIsLoading(true);
    fetchCoupons()
      .then(d => setCoupons(d.coupons || []))
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleCreate = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    if (!form.discountValue || Number(form.discountValue) <= 0) { toast.error("Discount value must be > 0"); return; }
    if (form.discountType === "percentage" && Number(form.discountValue) > 100) { toast.error("Percentage cannot exceed 100"); return; }
    setIsSaving(true);
    try {
      await createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        perUserLimit: Number(form.perUserLimit) || 1,
      });
      toast.success("Coupon created ✓");
      setShowForm(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally { setIsSaving(false); }
  };

  const handleToggle = async (id, isActive) => {
    setActionId(id);
    try {
      await toggleCoupon(id);
      toast.success(isActive ? "Coupon deactivated" : "Coupon activated");
      setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
    } catch { toast.error("Failed"); }
    finally { setActionId(null); }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    setActionId(id);
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted");
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch { toast.error("Failed"); }
    finally { setActionId(null); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupon Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Create discount codes for your courses.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          New Coupon
        </button>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">New Coupon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Code *</label>
                <input value={form.code} onChange={f("code")} placeholder="SAVE20"
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white uppercase placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <input value={form.description} onChange={f("description")} placeholder="20% off all courses"
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Discount Type *</label>
                <select value={form.discountType} onChange={f("discountType")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Discount Value * {form.discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input type="number" value={form.discountValue} onChange={f("discountValue")}
                  placeholder={form.discountType === "percentage" ? "20" : "500"}
                  min={1} max={form.discountType === "percentage" ? 100 : undefined}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Min Order Amount (₹)</label>
                <input type="number" value={form.minOrderAmount} onChange={f("minOrderAmount")} placeholder="0 = no minimum" min={0}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              {form.discountType === "percentage" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Max Discount Cap (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={f("maxDiscount")} placeholder="0 = no cap" min={0}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Total Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={f("usageLimit")} placeholder="0 = unlimited" min={0}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Per User Limit</label>
                <input type="number" value={form.perUserLimit} onChange={f("perUserLimit")} placeholder="1" min={1}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Valid From</label>
                <input type="date" value={form.validFrom} onChange={f("validFrom")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Valid Until</label>
                <input type="date" value={form.validUntil} onChange={f("validUntil")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} disabled={isSaving}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
                {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Create Coupon"}
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-xl transition">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons list */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🏷️</div>
          <p className="text-gray-400">No coupons yet. Create one to offer discounts!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map(coupon => (
            <motion.div key={coupon._id} layout
              className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex items-center gap-4 flex-wrap hover:border-gray-600 transition">
              {/* Code badge */}
              <div className="bg-gray-900 border border-gray-600 rounded-xl px-4 py-2.5 flex-shrink-0">
                <p className="text-base font-mono font-bold text-teal-400 tracking-widest">{coupon.code}</p>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white text-sm">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% off`
                      : `₹${coupon.discountValue} off`}
                  </p>
                  {coupon.maxDiscount > 0 && (
                    <span className="text-xs text-gray-500">max ₹{coupon.maxDiscount}</span>
                  )}
                  <Badge active={coupon.isActive} />
                </div>
                {coupon.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{coupon.description}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                  <span>Used {coupon.usageCount}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ""} times</span>
                  {coupon.minOrderAmount > 0 && <span>Min ₹{coupon.minOrderAmount}</span>}
                  {coupon.validUntil && (
                    <span className={new Date() > new Date(coupon.validUntil) ? "text-red-400" : ""}>
                      Expires {new Date(coupon.validUntil).toLocaleDateString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleToggle(coupon._id, coupon.isActive)} disabled={actionId === coupon._id}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${coupon.isActive ? "bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400" : "bg-green-900/30 hover:bg-green-900/60 text-green-400"}`}>
                  {coupon.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(coupon._id, coupon.code)} disabled={actionId === coupon._id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/50 text-red-400 transition disabled:opacity-50">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
