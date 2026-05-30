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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Service() {
      const navigate = useNavigate();
  const services = [
    {
      icon: <Globe size={28} />,
      title: "Website Development",
      desc: "Modern business websites, portfolios and high-converting landing pages.",
    },
    {
      icon: <Smartphone size={28} />,
      title: "App Development",
      desc: "Responsive mobile apps and scalable cross-platform solutions.",
    },
    {
      icon: <Palette size={28} />,
      title: "UI/UX Design",
      desc: "Beautiful and intuitive interfaces focused on user experience.",
    },
    {
      icon: <Rocket size={28} />,
      title: "Startup MVP",
      desc: "Launch your startup idea fast with production-ready MVP development.",
    },
    {
      icon: <ShoppingCart size={28} />,
      title: "eCommerce Solutions",
      desc: "Online stores with payments, inventory and admin dashboards.",
    },
    {
      icon: <GraduationCap size={28} />,
      title: "College Projects",
      desc: "Custom academic and final-year projects with modern technologies.",
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
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-[400px] right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[150px]" />

        {/* Hero */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-purple-300 mb-8">
            🚀 Digital Solutions Studio
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
            Build modern websites,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {" "}
              apps & digital products.
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto mt-8 leading-relaxed">
            We help startups, students, creators and businesses build modern
            digital experiences that grow brands and launch ideas faster.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button className="bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold flex items-center gap-2">
              Start Your Project
              <ArrowRight size={18} />
            </button>

            {/* <button className="border border-white/10 hover:border-purple-500 bg-white/5 transition px-8 py-4 rounded-2xl font-semibold">
              View Portfolio
            </button> */}
            <button onClick={()=> navigate("/certificate-purchase")} className="bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold flex items-center gap-2">
              Get Certificates
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
            {[
              ["50+", "Projects Delivered"],
              ["20+", "Happy Clients"],
              ["10+", "Industries Served"],
              ["99%", "Client Satisfaction"],
            ].map(([number, label]) => (
              <div key={label}>
                <h2 className="text-4xl font-bold text-purple-400">{number}</h2>
                <p className="text-gray-500 mt-2">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-20">
            <p className="text-purple-400 uppercase tracking-[4px] text-sm">
              Services
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Everything you need to build online
            </h2>

            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              From websites to apps and startup MVPs — we create powerful
              digital solutions tailored to your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-purple-500/40 hover:-translate-y-2 transition duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center mb-6">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>

                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audience */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16">
            <div className="text-center mb-16">
              <p className="text-cyan-400 uppercase tracking-[4px] text-sm">
                Who We Work With
              </p>

              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Solutions for every stage of growth
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {audiences.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#0B1225] border border-white/10 rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-20">
            <p className="text-purple-400 uppercase tracking-[4px] text-sm">
              Process
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              From idea to launch
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
              >
                <span className="text-6xl font-bold text-white/10 absolute top-4 right-4">
                  0{index + 1}
                </span>

                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-6">
                  <CheckCircle />
                </div>

                <h3 className="text-2xl font-semibold">{step}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-28 mt-10 bg-gradient-to-r from-purple-700 to-indigo-700">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-5xl font-bold leading-tight">
              Ready to build your next digital product?
            </h2>

            <p className="text-white/70 text-lg mt-6">
              Let’s create something modern, scalable and impactful together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold">
                Start Your Journey
              </button>

              <button className="border border-white/30 px-8 py-4 rounded-2xl font-semibold">
                Get Free Consultation
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
