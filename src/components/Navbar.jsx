import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);          // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // hamburger menu
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: "/techmind-courses", label: "Courses" },
    { to: "/internships",      label: "Internships" },
    { to: "/contact",          label: "Contact" },
    { to: "/Services",         label: "Services" },
    { to: "/about",            label: "About us" },
  ];

  const navLinkClass = (path) =>
    `text-sm transition ${
      location.pathname === path
        ? "text-purple-400 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }`;

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/logo.png"
            alt="Tech Mind Academy"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className={`text-base font-bold ${
            location.pathname === "/"
              ? "text-purple-400"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          }`}>
            Tech Mind Academy
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={navLinkClass(to)}>
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Sign In — only when NOT logged in (desktop) */}
          {!user && (
            <Link
              to="/auth"
              className="hidden md:block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
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
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
                  >
                    <button onClick={() => { navigate("/profile"); setOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                      My Profile
                    </button>
                    <button onClick={() => { navigate("/student/dashboard"); setOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                      Dashboard
                    </button>
                    <button onClick={() => { navigate("/student/my-courses"); setOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                      My Courses
                    </button>
                    <button onClick={() => { navigate("/settings"); setOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                      Settings
                    </button>
                    <div className="border-t dark:border-gray-800" />
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* HAMBURGER BUTTON (mobile only) */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full origin-center"
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
            className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    location.pathname === to
                      ? "text-purple-500 bg-purple-50 dark:bg-purple-950/40"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

              {/* Sign In — only when NOT logged in (mobile) */}
              {!user && (
                <Link
                  to="/auth"
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Sign in
                </Link>
              )}

              {/* LOGGED IN — mobile user section */}
              {user && (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt="profile"
                        className="w-9 h-9 rounded-full object-cover border" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.name}</span>
                  </div>

                  {[
                    { label: "My Profile",  path: "/profile" },
                    { label: "Dashboard",   path: "/student/dashboard" },
                    { label: "My Courses",  path: "/student/my-courses" },
                    { label: "Settings",    path: "/settings" },
                  ].map(({ label, path }) => (
                    <button key={path}
                      onClick={() => { navigate(path); setMobileOpen(false); }}
                      className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {label}
                    </button>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition"
                  >
                    Logout
                  </button>
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
