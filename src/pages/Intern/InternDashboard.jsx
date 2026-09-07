import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Clock, ArrowRight, Calendar, Building2 } from "lucide-react";
import { fetchMyLiveClasses } from "../../api/services/liveClass.service";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_BADGE = {
  paid: "bg-emerald-100 text-emerald-700",
  not_required: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  unpaid: "bg-red-100 text-red-700",
};

export default function InternDashboard() {
  const { access = [] } = useOutletContext() || {};
  const [classes, setClasses] = useState({ live: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMyLiveClasses();
        setClasses(data);
      } catch {
        setClasses({ live: [], upcoming: [], completed: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const eligible = access.filter((a) => a.canJoinPortal);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internship Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your enrolled internships and live class schedule
        </p>
      </div>

      {/* LIVE NOW banner */}
      {!loading && classes.live.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <div>
              <p className="font-bold">{classes.live.length} class{classes.live.length > 1 ? "es" : ""} live right now</p>
              <p className="text-sm text-white/80">{classes.live[0].title}</p>
            </div>
          </div>
          <Link
            to={`/classroom/${classes.live[0]._id}`}
            className="bg-white text-red-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-red-50 transition flex items-center gap-2"
          >
            <Radio className="w-4 h-4" /> Join Now
          </Link>
        </motion.div>
      )}

      {/* Enrolled internships */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
          Your Internships
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eligible.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-2">No active internship enrollments found.</p>
          ) : (
            eligible.map((a) => (
              <div
                key={a.applicationId}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{a.internshipTitle}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[a.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                    {a.paymentStatus === "not_required" ? "Free" : a.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5" /> {a.company}
                </p>
                {a.batch && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Batch: {a.batch}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Upcoming Live Classes
          </h2>
          <Link to="/intern/live-classes" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-16" />
            ))}
          </div>
        ) : classes.upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming classes scheduled yet.</p>
        ) : (
          <div className="space-y-2">
            {classes.upcoming.slice(0, 4).map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(c.scheduledDate)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.scheduledStartTime}</span>
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}