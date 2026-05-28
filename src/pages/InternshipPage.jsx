import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC JSON DATA (shown when API returns empty or fails)
// ─────────────────────────────────────────────────────────────────────────────
const STATIC_INTERNSHIPS = [
  {
    _id: "s1", title: "Full Stack Developer Intern", company: "Tech Mind Academy",
    domain: "Web Development", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 5,
    skills: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    description: "Work on live client projects using the MERN stack. Build and deploy full-stack web applications with an experienced team.",
    requirements: "Basic HTML/CSS/JS. Familiarity with React is a plus.",
    lastDate: new Date(Date.now() + 30 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s2", title: "Data Science Intern", company: "Tech Mind Academy",
    domain: "Data Science", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 3,
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL"],
    description: "Analyze real-world datasets, build predictive models, and present insights to stakeholders.",
    requirements: "Python basics, statistics fundamentals.",
    lastDate: new Date(Date.now() + 25 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s3", title: "Machine Learning Research Intern", company: "Tech Mind Academy",
    domain: "Machine Learning", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 2,
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NLP"],
    description: "Contribute to cutting-edge ML research. Work alongside PhD researchers building next-gen AI models.",
    requirements: "Strong Python skills, familiarity with ML concepts.",
    lastDate: new Date(Date.now() + 20 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s4", title: "Cybersecurity Intern", company: "Tech Mind Academy",
    domain: "Cybersecurity", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 4,
    skills: ["Network Security", "Ethical Hacking", "Linux", "Wireshark", "Python"],
    description: "Learn penetration testing, vulnerability assessment, and incident response in a real enterprise environment.",
    requirements: "Basic networking knowledge, Linux fundamentals.",
    lastDate: new Date(Date.now() + 35 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s5", title: "Cloud & DevOps Intern", company: "Tech Mind Academy",
    domain: "Cloud Computing", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 6,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    description: "Deploy and manage cloud infrastructure, set up CI/CD pipelines, and automate deployment workflows.",
    requirements: "Linux basics, networking understanding.",
    lastDate: new Date(Date.now() + 28 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s6", title: "Android Developer Intern", company: "Tech Mind Academy",
    domain: "Mobile Development", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 3,
    skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Firebase"],
    description: "Build and publish Android applications. Work on user-facing features and performance optimization.",
    requirements: "Basic Java/Kotlin knowledge.",
    lastDate: new Date(Date.now() + 22 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s7", title: "UI/UX Design Intern", company: "Tech Mind Academy",
    domain: "UI/UX Design", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 4,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    description: "Design intuitive interfaces for web and mobile apps. Work on user research, wireframes, and prototypes.",
    requirements: "Basic Figma skills. Portfolio required.",
    lastDate: new Date(Date.now() + 18 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s8", title: "Blockchain Developer Intern", company: "Tech Mind Academy",
    domain: "Blockchain", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 2,
    skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "React"],
    description: "Build decentralized applications and smart contracts on Ethereum. Work on DeFi and NFT platforms.",
    requirements: "JavaScript proficiency, interest in blockchain.",
    lastDate: new Date(Date.now() + 40 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s9", title: "AI Research Intern", company: "Tech Mind Academy",
    domain: "AI Research", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 3,
    skills: ["Python", "PyTorch", "Research", "LLMs", "Transformers"],
    description: "Assist researchers in developing and evaluating large language model applications and AI safety tools.",
    requirements: "Strong ML foundations, research aptitude.",
    lastDate: new Date(Date.now() + 33 * 864e5).toISOString(), isActive: true,
  },
  {
    _id: "s10", title: "Game Development Intern", company: "Tech Mind Academy",
    domain: "Game Development", location: "Remote", duration: "1 Month",
    stipend: "unpaid", type: "remote", openings: 2,
    skills: ["Unity", "C#", "Game Design", "3D Modeling", "Git"],
    description: "Help build and test 2D/3D games. Work on gameplay mechanics, UI, and bug fixing.",
    requirements: "Basic Unity or Unreal knowledge. Passion for gaming.",
    lastDate: new Date(Date.now() + 15 * 864e5).toISOString(), isActive: true,
  },
];

const DOMAIN_META = {
  "Web Development":    { icon: "💻", color: "from-blue-500 to-cyan-500",    light: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  "Data Science":       { icon: "📊", color: "from-emerald-500 to-teal-500",  light: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  "Machine Learning":   { icon: "🤖", color: "from-violet-500 to-purple-500", light: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" },
  "Cybersecurity":      { icon: "🔐", color: "from-red-500 to-rose-500",      light: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  "Cloud Computing":    { icon: "☁️", color: "from-sky-500 to-blue-500",      light: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  "Mobile Development": { icon: "📱", color: "from-orange-500 to-amber-500",  light: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  "UI/UX Design":       { icon: "🎨", color: "from-pink-500 to-fuchsia-500",  light: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
  "DevOps":             { icon: "⚙️", color: "from-gray-500 to-slate-500",    light: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  "Blockchain":         { icon: "🔗", color: "from-yellow-500 to-orange-500", light: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
  "AI Research":        { icon: "🧠", color: "from-indigo-500 to-violet-500", light: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
  "Game Development":   { icon: "🎮", color: "from-purple-500 to-pink-500",   light: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
};

const TYPE_STYLE = {
  remote:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  onsite:  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  hybrid:  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};
const TYPE_ICON = { remote: "🌐", onsite: "🏢", hybrid: "🔀" };

const DOMAINS = ["All", "Web Development", "Data Science", "Machine Learning",
  "Cybersecurity", "Cloud Computing", "Mobile Development", "UI/UX Design",
  "DevOps", "Blockchain", "AI Research", "Game Development"];

const BLANK_FORM = {
  name: "", email: "", phone: "", college: "",
  degree: "", year: "", whyApply: "", skills: "",
  linkedIn: "", github: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const isPast = (d) => d && new Date(d) < new Date();
const daysLeft = (d) => {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 864e5);
};
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl " +
  "bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

// ─────────────────────────────────────────────────────────────────────────────
  const Field = ({ label, children, span }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [domain, setDomain] = useState("All");
  const [applying, setApplying] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  // ── Fetch once (no params) — always merge backend + static, filter client-side
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/internships");
        const backendList = data.internships || [];
        // Merge: backend first, then static items whose _id isn't already present
        const backendIds = new Set(backendList.map((i) => i._id?.toString()));
        const merged = [
          ...backendList,
          ...STATIC_INTERNSHIPS.filter((i) => !backendIds.has(i._id)),
        ];
        setInternships(merged);
      } catch {
        setInternships(STATIC_INTERNSHIPS);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // fetch once on mount; filtering is client-side

  // ── Client-side filter (applied on static data too) ────────────────────────
  const filtered = internships.filter((i) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      i.title?.toLowerCase().includes(q) ||
      i.company?.toLowerCase().includes(q) ||
      i.skills?.some((s) => s.toLowerCase().includes(q));
    const matchType = !typeFilter || i.type === typeFilter;
    const matchDomain = domain === "All" || i.domain === domain;
    return matchSearch && matchType && matchDomain;
  });

  // ── Apply handlers ─────────────────────────────────────────────────────────
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
      // Static internship — one call handles everything (create internship + apply + email)
      await axios.post("/internships/apply-static", {
        internship: {
          title: applying.title,
          company: applying.company,
          domain: applying.domain,
          location: applying.location,
          duration: applying.duration,
          stipend: applying.stipend,
          type: applying.type,
          openings: applying.openings,
          skills: applying.skills,
          description: applying.description,
          requirements: applying.requirements,
          lastDate: applying.lastDate,
        },
        ...form,  // spread applicant fields directly at top level
      });
    } else {
      // Real DB internship — call apply directly
      await axios.post(`/api/internships/${applying._id}/apply`, form);
    }
    setSuccess(true);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to submit. Please try again.");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F6FA] dark:bg-gray-950 font-sans">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative bg-[#0B0F1E] overflow-hidden pt-20 pb-16 px-4">
          {/* Background layers */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              {STATIC_INTERNSHIPS.length} Live Opportunities
            </span>

            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Internship
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Explore real internship opportunities from top companies. Apply directly, build experience, and launch your tech career.
            </p>

            {/* Quick stats */}
            <div className="inline-flex items-center divide-x divide-white/10 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              {[
                { v: "10+", l: "Tech Domains" },
                { v: "50+", l: "Companies" },
                { v: "100%", l: "Free to Apply" },
                { v: "48hr", l: "Avg Response" },
              ].map((s) => (
                <div key={s.l} className="px-5 py-3 text-center">
                  <p className="text-xl font-black text-white leading-none">{s.v}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── STICKY FILTERS ───────────────────────────────────────────────── */}
        <div className="sticky top-16 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {/* Search + type */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search by role, company, skill..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]">
                <option value="">All Types</option>
                <option value="remote">🌐 Remote</option>
                <option value="onsite">🏢 Onsite</option>
                <option value="hybrid">🔀 Hybrid</option>
              </select>
            </div>
            {/* Domain chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DOMAINS.map((d) => {
                const active = domain === d || (d === "All" && domain === "All");
                return (
                  <button key={d} onClick={() => setDomain(d)}
                    className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                      active
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}>
                    {DOMAIN_META[d]?.icon} {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RESULTS COUNT ────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 pt-5 pb-1 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> internship{filtered.length !== 1 ? "s" : ""}
            {search && <> for "<span className="text-indigo-600">{search}</span>"</>}
          </p>
          {(search || typeFilter || domain !== "All") && (
            <button onClick={() => { setSearch(""); setTypeFilter(""); setDomain("All"); }}
              className="text-xs text-indigo-600 hover:underline font-semibold">
              Clear filters ×
            </button>
          )}
        </div>

        {/* ── LISTINGS ─────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 pb-20 pt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl h-72 border border-gray-100 dark:border-gray-800" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">No internships found</p>
              <p className="text-gray-400 text-sm">Try different search terms or clear filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((intern, i) => {
                const meta = DOMAIN_META[intern.domain] || { icon: "💼", color: "from-indigo-500 to-violet-500", light: "bg-indigo-50 text-indigo-700" };
                const expired = isPast(intern.lastDate);
                const days = daysLeft(intern.lastDate);
                const isExp = expanded === intern._id;

                return (
                  <motion.div key={intern._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  >
                    {/* Domain color bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${meta.color}`} />

                    <div className="p-5 flex flex-col flex-1">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                            {meta.icon}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">{intern.title}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold truncate">{intern.company}</p>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-[11px] font-bold px-2 py-1 rounded-full ${TYPE_STYLE[intern.type]}`}>
                          {TYPE_ICON[intern.type]} {intern.type.charAt(0).toUpperCase() + intern.type.slice(1)}
                        </span>
                      </div>

                      {/* Domain tag */}
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit mb-3 ${meta.light}`}>
                        {meta.icon} {intern.domain}
                      </span>

                      {/* Meta pills */}
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        {[
                          { e: "📍", v: intern.location },
                          { e: "⏱", v: intern.duration },
                          { e: "💰", v: intern.stipend },
                          { e: "👥", v: `${intern.openings} seat${intern.openings > 1 ? "s" : ""}` },
                        ].map((m) => (
                          <div key={m.v} className="flex items-center gap-1 truncate">
                            <span>{m.e}</span><span className="truncate">{m.v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                        {intern.description}
                      </p>

                      {/* Requirements (expanded) */}
                      <AnimatePresence>
                        {isExp && intern.requirements && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Requirements</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{intern.requirements}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Skill tags */}
                      {intern.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {intern.skills.slice(0, 4).map((s, j) => (
                            <span key={j} className="text-[11px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg font-medium">
                              {s}
                            </span>
                          ))}
                          {intern.skills.length > 4 && (
                            <span className="text-[11px] text-gray-400 px-1 py-0.5">+{intern.skills.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {intern.lastDate && (
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg ${
                              expired ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                                : days != null && days <= 7 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                                : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            }`}>
                              {expired ? "⛔ Closed" : days != null && days <= 7 ? `⚡ ${days}d left` : `📅 ${fmtDate(intern.lastDate)}`}
                            </span>
                          )}
                          <button onClick={() => setExpanded(isExp ? null : intern._id)}
                            className="text-[11px] text-gray-400 hover:text-indigo-500 transition font-medium">
                            {isExp ? "Less ▲" : "More ▼"}
                          </button>
                        </div>
                        <button
                          onClick={() => !expired && openApply(intern)}
                          disabled={expired}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            expired
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:shadow-indigo-200 dark:hover:shadow-none group-hover:scale-105"
                          }`}>
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

      {/* ── APPLICATION MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {applying && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setApplying(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 rounded-t-3xl px-6 py-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${DOMAIN_META[applying.domain]?.color || "from-indigo-500 to-violet-500"} flex items-center justify-center text-2xl shadow-lg`}>
                    {DOMAIN_META[applying.domain]?.icon || "💼"}
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 dark:text-white leading-tight">{applying.title}</h2>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">{applying.company}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLE[applying.type]}`}>
                        {TYPE_ICON[applying.type]} {applying.type}
                      </span>
                      <span className="text-xs text-gray-400">{applying.location} · {applying.duration} · {applying.stipend}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setApplying(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {success ? (
                <div className="p-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240 }}
                    className="text-7xl mb-5">🎉</motion.div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You're Shortlisted!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed text-sm">
                    Congratulations! Your application has been automatically <strong className="text-emerald-600">shortlisted</strong>. Check your email for a confirmation and next steps.
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6 max-w-sm mx-auto">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">✅ A confirmation email has been sent. Our team will reach out within 2–3 business days.</p>
                  </div>
                  <button onClick={() => setApplying(null)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Info banner */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">ℹ️</span>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      Applications are <strong>automatically shortlisted</strong>. Fill out all required fields accurately — our team reviews every submission personally.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name *">
                      <input type="text" required placeholder="Your full name" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Email Address *">
                      <input type="email" required placeholder="your@email.com" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Phone Number *">
                      <input type="tel" required placeholder="+91 XXXXX XXXXX" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Current Year *">
                      <select required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls}>
                        <option value="">Select year</option>
                        {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"].map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="College / University *" span>
                      <input type="text" required placeholder="Your college name" value={form.college}
                        onChange={(e) => setForm({ ...form, college: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Degree / Program *" span>
                      <input type="text" required placeholder="B.Tech CSE, BCA, MCA..." value={form.degree}
                        onChange={(e) => setForm({ ...form, degree: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Why do you want to apply? *" span>
                      <textarea required rows={4}
                        placeholder="Describe your motivation, relevant experience, and what you'll contribute..."
                        value={form.whyApply} onChange={(e) => setForm({ ...form, whyApply: e.target.value })}
                        className={`${inputCls} resize-none`} />
                    </Field>
                    <Field label="Skills (comma separated)" span>
                      <input type="text" placeholder="React, Python, Figma, Node.js..."
                        value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="LinkedIn Profile">
                      <input type="url" placeholder="https://linkedin.com/in/yourname"
                        value={form.linkedIn} onChange={(e) => setForm({ ...form, linkedIn: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="GitHub Profile">
                      <input type="url" placeholder="https://github.com/yourname"
                        value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className={inputCls} />
                    </Field>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 flex gap-2">
                      <span>⚠️</span> {error}
                    </div>
                  )}

                  <div className="flex gap-3 sticky bottom-0 bg-white dark:bg-gray-900 pt-2 pb-1 -mx-0">
                    <button type="button" onClick={() => setApplying(null)}
                      className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
                      {submitting ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg> Submitting...</>
                      ) : "Submit Application →"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
// // import { useState, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import axios from "axios";
// // import Navbar from "../components/Navbar";
// // import Footer from "../components/Footer";

// // const fadeUp = {
// //   initial: { opacity: 0, y: 24 },
// //   animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// // };

// // const TYPE_COLORS = {
// //   remote: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
// //   onsite: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
// //   hybrid: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
// // };

// // export default function InternshipsPage() {
// //   const [internships, setInternships] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [search, setSearch] = useState("");
// //   const [typeFilter, setTypeFilter] = useState("");
// //   const [applying, setApplying] = useState(null); // internship being applied to
// //   const [form, setForm] = useState({
// //     name: "", email: "", phone: "", college: "",
// //     degree: "", year: "", whyApply: "", skills: "",
// //     linkedIn: "", github: "",
// //   });
// //   const [submitting, setSubmitting] = useState(false);
// //   const [success, setSuccess] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     fetchInternships();
// //   }, [search, typeFilter]);

// //   const fetchInternships = async () => {
// //     try {
// //       setLoading(true);
// //       const params = {};
// //       if (search) params.search = search;
// //       if (typeFilter) params.type = typeFilter;
// //       const { data } = await axios.get("/api/internships", { params });
// //       setInternships(data.internships || []);
// //     } catch {
// //       setInternships([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleApply = (internship) => {
// //     setApplying(internship);
// //     setSuccess(false);
// //     setError("");
// //     setForm({
// //       name: "", email: "", phone: "", college: "",
// //       degree: "", year: "", whyApply: "", skills: "",
// //       linkedIn: "", github: "",
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setError("");
// //     try {
// //       await axios.post(`/api/internships/${applying._id}/apply`, form);
// //       setSuccess(true);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to submit application. Please try again.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const isPastDeadline = (lastDate) => {
// //     return lastDate && new Date(lastDate) < new Date();
// //   };

// //   return (
// //     <>
// //         <Navbar/>
// //         <div className="min-h-screen bg-white dark:bg-gray-950">

// //       {/* Hero */}
// //       <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 py-16 px-4 text-center">
// //         <motion.div variants={fadeUp} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-4">
// //           <span className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
// //             💼 Internship Opportunities
// //           </span>
// //           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
// //             Launch Your{" "}
// //             <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
// //               Career
// //             </span>
// //           </h1>
// //           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
// //             Explore internship opportunities across tech domains. Apply directly and kickstart your professional journey.
// //           </p>
// //         </motion.div>
// //       </section>

// //       {/* Filters */}
// //       <section className="py-6 px-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 z-20">
// //         <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
// //           <div className="relative flex-1">
// //             <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //             </svg>
// //             <input
// //               type="text"
// //               placeholder="Search internships, companies..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //             />
// //           </div>
// //           <select
// //             value={typeFilter}
// //             onChange={(e) => setTypeFilter(e.target.value)}
// //             className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //           >
// //             <option value="">All Types</option>
// //             <option value="remote">Remote</option>
// //             <option value="onsite">Onsite</option>
// //             <option value="hybrid">Hybrid</option>
// //           </select>
// //         </div>
// //       </section>

// //       {/* Listings */}
// //       <section className="py-10 px-4">
// //         <div className="max-w-6xl mx-auto">
// //           {loading ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {[1, 2, 3, 4].map((i) => (
// //                 <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-56" />
// //               ))}
// //             </div>
// //           ) : internships.length === 0 ? (
// //             <div className="text-center py-20 text-gray-400">
// //               <div className="text-5xl mb-4">💼</div>
// //               <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No internships found</p>
// //               <p className="text-sm mt-1 text-gray-400">Check back soon for new opportunities</p>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {internships.map((intern, i) => (
// //                 <motion.div
// //                   key={intern._id}
// //                   initial={{ opacity: 0, y: 24 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ delay: i * 0.06 }}
// //                   className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all flex flex-col"
// //                 >
// //                   {/* Header */}
// //                   <div className="flex items-start justify-between gap-3 mb-4">
// //                     <div>
// //                       <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{intern.title}</h3>
// //                       <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-0.5">{intern.company}</p>
// //                     </div>
// //                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${TYPE_COLORS[intern.type]}`}>
// //                       {intern.type.charAt(0).toUpperCase() + intern.type.slice(1)}
// //                     </span>
// //                   </div>

// //                   {/* Meta */}
// //                   <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
// //                     <div className="flex items-center gap-1.5">
// //                       <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
// //                       {intern.location}
// //                     </div>
// //                     <div className="flex items-center gap-1.5">
// //                       <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// //                       {intern.duration}
// //                     </div>
// //                     <div className="flex items-center gap-1.5">
// //                       <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// //                       {intern.stipend}
// //                     </div>
// //                     <div className="flex items-center gap-1.5">
// //                       <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
// //                       {intern.openings} opening{intern.openings > 1 ? "s" : ""}
// //                     </div>
// //                   </div>

// //                   {/* Description */}
// //                   <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
// //                     {intern.description}
// //                   </p>

// //                   {/* Skills */}
// //                   {intern.skills?.length > 0 && (
// //                     <div className="flex flex-wrap gap-1.5 mb-4">
// //                       {intern.skills.slice(0, 4).map((skill, j) => (
// //                         <span key={j} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">
// //                           {skill}
// //                         </span>
// //                       ))}
// //                       {intern.skills.length > 4 && (
// //                         <span className="text-xs text-gray-400">+{intern.skills.length - 4} more</span>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Footer */}
// //                   <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
// //                     {intern.lastDate && (
// //                       <span className={`text-xs font-medium ${isPastDeadline(intern.lastDate) ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
// //                         {isPastDeadline(intern.lastDate) ? "⛔ Deadline passed" : `📅 Apply by ${new Date(intern.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
// //                       </span>
// //                     )}
// //                     <button
// //                       onClick={() => !isPastDeadline(intern.lastDate) && handleApply(intern)}
// //                       disabled={isPastDeadline(intern.lastDate)}
// //                       className={`ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition ${
// //                         isPastDeadline(intern.lastDate)
// //                           ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
// //                           : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
// //                       }`}
// //                     >
// //                       {isPastDeadline(intern.lastDate) ? "Closed" : "Apply Now →"}
// //                     </button>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* Application Modal */}
// //       {applying && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0.95 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
// //           >
// //             <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// //               <div>
// //                 <h2 className="font-bold text-gray-900 dark:text-white text-lg">{applying.title}</h2>
// //                 <p className="text-indigo-600 dark:text-indigo-400 text-sm">{applying.company}</p>
// //               </div>
// //               <button onClick={() => setApplying(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg transition">
// //                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
// //               </button>
// //             </div>

// //             {success ? (
// //               <div className="p-8 text-center">
// //                 <div className="text-6xl mb-4">🎉</div>
// //                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
// //                 <p className="text-gray-500 dark:text-gray-400 mb-6">We've sent a confirmation to your email. Our team will get back to you within 3–5 business days.</p>
// //                 <button onClick={() => setApplying(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition">
// //                   Close
// //                 </button>
// //               </div>
// //             ) : (
// //               <form onSubmit={handleSubmit} className="p-6 space-y-5">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                   {[
// //                     { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name", required: true },
// //                     { label: "Email *", key: "email", type: "email", placeholder: "your@email.com", required: true },
// //                     { label: "Phone *", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX", required: true },
// //                     { label: "College / University *", key: "college", type: "text", placeholder: "Your college name", required: true },
// //                     { label: "Degree *", key: "degree", type: "text", placeholder: "B.Tech CSE, BCA, etc.", required: true },
// //                     { label: "Current Year *", key: "year", type: "select", options: ["1st", "2nd", "3rd", "4th", "Graduate"], required: true },
// //                   ].map((field) => (
// //                     <div key={field.key} className={field.key === "college" ? "sm:col-span-2" : ""}>
// //                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
// //                       {field.type === "select" ? (
// //                         <select
// //                           required={field.required}
// //                           value={form[field.key]}
// //                           onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
// //                           className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                         >
// //                           <option value="">Select year</option>
// //                           {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
// //                         </select>
// //                       ) : (
// //                         <input
// //                           type={field.type}
// //                           required={field.required}
// //                           placeholder={field.placeholder}
// //                           value={form[field.key]}
// //                           onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
// //                           className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                         />
// //                       )}
// //                     </div>
// //                   ))}

// //                   <div className="sm:col-span-2">
// //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Why do you want to apply? *</label>
// //                     <textarea
// //                       required
// //                       rows={4}
// //                       placeholder="Describe your motivation, what you hope to learn, and what you'll bring to the team..."
// //                       value={form.whyApply}
// //                       onChange={(e) => setForm({ ...form, whyApply: e.target.value })}
// //                       className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
// //                     />
// //                   </div>

// //                   <div className="sm:col-span-2">
// //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Skills (comma separated)</label>
// //                     <input
// //                       type="text"
// //                       placeholder="React, Node.js, Python, etc."
// //                       value={form.skills}
// //                       onChange={(e) => setForm({ ...form, skills: e.target.value })}
// //                       className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn Profile</label>
// //                     <input
// //                       type="url"
// //                       placeholder="https://linkedin.com/in/..."
// //                       value={form.linkedIn}
// //                       onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
// //                       className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Profile</label>
// //                     <input
// //                       type="url"
// //                       placeholder="https://github.com/..."
// //                       value={form.github}
// //                       onChange={(e) => setForm({ ...form, github: e.target.value })}
// //                       className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 {error && (
// //                   <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
// //                     {error}
// //                   </div>
// //                 )}

// //                 <div className="flex gap-3 pt-2">
// //                   <button
// //                     type="button"
// //                     onClick={() => setApplying(null)}
// //                     className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     disabled={submitting}
// //                     className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
// //                   >
// //                     {submitting ? "Submitting..." : "Submit Application →"}
// //                   </button>
// //                 </div>
// //               </form>
// //             )}
// //           </motion.div>
// //         </div>
// //       )}
// //     </div>
// //     <Footer/>
// //     </>
    
// //   );
// // }
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const fadeUp = {
//   initial: { opacity: 0, y: 24 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const TYPE_COLORS = {
//   remote: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
//   onsite: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
//   hybrid: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800",
// };

// const DOMAIN_ICONS = {
//   "Web Development": "💻", "Data Science": "📊", "Machine Learning": "🤖",
//   "Cybersecurity": "🔐", "Cloud Computing": "☁️", "Mobile Development": "📱",
//   "UI/UX Design": "🎨", "DevOps": "⚙️", "Blockchain": "🔗",
//   "Embedded Systems": "🔧", "Game Development": "🎮", "AI Research": "🧠",
// };

// // Static fallback internships for when API returns empty
// const STATIC_INTERNSHIPS = [
//   {
//     _id: "static1",
//     title: "Full Stack Developer Intern",
//     company: "TechMinds Solutions",
//     domain: "Web Development",
//     location: "Hyderabad",
//     duration: "3 Months",
//     stipend: "₹15,000/month",
//     type: "hybrid",
//     openings: 5,
//     skills: ["React", "Node.js", "MongoDB", "Express"],
//     description: "Work on live client projects using the MERN stack. You'll build and deploy full-stack web applications with a team of experienced developers.",
//     requirements: "Basic knowledge of HTML, CSS, JavaScript. Familiarity with React is a plus.",
//     lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static2",
//     title: "Data Science Intern",
//     company: "Analytics India Lab",
//     domain: "Data Science",
//     location: "Bangalore",
//     duration: "2 Months",
//     stipend: "₹12,000/month",
//     type: "remote",
//     openings: 3,
//     skills: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL"],
//     description: "Analyze real-world datasets, build predictive models, and present insights to stakeholders. Perfect for students with a passion for data.",
//     requirements: "Python basics, statistics fundamentals. Knowledge of ML libraries is a bonus.",
//     lastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static3",
//     title: "Machine Learning Research Intern",
//     company: "DeepThink AI",
//     domain: "Machine Learning",
//     location: "Pune",
//     duration: "4 Months",
//     stipend: "₹20,000/month",
//     type: "hybrid",
//     openings: 2,
//     skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NLP"],
//     description: "Contribute to cutting-edge ML research projects. Work alongside PhD researchers and help build next-generation AI models.",
//     requirements: "Strong Python skills, familiarity with ML concepts. Statistics background preferred.",
//     lastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static4",
//     title: "Cybersecurity Intern",
//     company: "SecureNet Technologies",
//     domain: "Cybersecurity",
//     location: "Delhi",
//     duration: "3 Months",
//     stipend: "₹18,000/month",
//     type: "onsite",
//     openings: 4,
//     skills: ["Network Security", "Ethical Hacking", "Linux", "Wireshark", "Python"],
//     description: "Learn penetration testing, vulnerability assessment, and incident response in a real enterprise security environment.",
//     requirements: "Basic networking knowledge, Linux fundamentals. CEH or CompTIA Security+ a bonus.",
//     lastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static5",
//     title: "Cloud & DevOps Intern",
//     company: "CloudNine Systems",
//     domain: "Cloud Computing",
//     location: "Remote",
//     duration: "3 Months",
//     stipend: "₹14,000/month",
//     type: "remote",
//     openings: 6,
//     skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
//     description: "Deploy and manage cloud infrastructure, set up CI/CD pipelines, and help automate deployment workflows for production systems.",
//     requirements: "Linux basics, understanding of networking. AWS fundamentals course completion preferred.",
//     lastDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static6",
//     title: "Android Developer Intern",
//     company: "MobileFirst App Studio",
//     domain: "Mobile Development",
//     location: "Chennai",
//     duration: "2 Months",
//     stipend: "₹10,000/month",
//     type: "hybrid",
//     openings: 3,
//     skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Firebase", "REST APIs"],
//     description: "Build and publish Android applications. Work on user-facing features, performance optimization, and app store publishing.",
//     requirements: "Basic Java/Kotlin knowledge. Familiarity with Android development lifecycle.",
//     lastDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static7",
//     title: "UI/UX Design Intern",
//     company: "PixelCraft Studios",
//     domain: "UI/UX Design",
//     location: "Mumbai",
//     duration: "2 Months",
//     stipend: "₹8,000/month",
//     type: "remote",
//     openings: 4,
//     skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
//     description: "Design intuitive and beautiful user interfaces for web and mobile apps. Work on user research, wireframes, prototypes, and final UI designs.",
//     requirements: "Basic Figma skills. Portfolio of design projects (even personal ones) is a must.",
//     lastDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
//   {
//     _id: "static8",
//     title: "Blockchain Developer Intern",
//     company: "Web3 Innovations",
//     domain: "Blockchain",
//     location: "Bangalore",
//     duration: "3 Months",
//     stipend: "₹22,000/month",
//     type: "remote",
//     openings: 2,
//     skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "React"],
//     description: "Build decentralized applications (dApps) and smart contracts on Ethereum. Work on DeFi protocols and NFT platforms.",
//     requirements: "JavaScript proficiency, interest in blockchain. Solidity basics is a strong plus.",
//     lastDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
//     isActive: true,
//   },
// ];

// const DOMAINS = ["All Domains", "Web Development", "Data Science", "Machine Learning", "Cybersecurity", "Cloud Computing", "Mobile Development", "UI/UX Design", "DevOps", "Blockchain"];

// export default function InternshipsPage() {
//   const [internships, setInternships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [domainFilter, setDomainFilter] = useState("");
//   const [applying, setApplying] = useState(null);
//   const [expanded, setExpanded] = useState(null);
//   const [form, setForm] = useState({
//     name: "", email: "", phone: "", college: "",
//     degree: "", year: "", whyApply: "", skills: "",
//     linkedIn: "", github: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => { fetchInternships(); }, [search, typeFilter, domainFilter]);

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (search) params.search = search;
//       if (typeFilter) params.type = typeFilter;
//       if (domainFilter && domainFilter !== "All Domains") params.domain = domainFilter;
//       const { data } = await axios.get("/api/internships", { params });
//       const list = data.internships || [];
//       setInternships(list.length > 0 ? list : STATIC_INTERNSHIPS);
//     } catch {
//       setInternships(STATIC_INTERNSHIPS);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filtered = internships.filter(intern => {
//     const searchLower = search.toLowerCase();
//     const matchSearch = !search || intern.title?.toLowerCase().includes(searchLower) ||
//       intern.company?.toLowerCase().includes(searchLower) ||
//       intern.domain?.toLowerCase().includes(searchLower) ||
//       intern.skills?.some(s => s.toLowerCase().includes(searchLower));
//     const matchType = !typeFilter || intern.type === typeFilter;
//     const matchDomain = !domainFilter || domainFilter === "All Domains" || intern.domain === domainFilter;
//     return matchSearch && matchType && matchDomain;
//   });

//   const handleApply = (internship) => {
//     setApplying(internship);
//     setSuccess(false);
//     setError("");
//     setForm({ name: "", email: "", phone: "", college: "", degree: "", year: "", whyApply: "", skills: "", linkedIn: "", github: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     try {
//       if (applying._id.startsWith("static")) {
//         await new Promise(r => setTimeout(r, 1200));
//         setSuccess(true);
//       } else {
//         await axios.post(`/api/internships/${applying._id}/apply`, form);
//         setSuccess(true);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit application. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const isPastDeadline = (lastDate) => lastDate && new Date(lastDate) < new Date();

//   const daysLeft = (lastDate) => {
//     if (!lastDate) return null;
//     const diff = Math.ceil((new Date(lastDate) - new Date()) / (1000 * 60 * 60 * 24));
//     return diff;
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

//         {/* ── Hero ── */}
//         <section className="relative bg-[#070B14] pt-24 pb-20 px-4 overflow-hidden">
//           <div className="absolute inset-0">
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_60%)]" />
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.12),transparent_60%)]" />
//             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
//           </div>
//           <motion.div variants={fadeUp} initial="initial" animate="animate" className="relative max-w-4xl mx-auto text-center space-y-5">
//             <span className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
//               </span>
//               {STATIC_INTERNSHIPS.length} Active Opportunities Available
//             </span>
//             <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight">
//               Launch Your Tech{" "}
//               <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Career</span>
//             </h1>
//             <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
//               Explore real internship opportunities across top tech fields. Apply directly and get hands-on industry experience.
//             </p>
//             {/* Quick stats */}
//             <div className="flex items-center justify-center gap-8 flex-wrap pt-2">
//               {[
//                 { label: "Open Roles", value: filtered.length + "+" },
//                 { label: "Tech Domains", value: "10+" },
//                 { label: "Top Companies", value: "50+" },
//                 { label: "Remote Options", value: "40%" },
//               ].map((s, i) => (
//                 <div key={i} className="text-center">
//                   <p className="text-2xl font-black text-white">{s.value}</p>
//                   <p className="text-xs text-gray-500">{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </section>

//         {/* ── Domain Chips ── */}
//         <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-16 z-20 shadow-sm">
//           <div className="max-w-6xl mx-auto">
//             {/* Search + Type filter row */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-3">
//               <div className="relative flex-1">
//                 <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//                 <input type="text" placeholder="Search by role, company, or skill..."
//                   value={search} onChange={(e) => setSearch(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//               </div>
//               <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
//                 className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[130px]">
//                 <option value="">All Types</option>
//                 <option value="remote">🌐 Remote</option>
//                 <option value="onsite">🏢 Onsite</option>
//                 <option value="hybrid">🔀 Hybrid</option>
//               </select>
//             </div>
//             {/* Domain chips */}
//             <div className="flex gap-2 flex-wrap">
//               {DOMAINS.map(d => (
//                 <button key={d} onClick={() => setDomainFilter(d === "All Domains" ? "" : d)}
//                   className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
//                     (d === "All Domains" && !domainFilter) || domainFilter === d
//                       ? "bg-indigo-600 text-white shadow-md"
//                       : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
//                   }`}>
//                   {DOMAIN_ICONS[d] && `${DOMAIN_ICONS[d]} `}{d}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── Results count ── */}
//         <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> internship{filtered.length !== 1 ? "s" : ""}
//             {search && <span> for "<span className="text-indigo-600">{search}</span>"</span>}
//           </p>
//         </div>

//         {/* ── Listings ── */}
//         <section className="pb-16 px-4">
//           <div className="max-w-6xl mx-auto">
//             {loading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {[1,2,3,4,5,6].map(i => (
//                   <div key={i} className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl h-64 border border-gray-100 dark:border-gray-800" />
//                 ))}
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="text-center py-20">
//                 <div className="text-6xl mb-4">🔍</div>
//                 <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No internships found</p>
//                 <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
//                 <button onClick={() => { setSearch(""); setTypeFilter(""); setDomainFilter(""); }}
//                   className="mt-4 text-indigo-600 font-semibold text-sm hover:underline">
//                   Clear all filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {filtered.map((intern, i) => {
//                   const days = daysLeft(intern.lastDate);
//                   const isExpired = isPastDeadline(intern.lastDate);
//                   const isExpanded = expanded === intern._id;
//                   return (
//                     <motion.div key={intern._id}
//                       initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.05 }}
//                       className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col group">
                      
//                       {/* Color accent top bar */}
//                       <div className={`h-1 w-full ${isExpired ? "bg-gray-200 dark:bg-gray-700" : "bg-gradient-to-r from-indigo-500 to-violet-500"}`} />

//                       <div className="p-6 flex flex-col flex-1">
//                         {/* Header */}
//                         <div className="flex items-start justify-between gap-3 mb-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center text-2xl flex-shrink-0">
//                               {DOMAIN_ICONS[intern.domain] || "💼"}
//                             </div>
//                             <div>
//                               <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{intern.title}</h3>
//                               <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">{intern.company}</p>
//                             </div>
//                           </div>
//                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${TYPE_COLORS[intern.type]}`}>
//                             {intern.type === "remote" ? "🌐" : intern.type === "onsite" ? "🏢" : "🔀"}{" "}
//                             {intern.type.charAt(0).toUpperCase() + intern.type.slice(1)}
//                           </span>
//                         </div>

//                         {/* Domain tag */}
//                         {intern.domain && (
//                           <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg w-fit mb-3">
//                             {intern.domain}
//                           </span>
//                         )}

//                         {/* Meta grid */}
//                         <div className="grid grid-cols-2 gap-2 mb-4">
//                           {[
//                             { icon: "📍", label: intern.location },
//                             { icon: "⏱", label: intern.duration },
//                             { icon: "💰", label: intern.stipend },
//                             { icon: "👥", label: `${intern.openings} opening${intern.openings > 1 ? "s" : ""}` },
//                           ].map((m, j) => (
//                             <div key={j} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
//                               <span className="text-base">{m.icon}</span>
//                               <span className="truncate">{m.label}</span>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Description */}
//                         <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
//                           {intern.description}
//                         </p>

//                         {/* Expanded details */}
//                         <AnimatePresence>
//                           {isExpanded && intern.requirements && (
//                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
//                               className="overflow-hidden">
//                               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-3">
//                                 <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Requirements</p>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">{intern.requirements}</p>
//                               </div>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>

//                         {/* Skills */}
//                         {intern.skills?.length > 0 && (
//                           <div className="flex flex-wrap gap-1.5 mb-4">
//                             {intern.skills.slice(0, 5).map((skill, j) => (
//                               <span key={j} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg font-medium">
//                                 {skill}
//                               </span>
//                             ))}
//                             {intern.skills.length > 5 && (
//                               <span className="text-xs text-gray-400 px-2 py-1">+{intern.skills.length - 5}</span>
//                             )}
//                           </div>
//                         )}

//                         {/* Footer */}
//                         <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
//                           <div className="flex items-center gap-3">
//                             {intern.lastDate && (
//                               <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
//                                 isExpired ? "bg-red-50 dark:bg-red-900/20 text-red-500"
//                                   : days <= 7 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
//                                   : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
//                               }`}>
//                                 {isExpired ? "⛔ Closed" : days <= 7 ? `⚡ ${days}d left` : `📅 ${new Date(intern.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
//                               </span>
//                             )}
//                             <button onClick={() => setExpanded(isExpanded ? null : intern._id)}
//                               className="text-xs text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
//                               {isExpanded ? "Show less ▲" : "Details ▼"}
//                             </button>
//                           </div>
//                           <button onClick={() => !isExpired && handleApply(intern)} disabled={isExpired}
//                             className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
//                               isExpired
//                                 ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
//                                 : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-200 dark:hover:shadow-none group-hover:scale-105"
//                             }`}>
//                             {isExpired ? "Closed" : "Apply Now →"}
//                           </button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* ── Application Modal ── */}
//       <AnimatePresence>
//         {applying && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
//             onClick={(e) => e.target === e.currentTarget && setApplying(null)}>
//             <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
//               className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
              
//               {/* Modal header */}
//               <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-start justify-between rounded-t-3xl z-10">
//                 <div>
//                   <div className="flex items-center gap-3 mb-1">
//                     <span className="text-2xl">{DOMAIN_ICONS[applying.domain] || "💼"}</span>
//                     <div>
//                       <h2 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{applying.title}</h2>
//                       <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">{applying.company}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 ml-9">
//                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[applying.type]}`}>
//                       {applying.type}
//                     </span>
//                     <span className="text-xs text-gray-500">{applying.location} · {applying.duration} · {applying.stipend}</span>
//                   </div>
//                 </div>
//                 <button onClick={() => setApplying(null)}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {success ? (
//                 <div className="p-10 text-center">
//                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
//                     className="text-7xl mb-5">🎉</motion.div>
//                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Application Submitted!</h3>
//                   <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
//                     Your application has been received. Our team will review it and get back to you within <strong>3–5 business days</strong>.
//                   </p>
//                   <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6 max-w-sm mx-auto">
//                     <p className="text-sm text-green-700 dark:text-green-400">✅ A confirmation email will be sent to your registered email address.</p>
//                   </div>
//                   <button onClick={() => setApplying(null)}
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition">
//                     Done
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="p-6 space-y-5">
//                   <p className="text-sm text-gray-500 dark:text-gray-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 rounded-xl px-4 py-3">
//                     📋 Your application will be reviewed by the hiring team. All fields marked with * are required.
//                   </p>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {[
//                       { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name", required: true },
//                       { label: "Email Address *", key: "email", type: "email", placeholder: "your@email.com", required: true },
//                       { label: "Phone Number *", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX", required: true },
//                       { label: "Degree / Program *", key: "degree", type: "text", placeholder: "B.Tech CSE, BCA, MCA...", required: true },
//                       { label: "Current Year *", key: "year", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"], required: true },
//                     ].map(field => (
//                       <div key={field.key}>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
//                         {field.type === "select" ? (
//                           <select required={field.required} value={form[field.key]}
//                             onChange={e => setForm({ ...form, [field.key]: e.target.value })}
//                             className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
//                             <option value="">Select year</option>
//                             {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                           </select>
//                         ) : (
//                           <input type={field.type} required={field.required} placeholder={field.placeholder}
//                             value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
//                             className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                         )}
//                       </div>
//                     ))}

//                     <div className="sm:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">College / University *</label>
//                       <input type="text" required placeholder="Your college or university name"
//                         value={form.college} onChange={e => setForm({ ...form, college: e.target.value })}
//                         className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Why do you want to apply? *</label>
//                       <textarea required rows={4}
//                         placeholder="Tell us about your motivation, what you hope to learn, relevant experience, and what you'll bring to the team..."
//                         value={form.whyApply} onChange={e => setForm({ ...form, whyApply: e.target.value })}
//                         className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Skills (comma separated)</label>
//                       <input type="text" placeholder="React, Python, Figma, Node.js, etc."
//                         value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
//                         className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn Profile</label>
//                       <input type="url" placeholder="https://linkedin.com/in/yourname"
//                         value={form.linkedIn} onChange={e => setForm({ ...form, linkedIn: e.target.value })}
//                         className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">GitHub Profile</label>
//                       <input type="url" placeholder="https://github.com/yourname"
//                         value={form.github} onChange={e => setForm({ ...form, github: e.target.value })}
//                         className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
//                     </div>
//                   </div>

//                   {error && (
//                     <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
//                       <span>⚠️</span> {error}
//                     </div>
//                   )}

//                   <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-gray-900 pb-1">
//                     <button type="button" onClick={() => setApplying(null)}
//                       className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
//                       Cancel
//                     </button>
//                     <button type="submit" disabled={submitting}
//                       className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-4 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
//                       {submitting ? (
//                         <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Submitting...</>
//                       ) : "Submit Application →"}
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <Footer />
//     </>
//   );
// }