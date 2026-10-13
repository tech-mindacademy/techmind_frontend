import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { fetchMyLiveClasses } from "../../api/services/liveClass.service";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function ClassRow({ c, action }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{c.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-3 mt-0.5">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(c.scheduledDate)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.scheduledStartTime} to {c.scheduledEndTime}</span>
          {c.mentor?.name && <span>Host: {c.mentor.name}</span>}
        </p>
      </div>
      {action}
    </div>
  );
}

function Group({ title, items, empty, renderAction }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((c) => <ClassRow key={c._id} c={c} action={renderAction?.(c)} />)}
        </div>
      )}
    </section>
  );
}

export default function TrainingLiveClasses() {
  const [data, setData] = useState({ live: [], upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLiveClasses()
      .then(setData)
      .catch(() => setData({ live: [], upcoming: [], completed: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>

      <Group
        title="Live now"
        items={data.live}
        empty="No class is live right now."
        renderAction={(c) => (
          <Link
            to={`/classroom/${c._id}`}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Join
          </Link>
        )}
      />
      <Group
        title="Upcoming"
        items={data.upcoming}
        empty="No upcoming classes scheduled yet."
        renderAction={() => (
          <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
            Scheduled
          </span>
        )}
      />
      <Group title="Completed" items={data.completed} empty="No completed classes yet." />
    </div>
  );
}
