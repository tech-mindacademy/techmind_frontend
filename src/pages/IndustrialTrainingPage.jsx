import { useState } from "react";
import { Monitor, Layers, Server, Smartphone, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { applyForTraining } from "../api/services/industrialTraining.service";

const DOMAINS = [
  { name: "Full Stack Development (MERN)", Icon: Layers, desc: "MongoDB, Express, React and Node.js, from database design to deployment." },
  { name: "Frontend Development", Icon: Monitor, desc: "HTML, CSS, JavaScript and React, building responsive interfaces." },
  { name: "Backend Development", Icon: Server, desc: "Node.js, Express, REST APIs, authentication and MongoDB." },
  { name: "Mobile App Development (React Native)", Icon: Smartphone, desc: "Android and iOS apps with React Native and Expo." },
];

const DURATIONS = [
  ["1 Month", "One stack, one focused project."],
  ["3 Months", "Commonly accepted for college training requirements."],
  ["6 Months", "Extended training with a larger end-to-end project."],
];

const WHY = [
  ["Built around a project", "The curriculum builds toward one working application instead of scattered topics."],
  ["Live sessions", "Classes are taught live by our trainers, with attendance recorded."],
  ["Reviewed assignments", "Assignments are checked and returned with feedback."],
  ["Certificate", "Issued when you complete the training and submit your project."],
];

const LEARN = [
  "Git and GitHub workflow",
  "REST API design and consumption",
  "Database design and modelling",
  "Authentication, validation and error handling",
  "Deploying an application",
  "Documenting and presenting a project",
];

const STEPS = [
  ["Apply", "Submit the form below. No payment is taken at this stage."],
  ["Review call", "Our team reviews your application and calls you."],
  ["Payment link", "If you decide to join, we email a Razorpay payment link."],
  ["Confirmation", "Your payment is verified automatically."],
  ["Portal access", "We email your portal login."],
  ["Training", "Attend sessions, finish assignments and submit your project."],
];

const FAQS = [
  ["Is this an internship?", "No. It is a structured industrial training program with a curriculum, assignments and a project."],
  ["Do I pay when I apply?", "No. The payment link is sent only after our team has spoken with you."],
  ["How do I pay?", "Through a secure Razorpay link emailed to the address you applied with."],
  ["When do I get portal access?", "After your payment is confirmed, our team emails your login."],
  ["Will I get a certificate?", "Yes, on completing the training and submitting your project."],
];

const BLANK = {
  name: "", email: "", phone: "", college: "", course: "", branch: "", semester: "",
  domain: "", duration: "", preferredStartDate: "", resumeUrl: "",
  skills: "", linkedIn: "", github: "", message: "",
};

const inputCls =
  "w-full px-3.5 py-2.5 border border-[#0D1B3E]/10 rounded-xl bg-white text-black text-sm placeholder-black/30 " +
  "focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/40 focus:border-[#1A56DB] transition";

const Field = ({ label, span, children }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <label className="block text-xs font-semibold text-black/60 mb-1.5">{label}</label>
    {children}
  </div>
);

const IconBox = ({ Icon }) => (
  <div
    className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center shrink-0"
    style={{ boxShadow: "0 6px 16px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" }}
  >
    <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
  </div>
);

const Heading = ({ children, sub }) => (
  <div className="mb-8">
    <h2 className="text-2xl sm:text-3xl font-black text-[#1A56DB]">{children}</h2>
    {sub && <p className="text-black/50 mt-2 max-w-2xl">{sub}</p>}
  </div>
);

export default function IndustrialTrainingPage() {
  const [form, setForm] = useState(BLANK);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await applyForTraining(form);
      setDone(true);
      setForm(BLANK);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.message || data?.message || "Unable to submit the application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white font-sans">
      <section className="relative overflow-hidden pt-20 pb-16 px-4 border-b border-[#0D1B3E]/10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-[#1A56DB] leading-[1.1] tracking-tight max-w-3xl">
            Industrial Training Program
          </h1>
          <p className="text-lg text-black/60 max-w-2xl leading-relaxed mt-5">
            Project-based training for engineering and computer science students, with a defined
            curriculum, assessed assignments and a final project. It is a training program, not an internship.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#apply" className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl text-sm transition">
              Apply now
            </a>
            <a href="#process" className="border border-[#0D1B3E]/15 text-black/70 hover:bg-[#0D1B3E]/5 font-semibold px-6 py-3 rounded-xl text-sm transition">
              How it works
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <Heading>Overview</Heading>
        <p className="text-black/70 leading-relaxed max-w-3xl">
          The program is for students who need industrial training as part of their degree and want to
          build working software while doing it. You train on one stack, complete assignments in a
          student portal, attend live sessions, and finish with a project that you present.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-14">
        <Heading>Why choose this training</Heading>
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          {WHY.map(([t, d]) => (
            <div key={t}>
              <dt className="font-black text-black text-sm">{t}</dt>
              <dd className="text-sm text-black/50 mt-1 leading-relaxed">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-[#1A56DB]/[0.03] border-y border-[#0D1B3E]/10">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <Heading sub="Pick the stack that matches your degree requirement or career goal.">Training domains</Heading>
          <div className="grid sm:grid-cols-2 gap-4">
            {DOMAINS.map(({ name, Icon, desc }) => (
              <div key={name} className="bg-white border border-[#0D1B3E]/10 rounded-2xl p-5 flex gap-4">
                <IconBox Icon={Icon} />
                <div>
                  <h3 className="font-black text-black text-sm">{name}</h3>
                  <p className="text-sm text-black/50 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <Heading>What you will learn</Heading>
          <ul className="space-y-2.5">
            {LEARN.map((l) => (
              <li key={l} className="flex gap-2.5 text-sm text-black/70">
                <CheckCircle className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2} />
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Heading>Training duration</Heading>
          <dl className="divide-y divide-[#0D1B3E]/10 border-y border-[#0D1B3E]/10">
            {DURATIONS.map(([n, d]) => (
              <div key={n} className="py-3 flex gap-6">
                <dt className="font-black text-black text-sm w-24 shrink-0">{n}</dt>
                <dd className="text-sm text-black/50">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="process" className="max-w-5xl mx-auto px-4 pb-14 scroll-mt-20">
        <Heading sub="Nothing is charged or unlocked until you have spoken with our team.">Training process and how to apply</Heading>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="border border-[#0D1B3E]/10 rounded-2xl p-5">
              <span className="text-xs font-bold text-[#1A56DB]">Step {i + 1}</span>
              <h3 className="font-black text-black text-sm mt-1">{title}</h3>
              <p className="text-sm text-black/50 mt-1 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-12">
        <div>
          <Heading>Eligibility</Heading>
          <ul className="list-disc pl-5 space-y-2 text-sm text-black/70">
            <li>Students of B.Tech, BCA, MCA, B.Sc (IT/CS) or diploma programs</li>
            <li>Basic programming knowledge</li>
            <li>A laptop and a stable internet connection</li>
          </ul>
        </div>
        <div>
          <Heading>Benefits</Heading>
          <ul className="list-disc pl-5 space-y-2 text-sm text-black/70">
            <li>A working project for your portfolio</li>
            <li>Training completion certificate</li>
            <li>Portal access for live sessions and course material</li>
          </ul>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-14">
        <Heading>FAQ</Heading>
        <div className="divide-y divide-[#0D1B3E]/10 border-y border-[#0D1B3E]/10">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-bold text-sm text-black">
                {q}
                <ChevronDown className="w-4 h-4 text-black/30 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-2 text-sm text-black/50 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="apply" className="border-t border-[#0D1B3E]/10 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 py-14">
          <Heading sub="Our team will call you after reviewing your application. No payment is taken now.">
            Apply for Industrial Training
          </Heading>

          {done ? (
            <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-6 flex gap-3" role="status">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-emerald-800 text-sm">Application received</p>
                <p className="text-sm text-emerald-700 mt-1">
                  A confirmation has been emailed to you. Our team will contact you on the phone number provided.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name *"><input required className={inputCls} value={form.name} onChange={set("name")} /></Field>
              <Field label="Email *"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} /></Field>
              <Field label="Phone number *"><input required type="tel" className={inputCls} placeholder="+91" value={form.phone} onChange={set("phone")} /></Field>
              <Field label="Current semester / year *"><input required className={inputCls} placeholder="e.g. 6th Semester" value={form.semester} onChange={set("semester")} /></Field>
              <Field label="College / university *" span><input required className={inputCls} value={form.college} onChange={set("college")} /></Field>
              <Field label="Course / degree *"><input required className={inputCls} placeholder="B.Tech, BCA, MCA" value={form.course} onChange={set("course")} /></Field>
              <Field label="Branch *"><input required className={inputCls} placeholder="Computer Science" value={form.branch} onChange={set("branch")} /></Field>
              <Field label="Training domain *">
                <select required className={inputCls} value={form.domain} onChange={set("domain")}>
                  <option value="">Select domain</option>
                  {DOMAINS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Training duration *">
                <select required className={inputCls} value={form.duration} onChange={set("duration")}>
                  <option value="">Select duration</option>
                  {DURATIONS.map(([n]) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Preferred start date">
                <input type="date" className={inputCls} min={new Date().toISOString().split("T")[0]} value={form.preferredStartDate} onChange={set("preferredStartDate")} />
              </Field>
              <Field label="Resume link">
                <input type="url" className={inputCls} placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={set("resumeUrl")} />
              </Field>
              <Field label="Skills" span><input className={inputCls} placeholder="HTML, JavaScript, Python" value={form.skills} onChange={set("skills")} /></Field>
              <Field label="LinkedIn"><input type="url" className={inputCls} value={form.linkedIn} onChange={set("linkedIn")} /></Field>
              <Field label="GitHub"><input type="url" className={inputCls} value={form.github} onChange={set("github")} /></Field>
              <Field label="Additional message" span>
                <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`} value={form.message} onChange={set("message")} />
              </Field>

              {error && (
                <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white font-bold px-7 py-3 rounded-xl text-sm transition inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
