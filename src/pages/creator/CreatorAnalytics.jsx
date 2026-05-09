import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { fetchMyEarnings } from "../../api/services/payment.service";
import { fetchMyCoursesCreator } from "../../api/services/course.service";

const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
        </p>
      ))}
    </div>
  );
};

function StatCard({ label, value, sub, icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function CreatorAnalytics() {
  const [earnings, setEarnings] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyEarnings().catch(() => null),
      fetchMyCoursesCreator().catch(() => ({ courses: [] })),
    ]).then(([eRes, cRes]) => {
      setEarnings(eRes);
      setCourses(cRes.courses || []);
    }).finally(() => setIsLoading(false));
  }, []);

  const fmt = (n) => (n || 0).toLocaleString("en-IN");

  // Earnings by course chart data
  const earningsByCourse = earnings?.earningsByCourse?.map(e => ({
    name: e.courseName?.length > 20 ? e.courseName.slice(0, 20) + "…" : e.courseName,
    earnings: Math.round(e.totalEarned),
    sales: e.salesCount,
  })) || [];

  // Students by course
  const studentsByCourse = courses.map(c => ({
    name: c.title?.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
    students: c.stats?.totalStudents || 0,
  })).filter(c => c.students > 0);

  // Published vs Draft pie
  const publishPie = [
    { name: "Published", value: courses.filter(c => c.isPublished).length },
    { name: "Draft", value: courses.filter(c => !c.isPublished).length },
  ].filter(d => d.value > 0);

  // Recent orders as monthly data
  const recentOrders = earnings?.recentOrders || [];
  const monthlyMap = {};
  recentOrders.forEach(order => {
    const month = new Date(order.paidAt).toLocaleString("default", { month: "short" });
    monthlyMap[month] = (monthlyMap[month] || 0) + (order.creatorEarning || 0);
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount: Math.round(amount) }));

  const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Track your course performance and earnings.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Courses" value={courses.length} icon="📚"
          sub={`${courses.filter(c => c.isPublished).length} published`} />
        <StatCard label="Total Students" value={fmt(totalStudents)} icon="👥" />
        <StatCard label="Total Earnings" value={`₹${fmt(earnings?.earnings?.total)}`} icon="💰"
          sub={`₹${fmt(earnings?.earnings?.thisMonth)} this month`} />
        <StatCard label="Recent Sales" value={earnings?.recentOrders?.length || 0} icon="🛒"
          sub="last 10 transactions" />
      </div>

      {/* Charts row 1 */}
      {earningsByCourse.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings by course */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Earnings by course</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={earningsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1) + "k" : v}`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Bar dataKey="earnings" fill="#6366f1" radius={[6, 6, 0, 0]} name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Students by course */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Students by course</h2>
            {studentsByCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={studentsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-600 text-sm">No student data yet</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-400">No data yet. Publish your courses and get students enrolled to see analytics.</p>
        </div>
      )}

      {/* Charts row 2 */}
      {(monthlyData.length > 0 || publishPie.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly earnings line chart */}
          {monthlyData.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Recent earnings trend</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip prefix="₹" />} />
                  <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} name="Earnings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Published vs Draft pie */}
          {publishPie.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Course status</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={publishPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    paddingAngle={4} dataKey="value">
                    {publishPie.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={v => <span style={{ color: "#9ca3af", fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Recent transactions */}
      {earnings?.recentOrders?.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-white">Recent transactions</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {earnings.recentOrders.map((order, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
                  {order.student?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{order.student?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{order.course?.title}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-green-400">+₹{Math.round(order.creatorEarning || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{new Date(order.paidAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
