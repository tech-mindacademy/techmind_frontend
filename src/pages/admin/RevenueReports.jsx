import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import {
  fetchPlatformStats, fetchRevenueChart,
  selectPlatformStats, selectRevenueChart,
} from "../../store/slices/adminSlice";
import { fetchOrders } from "../../api/services/admin.service";

const statusBadge = {
  completed: "bg-green-900/40 text-green-400",
  pending:   "bg-yellow-900/40 text-yellow-400",
  failed:    "bg-red-900/40 text-red-400",
  refunded:  "bg-gray-700 text-gray-400",
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === "orders" ? p.value : `₹${Number(p.value).toLocaleString("en-IN")}`}
        </p>
      ))}
    </div>
  );
};

export default function RevenueReports() {
  const dispatch = useDispatch();
  const stats  = useSelector(selectPlatformStats);
  const chart  = useSelector(selectRevenueChart);
  const [orders, setOrders]           = useState([]);
  const [ordersLoading, setOL]        = useState(true);
  const [statusFilter, setStatusFilter] = useState("completed");
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState(null);

  useEffect(() => { dispatch(fetchPlatformStats()); dispatch(fetchRevenueChart()); }, [dispatch]);
  useEffect(() => {
    setOL(true);
    fetchOrders({ status: statusFilter, page, limit: 15 })
      .then(d => { setOrders(d.orders || []); setPagination(d.pagination); })
      .catch(() => {})
      .finally(() => setOL(false));
  }, [statusFilter, page]);

  const fmt = (n) => (n || 0).toLocaleString("en-IN");
  const totalChartRev = chart?.reduce((s, d) => s + d.revenue, 0) || 0;
  const peakMonth = chart?.reduce((mx, d) => (!mx || d.revenue > mx.revenue ? d : mx), null);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Revenue Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide financial overview</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",  value: `₹${fmt(stats?.revenue?.total)}`,     icon: "💰", sub: "all time" },
          { label: "This Month",     value: `₹${fmt(stats?.revenue?.thisMonth)}`,  icon: "📅", sub: stats?.revenue?.growthPercent ? `${stats.revenue.growthPercent > 0 ? "+" : ""}${stats.revenue.growthPercent}% vs last month` : "" },
          { label: "Last Month",     value: `₹${fmt(stats?.revenue?.lastMonth)}`,  icon: "📊", sub: "previous month" },
          { label: "12-Month Total", value: `₹${fmt(totalChartRev)}`,              icon: "📈", sub: peakMonth ? `Peak: ${peakMonth.label}` : "" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
            {s.sub && <p className="text-xs text-slate-600 mt-1">{s.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Monthly revenue (12 months)</h2>
          {chart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rg)" name="revenue" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-52 flex items-center justify-center text-slate-600 text-sm">No data yet</div>}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Orders per month</h2>
          {chart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="orders" fill="#f59e0b" radius={[5,5,0,0]} name="orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-52 flex items-center justify-center text-slate-600 text-sm">No data yet</div>}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-white">Order History</h2>
          <div className="flex gap-1.5 flex-wrap">
            {["completed","pending","failed","refunded"].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-400 hover:text-white"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {ordersLoading ? (
          <div className="p-8 text-center"><div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">No {statusFilter} orders.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {["Student","Course","Amount","Creator","Status","Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white text-xs">{order.student?.name}</p>
                      <p className="text-slate-500 text-xs">{order.student?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-[160px]">
                      <p className="truncate">{order.course?.title}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">₹{fmt(order.displayAmount)}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{order.creator?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusBadge[order.status] || "bg-gray-700 text-gray-400"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500">Page {page} of {pagination.pages} · {pagination.total} orders</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">Prev</button>
              <button onClick={() => setPage(p => Math.min(pagination.pages,p+1))} disabled={page===pagination.pages}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
