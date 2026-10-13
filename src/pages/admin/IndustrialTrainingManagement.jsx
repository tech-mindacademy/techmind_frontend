import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import * as svc from "../../api/services/industrialTraining.service";

const LABEL = {
  APPLIED: "Applied",
  CONTACTED: "Contacted",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Paid",
  CREDENTIALS_SENT: "Credentials Sent",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const BADGE = {
  APPLIED: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  PAYMENT_PENDING: "bg-orange-100 text-orange-700",
  PAID: "bg-emerald-100 text-emerald-700",
  CREDENTIALS_SENT: "bg-teal-100 text-teal-700",
  ACTIVE: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-gray-200 text-gray-700",
  REJECTED: "bg-red-100 text-red-600",
};

const FILTERS = ["ALL", ...Object.keys(LABEL)];

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
const inr = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const paymentText = (a) => {
  const p = a.payment || {};
  if (p.status === "paid") return `Paid ${inr(p.amount)}`;
  if (p.status === "link_sent") return `Link sent (${inr(p.amount)})`;
  if (p.status === "expired") return "Link expired";
  if (p.status === "cancelled") return "Link cancelled";
  return "Not requested";
};

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-1.5 text-sm">
    <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
    <span className="text-gray-900 dark:text-white text-right break-words min-w-0">{children || "—"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <h3 className="text-xs font-semibold text-gray-400 mb-2">{title}</h3>
    {children}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${BADGE[status]}`}>
    {LABEL[status]}
  </span>
);

export default function IndustrialTrainingManagement() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [defaultFee, setDefaultFee] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await svc.fetchApplications({
        status: filter === "ALL" ? undefined : filter,
        search: query || undefined,
        page,
      });
      setApplications(data.applications);
      setStats(data.stats);
      setDefaultFee(data.defaultFee);
      setPagination(data.pagination);
      setSelected((prev) => (prev ? data.applications.find((a) => a._id === prev._id) || prev : prev));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, [filter, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn, success) => {
    setBusy(true);
    try {
      await fn();
      toast.success(success);
      setConfirm(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = (a, status, success) =>
    run(() => svc.updateApplicationStatus(a._id, status), success);

  const openPaymentConfirm = (app, resend = false) => {
    setAmount(defaultFee ? String(defaultFee) : "");
    setConfirm({ type: "payment", app, resend });
  };

  const submitConfirm = () => {
    const { type, app, resend } = confirm;
    if (type === "payment") {
      if (!resend && !(Number(amount) > 0)) return toast.error("Enter the training fee.");
      return run(
        () => svc.sendPaymentLink(app._id, { amount: Number(amount) || undefined, resend }),
        resend ? "Payment link resent." : "Payment link sent."
      );
    }
    if (type === "credentials") {
      return run(() => svc.sendCredentials(app._id, { resend }), resend ? "Credentials resent." : "Credentials sent.");
    }
    return changeStatus(app, "REJECTED", "Application rejected.");
  };

  const actionsFor = (a) => {
    const reject = { label: "Reject", tone: "danger", onClick: () => setConfirm({ type: "reject", app: a }) };
    switch (a.status) {
      case "APPLIED":
        return [{ label: "Contacted", onClick: () => changeStatus(a, "CONTACTED", "Marked as contacted.") }, reject];
      case "CONTACTED":
        return [{ label: "Send Payment Link", primary: true, onClick: () => openPaymentConfirm(a) }, reject];
      case "PAYMENT_PENDING":
        return [{ label: "Resend Link", onClick: () => openPaymentConfirm(a, true) }, reject];
      case "PAID":
        return [{ label: "Send Credentials", primary: true, onClick: () => setConfirm({ type: "credentials", app: a }) }];
      case "CREDENTIALS_SENT":
        return [
          { label: "Resend Credentials", onClick: () => setConfirm({ type: "credentials", app: a, resend: true }) },
          { label: "Mark Active", onClick: () => changeStatus(a, "ACTIVE", "Marked as active.") },
        ];
      case "ACTIVE":
        return [{ label: "Mark Completed", onClick: () => changeStatus(a, "COMPLETED", "Marked as completed.") }];
      default:
        return [];
    }
  };

  const viewLabel = (a) =>
    ["PAYMENT_PENDING", "PAID"].includes(a.status)
      ? "View Payment"
      : ["CREDENTIALS_SENT", "ACTIVE"].includes(a.status)
        ? "View Student"
        : "View";

  const cards = stats && [
    ["Total Applications", stats.total],
    ["New Applications", stats.applied],
    ["Payment Pending", stats.paymentPending],
    ["Paid Students", stats.paid],
    ["Active Students", stats.active],
    ["Completed Students", stats.completed],
  ];

  const btnCls = (a) =>
    a.primary
      ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
      : a.tone === "danger"
        ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industrial Training Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review applications, send payment links and share portal access.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {(cards || Array(6).fill(null)).map((c, i) => (
          <div key={i} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg px-4 py-3">
            {c ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400">{c[0]}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{c[1]}</p>
              </>
            ) : (
              <div className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f === "ALL" ? "All" : LABEL[f]}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone, college"
          aria-label="Search applications"
          className="w-full lg:w-72 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead className="text-left text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {["Student", "Training", "Applied On", "Status", "Payment", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse bg-gray-100 dark:bg-gray-800 rounded" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                  <button onClick={load} className="text-sm text-indigo-600 hover:underline">Try again</button>
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((a) => (
                <tr key={a._id} className="border-t border-gray-100 dark:border-gray-800 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{a.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.phone}</p>
                    <p className="text-xs text-gray-400">{a.college}, {a.course}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    <p>{a.domain}</p>
                    <p className="text-xs text-gray-500">{a.duration}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{fmtDate(a.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{paymentText(a)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelected(a)}
                        className="px-2.5 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {viewLabel(a)}
                      </button>
                      {actionsFor(a).map((act) => (
                        <button
                          key={act.label}
                          disabled={busy}
                          onClick={act.onClick}
                          className={`px-2.5 py-1 text-xs font-medium border rounded-md disabled:opacity-50 ${btnCls(act)}`}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{pagination.total} applications</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40">Previous</button>
            <span className="py-1.5">Page {pagination.page} of {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {selected && <Drawer a={selected} onClose={() => setSelected(null)} />}

      {confirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {confirm.type === "payment" && (confirm.resend ? "Resend Payment Link?" : "Send Payment Link?")}
              {confirm.type === "credentials" && (confirm.resend ? "Resend Credentials?" : "Send Credentials?")}
              {confirm.type === "reject" && "Reject this application?"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {confirm.type === "payment" && "This will send the Razorpay payment link to:"}
              {confirm.type === "credentials" && "This will create the portal account if needed and email the access details to:"}
              {confirm.type === "reject" && `${confirm.app.name} will be marked as rejected. Any open payment link is cancelled.`}
            </p>
            {confirm.type !== "reject" && (
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">{confirm.app.email}</p>
            )}
            {confirm.type === "payment" && !confirm.resend && (
              <div className="mb-4">
                <label htmlFor="fee" className="block text-xs font-semibold text-gray-500 mb-1.5">Training fee (₹)</label>
                <input
                  id="fee"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} disabled={busy} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button
                onClick={submitConfirm}
                disabled={busy}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60 ${confirm.type === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {busy
                  ? "Please wait..."
                  : confirm.type === "payment"
                    ? (confirm.resend ? "Resend Link" : "Send Payment Link")
                    : confirm.type === "credentials"
                      ? (confirm.resend ? "Resend Credentials" : "Send Credentials")
                      : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Drawer({ a, onClose }) {
  const p = a.payment || {};
  const timeline = [
    ["Application Submitted", a.createdAt],
    ["Student Contacted", a.contactedAt],
    ["Payment Link Sent", a.paymentLinkSentAt],
    ["Payment Completed", p.paidAt],
    ["Credentials Sent", a.credentialsSentAt],
    ["Training Started", a.startedAt],
    ["Training Completed", a.completedAt],
  ];

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Application details">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <aside className="w-full max-w-lg bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{a.name}</h2>
            <div className="mt-1"><StatusBadge status={a.status} /></div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>

        <div className="px-6">
          <Section title="Student information">
            <Row label="Name">{a.name}</Row>
            <Row label="Email">{a.email}</Row>
            <Row label="Phone">{a.phone}</Row>
            <Row label="College">{a.college}</Row>
            <Row label="Course">{a.course}</Row>
            <Row label="Branch">{a.branch}</Row>
            <Row label="Semester">{a.semester}</Row>
          </Section>

          <Section title="Training information">
            <Row label="Domain">{a.domain}</Row>
            <Row label="Duration">{a.duration}</Row>
            <Row label="Preferred start">{fmtDate(a.preferredStartDate)}</Row>
          </Section>

          <Section title="Application">
            <Row label="Applied on">{fmtDate(a.createdAt)}</Row>
            <Row label="Resume">
              {a.resumeUrl && <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Open resume</a>}
            </Row>
            <Row label="Skills">{a.skills}</Row>
            <Row label="LinkedIn">
              {a.linkedIn && <a href={a.linkedIn} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Profile</a>}
            </Row>
            <Row label="GitHub">
              {a.github && <a href={a.github} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Profile</a>}
            </Row>
            {a.message && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{a.message}</p>}
          </Section>

          <Section title="Payment">
            <Row label="Status">{paymentText(a)}</Row>
            <Row label="Amount">{p.amount ? inr(p.amount) : ""}</Row>
            <Row label="Payment link">
              {p.linkUrl && <a href={p.linkUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{p.linkUrl}</a>}
            </Row>
            <Row label="Payment ID">{p.paymentId}</Row>
            <Row label="Payment date">{fmtDate(p.paidAt)}</Row>
          </Section>

          <Section title="Timeline">
            <ol className="space-y-3">
              {timeline.map(([label, date]) => (
                <li key={label} className="flex items-start gap-3 text-sm">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${date ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"}`} />
                  <span className={date ? "text-gray-900 dark:text-white" : "text-gray-400"}>
                    {label}
                    {date && <span className="text-gray-500 dark:text-gray-400">, {fmtDate(date)}</span>}
                  </span>
                </li>
              ))}
            </ol>
            {a.status === "REJECTED" && (
              <p className="mt-3 text-sm text-red-600">Rejected{a.rejectedAt ? ` on ${fmtDate(a.rejectedAt)}` : ""}</p>
            )}
          </Section>
        </div>
      </aside>
    </div>
  );
}
