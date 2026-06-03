import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/techmind-courses", label: "Courses" },
    { to: "/internships",      label: "Internships", dot: true },
    { to: "/contact",          label: "Contact" },
    { to: "/Services",         label: "Services" },
    { to: "/about",            label: "About us" },
  ];

  const navLinkClass = (path) =>
    `text-sm font-medium transition ${
      location.pathname === path
        ? "text-[#1A56DB] font-semibold"
        : "text-[#0D1B3E] hover:text-[#1A56DB]"
    }`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.png" alt="Tech Mind Academy" className="w-9 h-9 rounded-full object-cover" />
          <span className="text-base font-bold text-[#0D1B3E]">
            Tech Mind <span className="text-[#1A56DB]">Academy</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ to, label, dot }) => (
            <Link key={to} to={to} className={`${navLinkClass(to)} relative inline-flex items-center gap-1.5`}>
              {label}
              {dot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56DB] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56DB]" />
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Sign In — only when NOT logged in */}
          {!user && (
            <Link to="/auth"
              className="hidden md:block text-sm font-medium text-[#0D1B3E] hover:text-[#1A56DB] transition">
              Sign in
            </Link>
          )}

          {/* LOGGED IN USER DROPDOWN */}
          {user && (
            <div className="relative hidden md:block" ref={menuRef}>
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                {user.avatar?.url ? (
                  <img src={user.avatar.url} alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1A56DB] flex items-center justify-center font-bold text-white text-sm">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-[#0D1B3E]">{user.name}</span>
                <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                      { label: "My Profile",  path: "/profile" },
                      { label: "Dashboard",   path: "/student/dashboard" },
                      { label: "My Courses",  path: "/student/my-courses" },
                      { label: "Settings",    path: "/settings" },
                    ].map(({ label, path }) => (
                      <button key={path} onClick={() => { navigate(path); setOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition">
                        {label}
                      </button>
                    ))}
                    <div className="border-t border-blue-100" />
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-blue-50 transition"
            aria-label="Toggle menu"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full origin-center" />
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.15 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-[#0D1B3E] rounded-full origin-center" />
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
                <Link key={to} to={to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center gap-2 ${
                    location.pathname === to
                      ? "text-[#1A56DB] bg-blue-50 font-semibold"
                      : "text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB]"
                  }`}>
                  {label}
                  {dot && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A56DB] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A56DB]" />
                    </span>
                  )}
                </Link>
              ))}

              <div className="border-t border-blue-100 my-1" />

              {/* Sign In — not logged in */}
              {!user && (
                <Link to="/auth"
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition">
                  Sign in
                </Link>
              )}

              {/* Logged in profile accordion */}
              {user && (
                <>
                  <button
                    onClick={() => setMobileProfileOpen(p => !p)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar?.url ? (
                        <img src={user.avatar.url} alt="profile"
                          className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1A56DB] flex items-center justify-center font-bold text-white text-sm">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#0D1B3E]">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <motion.svg animate={{ rotate: mobileProfileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                            { label: "My Profile",  path: "/profile" },
                            { label: "Dashboard",   path: "/student/dashboard" },
                            { label: "My Courses",  path: "/student/my-courses" },
                            { label: "Settings",    path: "/settings" },
                          ].map(({ label, path }) => (
                            <button key={path}
                              onClick={() => { navigate(path); setMobileOpen(false); setMobileProfileOpen(false); }}
                              className="text-left px-3 py-2 rounded-lg text-sm text-[#0D1B3E] hover:bg-blue-50 hover:text-[#1A56DB] transition">
                              {label}
                            </button>
                          ))}
                          <button onClick={handleLogout}
                            className="text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
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
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//         <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
//           Tech Minds
//         </Link>
//         <div className="flex items-center gap-3">
//           <Link to="/browse-courses" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block">
//             Browse courses
//           </Link>
//           <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
//             Sign in
//           </Link>
//           <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
//             Get started free
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// import { useState, useRef, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import useAuth from "../hooks/useAuth";
// import ProfileModal from "./ProfileModal";

// export default function Navbar() {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);
//   const menuRef = useRef(null);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navLinkClass = (path) =>
//     `text-sm transition hidden sm:block ${
//       location.pathname === path
//         ? "text-purple-400 font-semibold"
//         : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
//     }`;
//   // close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/auth";
//   };

//   return (
//     <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//         {/* LOGO */}
//         {/* LOGO */}
// <Link
//   to="/"
//   className="flex items-center gap-2.5"
// >
//   <img 
//     src="/logo.png" 
//     alt="Tech Mind Academy" 
//     className="w-9 h-9 rounded-full object-cover"
//   />
//   <span className={`text-base font-bold ${
//     location.pathname === "/" 
//       ? "text-purple-400" 
//       : "bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
//   }`}>
//     Tech Mind Academy
//   </span>
// </Link>

//         {/* RIGHT SIDE */}
//         <div className="flex items-center gap-4">
//           <Link
//             to="/techmind-courses"
//             className={navLinkClass("/techmind-courses")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             courses
//           </Link>
//           <Link
//             to="/internships"
//             className={navLinkClass("/internships")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             Internships
//           </Link>
//           {/* <Link
//             to="/certificate-purchase"
//             className={navLinkClass("/certificate-purchase")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             Certificates
//           </Link> */}
//           <Link
//             to="/contact"
//             className={navLinkClass("/contact")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             Contact
//           </Link>
//           <Link
//             to="/Services"
//             className={navLinkClass("/Services")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             Services
//           </Link>
//           <Link
//             to="/about"
//             className={navLinkClass("/about")}
//             // className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
//           >
//             About us
//           </Link>

//           {/* NOT LOGGED IN */}
//           <Link
//                 to="/auth"
//                 className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900"
//               >
//                 Sign in
//               </Link>
//           {/* {!user && (
//             <>
//               <Link
//                 to="/login"
//                 className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900"
//               >
//                 Sign in
//               </Link>

//               <Link
//                 to="/register"
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
//               >
//                 Get started
//               </Link>
//             </>
//           )} */}

//           {/* LOGGED IN USER */}
//           {user && (
//             <div className="relative" ref={menuRef}>
//               {/* AVATAR BUTTON */}
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center gap-2"
//               >
//                 {user.avatar?.url ? (
//                   <img
//                     src={user.avatar.url}
//                     alt="profile"
//                     className="w-9 h-9 rounded-full object-cover border"
//                   />
//                 ) : (
//                   <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
//                     {user.name?.charAt(0)}
//                   </div>
//                 )}

//                 <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
//                   {user.name}
//                 </span>
//               </button>

//               {/* DROPDOWN MENU */}
//               <AnimatePresence>
//                 {open && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
//                   >
//                     <button
//                       onClick={() => {
//                         navigate("/profile");
//                         setOpen(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       My Profile
//                     </button>

//                     {/* <button
//                       onClick={() => {
//                         setProfileOpen(true);
//                         setOpen(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       My Profile
//                     </button> */}
//                     <button
//                       onClick={() => {
//                         navigate("/student/dashboard");
//                         setOpen(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       Dashboard
//                     </button>

//                     <button
//                       onClick={() => {
//                         navigate("/student/my-courses");
//                         setOpen(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       My Courses
//                     </button>

//                     <button
//                       onClick={() => {
//                         navigate("/settings");
//                         setOpen(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                     >
//                       Settings
//                     </button>

//                     <div className="border-t dark:border-gray-800" />

//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
