import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiCamera,
  FiMail,
  FiCalendar,
  FiShield,
  FiBookOpen,
  FiAward,
  FiEdit2,
  FiMapPin,
  FiGlobe,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";
import Navbar from "./Navbar";

export default function StudentProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || null
  );

  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  const stats = [
    {
      label: "Courses",
      value: user?.coursesCount || 12,
      icon: <FiBookOpen />,
    },
    {
      label: "Certificates",
      value: user?.certificates || 4,
      icon: <FiAward />,
    },
    {
      label: "Completed",
      value: "87%",
      icon: <FiShield />,
    },
  ];

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      if (avatar) {
        fd.append("avatar", avatar);
      }

      await api.put("/auth/profile", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
        <Navbar/>
      {/* BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
            {/* AVATAR */}
            <div className="relative group w-fit">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center shadow-lg transition"
              >
                <FiCamera />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];

                  if (f) {
                    setAvatar(f);
                    setAvatarPreview(URL.createObjectURL(f));
                  }
                }}
              />
            </div>

            {/* INFO */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">
                  {form.name || "Student"}
                </h1>

                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold border border-indigo-500/20">
                  {user?.role || "Student"}
                </span>
              </div>

              <p className="text-gray-300 max-w-2xl leading-relaxed mb-5">
                {form.bio || "No bio added yet."}
              </p>

              <div className="flex flex-wrap gap-5 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiMail />
                  {user?.email}
                </div>

                <div className="flex items-center gap-2">
                  <FiCalendar />
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </div>

                <div className="flex items-center gap-2">
                  <FiShield />
                  {user?.isVerified ? "Verified" : "Not Verified"}
                </div>
              </div>
            </div>

            {/* EDIT */}
            <button
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2 transition"
            >
              <FiEdit2 />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="space-y-8">
            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Statistics</h2>

              <div className="space-y-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                        {stat.icon}
                      </div>

                      <span className="text-gray-300">{stat.label}</span>
                    </div>

                    <span className="text-2xl font-bold">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SOCIAL */}
            {/* <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Social Links</h2>

              <div className="space-y-4">
                {[
                  {
                    icon: <FiGlobe />,
                    value: form.website,
                    key: "website",
                    placeholder: "Website",
                  },
                  {
                    icon: <FiGithub />,
                    value: form.github,
                    key: "github",
                    placeholder: "GitHub",
                  },
                  {
                    icon: <FiLinkedin />,
                    value: form.linkedin,
                    key: "linkedin",
                    placeholder: "LinkedIn",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-3"
                  >
                    <div className="text-indigo-300">
                      {item.icon}
                    </div>

                    <input
                      type="text"
                      value={item.value}
                      placeholder={item.placeholder}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          [item.key]: e.target.value,
                        }))
                      }
                      className="bg-transparent outline-none w-full text-sm"
                    />
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-8">
            {/* ABOUT */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <h2 className="text-2xl font-semibold mb-8">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Full Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition"
                    placeholder="Your name"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Location
                  </label>

                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          location: e.target.value,
                        }))
                      }
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition"
                      placeholder="Your location"
                    />
                  </div>
                </div>

                {/* BIO */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">
                    Bio
                  </label>

                  <textarea
                    rows={6}
                    value={form.bio}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        bio: e.target.value,
                      }))
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none resize-none focus:border-indigo-500 transition"
                    placeholder="Tell something about yourself..."
                  />

                  <div className="text-right text-xs text-gray-500 mt-2">
                    {form.bio.length}/500
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-3"
                >
                  {loading && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}

                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* ACTIVITY */}
            {/* <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {[
                  "Completed React Fundamentals course",
                  "Earned JavaScript certificate",
                  "Started Advanced Node.js course",
                  "Updated profile information",
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />

                    <p className="text-gray-300">{activity}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          
        </div>
      </div>
    </div>
  );
}