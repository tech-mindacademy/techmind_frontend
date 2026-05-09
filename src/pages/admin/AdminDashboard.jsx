import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformStats, fetchRevenueChart, fetchCreatorRequests, approveCreator, rejectCreator, selectPlatformStats, selectRevenueChart, selectCreatorRequests, selectAdminLoading } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";

const fmt = (n) => (n || 0).toLocaleString("en-IN");

function StatCard({ label, value, sub, icon, to, trend }) {
  const inner = (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </motion.div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function MiniChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
            {d.label}: ₹{fmt(d.revenue)}
          </div>
          <div className="w-full bg-indigo-500/80 rounded-sm transition-all hover:bg-indigo-400"
            style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectPlatformStats);
  const chart = useSelector(selectRevenueChart);
  const requests = useSelector(selectCreatorRequests);
  const isLoading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(fetchPlatformStats());
    dispatch(fetchRevenueChart());
    dispatch(fetchCreatorRequests("pending"));
  }, [dispatch]);

  const handleApprove = async (userId, name) => {
    await dispatch(approveCreator(userId));
    toast.success(`${name} approved as creator`);
  };

  const handleReject = async (userId, name) => {
    await dispatch(rejectCreator(userId));
    toast.success(`${name}'s request rejected`);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time stats and management</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={fmt(stats?.users?.total)} sub={`+${stats?.users?.newThisMonth || 0} this month`} icon="👥" to="/admin/users" />
        <StatCard label="Published Courses" value={fmt(stats?.courses?.published)} sub={`${fmt(stats?.courses?.total)} total`} icon="📚" to="/admin/courses" />
        <StatCard label="Total Enrollments" value={fmt(stats?.enrollments?.total)} sub={`+${stats?.enrollments?.thisMonth || 0} this month`} icon="🎓" />
        <StatCard label="Revenue (this month)" value={`₹${fmt(stats?.revenue?.thisMonth)}`}
          sub={`Total: ₹${fmt(stats?.revenue?.total)}`} icon="💰"
          trend={stats?.revenue?.growthPercent ? parseFloat(stats.revenue.growthPercent) : undefined}
          to="/admin/revenue" />
      </div>

      {/* Revenue chart + pending approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Revenue (12 months)</h2>
            <Link to="/admin/revenue" className="text-xs text-indigo-400 hover:underline">View full report →</Link>
          </div>
          {chart?.length > 0 ? (
            <>
              <MiniChart data={chart} />
              <div className="flex items-end justify-between mt-3 overflow-x-auto">
                {chart.filter((_, i) => i % 3 === 0).map((d, i) => (
                  <span key={i} className="text-xs text-slate-500 flex-shrink-0">{d.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-16 flex items-center justify-center text-slate-600 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Pending creator approvals */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Creator Requests</h2>
              {requests.length > 0 && (
                <span className="text-xs bg-orange-900/60 text-orange-300 px-2 py-0.5 rounded-full font-semibold">
                  {requests.length}
                </span>
              )}
            </div>
            <Link to="/admin/creator-approvals" className="text-xs text-indigo-400 hover:underline">View all →</Link>
          </div>

          {requests.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm">No pending requests ✓</div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 4).map(user => (
                <div key={user._id} className="flex items-center gap-3 bg-slate-900/60 rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleApprove(user._id, user.name)}
                      className="px-3 py-1.5 bg-green-900/50 hover:bg-green-800 text-green-400 text-xs font-semibold rounded-lg transition">
                      Approve
                    </button>
                    <button onClick={() => handleReject(user._id, user.name)}
                      className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 text-xs font-semibold rounded-lg transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/admin/users", icon: "👤", label: "Manage Users" },
            { to: "/admin/courses", icon: "📚", label: "All Courses" },
            { to: "/admin/revenue", icon: "💰", label: "Revenue" },
            { to: "/admin/settings", icon: "⚙️", label: "Settings" },
          ].map(a => (
            <Link key={a.to} to={a.to}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 text-center transition group">
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="text-sm text-slate-300 group-hover:text-white font-medium transition">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
