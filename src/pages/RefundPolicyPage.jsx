import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const policies = [
  {
    id: "overview",
    icon: "📘",
    title: "Policy Overview",
    highlight: true,
    content: [
      {
        subtitle: "Our Commitment",
        text: "We want you to be completely satisfied with your learning experience. If a course doesn't meet your expectations, we offer a straightforward refund process with no questions asked within the eligible window.",
      },
      {
        subtitle: "Scope",
        text: "This policy applies to all course purchases made directly on the LearnHub platform. Purchases made through third-party affiliates or bundle packages may have separate terms.",
      },
    ],
  },
  {
    id: "eligibility",
    icon: "✅",
    title: "Refund Eligibility",
    content: [
      {
        subtitle: "30-Day Money-Back Guarantee",
        text: "You are eligible for a full refund if you request it within 30 days of your purchase date and have completed less than 30% of the course content.",
      },
      {
        subtitle: "Course Completion Threshold",
        text: "If you have completed 30% or more of a course, you are no longer eligible for a refund, as significant course value has already been consumed.",
      },
      {
        subtitle: "First Purchase Benefit",
        text: "First-time buyers on our platform receive an extended 24-hours refund window as part of our new learner welcome program.",
      },
    //   {
    //     subtitle: "Subscription Plans",
    //     text: "Monthly subscriptions may be cancelled at any time; you will retain access until the end of the paid billing period. Annual subscriptions are refundable within 14 days of renewal if no more than 2 courses have been accessed.",
    //   },
    ],
  },
  {
    id: "non-refundable",
    icon: "🚫",
    title: "Non-Refundable Items",
    content: [
      {
        subtitle: "Completed Courses",
        text: "Courses marked as 100% complete in your dashboard are not eligible for refunds, as the full learning value has been delivered.",
      },
      {
        subtitle: "Certificates",
        text: "Once a certificate of completion has been issued, the associated course purchase is non-refundable.",
      },
      {
        subtitle: "Live Sessions & Bootcamps",
        text: "Live workshops, cohort-based courses, and bootcamp sessions are non-refundable within 48 hours of the session start time.",
      },
      {
        subtitle: "Promotional Purchases",
        text: "Courses purchased at 80% or greater discount during flash sales or special promotions are final and non-refundable.",
      },
      {
        subtitle: "Abuse of Policy",
        text: "Accounts with a history of repeated refund requests (3 or more in a 12-month period) may be flagged and refunds may be denied at our discretion.",
      },
    ],
  },
  {
    id: "process",
    icon: "🔄",
    title: "How to Request a Refund",
    content: [
      {
        subtitle: "Step 1 — Submit a Request",
        text: "Visit your account dashboard, navigate to 'My Purchases', find the course, and click 'Request Refund'. Alternatively, email support@learnhub.com with your order ID.",
      },
      {
        subtitle: "Step 2 — Review Period",
        text: "Our support team will review your request within 2 business days and verify eligibility based on purchase date and course progress.",
      },
      {
        subtitle: "Step 3 — Confirmation",
        text: "You will receive an email confirmation once the refund is approved, along with the expected timeline for funds to appear in your account.",
      },
      {
        subtitle: "Step 4 — Access Revoked",
        text: "Upon refund approval, your access to the course and any associated materials or downloads will be revoked immediately.",
      },
    ],
  },
  {
    id: "timeline",
    icon: "⏱️",
    title: "Refund Timeline",
    content: [
      {
        subtitle: "Credit/Debit Cards",
        text: "Refunds are typically processed within 5–10 business days, depending on your card issuer and bank processing times.",
      },
      {
        subtitle: "UPI & Net Banking",
        text: "UPI refunds are usually processed within 3–5 business days. Net banking refunds may take up to 7 business days.",
      },
      {
        subtitle: "Platform Wallet / Credits",
        text: "Refunds issued as LearnHub credits are instant and can be used immediately on your next purchase.",
      },
      {
        subtitle: "International Payments",
        text: "International card refunds may take 10–15 business days depending on the issuing bank and currency conversion processing.",
      },
    ],
  },
  {
    id: "exchanges",
    icon: "🔀",
    title: "Course Exchanges",
    content: [
      {
        subtitle: "Switching Courses",
        text: "If you are not satisfied with a course but would prefer a different one rather than a refund, you may request a course exchange within the same 30-day window. The new course must be of equal or lesser value.",
      },
      {
        subtitle: "Price Difference",
        text: "If the replacement course costs more, you will be charged the difference. If it costs less, the remaining balance will be issued as LearnHub credits.",
      },
    ],
  },
  {
    id: "disputes",
    icon: "⚖️",
    title: "Disputes & Escalations",
    content: [
      {
        subtitle: "First Contact Resolution",
        text: "We aim to resolve all refund disputes at the first point of contact. If you're unsatisfied with our initial decision, you may escalate to our senior support team.",
      },
      {
        subtitle: "Chargebacks",
        text: "We encourage you to contact us before initiating a chargeback. Accounts with unauthorized chargebacks may be suspended. Legitimate disputes will always be honored through our refund process.",
      },
      {
        subtitle: "Governing Law",
        text: "This refund policy is governed by the laws of India. Any unresolved disputes shall be subject to the jurisdiction of courts in Punjab, India.",
      },
    ],
  },
];

const stats = [
  { value: "30", unit: "days", label: "Money-back guarantee" },
  { value: "48h", unit: "", label: "Request processing" },
  { value: "5–10", unit: "days", label: "Card refund timeline" },
  { value: "100%", unit: "", label: "No-questions-asked" },
];

export default function RefundPolicyPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-64 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      {/* Sticky nav */}
      {/* <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-black/20" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30">L</div>
            <span className="font-semibold text-slate-200 tracking-tight">LearnHub</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#" className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800/50">Home</a>
            <a href="#" className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800/50">Courses</a>
            <span className="px-3 py-1.5 text-violet-400 font-medium">Refund Policy</span>
          </div>
        </div>
      </nav> */}
      <Navbar/>

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Legal Document
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            We stand behind the quality of our courses. If you're not satisfied, our refund process is simple, fair, and transparent.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="text-slate-400">📅</span> Effective: January 1, 2025</span>
            <span className="flex items-center gap-1.5"><span className="text-slate-400">🔄</span> Last updated: May 15, 2025</span>
            <span className="flex items-center gap-1.5"><span className="text-slate-400">📖</span> ~5 min read</span>
          </div>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 text-center backdrop-blur-sm hover:border-violet-800/40 transition-colors duration-300">
              <div className="text-3xl font-bold text-violet-400 mb-1">
                {s.value}<span className="text-lg text-violet-500/70">{s.unit}</span>
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Table of Contents</p>
              <nav className="space-y-1">
                {policies.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => scrollTo(p.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === p.id
                        ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="leading-tight">{p.title}</span>
                  </button>
                ))}
              </nav>

              {/* Quick action */}
              <div className="mt-8 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-violet-400 mb-2">Need a refund?</p>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">Go to your dashboard and submit a request in under 2 minutes.</p>
                <button className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors duration-200">
                  Request Refund →
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-8">
            {policies.map((policy) => (
              <section
                key={policy.id}
                id={policy.id}
                className={`border rounded-2xl p-8 backdrop-blur-sm transition-colors duration-300 ${
                  policy.highlight
                    ? "bg-violet-900/10 border-violet-800/30 hover:border-violet-700/40"
                    : "bg-slate-900/50 border-slate-800/60 hover:border-slate-700/60"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                    policy.highlight
                      ? "bg-violet-500/15 border-violet-500/30"
                      : "bg-slate-800/60 border-slate-700/60"
                  }`}>
                    {policy.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-white">{policy.title}</h2>
                  {policy.highlight && (
                    <span className="ml-auto text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-medium">
                      Start here
                    </span>
                  )}
                </div>
                <div className="space-y-5">
                  {policy.content.map((item, i) => (
                    <div key={i} className="pl-4 border-l-2 border-slate-700/70 hover:border-violet-500/50 transition-colors duration-200">
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">{item.subtitle}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact section */}
            <section className="bg-gradient-to-br from-violet-600/15 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center text-xl">💬</div>
                <h2 className="text-xl font-semibold text-white">Need Help?</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Our support team is available Monday–Saturday, 9 AM – 6 PM IST. We'll do our best to resolve your query promptly.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Support Email", value: "support@learnhub.com" },
                  { label: "Response Time", value: "Within 48 business hours" },
                  { label: "Phone Support", value: "+91 98765 43210" },
                  { label: "Live Chat", value: "Available on Dashboard" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-900/60 rounded-xl px-4 py-3 border border-slate-800/60">
                    <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-sm text-slate-300 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="border-t border-slate-800/60 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2025 LearnHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Refund Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
}