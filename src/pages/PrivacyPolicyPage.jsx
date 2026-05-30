import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: "📋",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you register for an account, we collect your name, email address, password (encrypted), and optional profile details such as your profile picture and bio.",
      },
      {
        subtitle: "Learning Data",
        text: "We collect data about your course progress, quiz scores, assignment submissions, completion certificates, and time spent on each lesson to personalize your learning experience.",
      },
      {
        subtitle: "Payment Information",
        text: "For purchases, we collect billing details. All payment data is processed securely through our payment partners and we do not store your full card details on our servers.",
      },
      {
        subtitle: "Technical Data",
        text: "We automatically collect IP address, browser type, device information, operating system, and usage logs to ensure platform security and performance.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    icon: "⚙️",
    content: [
      {
        subtitle: "Delivering Services",
        text: "To provide access to courses, track your progress, issue certificates, and personalize your learning dashboard.",
      },
      {
        subtitle: "Communication",
        text: "To send transactional emails (enrollment confirmations, receipts), course updates, and — with your consent — marketing communications and newsletters.",
      },
      {
        subtitle: "Improvement & Analytics",
        text: "To analyze usage patterns, fix bugs, improve content quality, and enhance the overall user experience on our platform.",
      },
      {
        subtitle: "Legal & Security",
        text: "To comply with applicable laws, prevent fraud, resolve disputes, and enforce our Terms of Service.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Disclosure",
    icon: "🔗",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        text: "We never sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
      {
        subtitle: "Service Providers",
        text: "We share data with trusted third-party vendors (payment processors, email services, analytics tools) solely to operate our platform, under strict data protection agreements.",
      },
      {
        subtitle: "Instructors",
        text: "Course instructors may see aggregated, anonymized data about student engagement. They do not have access to your private account details or payment information.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required by law, court order, or government authority, or to protect the rights and safety of our users.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    icon: "🔒",
    content: [
      {
        subtitle: "Encryption",
        text: "All data is transmitted over HTTPS with TLS encryption. Passwords are hashed using industry-standard algorithms and are never stored in plain text.",
      },
      {
        subtitle: "Access Controls",
        text: "Access to personal data is restricted to authorized personnel on a need-to-know basis, and all access is logged and audited regularly.",
      },
      {
        subtitle: "Breach Response",
        text: "In the event of a data breach that affects your personal information, we will notify you within 72 hours as required by applicable data protection laws.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: "⚖️",
    content: [
      {
        subtitle: "Access & Portability",
        text: "You can request a copy of all personal data we hold about you at any time, in a machine-readable format.",
      },
      {
        subtitle: "Correction",
        text: "You can update or correct your personal information directly in your account settings, or contact us for assistance.",
      },
      {
        subtitle: "Deletion",
        text: "You may request deletion of your account and associated personal data. Note that some data may be retained for legal or financial compliance periods.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can unsubscribe from marketing emails at any time using the unsubscribe link in any email, or via your notification preferences in account settings.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: "🍪",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "Required for the platform to function, such as keeping you logged in and maintaining your session. These cannot be disabled.",
      },
      {
        subtitle: "Analytics Cookies",
        text: "Help us understand how users interact with the platform so we can improve the experience. You can opt out via your browser settings or our cookie preferences panel.",
      },
      {
        subtitle: "Marketing Cookies",
        text: "Used to show you relevant course recommendations and ads. These are only set with your explicit consent.",
      },
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: "👶",
    content: [
      {
        subtitle: "Age Requirement",
        text: "Our platform is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If we discover such data has been collected, we will delete it immediately.",
      },
      {
        subtitle: "Parental Consent",
        text: "For users between 13–18, we encourage parental involvement. Parents or guardians may contact us to review or request deletion of their child's data.",
      },
    ],
  },
  {
    id: "updates",
    title: "Policy Updates",
    icon: "🔄",
    content: [
      {
        subtitle: "Notification of Changes",
        text: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email and a prominent notice on our platform at least 14 days before the changes take effect.",
      },
      {
        subtitle: "Continued Use",
        text: "Your continued use of the platform after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-64 bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      {/* Sticky nav */}
      {/* <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-black/20" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">L</div>
            <span className="font-semibold text-slate-200 tracking-tight">LearnHub</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#" className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800/50">Home</a>
            <a href="#" className="px-3 py-1.5 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800/50">Courses</a>
            <span className="px-3 py-1.5 text-indigo-400 font-medium">Privacy Policy</span>
          </div>
        </div>
      </nav> */}
      <Navbar/>

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Legal Document
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Policy</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            We're committed to protecting your personal data. This policy explains what we collect, how we use it, and your rights as a learner on our platform.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><span className="text-slate-400">📅</span> Effective: January 1, 2025</span>
            <span className="flex items-center gap-1.5"><span className="text-slate-400">🔄</span> Last updated: May 15, 2025</span>
            <span className="flex items-center gap-1.5"><span className="text-slate-400">📖</span> ~8 min read</span>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Table of Contents</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === s.id
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="leading-tight">{s.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 backdrop-blur-sm hover:border-slate-700/60 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <div className="space-y-5">
                  {section.content.map((item, i) => (
                    <div key={i} className="pl-4 border-l-2 border-slate-700/70 hover:border-indigo-500/50 transition-colors duration-200">
                      <h3 className="text-sm font-semibold text-slate-300 mb-1">{item.subtitle}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact */}
            <section className="bg-gradient-to-br from-indigo-600/15 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-xl">📬</div>
                <h2 className="text-xl font-semibold text-white">Contact Us</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please reach out to our Data Protection team.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Email", value: "techmindacademy70@gmail.com" },
                  { label: "Response Time", value: "Within 48 hours" },
                  { label: "Address", value: "LearnHub Inc., Tech City, IN 141001" },
                  { label: "DPO", value: "dpo@learnhub.com" },
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