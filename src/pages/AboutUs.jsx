// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";

// export default function AboutUs() {
//   return (
//     <div className="bg-white dark:bg-gray-950 min-h-screen">
// <Navbar/>
//       {/* HERO */}
//       <section className="py-20 px-4 text-center bg-gradient-to-br from-indigo-600 to-violet-600">
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-4xl md:text-5xl font-bold text-white"
//         >
//           About Tech Minds
//         </motion.h1>

//         <p className="mt-4 text-indigo-100 max-w-2xl mx-auto text-lg">
//           We help students build real-world skills through practical, modern,
//           and industry-focused learning experiences.
//         </p>
//       </section>

//       {/* STORY */}
//       <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Our Mission
//           </h2>
//           <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
//             Tech Minds was created with a simple goal — to make high-quality
//             education accessible to everyone. We focus on practical learning,
//             real projects, and skills that actually matter in the job market.
//           </p>

//           <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
//             Whether you're a beginner or an advanced learner, our platform
//             helps you grow step-by-step with structured courses and expert
//             mentorship.
//           </p>

//           <Link
//             to="/techmind-courses"
//             className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
//           >
//             Explore Courses
//           </Link>
//         </div>

//         <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8">
//           <div className="text-6xl text-center">🎓</div>
//           <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
//             Learn. Build. Grow.
//           </p>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
//         <div className="max-w-6xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Why Choose Us?
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8 mt-10">
//             {[
//               {
//                 icon: "🚀",
//                 title: "Practical Learning",
//                 desc: "Build real projects instead of just theory.",
//               },
//               {
//                 icon: "👨‍🏫",
//                 title: "Expert Instructors",
//                 desc: "Learn from industry professionals.",
//               },
//               {
//                 icon: "📈",
//                 title: "Career Growth",
//                 desc: "Get job-ready skills and guidance.",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
//               >
//                 <div className="text-4xl">{item.icon}</div>
//                 <h3 className="mt-3 font-bold text-lg text-gray-900 dark:text-white">
//                   {item.title}
//                 </h3>
//                 <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-20 text-center px-4">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Start Your Learning Journey Today
//         </h2>
//         <p className="mt-3 text-gray-500 dark:text-gray-400">
//           Join thousands of learners improving their skills.
//         </p>

//         <Link
//           to="/register"
//           className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold"
//         >
//           Get Started Free
//         </Link>
//       </section>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  Globe,
  Smartphone,
  Palette,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  const features = [
    {
      icon: <Rocket size={28} />,
      title: "Modern Development",
      desc: "Fast, scalable and modern websites, apps and digital platforms.",
    },
    {
      icon: <Palette size={28} />,
      title: "Premium UI/UX",
      desc: "Clean and beautiful interfaces designed for modern users.",
    },
    {
      icon: <Users size={28} />,
      title: "Client Focused",
      desc: "We build solutions tailored to your business and audience.",
    },
  ];

  const audiences = [
    {
      icon: <GraduationCap size={26} />,
      title: "Students",
      desc: "Portfolio websites, final-year projects and personal branding.",
    },
    {
      icon: <Rocket size={26} />,
      title: "Startups",
      desc: "MVP development, SaaS products and scalable platforms.",
    },
    {
      icon: <Briefcase size={26} />,
      title: "Businesses",
      desc: "Professional websites and digital systems for growth.",
    },
    {
      icon: <Sparkles size={26} />,
      title: "Creators",
      desc: "Personal brands, landing pages and audience platforms.",
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="bg-[#050816] min-h-screen text-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-600/10 blur-[140px]" />
        <div className="absolute top-[500px] right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px]" />

        {/* HERO */}
        <section className="relative z-10 py-28 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-purple-300 mb-8">
              🚀 Digital Product Studio
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
              Building digital experiences
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {" "}
                that help brands grow.
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tech Minds is a modern digital solutions studio helping startups,
              students, creators and businesses launch websites, apps and
              scalable digital products with premium design and development.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/contact"
                className="bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold flex items-center gap-2"
              >
                Start Your Project
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/services"
                className="border border-white/10 hover:border-purple-500 bg-white/5 transition px-8 py-4 rounded-2xl font-semibold"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </section>

        {/* STORY */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-purple-400 uppercase tracking-[4px] text-sm">
              About Us
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              More than development —
              <span className="text-purple-400"> we build digital growth.</span>
            </h2>

            <p className="mt-6 text-gray-400 leading-relaxed text-lg">
              We started Tech Minds with a simple vision — to help individuals,
              startups and businesses bring their ideas online with modern,
              high-quality digital solutions.
            </p>

            <p className="mt-5 text-gray-400 leading-relaxed">
              From websites and mobile apps to startup MVPs and business
              systems, we focus on creating experiences that are fast, scalable
              and built for real users.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Modern UI/UX focused development",
                "Scalable and responsive solutions",
                "Startup-friendly approach",
                "Long-term support & improvements",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                    <CheckCircle size={14} />
                  </div>

                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                ["50+", "Projects Delivered"],
                ["20+", "Happy Clients"],
                ["10+", "Industries Served"],
                ["99%", "Client Satisfaction"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  className="bg-[#0B1225] border border-white/10 rounded-2xl p-6 text-center"
                >
                  <h3 className="text-4xl font-bold text-purple-400">{num}</h3>
                  <p className="text-gray-400 mt-2 text-sm">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                  <Globe />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Websites • Apps • MVPs
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Complete digital solutions for modern businesses.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-cyan-400 uppercase tracking-[4px] text-sm">
              Why Choose Us
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Built for modern brands & businesses
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {features.map((item) => (
                <motion.div
                  whileHover={{ y: -8 }}
                  key={item.title}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold">{item.title}</h3>

                  <p className="mt-4 text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16">
            <div className="text-center">
              <p className="text-purple-400 uppercase tracking-[4px] text-sm">
                Who We Work With
              </p>

              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Helping ideas become reality
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {audiences.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#0B1225] border border-white/10 rounded-3xl p-8 hover:border-purple-500/40 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 mb-6">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold">{item.title}</h3>

                  <p className="text-gray-400 mt-4 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-28 px-4">
          <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-r from-purple-700 to-indigo-700 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to build something amazing?
            </h2>

            <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
              Whether you're launching a startup, growing your business or
              building your personal brand — we can help bring your vision to
              life.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/contact"
                className="bg-white text-black hover:bg-gray-200 transition px-8 py-4 rounded-2xl font-semibold"
              >
                Start a Project
              </Link>

              <Link
                to="/services"
                className="border border-white/30 hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
