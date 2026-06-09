import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { fetchCoupons, createCoupon, toggleCoupon, deleteCoupon } from "../../api/services/wallet.service";
import { selectUserRole } from "../../store/slices/authSlice";
import api from "../../api/axios";

function Badge({ active }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${active ? "bg-green-900/40 text-green-400 border border-green-800" : "bg-gray-700 text-gray-400"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function CouponManager() {
  const role = useSelector(selectUserRole);
  const isCreator = role === "creator";

  const getEmptyForm = () => ({
    code: "", description: "", discountType: "percentage", discountValue: "",
    applicableTo: isCreator ? "specific_courses" : "all",
    courses: [],
    minOrderAmount: "", maxDiscount: "",
    usageLimit: "", perUserLimit: "1", validFrom: "", validUntil: "",
  });

  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(getEmptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  // Creator's own courses
  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesFetched, setCoursesFetched] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetchCoupons()
      .then(d => setCoupons(d.coupons || []))
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Fetch creator courses once when form opens
  useEffect(() => {
    if (showForm && isCreator && !coursesFetched) {
      setCoursesLoading(true);
      api.get("/courses/creator/my-courses")
        .then(r => { setMyCourses(r.data.courses || []); setCoursesFetched(true); })
        .catch(() => toast.error("Failed to load your courses"))
        .finally(() => setCoursesLoading(false));
    }
  }, [showForm, isCreator, coursesFetched]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const toggleCourseSelection = (id) => {
    setForm(p => ({
      ...p,
      courses: p.courses.includes(id)
        ? p.courses.filter(c => c !== id)
        : [...p.courses, id],
    }));
  };

  const handleCreate = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    if (!form.discountValue || Number(form.discountValue) <= 0) { toast.error("Discount value must be > 0"); return; }
    if (form.discountType === "percentage" && Number(form.discountValue) > 100) { toast.error("Percentage cannot exceed 100"); return; }
    if (form.applicableTo === "specific_courses" && form.courses.length === 0) {
      toast.error("Select at least one course"); return;
    }

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
      setForm(getEmptyForm());
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

  const handleCancel = () => {
    setShowForm(false);
    setForm(getEmptyForm());
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

      {/* ── Create form ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">New Coupon</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Code *</label>
                <input value={form.code} onChange={f("code")} placeholder="SAVE20"
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white uppercase placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <input value={form.description} onChange={f("description")} placeholder="20% off all courses"
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Discount Type *</label>
                <select value={form.discountType} onChange={f("discountType")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Discount Value * {form.discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input type="number" value={form.discountValue} onChange={f("discountValue")}
                  placeholder={form.discountType === "percentage" ? "20" : "500"}
                  min={1} max={form.discountType === "percentage" ? 100 : undefined}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Applies To — admin only; creators are locked to specific_courses */}
              {!isCreator && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Applies To</label>
                  <select value={form.applicableTo} onChange={f("applicableTo")}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition">
                    <option value="all">All Courses</option>
                    <option value="specific_courses">Specific Courses</option>
                  </select>
                </div>
              )}

              {/* Course selector — shown when specific_courses is active */}
              {form.applicableTo === "specific_courses" && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Select Courses *
                    {isCreator && <span className="ml-1.5 normal-case text-teal-400 font-normal">your courses only</span>}
                  </label>

                  {coursesLoading ? (
                    <div className="flex items-center gap-2 py-3 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      Loading courses…
                    </div>
                  ) : myCourses.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No courses found. Create and publish a course first.</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {myCourses.map(course => {
                        const selected = form.courses.includes(course._id);
                        return (
                          <button key={course._id} type="button"
                            onClick={() => toggleCourseSelection(course._id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition ${
                              selected
                                ? "border-teal-500 bg-teal-900/20"
                                : "border-gray-600 bg-gray-700 hover:border-gray-500"
                            }`}>
                            {/* Checkbox */}
                            <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition ${
                              selected ? "bg-teal-500 border-teal-500" : "border-gray-500"
                            }`}>
                              {selected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                            </div>
                            {/* Thumbnail */}
                            {course.thumbnail?.url ? (
                              <img src={course.thumbnail.url} alt=""
                                className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-gray-600 flex-shrink-0" />
                            )}
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${selected ? "text-white" : "text-gray-300"}`}>
                                {course.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {course.isFree ? "Free" : `₹${course.price?.toLocaleString("en-IN")}`}
                                {!course.isPublished && <span className="ml-1.5 text-yellow-500">· Draft</span>}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {form.courses.length > 0 && (
                    <p className="text-xs text-teal-400 mt-1.5">
                      ✓ {form.courses.length} course{form.courses.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              )}

              {/* Min Order */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Min Order Amount (₹)</label>
                <input type="number" value={form.minOrderAmount} onChange={f("minOrderAmount")}
                  placeholder="0 = no minimum" min={0}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Max Discount Cap — percentage only */}
              {form.discountType === "percentage" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Max Discount Cap (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={f("maxDiscount")}
                    placeholder="0 = no cap" min={0}
                    className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
                </div>
              )}

              {/* Usage Limit */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Total Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={f("usageLimit")}
                  placeholder="0 = unlimited" min={0}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Per User Limit */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Per User Limit</label>
                <input type="number" value={form.perUserLimit} onChange={f("perUserLimit")}
                  placeholder="1" min={1}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Valid From */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Valid From</label>
                <input type="date" value={form.validFrom} onChange={f("validFrom")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition" />
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Valid Until</label>
                <input type="date" value={form.validUntil} onChange={f("validUntil")}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} disabled={isSaving}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
                {isSaving
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                  : "Create Coupon"}
              </button>
              <button onClick={handleCancel}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold rounded-xl transition">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Coupons list ────────────────────────────────────────────────────── */}
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

              {/* Code */}
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
                  {/* Course scope badge */}
                  {coupon.applicableTo === "specific_courses" && coupon.courses?.length > 0 && (
                    <span className="text-xs bg-indigo-900/40 text-indigo-400 border border-indigo-800 px-2 py-0.5 rounded-lg">
                      {coupon.courses.length === 1
                        ? coupon.courses[0]?.title || "1 course"
                        : `${coupon.courses.length} courses`}
                    </span>
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${
                    coupon.isActive
                      ? "bg-yellow-900/30 hover:bg-yellow-900/60 text-yellow-400"
                      : "bg-green-900/30 hover:bg-green-900/60 text-green-400"
                  }`}>
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