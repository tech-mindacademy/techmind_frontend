// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
//   Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
// } from "recharts";
// import { fetchMyEarnings } from "../../api/services/payment.service";
// import { fetchMyCoursesCreator } from "../../api/services/course.service";

// const COLORS = ["#6366f1", "#14b8a6", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

// const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs">
//       {label && <p className="text-gray-400 mb-1">{label}</p>}
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: p.color }} className="font-semibold">
//           {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
//         </p>
//       ))}
//     </div>
//   );
// };

// function StatCard({ label, value, sub, icon }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//       className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
//       <div className="flex items-start justify-between mb-2">
//         <span className="text-2xl">{icon}</span>
//       </div>
//       <p className="text-2xl font-bold text-white">{value}</p>
//       <p className="text-sm text-gray-400 mt-0.5">{label}</p>
//       {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
//     </motion.div>
//   );
// }

// export default function CreatorAnalytics() {
//   const [earnings, setEarnings] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       fetchMyEarnings().catch(() => null),
//       fetchMyCoursesCreator().catch(() => ({ courses: [] })),
//     ]).then(([eRes, cRes]) => {
//       setEarnings(eRes);
//       setCourses(cRes.courses || []);
//     }).finally(() => setIsLoading(false));
//   }, []);

//   const fmt = (n) => (n || 0).toLocaleString("en-IN");

//   // Earnings by course chart data
//   const earningsByCourse = earnings?.earningsByCourse?.map(e => ({
//     name: e.courseName?.length > 20 ? e.courseName.slice(0, 20) + "…" : e.courseName,
//     earnings: Math.round(e.totalEarned),
//     sales: e.salesCount,
//   })) || [];

//   // Students by course
//   const studentsByCourse = courses.map(c => ({
//     name: c.title?.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
//     students: c.stats?.totalStudents || 0,
//   })).filter(c => c.students > 0);

//   // Published vs Draft pie
//   const publishPie = [
//     { name: "Published", value: courses.filter(c => c.isPublished).length },
//     { name: "Draft", value: courses.filter(c => !c.isPublished).length },
//   ].filter(d => d.value > 0);

//   // Recent orders as monthly data
//   const recentOrders = earnings?.recentOrders || [];
//   const monthlyMap = {};
//   recentOrders.forEach(order => {
//     const month = new Date(order.paidAt).toLocaleString("default", { month: "short" });
//     monthlyMap[month] = (monthlyMap[month] || 0) + (order.creatorEarning || 0);
//   });
//   const monthlyData = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount: Math.round(amount) }));

//   const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);

//   if (isLoading) return (
//     <div className="flex items-center justify-center h-64">
//       <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
//         <h1 className="text-2xl font-bold text-white">Analytics</h1>
//         <p className="text-gray-400 text-sm mt-1">Track your course performance and earnings.</p>
//       </motion.div>

//       {/* Stats row */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="Total Courses" value={courses.length} icon="📚"
//           sub={`${courses.filter(c => c.isPublished).length} published`} />
//         <StatCard label="Total Students" value={fmt(totalStudents)} icon="👥" />
//         <StatCard label="Total Earnings" value={`₹${fmt(earnings?.earnings?.total)}`} icon="💰"
//           sub={`₹${fmt(earnings?.earnings?.thisMonth)} this month`} />
//         <StatCard label="Recent Sales" value={earnings?.recentOrders?.length || 0} icon="🛒"
//           sub="last 10 transactions" />
//       </div>

//       {/* Charts row 1 */}
//       {earningsByCourse.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Earnings by course */}
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
//             <h2 className="text-sm font-semibold text-white mb-4">Earnings by course</h2>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={earningsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
//                   tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1) + "k" : v}`} />
//                 <Tooltip content={<CustomTooltip prefix="₹" />} />
//                 <Bar dataKey="earnings" fill="#6366f1" radius={[6, 6, 0, 0]} name="Earnings" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Students by course */}
//           <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
//             <h2 className="text-sm font-semibold text-white mb-4">Students by course</h2>
//             {studentsByCourse.length > 0 ? (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={studentsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="students" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Students" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-52 flex items-center justify-center text-gray-600 text-sm">No student data yet</div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
//           <div className="text-5xl mb-4">📊</div>
//           <p className="text-gray-400">No data yet. Publish your courses and get students enrolled to see analytics.</p>
//         </div>
//       )}

//       {/* Charts row 2 */}
//       {(monthlyData.length > 0 || publishPie.length > 0) && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Monthly earnings line chart */}
//           {monthlyData.length > 0 && (
//             <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
//               <h2 className="text-sm font-semibold text-white mb-4">Recent earnings trend</h2>
//               <ResponsiveContainer width="100%" height={200}>
//                 <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                   <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
//                     tickFormatter={v => `₹${v}`} />
//                   <Tooltip content={<CustomTooltip prefix="₹" />} />
//                   <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2}
//                     dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} name="Earnings" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}

//           {/* Published vs Draft pie */}
//           {publishPie.length > 0 && (
//             <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
//               <h2 className="text-sm font-semibold text-white mb-4">Course status</h2>
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie data={publishPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
//                     paddingAngle={4} dataKey="value">
//                     {publishPie.map((entry, i) => (
//                       <Cell key={i} fill={COLORS[i]} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend formatter={v => <span style={{ color: "#9ca3af", fontSize: 12 }}>{v}</span>} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Recent transactions */}
//       {earnings?.recentOrders?.length > 0 && (
//         <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-700">
//             <h2 className="text-sm font-semibold text-white">Recent transactions</h2>
//           </div>
//           <div className="divide-y divide-gray-700/50">
//             {earnings.recentOrders.map((order, i) => (
//               <div key={i} className="flex items-center gap-4 px-5 py-3.5">
//                 <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
//                   {order.student?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-white truncate">{order.student?.name}</p>
//                   <p className="text-xs text-gray-500 truncate">{order.course?.title}</p>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <p className="text-sm font-semibold text-green-400">+₹{Math.round(order.creatorEarning || 0).toLocaleString()}</p>
//                   <p className="text-xs text-gray-600">{new Date(order.paidAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { BookOpen, Users, IndianRupee, Receipt, BarChart3 } from "lucide-react";
import { fetchMyEarnings } from "../../api/services/payment.service";
import { fetchMyCoursesCreator } from "../../api/services/course.service";

/* Palette: blue #1A56DB, navy #0D1B3E, light blue #7FA6F5, white */

const BLUE = "#1A56DB";
const NAVY = "#0D1B3E";
const LIGHT_BLUE = "#7FA6F5";
const AXIS = "rgba(13,27,62,0.6)";
const GRID = "rgba(13,27,62,0.1)";

const fmt = (n) => (n || 0).toLocaleString("en-IN");
const short = (s) => (s?.length > 20 ? s.slice(0, 20) + "…" : s || "Untitled");

const axisProps = { tick: { fill: AXIS, fontSize: 12 }, axisLine: false, tickLine: false };

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#0D1B3E]/15 rounded-lg shadow-md px-3 py-2 text-xs">
      {label && <p className="text-black/60 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold text-[#0D1B3E]">
          {p.name}: {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
        </p>
      ))}
    </div>
  );
};

function Stat({ label, value, sub, Icon }) {
  return (
    <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-black/60">{label}</p>
        <p className="text-3xl font-bold text-[#0D1B3E] mt-1.5 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-black/50 mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="bg-white border border-[#0D1B3E]/12 rounded-xl p-5 sm:p-6">
      <h2 className="text-base font-bold text-[#0D1B3E] mb-5">{title}</h2>
      {children}
    </section>
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
    ])
      .then(([eRes, cRes]) => {
        setEarnings(eRes);
        setCourses(cRes.courses || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Earnings by course
  const earningsByCourse =
    earnings?.earningsByCourse?.map((e) => ({
      name: short(e.courseName),
      earnings: Math.round(e.totalEarned),
      sales: e.salesCount,
    })) || [];

  // Students by course
  const studentsByCourse = courses
    .map((c) => ({ name: short(c.title), students: c.stats?.totalStudents || 0 }))
    .filter((c) => c.students > 0);

  // Published vs draft
  const publishPie = [
    { name: "Published", value: courses.filter((c) => c.isPublished).length, color: BLUE },
    { name: "Draft", value: courses.filter((c) => !c.isPublished).length, color: LIGHT_BLUE },
  ].filter((d) => d.value > 0);

  // Recent orders grouped by month (keyed by year and month so different years don't merge)
  const recentOrders = earnings?.recentOrders || [];
  const monthlyMap = {};
  recentOrders.forEach((order) => {
    const d = new Date(order.paidAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        month: d.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
        amount: 0,
      };
    }
    monthlyMap[key].amount += order.creatorEarning || 0;
  });
  const monthlyData = Object.keys(monthlyMap)
    .sort()
    .map((k) => ({ month: monthlyMap[k].month, amount: Math.round(monthlyMap[k].amount) }));

  const totalStudents = courses.reduce((s, c) => s + (c.stats?.totalStudents || 0), 0);
  const publishedCount = courses.filter((c) => c.isPublished).length;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading analytics">
        <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">Analytics</h1>
        <p className="text-black/60 text-sm mt-1.5">Track your course performance and earnings.</p>
      </div>

      {/* Stats */}
      <section
        aria-label="Overview"
        className="bg-white border border-[#0D1B3E]/12 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-[#0D1B3E]/10 divide-x divide-y lg:divide-y-0"
      >
        <Stat label="Total courses" value={courses.length} sub={`${publishedCount} published`} Icon={BookOpen} />
        <Stat label="Total students" value={fmt(totalStudents)} Icon={Users} />
        <Stat
          label="Total earnings"
          value={`₹${fmt(earnings?.earnings?.total)}`}
          sub={`₹${fmt(earnings?.earnings?.thisMonth)} this month`}
          Icon={IndianRupee}
        />
        <Stat label="Recent sales" value={recentOrders.length} sub="Last 10 transactions" Icon={Receipt} />
      </section>

      {/* Charts row 1 */}
      {earningsByCourse.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Earnings by course">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={earningsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis
                  {...axisProps}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
                />
                <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ fill: "rgba(26,86,219,0.06)" }} />
                <Bar dataKey="earnings" fill={BLUE} radius={[4, 4, 0, 0]} maxBarSize={56} name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Students by course">
            {studentsByCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={studentsByCourse} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis {...axisProps} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(26,86,219,0.06)" }} />
                  <Bar dataKey="students" fill={NAVY} radius={[4, 4, 0, 0]} maxBarSize={56} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-black/50 text-sm">
                No student data yet
              </div>
            )}
          </Panel>
        </div>
      ) : (
        <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-12 text-center">
          <BarChart3 className="w-8 h-8 text-[#0D1B3E]/30 mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-semibold text-[#0D1B3E]">No data yet</p>
          <p className="text-sm text-black/60 mt-1">
            Publish your courses and get students enrolled to see analytics.
          </p>
        </div>
      )}

      {/* Charts row 2 */}
      {(monthlyData.length > 0 || publishPie.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyData.length > 0 && (
            <Panel title="Earnings by month (recent sales)">
              <ResponsiveContainer width="100%" height={220}>
                {monthlyData.length > 1 ? (
                  <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                    <XAxis dataKey="month" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip content={<CustomTooltip prefix="₹" />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke={BLUE}
                      strokeWidth={2}
                      dot={{ fill: BLUE, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Earnings"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                    <XAxis dataKey="month" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ fill: "rgba(26,86,219,0.06)" }} />
                    <Bar dataKey="amount" fill={BLUE} radius={[4, 4, 0, 0]} maxBarSize={56} name="Earnings" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Panel>
          )}

          {publishPie.length > 0 && (
            <Panel title="Course status">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={publishPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={publishPie.length > 1 ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                  >
                    {publishPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(v) => <span style={{ color: AXIS, fontSize: 13 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Panel>
          )}
        </div>
      )}

      {/* Recent transactions */}
      {recentOrders.length > 0 && (
        <section className="bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden">
          <h2 className="px-5 sm:px-6 py-4 text-base font-bold text-[#0D1B3E] border-b border-[#0D1B3E]/10">
            Recent transactions
          </h2>
          <ul className="divide-y divide-[#0D1B3E]/10">
            {recentOrders.map((order, i) => {
              const name = order.student?.name || "Deleted user";
              return (
                <li key={i} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-[#1A56DB]/10 flex items-center justify-center text-sm font-bold text-[#1A56DB] shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${order.student?.name ? "text-[#0D1B3E]" : "text-black/45"}`}>
                      {name}
                    </p>
                    <p className="text-sm text-black/55 truncate">{order.course?.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-700 tabular-nums">
                      +₹{Math.round(order.creatorEarning || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-black/50 mt-0.5">
                      {new Date(order.paidAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}