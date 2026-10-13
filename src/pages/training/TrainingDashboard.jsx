import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Radio, Clock, ArrowRight, Calendar } from "lucide-react";
import { fetchMyLiveClasses } from "../../api/services/liveClass.service";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function TrainingDashboard() {
  const { access = [] } = useOutletContext() || {};
  const [classes, setClasses] = useState({ live: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLiveClasses()
      .then(setClasses)
      .catch(() => setClasses({ live: [], upcoming: [], completed: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industrial Training Portal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your training and live class schedule
        </p>
      </div>

      {!loading && classes.live.length > 0 && (
        <div className="bg-red-600 rounded-2xl p-5 text-white flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <div>
              <p className="font-bold">
                {classes.live.length} class{classes.live.length > 1 ? "es" : ""} live now
              </p>
              <p className="text-sm text-white/80">{classes.live[0].title}</p>
            </div>
          </div>
          <Link
            to={`/classroom/${classes.live[0]._id}`}
            className="bg-white text-red-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-red-50 transition flex items-center gap-2"
          >
            <Radio className="w-4 h-4" /> Join now
          </Link>
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Your training</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {access.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-2">No active training enrollment found.</p>
          ) : (
            access.map((a) => (
              <div
                key={a.applicationId}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5"
              >
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {a.duration}, {a.status === "COMPLETED" ? "Completed" : "In progress"}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Upcoming live classes</h2>
          <Link to="/training/live-classes" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
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
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4"
              >
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{c.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(c.scheduledDate)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.scheduledStartTime}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
