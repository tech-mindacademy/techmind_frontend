import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Clock, Calendar, User, CheckCircle2, Hourglass } from "lucide-react";
import { fetchMyLiveClasses } from "../../api/services/liveClass.service";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const TABS = [
  { key: "live", label: "Live Now" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

function useCountdown(scheduledDate, scheduledStartTime) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const target = new Date(`${scheduledDate.split("T")[0]}T${scheduledStartTime}:00`);
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return setLabel("Starting soon");
      const h = Math.floor(diff / 3.6e6);
      const m = Math.floor((diff % 3.6e6) / 6e4);
      setLabel(h > 0 ? `in ${h}h ${m}m` : `in ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [scheduledDate, scheduledStartTime]);
  return label;
}

function ClassCard({ c, kind }) {
  const countdown = useCountdown(c.scheduledDate, c.scheduledStartTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{c.title}</h3>
          {kind === "live" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> LIVE
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{c.internship?.title} · {c.internship?.company}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 flex-wrap">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(c.scheduledDate)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.scheduledStartTime}–{c.scheduledEndTime}</span>
          {c.mentor?.name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.mentor.name}</span>}
        </div>
      </div>

      {kind === "live" && (
        <Link
          to={`/classroom/${c._id}`}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          <Radio className="w-4 h-4" /> Join Live Class
        </Link>
      )}
      {kind === "upcoming" && (
        <span className="flex-shrink-0 inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-500 font-semibold px-4 py-2.5 rounded-xl text-xs">
          <Hourglass className="w-3.5 h-3.5" /> {countdown}
        </span>
      )}
      {kind === "completed" && (
        <span className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 font-semibold px-4 py-2.5 rounded-xl text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
        </span>
      )}
    </motion.div>
  );
}

export default function InternLiveClasses() {
  const [tab, setTab] = useState("live");
  const [classes, setClasses] = useState({ live: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMyLiveClasses();
        setClasses(data);
        if (data.live?.length === 0) setTab("upcoming");
      } catch {
        setClasses({ live: [], upcoming: [], completed: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = classes[tab] || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sessions for the internships you're enrolled in
        </p>
      </div>

      <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === t.key
                ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label} {classes[t.key]?.length > 0 && `(${classes[t.key].length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-24" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p>No {tab} classes right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((c) => (
            <ClassCard key={c._id} c={c} kind={tab} />
          ))}
        </div>
      )}
    </div>
  );
}