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
import { useState, useEffect } from "react";
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
import api from "../api/axios";

export default function AboutUs() {
  const [stats, setStats] = useState([
    { num: "...", label: "Students Learning" },
    { num: "...", label: "Published Courses" },
    { num: "...", label: "Expert Educators" },
    { num: "4.9★", label: "Average Rating" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/stats/public");
        setStats([
          { num: `${data.students}+`, label: "Students Learning" },
          { num: `${data.courses}+`, label: "Published Courses" },
          { num: `${data.creators}+`, label: "Expert Educators" },
          { num: "4.9★", label: "Average Rating" },
        ]);
      } catch (err) {
        console.log("Stats fetch failed", err);
      }
    };
    fetchStats();
  }, []);
  const features = [
    {
      icon: <GraduationCap size={28} />,
      title: "HD Video Learning",
      desc: "Learn through high-quality video lessons with subtitle support.",
    },
    {
      icon: <CheckCircle size={28} />,
      title: "Interactive Assessments",
      desc: "Quizzes, assignments and instant feedback to improve learning.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Verified Certificates",
      desc: "Earn certificates that validate your skills and achievements.",
    },
  ];

  const audiences = [
    {
      icon: <GraduationCap size={26} />,
      title: "Students",
      desc: "Learn new skills and earn certificates.",
    },
    {
      icon: <Users size={26} />,
      title: "Professionals",
      desc: "Upskill and advance your career.",
    },
    {
      icon: <Rocket size={26} />,
      title: "Educators",
      desc: "Create courses and share your expertise.",
    },
    {
      icon: <Globe size={26} />,
      title: "Organizations",
      desc: "Train teams through scalable learning programs.",
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
              🎓 Modern Learning Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
              Learn, Teach &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {" "}
                Grow Together
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tech Minds is a modern online learning platform where students can
              discover expert-led courses, build valuable skills, and achieve
              their goals, while educators can create, publish, and share
              knowledge with learners around the world.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-900/40"
              >
                Start learning
              </Link>
              <Link
                to="/courses"
                className="bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition text-base"
              >
                Browse courses
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
              Empowering Learning Through
              <span className="text-purple-400"> Technology & Knowledge</span>
            </h2>

            <p className="mt-6 text-gray-400 leading-relaxed text-lg">
              Tech Minds is a modern online learning platform that connects
              learners with expert educators. Our goal is to make quality
              education accessible, engaging, and practical for everyone.
            </p>

            <p className="mt-5 text-gray-400 leading-relaxed">
              Students can explore expert-led courses, develop real-world
              skills, and earn verified certificates, while educators can
              create, publish, and manage courses that inspire learners around
              the world.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Expert-led courses across multiple domains",
                "Interactive quizzes and assessments",
                "Downloadable learning resources",
                "Verified completion certificates",
                "Progress tracking and analytics",
                "Powerful tools for educators",
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
              {stats.map(({ num, label }) => (
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
                  <GraduationCap />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Learn • Teach • Grow
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    A complete learning platform for students and educators.
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
              Why Choose Tech Minds
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Everything You Need To Learn And Grow
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
                Who We Serve
              </p>

              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Built For Learners, Educators & Organizations
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
              Ready To Start Your Learning Journey?
            </h2>

            <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
              Join thousands of learners and educators already using Tech Minds.
              Discover courses, develop valuable skills, and achieve your goals.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition text-base shadow-lg shadow-indigo-900/40"
              >
                Start learning
              </Link>
              <Link
                to="/courses"
                className="bg-white/5 border border-white/10 hover:border-white/20 text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition text-base"
              >
                Browse courses
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
