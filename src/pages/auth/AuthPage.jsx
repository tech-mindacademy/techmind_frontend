import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  loginUser,
  registerUser,
  clearError,
  selectAuthLoading,
} from "../../store/slices/authSlice";

import { ROLE_DASHBOARDS } from "../../routes/ProtectedRoute";
import Navbar from "../../components/Navbar";

const stats = [
  { value: "50K+", label: "Students" },
  { value: "1,200+", label: "Courses" },
  { value: "800+", label: "Creators" },
];

const features = [
  "HD video lessons",
  "Interactive quizzes",
  "Verified certificates",
  "Track learning progress",
];

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = useSelector(selectAuthLoading);

  const from = location.state?.from?.pathname || null;

  const [isLogin, setIsLogin] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!isLogin && !form.name.trim()) {
      e.name = "Name required";
    }

    if (!form.email) {
      e.email = "Email required";
    }

    if (!form.password) {
      e.password = "Password required";
    }

    if (!isLogin && form.password.length < 8) {
      e.password = "Minimum 8 characters";
    }

    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isLogin) {
      dispatch(clearError());

      const result = await dispatch(
        loginUser({
          email: form.email,
          password: form.password,
        })
      );

      if (loginUser.fulfilled.match(result)) {
        toast.success("Welcome back!");

        const role = result.payload.user.role;

        navigate(from || ROLE_DASHBOARDS[role] || "/");
      } else {
        toast.error(result.payload || "Login failed");
      }
    } else {
      const result = await dispatch(registerUser(form));

      if (registerUser.fulfilled.match(result)) {
        toast.success("Account created!");
        setIsLogin(true);
      } else {
        toast.error(result.payload || "Signup failed");
      }
    }
  };

  return (
   <div>
    <Navbar/>
     <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* GLOW */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-700/30 blur-[120px]" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-700/30 blur-[120px]" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center px-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-10">
                Tech Minds
              </h1>
            </Link>

            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 inline-block mb-6">
              The future of online learning
            </span>

            <h2 className="text-6xl font-bold leading-tight mb-6">
              Learn anything, <br />
              <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text">
                master everything.
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-10">
              Build real-world skills with premium courses, quizzes,
              certificates and mentorship from expert creators.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            {/* STATS */}
            <div className="flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <h3 className="text-3xl font-bold text-indigo-300">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(99,102,241,0.15)]">
              {/* TOGGLE */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition ${
                    isLogin
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition ${
                    !isLogin
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {!isLogin && (
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="text-sm text-gray-300 mb-3 block">
                        Join As
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              role: "student",
                            }))
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            form.role === "student"
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-white/10"
                          }`}
                        >
                          <p className="font-medium">Student</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Learn skills
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              role: "creator",
                            }))
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            form.role === "creator"
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-white/10"
                          }`}
                        >
                          <p className="font-medium">Creator</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Build courses
                          </p>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-semibold transition"
                  >
                    {isLoading
                      ? "Please wait..."
                      : isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </button>

                  <p className="text-center text-sm text-gray-400">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}

                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-indigo-400 hover:underline"
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
   </div>
  );
}