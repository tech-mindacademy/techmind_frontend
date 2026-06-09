import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/techmind-courses", label: "Courses" },
    { to: "/internships", label: "Internships", dot: true },
    { to: "/contact", label: "Contact" },
    { to: "/Services", label: "Services" },
    { to: "/about", label: "About us" },
    {to: "/blogs", label: "Blogs" },
  ];

  const navLinkClass = (path) =>
    `text-sm font-medium transition ${location.pathname === path
      ? "text-[#1A56DB] font-semibold"
      : "text-[#0D1B3E] hover:text-[#1A56DB]"
    }`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileProfileOpen(false);
  }, [location.pathname]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   window.location.href = "/auth";
  // };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/">
          <img
            src="/logo (2).png"
            alt="Tech Mind Academy"
            className="w-48 object-contain"
            style={{
              marginTop: "-38%",
              marginBottom: "-38%",
              marginLeft: "-8%",
            }}
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ to, label, dot }) => (
            <Link
              key={to}
              to={to}
              className={`${navLinkClass(to)} relative inline-flex items-center gap-1.5`}
            >
              {dot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56DB] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56DB]" />
                </span>
              )}
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Sign In — only when NOT logged in */}
          {!user && (
            <Link
              to="/auth"
              className="hidden md:block text-sm font-medium text-[#0D1B3E] hover:text-[#1A56DB] transition"
            >
              Sign in
            </Link>
          )}

          {/* LOGGED IN USER DROPDOWN */}
          {user && (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1A56DB] flex items-center justify-center font-bold text-white text-sm">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-[#0D1B3E]">
                  {user.name}
                </span>
                <motion.svg
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 bg-white border border-blue-100 rounded-xl shadow-lg shadow-blue-100/60 overflow-hidden"
                  >
                    {[
                      { label: "My Profile", path: "/profile" },
                      { label: "Dashboard", path: "/student/dashboard" },
                      { label: "My Courses", path: "/student/my-courses" },
                      { label: "Settings", path: "/settings" },
                    ].map(({ label, path }) => (
                      <button
                        key={path}
                        onClick={() => {
                          navigate(path);
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition"
                      >
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-blue-100" />
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-blue-50 transition"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full origin-center"
            />
            <motion.span
              animate={
                mobileOpen
                  ? { opacity: 0, scaleX: 0 }
                  : { opacity: 1, scaleX: 1 }
              }
              transition={{ duration: 0.15 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full origin-center"
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-blue-100 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map(({ to, label, dot }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center gap-2 ${location.pathname === to
                      ? "text-[#1A56DB] bg-blue-50 font-semibold"
                      : "text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB]"
                    }`}
                >
                  {dot && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56DB] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56DB]" />
                    </span>
                  )}
                  {label}
                </Link>
              ))}

              <div className="border-t border-blue-100 my-1" />

              {/* Sign In — not logged in */}
              {!user && (
                <Link
                  to="/auth"
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition"
                >
                  Sign in
                </Link>
              )}

              {/* Logged in profile accordion */}
              {user && (
                <>
                  <button
                    onClick={() => setMobileProfileOpen((p) => !p)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="profile"
                          className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1A56DB] flex items-center justify-center font-bold text-white text-sm">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#0D1B3E]">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <motion.svg
                      animate={{ rotate: mobileProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>

                  <AnimatePresence>
                    {mobileProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden pl-3"
                      >
                        <div className="border-l-2 border-[#1A56DB]/30 pl-3 flex flex-col gap-0.5 py-1">
                          {[
                            { label: "My Profile", path: "/profile" },
                            { label: "Dashboard", path: "/student/dashboard" },
                            {
                              label: "My Courses",
                              path: "/student/my-courses",
                            },
                            { label: "Settings", path: "/settings" },
                          ].map(({ label, path }) => (
                            <button
                              key={path}
                              onClick={() => {
                                navigate(path);
                                setMobileOpen(false);
                                setMobileProfileOpen(false);
                              }}
                              className="text-left px-3 py-2 rounded-lg text-sm text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition"
                            >
                              {label}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              logout();
                              setOpen(false);
                            }}
                            className="text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
