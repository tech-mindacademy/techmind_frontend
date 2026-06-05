import React from "react";
import {
  Globe,
  Smartphone,
  Palette,
  Rocket,
  ShoppingCart,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

export default function Service() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Globe,
      title: "Website Development",
      desc: "Modern business websites, portfolios and high-converting landing pages.",
      gradient: "from-[#1A56DB] to-[#0D1B3E]",
    },
    {
      icon: Smartphone,
      title: "App Development",
      desc: "Responsive mobile apps and scalable cross-platform solutions.",
      gradient: "from-[#2563EB] to-[#1A56DB]",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      desc: "Beautiful and intuitive interfaces focused on user experience.",
      gradient: "from-[#0D1B3E] to-[#1A56DB]",
    },
    {
      icon: Rocket,
      title: "Startup MVP",
      desc: "Launch your startup idea fast with production-ready MVP development.",
      gradient: "from-[#1A56DB] to-[#2563EB]",
    },
    {
      icon: ShoppingCart,
      title: "eCommerce Solutions",
      desc: "Online stores with payments, inventory and admin dashboards.",
      gradient: "from-[#2563EB] to-[#0D1B3E]",
    },
    {
      icon: GraduationCap,
      title: "College Projects",
      desc: "Custom academic and final-year projects with modern technologies.",
      gradient: "from-[#0D1B3E] to-[#2563EB]",
    },
  ];

  const audiences = [
    {
      title: "Students",
      desc: "Portfolio websites, resume builders and final-year projects.",
    },
    {
      title: "Startups",
      desc: "MVPs, SaaS platforms and scalable digital products.",
    },
    {
      title: "Local Businesses",
      desc: "Bring your business online and reach more customers.",
    },
    {
      title: "Creators & Brands",
      desc: "Personal brands, course platforms and audience growth tools.",
    },
  ];

  const process = [
    "Share your idea",
    "Planning & UI Design",
    "Development & Testing",
    "Launch & Support",
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      
      <section className="relative z-10 overflow-hidden text-center pt-28 pb-24 px-6">
        {/* Grid only in hero */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(26,86,219,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,219,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-[#1A56DB]/15 border border-[#1A56DB]/30 text-[#1A56DB] text-sm font-semibold px-5 py-2.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                </span>
                Digital Solutions Studio
              </span>
            </motion.div>
            <motion.div variants={fadeUp}>
        <div
          className="inline-flex items-center gap-3 bg-[#1A56DB] px-6 py-3 rounded-2xl"
      //     style={{
      //       boxShadow: `
      //   4px 4px 0px #0D1B3E,
      //   6px 6px 0px rgba(13,27,62,0.25),
      //   inset 0 1px 0 rgba(255,255,255,0.15),
      //   inset 0 -1px 0 rgba(0,0,0,0.1)
      // `,
      //     }}
        >
          <BadgeCheck
            size={20}
            color="#ffffff"
            strokeWidth={2}
            style={{
              // filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
              transform: "perspective(200px) rotateX(8deg) rotateY(-5deg)",
            }}
          />
          <span className="text-white text-xs font-semibold uppercase tracking-[2px]">
            Official Partnership with
          </span>
          <span className="text-white text-xs font-black uppercase tracking-wider">
            Webtech Solution
          </span>
          <BadgeCheck
            size={20}
            color="#f6f6f6"
            strokeWidth={2}
            style={{
              // filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
              transform: "perspective(200px) rotateX(8deg) rotateY(-5deg)",
            }}
          />
        </div>
      </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black leading-tight max-w-5xl mx-auto text-[#1A56DB]"
            >
              Build modern websites, apps & digital products.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-black/70 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              We help startups, students, creators and businesses build modern
              digital experiences that grow brands and launch ideas faster.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4 pt-2"
            >
              <button className="bg-[#1A56DB] hover:bg-[#0D1B3E] transition-all text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#1A56DB]/20">
                Start Your Project <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/certificate-purchase")}
                className="bg-[#1A56DB] hover:bg-[#0D1B3E] transition-all text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#1A56DB]/20"
              >
                Get Certificates <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24">
            {[
              ["50+", "Projects Delivered"],
              ["20+", "Happy Clients"],
              ["10+", "Industries Served"],
              ["99%", "Client Satisfaction"],
            ].map(([number, label], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="bg-white border border-[#0D1B3E]/8 rounded-2xl py-6 px-4 shadow-sm"
              >
                <h2 className="text-4xl font-black text-[#1A56DB]">{number}</h2>
                <p className="text-black/70 mt-2 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
          >
            Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#1A56DB]"
          >
            Everything you need to build online
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-black/70 mt-4 max-w-2xl mx-auto text-sm"
          >
            From websites to apps and startup MVPs — we create powerful digital
            solutions tailored to your goals.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, gradient }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#1A56DB]/8 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A56DB] text-white mb-6`}
                // style={{
                //   boxShadow:
                //     "0 8px 20px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                // }}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-black text-[#1A56DB] mb-3 transition">
                {title}
              </h3>
              <p className="text-black/70 leading-relaxed text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Audience ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-[40px] p-10 md:p-16 shadow-sm">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
            >
              Who We Work With
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-[#1A56DB]"
            >
              Solutions for every stage of growth
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#0D1B3E]/8 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
              >
                <div className="w-2 h-8 bg-gradient-to-b from-[#1A56DB] to-[#0D1B3E] rounded-full mb-4" />
                <h3 className="text-lg font-black text-[#1A56DB] mb-2">
                  {item.title}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-3"
          >
            Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#1A56DB]"
          >
            From idea to launch
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#F7F5F0] border border-[#0D1B3E]/8 rounded-3xl p-8 relative overflow-hidden hover:shadow-lg hover:shadow-[#1A56DB]/8 transition-all"
            >
              <span className="text-6xl font-black text-[#1A56DB]/10 absolute top-4 right-4">
                0{i + 1}
              </span>
              <div
                className="w-12 h-12 rounded-2xl bg-[#1A56DB] flex items-center justify-center mb-6"
                // style={{
                //   boxShadow:
                //     "0 8px 20px rgba(26,86,219,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                // }}
              >
                <CheckCircle className="w-5 h-5 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-black text-[#1A56DB]">{step}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 py-24 mx-6 mb-16 rounded-3xl bg-[#F7F5F0] border border-[#0D1B3E]/8 overflow-hidden"
      >
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-4">
            Get Started
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-[#1A56DB] leading-tight">
            Ready to build your next digital product?
          </h2>
          <p className="text-black/70 mt-6 text-sm">
            Let's create something modern, scalable and impactful together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#1A56DB]/20">
              Start Your Journey
            </button>
            <button  className="bg-[#1A56DB] hover:bg-[#0D1B3E] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#1A56DB]/20">
              {/* <a href="">Get Free Consultation</a> */}
              <Link to='/contact' >Get Free Consultation</Link>
            </button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
