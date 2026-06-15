import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  MapPin, Clock, Banknote, Users, Globe, Building2, Shuffle,
  Search, X, ChevronDown, ChevronUp, Send, Loader2,
  Monitor, BarChart2, Brain, Shield, Cloud, Smartphone,
  Paintbrush, Link2, Gamepad2, FlaskConical, Briefcase,
  Zap, CheckCircle, AlertCircle, SlidersHorizontal,
} from "lucide-react";

// ── Static internships ────────────────────────────────────────────────────
const STATIC_INTERNSHIPS = [
  {
    _id: "s1",
    title: "Frontend Developer Intern",
    company: "Tech Mind Academy",
    domain: "Web Development",
    location: "Remote",
    duration: "1 Month",
    stipend: "Unpaid",
    type: "remote",
    openings: 5,
    skills: ["React", "HTML", "CSS", "JavaScript", "Tailwind CSS"],
    description:
      "Build responsive and interactive UIs for live client projects. Work closely with designers and backend engineers to deliver polished web experiences.",
    requirements:
      "Solid understanding of HTML, CSS, and JavaScript. Familiarity with React or any modern frontend framework is a plus.",
    lastDate: new Date(Date.now() + 30 * 864e5).toISOString(),
    isActive: true,
  },
  {
    _id: "s2",
    title: "Backend Developer Intern",
    company: "Tech Mind Academy",
    domain: "Web Development",
    location: "Remote",
    duration: "1 Month",
    stipend: "Unpaid",
    type: "remote",
    openings: 4,
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
    description:
      "Design and build robust REST APIs, manage databases, and implement authentication flows for real-world applications used by thousands of users.",
    requirements:
      "Basic knowledge of Node.js and Express. Understanding of REST API design and MongoDB is preferred.",
    lastDate: new Date(Date.now() + 30 * 864e5).toISOString(),
    isActive: true,
  },
  {
    _id: "s3",
    title: "Full Stack Developer Intern",
    company: "Tech Mind Academy",
    domain: "Web Development",
    location: "Remote",
    duration: "1 Month",
    stipend: "Unpaid",
    type: "remote",
    openings: 5,
    skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    description:
      "Work on live client projects using the MERN stack. Build and deploy full-stack web applications end-to-end with an experienced engineering team.",
    requirements:
      "Basic HTML/CSS/JS knowledge required. Familiarity with React and Node.js is a plus.",
    lastDate: new Date(Date.now() + 30 * 864e5).toISOString(),
    isActive: true,
  },
  {
    _id: "s4",
    title: "React Native Developer Intern",
    company: "Tech Mind Academy",
    domain: "Mobile Development",
    location: "Remote",
    duration: "1 Month",
    stipend: "Unpaid",
    type: "remote",
    openings: 3,
    skills: ["React Native", "JavaScript", "Expo", "REST APIs", "AsyncStorage"],
    description:
      "Develop cross-platform mobile applications for iOS and Android. Collaborate with the product team to implement features, fix bugs, and improve app performance.",
    requirements:
      "Basic JavaScript and React knowledge required. Prior exposure to React Native or Expo is a plus.",
    lastDate: new Date(Date.now() + 30 * 864e5).toISOString(),
    isActive: true,
  },
];

// ── Domain metadata with lucide icons ────────────────────────────────────
const DOMAIN_META = {
  "Web Development":    { Icon: Monitor,      light: "bg-blue-50 text-blue-700 border-blue-100" },
  "Data Science":       { Icon: BarChart2,    light: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "Machine Learning":   { Icon: Brain,        light: "bg-violet-50 text-violet-700 border-violet-100" },
  "Cybersecurity":      { Icon: Shield,       light: "bg-red-50 text-red-700 border-red-100" },
  "Cloud Computing":    { Icon: Cloud,        light: "bg-sky-50 text-sky-700 border-sky-100" },
  "Mobile Development": { Icon: Smartphone,   light: "bg-orange-50 text-orange-700 border-orange-100" },
  "UI/UX Design":       { Icon: Paintbrush,   light: "bg-pink-50 text-pink-700 border-pink-100" },
  "DevOps":             { Icon: Briefcase,    light: "bg-gray-100 text-gray-700 border-gray-200" },
  "Blockchain":         { Icon: Link2,        light: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  "AI Research":        { Icon: FlaskConical, light: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  "Game Development":   { Icon: Gamepad2,     light: "bg-purple-50 text-purple-700 border-purple-100" },
};

const TYPE_CFG = {
  remote: { Icon: Globe,     label: "Remote", cls: "bg-emerald-100 text-emerald-700" },
  onsite: { Icon: Building2, label: "Onsite", cls: "bg-blue-100 text-blue-700" },
  hybrid: { Icon: Shuffle,   label: "Hybrid", cls: "bg-violet-100 text-violet-700" },
};

const DOMAINS = [
  "All", "Web Development", "Data Science", "Machine Learning",
  "Cybersecurity", "Cloud Computing", "Mobile Development", "UI/UX Design",
  "DevOps", "Blockchain", "AI Research", "Game Development",
];

const BLANK_FORM = {
  name: "", email: "", phone: "", college: "",
  degree: "", year: "", whyApply: "", skills: "",
  linkedIn: "", github: "",
};

// ── Helpers ───────────────────────────────────────────────────────────────
const isPast    = (d) => d && new Date(d) < new Date();
const daysLeft  = (d) => d ? Math.ceil((new Date(d) - new Date()) / 864e5) : null;
const fmtDate   = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// 3-D blue icon box
const IconBox = ({ Icon, size = "md" }) => {
  const sz = size === "lg" ? "w-14 h-14" : "w-10 h-10";
  const ic = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div
      className={`${sz} rounded-xl bg-[#1A56DB] flex items-center justify-center flex-shrink-0`}
      style={{
        boxShadow:
          "0 6px 16px rgba(26,86,219,0.45), 0 2px 4px rgba(26,86,219,0.3), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)",
      }}
    >
      <Icon className={`${ic} text-white`} strokeWidth={1.75} />
    </div>
  );
};

// Type badge
const TypeBadge = ({ type, className = "" }) => {
  const cfg = TYPE_CFG[type] || TYPE_CFG.remote;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.cls} ${className}`}>
      <cfg.Icon className="w-3 h-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
};

// Input class
const inputCls =
  "w-full px-3.5 py-2.5 border border-[#0D1B3E]/10 rounded-xl bg-white text-black text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/40 focus:border-[#1A56DB] transition placeholder-black/30";

const Field = ({ label, children, span }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <label className="block text-xs font-black text-black/50 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────
export default function InternshipsPage() {
  const [internships, setInternships]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("");
  const [domain, setDomain]             = useState("All");
  const [applying, setApplying]         = useState(null);
  const [expanded, setExpanded]         = useState(null);
  const [form, setForm]                 = useState(BLANK_FORM);
  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState("");
  const modalRef                        = useRef(null);

  // Fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/internships");
        const backendList   = data.internships || [];
        const backendTitles = new Set(backendList.map((i) => i.title?.toLowerCase().trim()));
        const merged = [
          ...backendList,
          ...STATIC_INTERNSHIPS.filter((i) => !backendTitles.has(i.title?.toLowerCase().trim())),
        ];
        setInternships(merged);
      } catch {
        setInternships(STATIC_INTERNSHIPS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter
  const filtered = internships.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      i.title?.toLowerCase().includes(q) ||
      i.company?.toLowerCase().includes(q) ||
      i.skills?.some((s) => s.toLowerCase().includes(q));
    const matchType   = !typeFilter || i.type === typeFilter;
    const matchDomain = domain === "All" || i.domain === domain;
    return matchSearch && matchType && matchDomain;
  });

  const openApply = (intern) => {
    setApplying(intern);
    setForm(BLANK_FORM);
    setSuccess(false);
    setError("");
    setTimeout(() => modalRef.current?.scrollTo(0, 0), 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (applying._id.startsWith("s")) {
        await api.post("/internships/apply-static", {
          internship: {
            title: applying.title, company: applying.company, domain: applying.domain,
            location: applying.location, duration: applying.duration, stipend: applying.stipend,
            type: applying.type, openings: applying.openings, skills: applying.skills,
            description: applying.description, requirements: applying.requirements,
            lastDate: applying.lastDate,
          },
          ...form,
        });
      } else {
        await api.post(`/internships/${applying._id}/apply`, form);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => { setSearch(""); setTypeFilter(""); setDomain("All"); };
  const hasFilters   = search || typeFilter || domain !== "All";

  return (
    <>
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative bg-white overflow-hidden pt-20 pb-16 px-4 border-b border-[#0D1B3E]/8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto text-center"
          >
            {/* Live badge */}
            <span className="inline-flex items-center gap-2 bg-[#1A56DB]/10 border border-[#1A56DB]/20 text-[#1A56DB] text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56DB] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56DB]" />
              </span>
              {STATIC_INTERNSHIPS.length} Live Opportunities
            </span>

            {/* Heading — flat blue, no gradient */}
            <h1 className="text-5xl sm:text-6xl font-black text-[#1A56DB] leading-[1.1] tracking-tight mb-4">
              Find Your Perfect Internship
            </h1>

            <p className="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed mb-10">
              Explore real internship opportunities. Apply directly, build experience,
              and launch your tech career.
            </p>

            {/* Quick stats */}
            <div className="inline-flex items-center divide-x divide-[#0D1B3E]/10 bg-white border border-[#0D1B3E]/8 rounded-2xl overflow-hidden shadow-sm">
              {[
                { v: `${STATIC_INTERNSHIPS.length}+`, l: "Open Roles" },
                { v: "4+",  l: "Tech Domains" },
                { v: "24hr", l: "Avg Response" },
              ].map((s) => (
                <div key={s.l} className="px-6 py-3 text-center">
                  <p className="text-xl font-black text-[#1A56DB] leading-none">{s.v}</p>
                  <p className="text-[11px] text-black/40 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── STICKY FILTERS ──────────────────────────────────────── */}
        <div className="sticky top-16 z-20 bg-white border-b border-[#0D1B3E]/8 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">

            {/* Search + type + clear */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by role, company, skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#0D1B3E]/10 rounded-xl bg-white text-sm text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-black/30 hover:text-black/60" />
                  </button>
                )}
              </div>

              {/* Type filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2.5 border border-[#0D1B3E]/10 rounded-xl bg-white text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] min-w-[148px] transition"
                >
                  <option value="">All Types</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 pointer-events-none" />
              </div>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#1A56DB] border border-[#1A56DB]/20 rounded-xl hover:bg-[#1A56DB]/5 transition"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Domain chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DOMAINS.map((d) => {
                const active    = domain === d;
                const DomIcon   = DOMAIN_META[d]?.Icon;
                return (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                      active
                        ? "bg-[#1A56DB] text-white shadow-md"
                        : "bg-[#0D1B3E]/5 text-black/60 hover:bg-[#1A56DB]/10 hover:text-[#1A56DB]"
                    }`}
                  >
                    {DomIcon && <DomIcon className="w-3 h-3" strokeWidth={2} />}
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RESULTS COUNT ───────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-1 flex items-center justify-between">
          <p className="text-sm text-black/50">
            Showing{" "}
            <span className="font-black text-black">{filtered.length}</span>{" "}
            internship{filtered.length !== 1 ? "s" : ""}
            {search && (
              <> for "<span className="text-[#1A56DB]">{search}</span>"</>
            )}
          </p>
        </div>

        {/* ── LISTINGS ────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-20 pt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-[#0D1B3E]/5 rounded-2xl h-72 border border-[#0D1B3E]/8" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Search className="w-12 h-12 text-[#1A56DB]/20 mx-auto mb-4" />
              <p className="text-xl font-black text-[#1A56DB] mb-1">No internships found</p>
              <p className="text-black/40 text-sm mb-4">Try different search terms or clear filters</p>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-[#1A56DB] border border-[#1A56DB]/20 px-4 py-2 rounded-xl hover:bg-[#1A56DB]/5 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((intern, i) => {
                const meta    = DOMAIN_META[intern.domain] || { Icon: Briefcase, light: "bg-blue-50 text-blue-700 border-blue-100" };
                const expired = isPast(intern.lastDate);
                const days    = daysLeft(intern.lastDate);
                const isExp   = expanded === intern._id;

                return (
                  <motion.div
                    key={intern._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="group bg-white border border-[#0D1B3E]/8 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#1A56DB]/10 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Top accent bar — solid blue */}
                    <div className="h-1 bg-[#1A56DB]" />

                    <div className="p-5 flex flex-col flex-1">

                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <IconBox Icon={meta.Icon} size="sm" />
                          <div className="min-w-0">
                            <h3 className="font-black text-black text-sm leading-snug line-clamp-2">
                              {intern.title}
                            </h3>
                            <p className="text-[#1A56DB] text-xs font-semibold truncate">{intern.company}</p>
                          </div>
                        </div>
                        <TypeBadge type={intern.type} className="flex-shrink-0" />
                      </div>

                      {/* Domain tag */}
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-fit mb-3 border ${meta.light}`}>
                        <meta.Icon className="w-3 h-3" strokeWidth={2} />
                        {intern.domain}
                      </span>

                      {/* Meta grid */}
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mb-3">
                        {[
                          { Icon: MapPin,   v: intern.location },
                          { Icon: Clock,    v: intern.duration },
                          { Icon: Banknote, v: intern.stipend },
                          { Icon: Users,    v: `${intern.openings} seat${intern.openings > 1 ? "s" : ""}` },
                        ].map((m) => (
                          <div key={m.v} className="flex items-center gap-1.5 text-xs text-black/50 truncate">
                            <m.Icon className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{m.v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-black/50 leading-relaxed line-clamp-2 mb-3">
                        {intern.description}
                      </p>

                      {/* Expanded requirements */}
                      <AnimatePresence>
                        {isExp && intern.requirements && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-3"
                          >
                            <div className="bg-[#1A56DB]/5 rounded-xl p-3 border border-[#1A56DB]/10">
                              <p className="text-[10px] font-black text-[#1A56DB] uppercase tracking-wider mb-1">Requirements</p>
                              <p className="text-xs text-black/60">{intern.requirements}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Skills */}
                      {intern.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {intern.skills.slice(0, 4).map((s, j) => (
                            <span key={j} className="text-[11px] bg-[#1A56DB]/8 text-[#1A56DB] px-2 py-0.5 rounded-lg font-medium">
                              {s}
                            </span>
                          ))}
                          {intern.skills.length > 4 && (
                            <span className="text-[11px] text-black/30 px-1 py-0.5">+{intern.skills.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-3 border-t border-[#0D1B3E]/8 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {intern.lastDate && (
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                              expired
                                ? "bg-red-50 text-red-500"
                                : days != null && days <= 7
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-green-50 text-green-600"
                            }`}>
                              {expired
                                ? "Closed"
                                : days != null && days <= 7
                                  ? `${days}d left`
                                  : `Closes ${fmtDate(intern.lastDate)}`}
                            </span>
                          )}
                          <button
                            onClick={() => setExpanded(isExp ? null : intern._id)}
                            className="inline-flex items-center gap-0.5 text-[11px] text-black/30 hover:text-[#1A56DB] transition font-medium"
                          >
                            {isExp
                              ? <><ChevronUp className="w-3 h-3" /> Less</>
                              : <><ChevronDown className="w-3 h-3" /> More</>}
                          </button>
                        </div>
                        <button
                          onClick={() => !expired && openApply(intern)}
                          disabled={expired}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            expired
                              ? "bg-[#0D1B3E]/5 text-black/30 cursor-not-allowed"
                              : "bg-[#1A56DB] hover:bg-[#0D1B3E] text-white shadow hover:shadow-[#1A56DB]/20 group-hover:scale-105"
                          }`}
                        >
                          {expired ? "Closed" : "Apply →"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── APPLICATION MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {applying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setApplying(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              className="bg-white rounded-3xl shadow-2xl shadow-[#1A56DB]/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-[#0D1B3E]/8"
            >
              {/* ── Modal Header ── */}
              <div className="sticky top-0 z-10 bg-white border-b border-[#0D1B3E]/8 rounded-t-3xl px-6 py-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-4 min-w-0">
                  {/* 3D blue icon */}
                  <IconBox Icon={DOMAIN_META[applying.domain]?.Icon || Briefcase} size="lg" />

                  <div className="min-w-0">
                    <h2 className="font-black text-black text-base leading-tight mb-0.5">
                      {applying.title}
                    </h2>
                    <p className="text-[#1A56DB] text-sm font-semibold mb-2">{applying.company}</p>

                    {/* Type + meta all in ONE row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <TypeBadge type={applying.type} />
                      <span className="flex items-center gap-1 text-xs text-black/40">
                        <MapPin className="w-3 h-3" strokeWidth={2} />
                        {applying.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-black/40">
                        <Clock className="w-3 h-3" strokeWidth={2} />
                        {applying.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-black/40">
                        <Banknote className="w-3 h-3" strokeWidth={2} />
                        {applying.stipend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setApplying(null)}
                  className="flex-shrink-0 text-black/30 hover:text-black p-2 rounded-xl hover:bg-[#0D1B3E]/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Success state ── */}
              {success ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 240 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-[#1A56DB] mb-2">You're Shortlisted!</h3>
                  <p className="text-black/50 mb-6 max-w-sm mx-auto leading-relaxed text-sm">
                    Your application has been automatically{" "}
                    <strong className="text-emerald-600">shortlisted</strong>. Check your
                    email for confirmation and next steps.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 max-w-sm mx-auto">
                    <p className="text-sm text-emerald-700">
                      ✅ Our team will reach out within 2–3 business days.
                    </p>
                  </div>
                  <button
                    onClick={() => setApplying(null)}
                    className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-8 py-3 rounded-xl transition"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Info banner */}
                  <div className="bg-[#1A56DB]/5 border border-[#1A56DB]/15 rounded-xl px-4 py-3 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-[#1A56DB] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-xs text-[#1A56DB] leading-relaxed">
                      Applications are <strong>automatically shortlisted</strong>. Fill out
                      all required fields accurately — our team reviews every submission
                      personally.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name *">
                      <input
                        type="text" required placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Email Address *">
                      <input
                        type="email" required placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Phone Number *">
                      <input
                        type="tel" required placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Current Year *">
                      <select
                        required value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className={inputCls}
                      >
                        <option value="">Select year</option>
                        {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"].map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="College / University *" span>
                      <input
                        type="text" required placeholder="Your college name"
                        value={form.college}
                        onChange={(e) => setForm({ ...form, college: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Degree / Program *" span>
                      <input
                        type="text" required placeholder="B.Tech CSE, BCA, MCA..."
                        value={form.degree}
                        onChange={(e) => setForm({ ...form, degree: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Why do you want to apply? *" span>
                      <textarea
                        required rows={4}
                        placeholder="Describe your motivation, relevant experience, and what you'll contribute..."
                        value={form.whyApply}
                        onChange={(e) => setForm({ ...form, whyApply: e.target.value })}
                        className={`${inputCls} resize-none`}
                      />
                    </Field>

                    <Field label="Skills (comma separated)" span>
                      <input
                        type="text" placeholder="React, Python, Figma, Node.js..."
                        value={form.skills}
                        onChange={(e) => setForm({ ...form, skills: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="LinkedIn Profile">
                      <input
                        type="url" placeholder="https://linkedin.com/in/yourname"
                        value={form.linkedIn}
                        onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                        className={inputCls}
                      />
                    </Field>

                    <Field label="GitHub Profile">
                      <input
                        type="url" placeholder="https://github.com/yourname"
                        value={form.github}
                        onChange={(e) => setForm({ ...form, github: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      {error}
                    </div>
                  )}

                  {/* Sticky submit row */}
                  <div className="flex gap-3 sticky bottom-0 bg-white pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setApplying(null)}
                      className="flex-1 py-3 border border-[#0D1B3E]/10 rounded-xl text-sm font-semibold text-black/60 hover:bg-[#0D1B3E]/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white font-black py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" strokeWidth={2} />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
