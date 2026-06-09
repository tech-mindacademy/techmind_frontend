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
        }),
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
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
        {/* GRID - Light version */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* GLOW - Light version */}
        {/* <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] bg-indigo-500/10 blur-[140px] rounded-full" /> */}

        <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
          {/* LEFT SIDE - Light Theme */}
          <div className="hidden lg:flex flex-col justify-center px-40">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/">
                <div className="flex items-center gap-3 mb-10">
                  {/* <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">TM</span>
                  </div> */}
                  {/* <h1 className="text-3xl font-bold tracking-tight">
                    Tech Mind
                  </h1> */}
                </div>
              </Link>

              <span className="px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm inline-block mb-6">
                The Modern Learning with Tech Mind Academy
              </span>

              <h2 className="text-6xl font-bold leading-tight mb-6 text-gray-900">
                Learn Fast. Land Faster.
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mb-10">
                Expert-led courses, real projects, verified certificates —
                everything you need to go from student to professional.
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div className="flex gap-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <h3 className="text-4xl font-bold text-blue-600">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Light Form */}
          <div className="flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
                {/* TOGGLE */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isLogin
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      !isLogin
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
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
                        <label className="text-sm text-gray-700 mb-2 block font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          required
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          placeholder="••••••••"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-blue-500 transition"
                        />
                        {/* <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button> */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 active:text-gray-700 transition p-1 rounded-md focus:outline-none"
                        >
                          {showPassword ? (
                            /* Eye Slash */
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908l3.42 3.42M3 3l18 18"
                              />
                            </svg>
                          ) : (
                            /* Eye */
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="text-sm text-gray-700 mb-3 block font-medium">
                          Join As
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, role: "student" }))
                            }
                            className={`rounded-2xl border p-4 text-left transition ${
                              form.role === "student"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <p className="font-medium">Student</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Learn skills
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, role: "creator" }))
                            }
                            className={`rounded-2xl border p-4 text-left transition ${
                              form.role === "creator"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <p className="font-medium">Creator</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Build courses
                            </p>
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:brightness-105 transition disabled:opacity-70 mt-2"
                    >
                      {isLoading
                        ? "Please wait..."
                        : isLogin
                          ? "Sign In"
                          : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-blue-600 hover:underline font-medium"
                      >
                        {isLogin ? "Sign Up" : "Login"}
                      </button>
                    </p>

                    <p className="text-center text-sm text-gray-500">
                      Terms & Conditions • Privacy Policy
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