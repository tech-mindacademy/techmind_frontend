import { useState, Suspense } from "react";
import { Outlet, NavLink, Link, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import PageLoader from "../PageLoader";

const navItems = [
  {
    to: "/intern/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    to: "/intern/live-classes",
    label: "Live Classes",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
];

function NavIcon({ path }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
    </svg>
  );
}

function SidebarContent({ onClose, user, logout }) {
  return (
    <div className="flex flex-col h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span>
            Tech Mind <span className="text-indigo-600">Internships</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-700">
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <NavIcon path={item.icon} />
            </div>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950 rounded-xl transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function InternLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const outletCtx = useOutletContext?.() ?? {};

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex w-64 shrink-0">
        <SidebarContent user={user} logout={logout} />
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setOpen(false)} user={user} logout={logout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={() => setOpen(true)} className="text-gray-500">☰</button>
          <span className="ml-3 font-bold text-gray-900 dark:text-white">Intern Portal</span>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="w-full max-w-6xl mx-auto p-6">
            <Suspense fallback={<PageLoader />}>
              <Outlet context={outletCtx} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}