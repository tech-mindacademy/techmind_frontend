// // import { useState } from "react";
// // import { Monitor, Layers, Server, Smartphone, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// // import { applyForTraining } from "../api/services/industrialTraining.service";

// // const DOMAINS = [
// //   { name: "Full Stack Development (MERN)", Icon: Layers, desc: "MongoDB, Express, React and Node.js, from database design to deployment." },
// //   { name: "Frontend Development", Icon: Monitor, desc: "HTML, CSS, JavaScript and React, building responsive interfaces." },
// //   { name: "Backend Development", Icon: Server, desc: "Node.js, Express, REST APIs, authentication and MongoDB." },
// //   { name: "Mobile App Development (React Native)", Icon: Smartphone, desc: "Android and iOS apps with React Native and Expo." },
// //   { name: "Cyber Security", Icon: AlertCircle, desc: "Protecting systems and networks from digital threats." },
// //   { name: "Cloud Computing", Icon: Server, desc: "Deploying and managing applications on cloud platforms." },
// //   { name: "DevOps", Icon: Layers, desc: "Integrating development and operations for faster delivery." },
// //   { name: "UI/UX Design", Icon: Monitor, desc: "Creating intuitive and visually appealing user interfaces." },
// //   { name: "Graphic Design", Icon: Layers, desc: "Designing visual content for digital and print media." },
// //   { name: "AI/ML", Icon: Layers, desc: "Building intelligent systems using machine learning algorithms." },
// //   { name: "Data Science", Icon: Layers, desc: "Extracting insights from data using statistical and computational methods." },
// // ];

// // const DURATIONS = [
// //   ["1 Month", "One stack, one focused project."],
// //   ["2 Months", "Balanced duration for comprehensive learning."],
// //   ["3 Months", "Commonly accepted for college training requirements."],
// //   ["6 Months", "Extended training with a larger end-to-end project."],
// //   ["1 Year", "Deep dive into multiple stacks and advanced topics."],
// // ];

// // const WHY = [
// //   ["Built around a project", "The curriculum builds toward one working application instead of scattered topics."],
// //   ["Live sessions", "Classes are taught live by our trainers, with attendance recorded."],
// //   ["Reviewed assignments", "Assignments are checked and returned with feedback."],
// //   ["Certificate", "Issued when you complete the training and submit your project."],
// // ];

// // const LEARN = [
// //   "Git and GitHub workflow",
// //   "REST API design and consumption",
// //   "Database design and modelling",
// //   "Authentication, validation and error handling",
// //   "Deploying an application",
// //   "Documenting and presenting a project",
// // ];

// // const STEPS = [
// //   ["Apply", "Submit the form below. No payment is taken at this stage."],
// //   ["Review call", "Our team reviews your application and calls you."],
// //   ["Payment link", "If you decide to join, we email a Razorpay payment link."],
// //   ["Confirmation", "Your payment is verified automatically."],
// //   ["Portal access", "We email your portal login."],
// //   ["Training", "Attend sessions, finish assignments and submit your project."],
// // ];

// // const FAQS = [
// //   ["Is this an internship?", "No. It is a structured industrial training program with a curriculum, assignments and a project."],
// //   ["Do I pay when I apply?", "No. The payment link is sent only after our team has spoken with you."],
// //   ["How do I pay?", "Through a secure Razorpay link emailed to the address you applied with."],
// //   ["When do I get portal access?", "After your payment is confirmed, our team emails your login."],
// //   ["Will I get a certificate?", "Yes, on completing the training and submitting your project."],
// // ];

// // const BLANK = {
// //   name: "", email: "", phone: "", college: "", course: "", branch: "", semester: "",
// //   domain: "", duration: "", preferredStartDate: "", resumeUrl: "",
// //   skills: "", linkedIn: "", github: "", message: "",
// // };

// // const inputCls =
// //   "w-full px-3.5 py-2.5 border border-[#0D1B3E]/10 rounded-xl bg-white text-black text-sm placeholder-black/30 " +
// //   "focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/40 focus:border-[#1A56DB] transition";

// // const Field = ({ label, span, children }) => (
// //   <div className={span ? "sm:col-span-2" : ""}>
// //     <label className="block text-xs font-semibold text-black/60 mb-1.5">{label}</label>
// //     {children}
// //   </div>
// // );

// // const IconBox = ({ Icon }) => (
// //   <div
// //     className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center shrink-0"
// //     style={{ boxShadow: "0 6px 16px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" }}
// //   >
// //     <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
// //   </div>
// // );

// // const Heading = ({ children, sub }) => (
// //   <div className="mb-8">
// //     <h2 className="text-2xl sm:text-3xl font-black text-[#1A56DB]">{children}</h2>
// //     {sub && <p className="text-black/50 mt-2 max-w-2xl">{sub}</p>}
// //   </div>
// // );

// // export default function IndustrialTrainingPage() {
// //   const [form, setForm] = useState(BLANK);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [done, setDone] = useState(false);
// //   const [error, setError] = useState("");

// //   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setError("");
// //     try {
// //       await applyForTraining(form);
// //       setDone(true);
// //       setForm(BLANK);
// //     } catch (err) {
// //       const data = err.response?.data;
// //       setError(data?.errors?.[0]?.message || data?.message || "Unable to submit the application. Please try again.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-white font-sans">
// //       <section className="relative overflow-hidden pt-20 pb-16 px-4 border-b border-[#0D1B3E]/10">
// //         <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
// //         <div className="relative max-w-5xl mx-auto">
// //           <h1 className="text-4xl sm:text-6xl font-black text-[#1A56DB] leading-[1.1] tracking-tight max-w-3xl">
// //             Industrial Training Program
// //           </h1>
// //           <p className="text-lg text-black/60 max-w-2xl leading-relaxed mt-5">
// //             Project-based training for engineering and computer science students, with a defined
// //             curriculum, assessed assignments and a final project. It is a training program, not an internship.
// //           </p>
// //           <div className="flex flex-wrap gap-3 mt-8">
// //             <a href="#apply" className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3 rounded-xl text-sm transition">
// //               Apply now
// //             </a>
// //             <a href="#process" className="border border-[#0D1B3E]/15 text-black/70 hover:bg-[#0D1B3E]/5 font-semibold px-6 py-3 rounded-xl text-sm transition">
// //               How it works
// //             </a>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="max-w-5xl mx-auto px-4 py-14">
// //         <Heading>Overview</Heading>
// //         <p className="text-black/70 leading-relaxed max-w-3xl">
// //           The program is for students who need industrial training as part of their degree and want to
// //           build working software while doing it. You train on one stack, complete assignments in a
// //           student portal, attend live sessions, and finish with a project that you present.
// //         </p>
// //       </section>

// //       <section className="max-w-5xl mx-auto px-4 pb-14">
// //         <Heading>Why choose this training</Heading>
// //         <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
// //           {WHY.map(([t, d]) => (
// //             <div key={t}>
// //               <dt className="font-black text-black text-sm">{t}</dt>
// //               <dd className="text-sm text-black/50 mt-1 leading-relaxed">{d}</dd>
// //             </div>
// //           ))}
// //         </dl>
// //       </section>

// //       <section className="bg-[#1A56DB]/[0.03] border-y border-[#0D1B3E]/10">
// //         <div className="max-w-5xl mx-auto px-4 py-14">
// //           <Heading sub="Pick the stack that matches your degree requirement or career goal.">Training domains</Heading>
// //           <div className="grid sm:grid-cols-2 gap-4">
// //             {DOMAINS.map(({ name, Icon, desc }) => (
// //               <div key={name} className="bg-white border border-[#0D1B3E]/10 rounded-2xl p-5 flex gap-4">
// //                 <IconBox Icon={Icon} />
// //                 <div>
// //                   <h3 className="font-black text-black text-sm">{name}</h3>
// //                   <p className="text-sm text-black/50 mt-1 leading-relaxed">{desc}</p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       <section className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-12">
// //         <div>
// //           <Heading>What you will learn</Heading>
// //           <ul className="space-y-2.5">
// //             {LEARN.map((l) => (
// //               <li key={l} className="flex gap-2.5 text-sm text-black/70">
// //                 <CheckCircle className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2} />
// //                 {l}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //         <div>
// //           <Heading>Training duration</Heading>
// //           <dl className="divide-y divide-[#0D1B3E]/10 border-y border-[#0D1B3E]/10">
// //             {DURATIONS.map(([n, d]) => (
// //               <div key={n} className="py-3 flex gap-6">
// //                 <dt className="font-black text-black text-sm w-24 shrink-0">{n}</dt>
// //                 <dd className="text-sm text-black/50">{d}</dd>
// //               </div>
// //             ))}
// //           </dl>
// //         </div>
// //       </section>

// //       <section id="process" className="max-w-5xl mx-auto px-4 pb-14 scroll-mt-20">
// //         <Heading sub="Nothing is charged or unlocked until you have spoken with our team.">Training process and how to apply</Heading>
// //         <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {STEPS.map(([title, text], i) => (
// //             <li key={title} className="border border-[#0D1B3E]/10 rounded-2xl p-5">
// //               <span className="text-xs font-bold text-[#1A56DB]">Step {i + 1}</span>
// //               <h3 className="font-black text-black text-sm mt-1">{title}</h3>
// //               <p className="text-sm text-black/50 mt-1 leading-relaxed">{text}</p>
// //             </li>
// //           ))}
// //         </ol>
// //       </section>

// //       <section className="max-w-5xl mx-auto px-4 pb-14 grid md:grid-cols-2 gap-12">
// //         <div>
// //           <Heading>Eligibility</Heading>
// //           <ul className="list-disc pl-5 space-y-2 text-sm text-black/70">
// //             <li>Students of B.Tech, BCA, MCA, B.Sc (IT/CS) or diploma programs</li>
// //             <li>Basic programming knowledge</li>
// //             <li>A laptop and a stable internet connection</li>
// //           </ul>
// //         </div>
// //         <div>
// //           <Heading>Benefits</Heading>
// //           <ul className="list-disc pl-5 space-y-2 text-sm text-black/70">
// //             <li>A working project for your portfolio</li>
// //             <li>Training completion certificate</li>
// //             <li>Portal access for live sessions and course material</li>
// //           </ul>
// //         </div>
// //       </section>

// //       <section className="max-w-3xl mx-auto px-4 pb-14">
// //         <Heading>FAQ</Heading>
// //         <div className="divide-y divide-[#0D1B3E]/10 border-y border-[#0D1B3E]/10">
// //           {FAQS.map(([q, a]) => (
// //             <details key={q} className="group py-4">
// //               <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-bold text-sm text-black">
// //                 {q}
// //                 <ChevronDown className="w-4 h-4 text-black/30 group-open:rotate-180 transition-transform" />
// //               </summary>
// //               <p className="mt-2 text-sm text-black/50 leading-relaxed">{a}</p>
// //             </details>
// //           ))}
// //         </div>
// //       </section>

// //       <section id="apply" className="border-t border-[#0D1B3E]/10 scroll-mt-16">
// //         <div className="max-w-3xl mx-auto px-4 py-14">
// //           <Heading sub="Our team will call you after reviewing your application. No payment is taken now.">
// //             Apply for Industrial Training
// //           </Heading>

// //           {done ? (
// //             <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-6 flex gap-3" role="status">
// //               <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
// //               <div>
// //                 <p className="font-black text-emerald-800 text-sm">Application received</p>
// //                 <p className="text-sm text-emerald-700 mt-1">
// //                   A confirmation has been emailed to you. Our team will contact you on the phone number provided.
// //                 </p>
// //               </div>
// //             </div>
// //           ) : (
// //             <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
// //               <Field label="Full name *"><input required className={inputCls} value={form.name} onChange={set("name")} /></Field>
// //               <Field label="Email *"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} /></Field>
// //               <Field label="Phone number *"><input required type="tel" className={inputCls} placeholder="+91" value={form.phone} onChange={set("phone")} /></Field>
// //               <Field label="Current semester / year *"><input required className={inputCls} placeholder="e.g. 6th Semester" value={form.semester} onChange={set("semester")} /></Field>
// //               <Field label="College / university *" span><input required className={inputCls} value={form.college} onChange={set("college")} /></Field>
// //               <Field label="Course / degree *"><input required className={inputCls} placeholder="B.Tech, BCA, MCA" value={form.course} onChange={set("course")} /></Field>
// //               <Field label="Branch *"><input required className={inputCls} placeholder="Computer Science" value={form.branch} onChange={set("branch")} /></Field>
// //               <Field label="Training domain *">
// //                 <select required className={inputCls} value={form.domain} onChange={set("domain")}>
// //                   <option value="">Select domain</option>
// //                   {DOMAINS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
// //                 </select>
// //               </Field>
// //               <Field label="Training duration *">
// //                 <select required className={inputCls} value={form.duration} onChange={set("duration")}>
// //                   <option value="">Select duration</option>
// //                   {DURATIONS.map(([n]) => <option key={n} value={n}>{n}</option>)}
// //                 </select>
// //               </Field>
// //               <Field label="Preferred start date">
// //                 <input type="date" className={inputCls} min={new Date().toISOString().split("T")[0]} value={form.preferredStartDate} onChange={set("preferredStartDate")} />
// //               </Field>
// //               <Field label="Resume link">
// //                 <input type="url" className={inputCls} placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={set("resumeUrl")} />
// //               </Field>
// //               <Field label="Skills" span><input className={inputCls} placeholder="HTML, JavaScript, Python" value={form.skills} onChange={set("skills")} /></Field>
// //               <Field label="LinkedIn"><input type="url" className={inputCls} value={form.linkedIn} onChange={set("linkedIn")} /></Field>
// //               <Field label="GitHub"><input type="url" className={inputCls} value={form.github} onChange={set("github")} /></Field>
// //               <Field label="Additional message" span>
// //                 <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`} value={form.message} onChange={set("message")} />
// //               </Field>

// //               {error && (
// //                 <div className="sm:col-span-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex gap-2" role="alert">
// //                   <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
// //                 </div>
// //               )}

// //               <div className="sm:col-span-2">
// //                 <button
// //                   type="submit"
// //                   disabled={submitting}
// //                   className="bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white font-bold px-7 py-3 rounded-xl text-sm transition inline-flex items-center gap-2"
// //                 >
// //                   {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
// //                   {submitting ? "Submitting..." : "Submit application"}
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import {
//   Monitor, Layers, Server, Smartphone, ShieldCheck, Cloud, GitBranch, PenTool,
//   Palette, Cpu, BarChart3, ChevronDown, Loader2, CheckCircle, AlertCircle,
//   Calendar, Award, Video, ClipboardCheck, ArrowRight, Check,
// } from "lucide-react";
// import { applyForTraining } from "../api/services/industrialTraining.service";

// /* ---------- Content ---------- */

// const DOMAINS = [
//   { name: "Full Stack Development (MERN)", group: "Development", Icon: Layers, desc: "MongoDB, Express, React and Node.js, from database design to deployment." },
//   { name: "Frontend Development", group: "Development", Icon: Monitor, desc: "HTML, CSS, JavaScript and React, building responsive interfaces." },
//   { name: "Backend Development", group: "Development", Icon: Server, desc: "Node.js, Express, REST APIs, authentication and MongoDB." },
//   { name: "Mobile App Development (React Native)", group: "Development", Icon: Smartphone, desc: "Android and iOS apps with React Native and Expo." },
//   { name: "Cloud Computing", group: "Infrastructure", Icon: Cloud, desc: "Deploying and managing applications on cloud platforms." },
//   { name: "DevOps", group: "Infrastructure", Icon: GitBranch, desc: "Integrating development and operations for faster delivery." },
//   { name: "Cyber Security", group: "Infrastructure", Icon: ShieldCheck, desc: "Protecting systems and networks from digital threats." },
//   { name: "UI/UX Design", group: "Design", Icon: PenTool, desc: "Creating intuitive and visually appealing user interfaces." },
//   { name: "Graphic Design", group: "Design", Icon: Palette, desc: "Designing visual content for digital and print media." },
//   { name: "AI/ML", group: "Data & AI", Icon: Cpu, desc: "Building intelligent systems using machine learning algorithms." },
//   { name: "Data Science", group: "Data & AI", Icon: BarChart3, desc: "Extracting insights from data using statistical and computational methods." },
// ];

// const GROUPS = ["All", "Development", "Infrastructure", "Design", "Data & AI"];

// const DURATIONS = [
//   ["1 Month", "One stack, one focused project."],
//   ["2 Months", "Balanced duration for comprehensive learning."],
//   ["3 Months", "Commonly accepted for college training requirements."],
//   ["6 Months", "Extended training with a larger end-to-end project."],
//   ["1 Year", "Deep dive into multiple stacks and advanced topics."],
// ];

// const WHY = [
//   { Icon: Layers, t: "Built around a project", d: "The curriculum builds toward one working application instead of scattered topics." },
//   { Icon: Video, t: "Live sessions", d: "Classes are taught live by our trainers, with attendance recorded." },
//   { Icon: ClipboardCheck, t: "Reviewed assignments", d: "Assignments are checked and returned with feedback." },
//   { Icon: Award, t: "Certificate", d: "Issued when you complete the training and submit your project." },
// ];

// const LEARN = [
//   "Git and GitHub workflow",
//   "REST API design and consumption",
//   "Database design and modelling",
//   "Authentication, validation and error handling",
//   "Deploying an application",
//   "Documenting and presenting a project",
// ];

// const STEPS = [
//   ["Apply", "Submit the form below. No payment is taken at this stage."],
//   ["Review call", "Our team reviews your application and calls you."],
//   ["Payment link", "If you decide to join, we email a Razorpay payment link."],
//   ["Confirmation", "Your payment is verified automatically."],
//   ["Portal access", "We email your portal login."],
//   ["Training", "Attend sessions, finish assignments and submit your project."],
// ];

// const FAQS = [
//   ["Is this an internship?", "No. It is a structured industrial training program with a curriculum, assignments and a project."],
//   ["Do I pay when I apply?", "No. The payment link is sent only after our team has spoken with you."],
//   ["How do I pay?", "Through a secure Razorpay link emailed to the address you applied with."],
//   ["When do I get portal access?", "After your payment is confirmed, our team emails your login."],
//   ["Will I get a certificate?", "Yes, on completing the training and submitting your project."],
// ];

// const BLANK = {
//   name: "", email: "", phone: "", college: "", course: "", branch: "", semester: "",
//   domain: "", duration: "", preferredStartDate: "", resumeUrl: "",
//   skills: "", linkedIn: "", github: "", message: "",
// };

// /* ---------- Small pieces ---------- */

// const inputCls =
//   "w-full px-3.5 py-3 border border-[#0D1B3E]/10 rounded-xl bg-white text-black text-sm placeholder-black/30 " +
//   "hover:border-[#1A56DB]/40 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/40 focus:border-[#1A56DB] transition";

// const Field = ({ label, span, children }) => (
//   <div className={span ? "sm:col-span-2" : ""}>
//     <label className="block text-xs font-semibold text-black/60 mb-1.5">{label}</label>
//     {children}
//   </div>
// );

// const IconBox = ({ Icon, light }) => (
//   <div
//     className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${light ? "bg-white/10 border border-white/15" : "bg-[#1A56DB]"}`}
//     style={light ? undefined : { boxShadow: "0 6px 16px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" }}
//   >
//     <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
//   </div>
// );

// const Heading = ({ children, sub, light }) => (
//   <div className="mb-10">
//     <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${light ? "text-white" : "text-[#1A56DB]"}`}>{children}</h2>
//     {sub && <p className={`mt-3 max-w-2xl leading-relaxed ${light ? "text-white/60" : "text-black/50"}`}>{sub}</p>}
//   </div>
// );

// const FormGroup = ({ title, children }) => (
//   <fieldset className="grid sm:grid-cols-2 gap-4">
//     <legend className="text-sm font-black text-[#0D1B3E] mb-4 pb-2 border-b border-[#0D1B3E]/10 w-full">{title}</legend>
//     {children}
//   </fieldset>
// );

// /* ---------- Page ---------- */

// export default function IndustrialTrainingPage() {
//   const [form, setForm] = useState(BLANK);
//   const [submitting, setSubmitting] = useState(false);
//   const [done, setDone] = useState(false);
//   const [error, setError] = useState("");
//   const [group, setGroup] = useState("All");

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
//   const pick = (key, value) => setForm((f) => ({ ...f, [key]: value }));

//   const chooseDomain = (name) => {
//     pick("domain", name);
//     document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     try {
//       await applyForTraining(form);
//       setDone(true);
//       setForm(BLANK);
//     } catch (err) {
//       const data = err.response?.data;
//       setError(data?.errors?.[0]?.message || data?.message || "Unable to submit the application. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const visibleDomains = group === "All" ? DOMAINS : DOMAINS.filter((d) => d.group === group);

//   return (
//     <div className="bg-white font-sans">
//       {/* Hero */}
//       <section className="relative overflow-hidden pt-20 pb-20 px-4 border-b border-[#0D1B3E]/10">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
//         <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#1A56DB]/10 blur-3xl pointer-events-none" />

//         <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
//           <div>
//             <p className="inline-flex items-center gap-2 text-xs font-bold text-[#1A56DB] bg-[#1A56DB]/10 rounded-full px-3 py-1.5">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" />
//               Applications open · Not an internship
//             </p>
//             <h1 className="text-4xl sm:text-6xl font-black text-[#1A56DB] leading-[1.05] tracking-tight mt-5">
//               Industrial Training Program
//             </h1>
//             <p className="text-lg text-black/60 max-w-xl leading-relaxed mt-5">
//               Project-based training for engineering and computer science students, with a defined
//               curriculum, assessed assignments and a final project you can present.
//             </p>
//             <div className="flex flex-wrap gap-3 mt-8">
//               <a href="#apply" className="group bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition inline-flex items-center gap-2 shadow-[0_10px_24px_rgba(26,86,219,0.3)]">
//                 Apply now
//                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//               </a>
//               <a href="#process" className="border border-[#0D1B3E]/15 text-black/70 hover:bg-[#0D1B3E]/5 font-semibold px-6 py-3.5 rounded-xl text-sm transition">
//                 How it works
//               </a>
//             </div>
//           </div>

//           {/* Program snapshot */}
//           <aside className="bg-[#0D1B3E] rounded-3xl p-6 sm:p-7 text-white shadow-[0_30px_60px_rgba(13,27,62,0.25)]">
//             <p className="text-sm font-black">Program at a glance</p>
//             <dl className="mt-5 divide-y divide-white/10">
//               {[
//                 [`${DOMAINS.length} domains`, "Development, infrastructure, design and data"],
//                 ["1 to 12 months", "Pick the length your college requires"],
//                 ["Live + portal", "Live classes with assignments in the student portal"],
//                 ["1 final project", "Submitted and presented for your certificate"],
//               ].map(([a, b]) => (
//                 <div key={a} className="py-3.5 flex items-start gap-3">
//                   <Check className="w-4 h-4 text-[#7FA6F5] mt-1 shrink-0" strokeWidth={2.5} />
//                   <div>
//                     <dt className="font-black text-sm">{a}</dt>
//                     <dd className="text-sm text-white/55 mt-0.5">{b}</dd>
//                   </div>
//                 </div>
//               ))}
//             </dl>
//             <p className="mt-4 text-xs text-white/50 bg-white/5 rounded-xl px-3.5 py-2.5">
//               No payment is taken when you apply.
//             </p>
//           </aside>
//         </div>
//       </section>

//       {/* Overview + why */}
//       <section className="max-w-6xl mx-auto px-4 py-16">
//         <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
//           <div>
//             <Heading>Overview</Heading>
//             <p className="text-black/70 leading-relaxed max-w-xl -mt-4">
//               The program is for students who need industrial training as part of their degree and want to
//               build working software while doing it. You train on one stack, complete assignments in a
//               student portal, attend live sessions, and finish with a project that you present.
//             </p>
//           </div>
//           <div className="grid sm:grid-cols-2 gap-4">
//             {WHY.map(({ Icon, t, d }) => (
//               <div key={t} className="border border-[#0D1B3E]/10 rounded-2xl p-5 bg-white hover:border-[#1A56DB]/40 hover:shadow-[0_12px_30px_rgba(26,86,219,0.08)] transition">
//                 <IconBox Icon={Icon} />
//                 <h3 className="font-black text-black text-sm mt-4">{t}</h3>
//                 <p className="text-sm text-black/50 mt-1 leading-relaxed">{d}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Domains */}
//       <section className="bg-[#1A56DB]/[0.03] border-y border-[#0D1B3E]/10">
//         <div className="max-w-6xl mx-auto px-4 py-16">
//           <Heading sub="Pick the stack that matches your degree requirement or career goal. Select a domain to start your application.">
//             Training domains
//           </Heading>

//           <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter domains">
//             {GROUPS.map((g) => (
//               <button
//                 key={g}
//                 role="tab"
//                 aria-selected={group === g}
//                 onClick={() => setGroup(g)}
//                 className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
//                   group === g
//                     ? "bg-[#1A56DB] text-white border-[#1A56DB]"
//                     : "bg-white text-black/60 border-[#0D1B3E]/10 hover:border-[#1A56DB]/40"
//                 }`}
//               >
//                 {g}
//               </button>
//             ))}
//           </div>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {visibleDomains.map(({ name, Icon, desc, group: g }) => (
//               <button
//                 key={name}
//                 onClick={() => chooseDomain(name)}
//                 className="group text-left bg-white border border-[#0D1B3E]/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-[#1A56DB] hover:shadow-[0_14px_32px_rgba(26,86,219,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/50 transition"
//               >
//                 <div className="flex items-center justify-between">
//                   <IconBox Icon={Icon} />
//                   <span className="text-xs font-semibold text-black/40">{g}</span>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-black text-black text-sm">{name}</h3>
//                   <p className="text-sm text-black/50 mt-1 leading-relaxed">{desc}</p>
//                 </div>
//                 <span className="text-xs font-bold text-[#1A56DB] inline-flex items-center gap-1">
//                   Apply for this domain
//                   <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Learn + duration */}
//       <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
//         <div>
//           <Heading>What you will learn</Heading>
//           <ul className="space-y-3">
//             {LEARN.map((l) => (
//               <li key={l} className="flex items-center gap-3 text-sm text-black/70 bg-white border border-[#0D1B3E]/10 rounded-xl px-4 py-3">
//                 <span className="w-6 h-6 rounded-full bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
//                   <Check className="w-3.5 h-3.5 text-[#1A56DB]" strokeWidth={3} />
//                 </span>
//                 {l}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div>
//           <Heading>Training duration</Heading>
//           <div className="space-y-3">
//             {DURATIONS.map(([n, d]) => (
//               <button
//                 key={n}
//                 onClick={() => { pick("duration", n); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }); }}
//                 className="w-full text-left flex items-center gap-4 border border-[#0D1B3E]/10 rounded-xl px-4 py-3 hover:border-[#1A56DB] hover:bg-[#1A56DB]/[0.03] transition"
//               >
//                 <span className="font-black text-[#1A56DB] text-sm w-20 shrink-0">{n}</span>
//                 <span className="text-sm text-black/50">{d}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Process (navy band) */}
//       <section id="process" className="bg-[#0D1B3E] scroll-mt-16">
//         <div className="max-w-6xl mx-auto px-4 py-16">
//           <Heading light sub="Nothing is charged or unlocked until you have spoken with our team.">
//             Training process and how to apply
//           </Heading>
//           <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
//             {STEPS.map(([title, text], i) => (
//               <li key={title} className="relative pl-14">
//                 <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#1A56DB] text-white font-black text-sm flex items-center justify-center shadow-[0_6px_16px_rgba(26,86,219,0.5)]">
//                   {i + 1}
//                 </span>
//                 <h3 className="font-black text-white text-sm pt-1.5">{title}</h3>
//                 <p className="text-sm text-white/55 mt-1 leading-relaxed">{text}</p>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       {/* Eligibility + benefits */}
//       <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
//         {[
//           ["Eligibility", [
//             "Students of B.Tech, BCA, MCA, B.Sc (IT/CS) or diploma programs",
//             "Basic programming knowledge",
//             "A laptop and a stable internet connection",
//           ]],
//           ["Benefits", [
//             "A working project for your portfolio",
//             "Training completion certificate",
//             "Portal access for live sessions and course material",
//           ]],
//         ].map(([title, items]) => (
//           <div key={title} className="border border-[#0D1B3E]/10 rounded-3xl p-7">
//             <h2 className="text-xl font-black text-[#1A56DB] mb-4">{title}</h2>
//             <ul className="space-y-3">
//               {items.map((i) => (
//                 <li key={i} className="flex gap-3 text-sm text-black/70">
//                   <CheckCircle className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2} />
//                   {i}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </section>

//       {/* FAQ */}
//       <section className="max-w-3xl mx-auto px-4 pb-16">
//         <Heading>FAQ</Heading>
//         <div className="space-y-3">
//           {FAQS.map(([q, a]) => (
//             <details key={q} className="group border border-[#0D1B3E]/10 rounded-2xl px-5 py-4 open:border-[#1A56DB]/40 open:bg-[#1A56DB]/[0.03] transition">
//               <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-bold text-sm text-black">
//                 {q}
//                 <ChevronDown className="w-4 h-4 text-[#1A56DB] group-open:rotate-180 transition-transform shrink-0" />
//               </summary>
//               <p className="mt-3 text-sm text-black/50 leading-relaxed">{a}</p>
//             </details>
//           ))}
//         </div>
//       </section>

//       {/* Apply */}
//       <section id="apply" className="bg-[#1A56DB]/[0.03] border-t border-[#0D1B3E]/10 scroll-mt-16">
//         <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-[0.7fr_1.3fr] gap-12">
//           <div className="lg:sticky lg:top-24 self-start">
//             <Heading sub="Our team will call you after reviewing your application.">
//               Apply for Industrial Training
//             </Heading>
//             <ul className="space-y-3 text-sm text-black/60">
//               <li className="flex gap-3"><Check className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2.5} />No payment is taken now</li>
//               <li className="flex gap-3"><Check className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2.5} />Takes about 3 minutes</li>
//               <li className="flex gap-3"><Check className="w-4 h-4 text-[#1A56DB] mt-0.5 shrink-0" strokeWidth={2.5} />Fields marked * are required</li>
//             </ul>
//             {(form.domain || form.duration) && (
//               <div className="mt-6 bg-[#0D1B3E] text-white rounded-2xl p-4 text-sm">
//                 <p className="text-white/50 text-xs font-semibold">Your selection</p>
//                 {form.domain && <p className="font-black mt-1">{form.domain}</p>}
//                 {form.duration && <p className="text-white/70 mt-0.5">{form.duration}</p>}
//               </div>
//             )}
//           </div>

//           <div className="bg-white border border-[#0D1B3E]/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(13,27,62,0.06)]">
//             {done ? (
//               <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-6 flex gap-3" role="status">
//                 <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
//                 <div>
//                   <p className="font-black text-emerald-800 text-sm">Application received</p>
//                   <p className="text-sm text-emerald-700 mt-1">
//                     A confirmation has been emailed to you. Our team will contact you on the phone number provided.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 <FormGroup title="Personal details">
//                   <Field label="Full name *"><input required className={inputCls} value={form.name} onChange={set("name")} /></Field>
//                   <Field label="Email *"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} /></Field>
//                   <Field label="Phone number *" span><input required type="tel" className={inputCls} placeholder="+91" value={form.phone} onChange={set("phone")} /></Field>
//                 </FormGroup>

//                 <FormGroup title="Education">
//                   <Field label="College / university *" span><input required className={inputCls} value={form.college} onChange={set("college")} /></Field>
//                   <Field label="Course / degree *"><input required className={inputCls} placeholder="B.Tech, BCA, MCA" value={form.course} onChange={set("course")} /></Field>
//                   <Field label="Branch *"><input required className={inputCls} placeholder="Computer Science" value={form.branch} onChange={set("branch")} /></Field>
//                   <Field label="Current semester / year *" span><input required className={inputCls} placeholder="e.g. 6th Semester" value={form.semester} onChange={set("semester")} /></Field>
//                 </FormGroup>

//                 <FormGroup title="Training preferences">
//                   <Field label="Training domain *" span>
//                     <select required className={inputCls} value={form.domain} onChange={set("domain")}>
//                       <option value="">Select domain</option>
//                       {DOMAINS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
//                     </select>
//                   </Field>
//                   <div className="sm:col-span-2">
//                     <span className="block text-xs font-semibold text-black/60 mb-1.5">Training duration *</span>
//                     <div className="flex flex-wrap gap-2">
//                       {DURATIONS.map(([n]) => (
//                         <label key={n} className="cursor-pointer">
//                           <input
//                             type="radio"
//                             name="duration"
//                             required
//                             value={n}
//                             checked={form.duration === n}
//                             onChange={set("duration")}
//                             className="peer sr-only"
//                           />
//                           <span className="block px-4 py-2.5 rounded-xl border border-[#0D1B3E]/10 text-sm font-semibold text-black/60 hover:border-[#1A56DB]/40 peer-checked:bg-[#1A56DB] peer-checked:text-white peer-checked:border-[#1A56DB] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1A56DB]/40 transition">
//                             {n}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <Field label="Preferred start date" span>
//                     <div className="relative">
//                       <Calendar className="w-4 h-4 text-black/30 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//                       <input type="date" className={inputCls} min={new Date().toISOString().split("T")[0]} value={form.preferredStartDate} onChange={set("preferredStartDate")} />
//                     </div>
//                   </Field>
//                 </FormGroup>

//                 <FormGroup title="Profile (optional)">
//                   <Field label="Skills" span><input className={inputCls} placeholder="HTML, JavaScript, Python" value={form.skills} onChange={set("skills")} /></Field>
//                   <Field label="Resume link" span><input type="url" className={inputCls} placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={set("resumeUrl")} /></Field>
//                   <Field label="LinkedIn"><input type="url" className={inputCls} value={form.linkedIn} onChange={set("linkedIn")} /></Field>
//                   <Field label="GitHub"><input type="url" className={inputCls} value={form.github} onChange={set("github")} /></Field>
//                   <Field label="Additional message" span>
//                     <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`} value={form.message} onChange={set("message")} />
//                   </Field>
//                 </FormGroup>

//                 {error && (
//                   <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex gap-2" role="alert">
//                     <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full sm:w-auto bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition inline-flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(26,86,219,0.3)]"
//                 >
//                   {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                   {submitting ? "Submitting..." : "Submit application"}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import { useState } from "react";
import {
  Monitor, Layers, Server, Smartphone, ShieldCheck, Cloud, GitBranch, PenTool,
  Palette, Cpu, BarChart3, ChevronDown, Loader2, CheckCircle, AlertCircle,
  Video, ClipboardCheck, Award, Check,
} from "lucide-react";
import { applyForTraining } from "../api/services/industrialTraining.service";

/* Palette (unchanged): blue #1A56DB, navy #0D1B3E, white, black text */

/* ---------- Content ---------- */

const DOMAINS = [
  { name: "Full Stack Development (MERN)", group: "Development", Icon: Layers, desc: "MongoDB, Express, React and Node.js, from database design to deployment." },
  { name: "Frontend Development", group: "Development", Icon: Monitor, desc: "HTML, CSS, JavaScript and React, building responsive interfaces." },
  { name: "Backend Development", group: "Development", Icon: Server, desc: "Node.js, Express, REST APIs, authentication and MongoDB." },
  { name: "Mobile App Development (React Native)", group: "Development", Icon: Smartphone, desc: "Android and iOS apps with React Native and Expo." },
  { name: "Cloud Computing", group: "Infrastructure", Icon: Cloud, desc: "Deploying and managing applications on cloud platforms." },
  { name: "DevOps", group: "Infrastructure", Icon: GitBranch, desc: "Integrating development and operations for faster delivery." },
  { name: "Cyber Security", group: "Infrastructure", Icon: ShieldCheck, desc: "Protecting systems and networks from digital threats." },
  { name: "UI/UX Design", group: "Design", Icon: PenTool, desc: "Creating intuitive and visually appealing user interfaces." },
  { name: "Graphic Design", group: "Design", Icon: Palette, desc: "Designing visual content for digital and print media." },
  { name: "AI/ML", group: "Data & AI", Icon: Cpu, desc: "Building intelligent systems using machine learning algorithms." },
  { name: "Data Science", group: "Data & AI", Icon: BarChart3, desc: "Extracting insights from data using statistical and computational methods." },
];

const GROUPS = ["All", "Development", "Infrastructure", "Design", "Data & AI"];

const DURATIONS = [
  ["1 Month", "One stack, one focused project."],
  ["2 Months", "Balanced duration for comprehensive learning."],
  ["3 Months", "Commonly accepted for college training requirements."],
  ["6 Months", "Extended training with a larger end-to-end project."],
  ["1 Year", "Deep dive into multiple stacks and advanced topics."],
];

const WHY = [
  { Icon: Layers, t: "Built around a project", d: "The curriculum builds toward one working application instead of scattered topics." },
  { Icon: Video, t: "Live sessions", d: "Classes are taught live by our trainers, with attendance recorded." },
  { Icon: ClipboardCheck, t: "Reviewed assignments", d: "Assignments are checked and returned with feedback." },
  { Icon: Award, t: "Certificate", d: "Issued when you complete the training and submit your project." },
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

const ELIGIBILITY = [
  "Students of B.Tech, BCA, MCA, B.Sc (IT/CS) or diploma programs",
  "Basic programming knowledge",
  "A laptop and a stable internet connection",
];

const BENEFITS = [
  "A working project for your portfolio",
  "Training completion certificate",
  "Portal access for live sessions and course material",
];

const BLANK = {
  name: "", email: "", phone: "", college: "", course: "", branch: "", semester: "",
  domain: "", duration: "", preferredStartDate: "", resumeUrl: "",
  skills: "", linkedIn: "", github: "", message: "",
};

/* ---------- Helpers ---------- */

const scrollToApply = () => {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("apply")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
};

const inputCls =
  "w-full px-3.5 py-3 border border-[#0D1B3E]/15 rounded-lg bg-white text-black text-sm placeholder-black/35 " +
  "hover:border-[#0D1B3E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition";

const Field = ({ label, span, children }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <label className="block text-sm font-medium text-[#0D1B3E] mb-1.5">{label}</label>
    {children}
  </div>
);

const IconBox = ({ Icon }) => (
  <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
    <Icon className="w-5 h-5 text-[#1A56DB]" strokeWidth={1.75} />
  </div>
);

const Heading = ({ children, sub, light }) => (
  <div className="mb-8 max-w-2xl">
    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${light ? "text-white" : "text-[#0D1B3E]"}`}>
      {children}
    </h2>
    {sub && <p className={`mt-3 leading-relaxed ${light ? "text-white/65" : "text-black/60"}`}>{sub}</p>}
  </div>
);

const CheckList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((i) => (
      <li key={i} className="flex gap-3 text-[15px] text-black/75 leading-relaxed">
        <Check className="w-4 h-4 text-[#1A56DB] mt-1 shrink-0" strokeWidth={2.5} />
        {i}
      </li>
    ))}
  </ul>
);

const FormGroup = ({ title, children }) => (
  <fieldset className="min-w-0">
    <legend className="text-base font-bold text-[#0D1B3E] pb-3 mb-5 border-b border-[#0D1B3E]/10 w-full">{title}</legend>
    <div className="grid sm:grid-cols-2 gap-4">{children}</div>
  </fieldset>
);

const wrap = "max-w-6xl mx-auto px-4 sm:px-6";

/* ---------- Page ---------- */

export default function IndustrialTrainingPage() {
  const [form, setForm] = useState(BLANK);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [group, setGroup] = useState("All");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const pick = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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

  const visibleDomains = group === "All" ? DOMAINS : DOMAINS.filter((d) => d.group === group);

  return (
    <div className="bg-white font-sans text-black antialiased">
      {/* Hero */}
      <section className="relative border-b border-[#0D1B3E]/10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.05)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className={`${wrap} relative py-16 sm:py-24 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center`}>
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D1B3E] leading-[1.08] tracking-tight">
              Industrial Training Program
            </h1>
            <p className="text-lg text-black/65 max-w-xl leading-relaxed mt-6">
              Project-based training for engineering and computer science students, with a defined
              curriculum, assessed assignments and a final project. It is a training program, not an internship.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <a
                href="#apply"
                className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white font-semibold px-6 py-3 rounded-lg text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]"
              >
                Apply now
              </a>
              <a
                href="#process"
                className="border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 font-semibold px-6 py-3 rounded-lg text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]"
              >
                How it works
              </a>
            </div>
          </div>

          <aside className="bg-[#0D1B3E] rounded-2xl p-7 text-white">
            <h2 className="text-base font-bold">Program at a glance</h2>
            <dl className="mt-5 divide-y divide-white/10">
              {[
                [`${DOMAINS.length} training domains`, "Development, infrastructure, design and data"],
                ["1 month to 1 year", "Choose the length your college requires"],
                ["Live sessions and portal", "Assignments are submitted and reviewed in the student portal"],
                ["One final project", "Submitted for your completion certificate"],
              ].map(([a, b]) => (
                <div key={a} className="py-3.5">
                  <dt className="font-semibold text-sm">{a}</dt>
                  <dd className="text-sm text-white/60 mt-0.5">{b}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 pt-4 border-t border-white/10 text-sm text-white/70">
              No payment is taken when you apply.
            </p>
          </aside>
        </div>
      </section>

      {/* Overview + why */}
      <section className={`${wrap} py-16 sm:py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16`}>
        <div>
          <Heading>Overview</Heading>
          <p className="text-black/70 leading-relaxed max-w-md">
            The program is for students who need industrial training as part of their degree and want to
            build working software while doing it. You train on one stack, complete assignments in a
            student portal, attend live sessions, and finish with a project that you present.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0D1B3E] mb-2">Why choose this training</h2>
          <ul className="divide-y divide-[#0D1B3E]/10">
            {WHY.map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4 py-5">
                <IconBox Icon={Icon} />
                <div>
                  <h3 className="font-semibold text-[#0D1B3E]">{t}</h3>
                  <p className="text-sm text-black/60 mt-1 leading-relaxed">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Domains */}
      <section className="bg-[#1A56DB]/[0.04] border-y border-[#0D1B3E]/10">
        <div className={`${wrap} py-16 sm:py-20`}>
          <Heading sub="Pick the stack that matches your degree requirement or career goal. Select a domain to start your application.">
            Training domains
          </Heading>

          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter domains by area">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                onClick={() => setGroup(g)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/50 ${
                  group === g
                    ? "bg-[#0D1B3E] text-white border-[#0D1B3E]"
                    : "bg-white text-black/65 border-[#0D1B3E]/15 hover:border-[#0D1B3E]/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleDomains.map(({ name, Icon, desc }) => {
              const selected = form.domain === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => { pick("domain", name); scrollToApply(); }}
                  className={`text-left bg-white border rounded-xl p-5 flex flex-col gap-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/50 ${
                    selected ? "border-[#1A56DB] ring-1 ring-[#1A56DB]" : "border-[#0D1B3E]/12 hover:border-[#1A56DB]/60"
                  }`}
                >
                  <IconBox Icon={Icon} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0D1B3E] leading-snug">{name}</h3>
                    <p className="text-sm text-black/60 mt-1.5 leading-relaxed">{desc}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#1A56DB]">
                    {selected ? "Selected" : "Apply for this domain"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learn + duration */}
      <section className={`${wrap} py-16 sm:py-20 grid md:grid-cols-2 gap-12 lg:gap-16`}>
        <div>
          <Heading>What you will learn</Heading>
          <CheckList items={LEARN} />
        </div>
        <div>
          <Heading sub="Select a duration to add it to your application.">Training duration</Heading>
          <div className="border border-[#0D1B3E]/12 rounded-xl divide-y divide-[#0D1B3E]/10 overflow-hidden">
            {DURATIONS.map(([n, d]) => {
              const selected = form.duration === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => { pick("duration", n); scrollToApply(); }}
                  className={`w-full text-left flex items-baseline gap-4 px-5 py-4 transition focus:outline-none focus-visible:bg-[#1A56DB]/5 ${
                    selected ? "bg-[#1A56DB]/[0.06]" : "hover:bg-[#0D1B3E]/[0.03]"
                  }`}
                >
                  <span className={`font-semibold text-sm w-20 shrink-0 ${selected ? "text-[#1A56DB]" : "text-[#0D1B3E]"}`}>{n}</span>
                  <span className="text-sm text-black/60">{d}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-[#0D1B3E] scroll-mt-16">
        <div className={`${wrap} py-16 sm:py-20`}>
          <Heading light sub="Nothing is charged or unlocked until you have spoken with our team.">
            Training process and how to apply
          </Heading>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="w-9 h-9 rounded-full border border-white/25 text-white font-semibold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-white pt-1.5">{title}</h3>
                  <p className="text-sm text-white/65 mt-1 leading-relaxed">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Eligibility + benefits */}
      <section className={`${wrap} py-16 sm:py-20 grid md:grid-cols-2 gap-12 lg:gap-16`}>
        <div>
          <Heading>Eligibility</Heading>
          <CheckList items={ELIGIBILITY} />
        </div>
        <div>
          <Heading>Benefits</Heading>
          <CheckList items={BENEFITS} />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#0D1B3E]/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Heading>FAQ</Heading>
          <div className="border-y border-[#0D1B3E]/10 divide-y divide-[#0D1B3E]/10">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-semibold text-[#0D1B3E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/50 rounded">
                  {q}
                  <ChevronDown className="w-4 h-4 text-[#1A56DB] group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-[15px] text-black/60 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="bg-[#1A56DB]/[0.04] border-t border-[#0D1B3E]/10 scroll-mt-16">
        <div className={`${wrap} py-16 sm:py-20 grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-14`}>
          <div className="lg:sticky lg:top-24 self-start">
            <Heading sub="Our team will call you after reviewing your application. No payment is taken now.">
              Apply for Industrial Training
            </Heading>
            <p className="text-sm text-black/60">Fields marked * are required.</p>

            {(form.domain || form.duration) && (
              <div className="mt-6 bg-[#0D1B3E] text-white rounded-xl p-5">
                <p className="text-sm text-white/60">Your selection</p>
                {form.domain && <p className="font-semibold mt-1.5">{form.domain}</p>}
                {form.duration && <p className="text-sm text-white/75 mt-0.5">{form.duration}</p>}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#0D1B3E]/12 rounded-2xl p-6 sm:p-8">
            {done ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6 flex gap-3" role="status">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-800">Application received</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    A confirmation has been emailed to you. Our team will contact you on the phone number provided.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-9">
                <FormGroup title="Personal details">
                  <Field label="Full name *"><input required autoComplete="name" className={inputCls} value={form.name} onChange={set("name")} /></Field>
                  <Field label="Email *"><input required type="email" autoComplete="email" className={inputCls} value={form.email} onChange={set("email")} /></Field>
                  <Field label="Phone number *" span><input required type="tel" autoComplete="tel" className={inputCls} placeholder="+91" value={form.phone} onChange={set("phone")} /></Field>
                </FormGroup>

                <FormGroup title="Education">
                  <Field label="College / university *" span><input required className={inputCls} value={form.college} onChange={set("college")} /></Field>
                  <Field label="Course / degree *"><input required className={inputCls} placeholder="B.Tech, BCA, MCA" value={form.course} onChange={set("course")} /></Field>
                  <Field label="Branch *"><input required className={inputCls} placeholder="Computer Science" value={form.branch} onChange={set("branch")} /></Field>
                  <Field label="Current semester / year *" span><input required className={inputCls} placeholder="e.g. 6th Semester" value={form.semester} onChange={set("semester")} /></Field>
                </FormGroup>

                <FormGroup title="Training preferences">
                  <Field label="Training domain *" span>
                    <select required className={inputCls} value={form.domain} onChange={set("domain")}>
                      <option value="">Select domain</option>
                      {DOMAINS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <span className="block text-sm font-medium text-[#0D1B3E] mb-1.5">Training duration *</span>
                    <div className="flex flex-wrap gap-2">
                      {DURATIONS.map(([n]) => (
                        <label key={n} className="cursor-pointer">
                          <input
                            type="radio"
                            name="duration"
                            required
                            value={n}
                            checked={form.duration === n}
                            onChange={set("duration")}
                            className="peer sr-only"
                          />
                          <span className="block px-4 py-2.5 rounded-lg border border-[#0D1B3E]/15 text-sm font-medium text-black/70 hover:border-[#0D1B3E]/40 peer-checked:bg-[#1A56DB] peer-checked:text-white peer-checked:border-[#1A56DB] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1A56DB]/40 transition">
                            {n}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Field label="Preferred start date" span>
                    <input type="date" className={inputCls} min={new Date().toISOString().split("T")[0]} value={form.preferredStartDate} onChange={set("preferredStartDate")} />
                  </Field>
                </FormGroup>

                <FormGroup title="Profile (optional)">
                  <Field label="Skills" span><input className={inputCls} placeholder="HTML, JavaScript, Python" value={form.skills} onChange={set("skills")} /></Field>
                  <Field label="Resume link" span><input type="url" className={inputCls} placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={set("resumeUrl")} /></Field>
                  <Field label="LinkedIn"><input type="url" className={inputCls} value={form.linkedIn} onChange={set("linkedIn")} /></Field>
                  <Field label="GitHub"><input type="url" className={inputCls} value={form.github} onChange={set("github")} /></Field>
                  <Field label="Additional message" span>
                    <textarea rows={3} maxLength={1000} className={`${inputCls} resize-none`} value={form.message} onChange={set("message")} />
                  </Field>
                </FormGroup>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm transition inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}