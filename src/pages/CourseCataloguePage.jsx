// import { useState, useEffect, useCallback } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { fetchCourses } from "../api/services/course.service";

// /* ───────────────────────── COURSE CARD ───────────────────────── */

// function CourseCard({ course }) {
//   return (
//     <Link to={`/courses/${course.slug}`}>
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
//       >
//         <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
//           {course.thumbnail?.url ? (
//             <img
//               src={course.thumbnail.url}
//               alt={course.title}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-4xl">
//               📚
//             </div>
//           )}
//         </div>

//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
//               {course.level}
//             </span>
//             <span className="text-gray-300 dark:text-gray-600">·</span>
//             <span className="text-xs text-gray-500">{course.category}</span>
//           </div>

//           <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//             {course.title}
//           </h3>

//           {course.shortDescription && (
//             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
//               {course.shortDescription}
//             </p>
//           )}

//           <div className="flex items-center gap-2 mt-2">
//             {course.creator?.avatar?.url ? (
//               <img
//                 src={course.creator.avatar.url}
//                 alt={course.creator.name}
//                 className="w-5 h-5 rounded-full"
//               />
//             ) : (
//               <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
//                 {course.creator?.name?.charAt(0)}
//               </div>
//             )}
//             <span className="text-xs text-gray-400">{course.creator?.name}</span>
//           </div>

//           <div className="flex items-center justify-between mt-3">
//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               {course.stats?.totalStudents > 0 && (
//                 <span>👥 {course.stats.totalStudents.toLocaleString()}</span>
//               )}
//               {course.stats?.totalLessons > 0 && (
//                 <span>📹 {course.stats.totalLessons} lessons</span>
//               )}
//             </div>
//             <div className="font-bold text-gray-900 dark:text-white text-sm">
//               {course.isFree || course.price === 0 ? (
//                 <span className="text-green-600 dark:text-green-400">Free</span>
//               ) : (
//                 <span>
//                   ₹
//                   {(
//                     course.discountPrice > 0
//                       ? course.discountPrice
//                       : course.price
//                   ).toLocaleString()}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </Link>
//   );
// }

// /* ───────────────────────── MAIN PAGE ───────────────────────── */

// export default function CoursesCataloguePage() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Data
//   const [courses, setCourses] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);

//   // Filters
//   const [search, setSearch] = useState(searchParams.get("q") || "");
//   const [category, setCategory] = useState(
//     searchParams.get("category") || "All"
//   );
//   const [level, setLevel] = useState(searchParams.get("level") || "");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const [free, setFree] = useState(false);

//   /* ── Fetch categories once on mount ── */
//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const res = await fetch("/api/courses/categories");
//         const data = await res.json();
//         if (data.success) {
//           setCategories(["All", ...data.categories]);
//         }
//       } catch {
//         setCategories(["All"]);
//       } finally {
//         setCategoriesLoading(false);
//       }
//     }
//     loadCategories();
//   }, []);

//   /* ── Fetch courses whenever filters change ── */
//  useEffect(() => {
//   const timer = setTimeout(async () => {
//     setIsLoading(true);
//     try {
//       const params = { sort, page, limit: 12 };
//       if (search) params.search = search;
//       if (category && category !== "All") params.category = category;
//       if (level) params.level = level;
//       if (free) params.free = true;
//       const d = await fetchCourses(params);
//       setCourses(d.courses || []);
//       setPagination(d.pagination);
//     } catch {
//       setCourses([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, search ? 500 : 0); // debounce only for search, instant for filters

//   return () => clearTimeout(timer);
// }, [search, category, level, sort, page, free]);

// // Simple form submit — just prevents page reload
// const handleSearch = (e) => {
//   e.preventDefault();
//   setPage(1);
// };
//   /* ── Sync active category to URL search params ── */
//   const handleCategoryChange = (c) => {
//     setCategory(c);
//     setPage(1);
//     setSearchParams((prev) => {
//       const next = new URLSearchParams(prev);
//       if (c === "All") next.delete("category");
//       else next.set("category", c);
//       return next;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       {/* <Navbar /> */}

//       {/* HERO / SEARCH HEADER */}
//       <div className="bg-gradient-to-br from-indigo-600 to-violet-600 py-12 px-4">
//         <div className="max-w-4xl mx-auto text-center space-y-5">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold text-white"
//           >
//             Find your next course
//           </motion.h1>

//           <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
//             <div className="flex-1 relative">
//               <svg
//                 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses..."
//                 className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
//             >
//               Search
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* BODY */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* FILTERS ROW */}
//         <div className="flex gap-3 mb-6 flex-wrap items-center">
//           {/* CATEGORY PILLS */}
//           <div className="flex gap-1 flex-wrap">
//             {categoriesLoading
//               ? Array(5)
//                   .fill(0)
//                   .map((_, i) => (
//                     <div
//                       key={i}
//                       className="h-7 w-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
//                     />
//                   ))
//               : categories.map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => handleCategoryChange(c)}
//                     className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
//                       category === c
//                         ? "bg-indigo-600 text-white"
//                         : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
//                     }`}
//                   >
//                     {c}
//                   </button>
//                 ))}
//           </div>

//           {/* RIGHT-SIDE CONTROLS */}
//           <div className="ml-auto flex items-center gap-2">
//             <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300">
//               <input
//                 type="checkbox"
//                 checked={free}
//                 onChange={(e) => {
//                   setFree(e.target.checked);
//                   setPage(1);
//                 }}
//                 className="accent-indigo-600"
//               />
//               Free only
//             </label>

//             <select
//               value={sort}
//               onChange={(e) => {
//                 setSort(e.target.value);
//                 setPage(1);
//               }}
//               className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
//             >
//               <option value="newest">Newest</option>
//               <option value="popular">Most popular</option>
//               <option value="rating">Top rated</option>
//               <option value="price-low">Price: Low to high</option>
//               <option value="price-high">Price: High to low</option>
//             </select>
//           </div>
//         </div>

//         {/* RESULTS COUNT */}
//         {pagination && (
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
//             {pagination.total} course{pagination.total !== 1 ? "s" : ""} found
//           </p>
//         )}

//         {/* COURSE GRID */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {Array(8)
//               .fill(0)
//               .map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse"
//                 >
//                   <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
//                   <div className="p-4 space-y-2">
//                     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//                     <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//                     <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
//                   </div>
//                 </div>
//               ))}
//           </div>
//         ) : courses.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-5xl mb-4">🔍</div>
//             <p className="text-gray-500 dark:text-gray-400 text-lg">
//               No courses found.
//             </p>
//             <p className="text-gray-400 text-sm mt-2">
//               Try adjusting your search or filters.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {courses.map((course) => (
//               <CourseCard key={course._id} course={course} />
//             ))}
//           </div>
//         )}

//         {/* PAGINATION */}
//         {pagination && pagination.pages > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-10">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:border-indigo-300 transition"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-500 px-2">
//               Page {page} of {pagination.pages}
//             </span>
//             <button
//               onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
//               disabled={page === pagination.pages}
//               className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:border-indigo-300 transition"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* <Footer /> */}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Users, PlayCircle, ImageOff, SlidersHorizontal } from "lucide-react";
import { fetchCourses } from "../api/services/course.service";

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const inputCls =
  "w-full px-3.5 py-3 border border-[#0D1B3E]/15 rounded-lg bg-white text-black text-sm placeholder-black/35 " +
  "hover:border-[#0D1B3E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition";

const LEVELS = [
  ["", "Any level"],
  ["beginner", "Beginner"],
  ["intermediate", "Intermediate"],
  ["advanced", "Advanced"],
];

const levelLabel = (level) =>
  !level ? "" : level === "all" ? "All levels" : level.charAt(0).toUpperCase() + level.slice(1);

/* ───────────────────────── COURSE CARD ───────────────────────── */

function CourseCard({ course }) {
  const isFree = course.isFree || course.price === 0;
  const hasDiscount = course.discountPrice > 0 && course.price > course.discountPrice;
  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const students = course.stats?.totalStudents || 0;
  const lessons = course.stats?.totalLessons || 0;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={`group block bg-white border border-[#0D1B3E]/12 rounded-xl overflow-hidden hover:border-[#1A56DB]/50 hover:shadow-[0_8px_24px_rgba(13,27,62,0.08)] transition ${focusRing}`}
    >
      {/* Fixed 16:9 frame so every thumbnail is the same size */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0D1B3E]/5">
        {course.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-[#0D1B3E]/25" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold text-[#1A56DB] truncate">
          {levelLabel(course.level)}
          {course.level && course.category && <span className="text-black/30 font-normal"> / </span>}
          <span className="font-normal text-black/55">{course.category}</span>
        </p>

        <h3
          className="font-semibold text-[#0D1B3E] mt-2 truncate group-hover:text-[#1A56DB] transition-colors"
          title={course.title}
        >
          {course.title}
        </h3>
        <p className="text-sm text-black/55 mt-1 truncate min-h-[1.25rem]">{course.shortDescription}</p>

        <div className="flex items-center gap-2 mt-4">
          {course.creator?.avatar?.url ? (
            <img src={course.creator.avatar.url} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#1A56DB]/10 flex items-center justify-center text-xs font-bold text-[#1A56DB]">
              {course.creator?.name?.charAt(0)}
            </div>
          )}
          <span className="text-sm text-black/60 truncate">{course.creator?.name}</span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#0D1B3E]/10">
          <div className="flex items-center gap-3 text-sm text-black/55 min-w-0">
            {students > 0 && (
              <span className="inline-flex items-center gap-1.5" title="Students enrolled">
                <Users className="w-4 h-4" strokeWidth={1.75} />
                {students.toLocaleString("en-IN")}
              </span>
            )}
            {lessons > 0 && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <PlayCircle className="w-4 h-4" strokeWidth={1.75} />
                {lessons} {lessons === 1 ? "lesson" : "lessons"}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            {isFree ? (
              <span className="text-sm font-bold text-emerald-700">Free</span>
            ) : (
              <>
                {hasDiscount && (
                  <span className="text-xs text-black/40 line-through mr-2">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-base font-bold text-[#0D1B3E]">₹{price.toLocaleString("en-IN")}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ───────────────────────── MAIN PAGE ───────────────────────── */

export default function CoursesCataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [free, setFree] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile only

  /* ── Fetch categories once on mount ── */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/courses/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(["All", ...data.categories]);
        }
      } catch {
        setCategories(["All"]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  /* ── Fetch courses whenever filters change ── */
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = { sort, page, limit: 12 };
        if (search) params.search = search;
        if (category && category !== "All") params.category = category;
        if (level) params.level = level;
        if (free) params.free = true;
        const d = await fetchCourses(params);
        setCourses(d.courses || []);
        setPagination(d.pagination);
      } catch {
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    }, search ? 500 : 0); // debounce only for search, instant for filters

    return () => clearTimeout(timer);
  }, [search, category, level, sort, page, free]);

  // Simple form submit, just prevents page reload
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  /* ── Sync active category to URL search params ── */
  const handleCategoryChange = (c) => {
    setCategory(c);
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (c === "All") next.delete("category");
      else next.set("category", c);
      return next;
    });
  };

  const hasFilters = search || category !== "All" || level || free;

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("");
    setFree(false);
    setPage(1);
    setSearchParams({});
  };

  const filterPanel = (
    <div className="space-y-7">
      {/* Category */}
      <fieldset>
        <legend className="text-sm font-bold text-[#0D1B3E] mb-3">Category</legend>
        {categoriesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 rounded-lg bg-[#0D1B3E]/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => handleCategoryChange(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${focusRing} ${
                    category === c
                      ? "bg-[#1A56DB]/10 text-[#1A56DB] font-semibold"
                      : "text-[#0D1B3E]/70 hover:bg-[#0D1B3E]/5 hover:text-[#0D1B3E]"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {/* Level */}
      <fieldset>
        <legend className="text-sm font-bold text-[#0D1B3E] mb-3">Level</legend>
        <div className="space-y-2.5">
          {LEVELS.map(([value, label]) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#0D1B3E]/80">
              <input
                type="radio"
                name="level"
                checked={level === value}
                onChange={() => { setLevel(value); setPage(1); }}
                className="w-4 h-4 accent-[#1A56DB]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Price */}
      <fieldset>
        <legend className="text-sm font-bold text-[#0D1B3E] mb-3">Price</legend>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#0D1B3E]/80">
          <input
            type="checkbox"
            checked={free}
            onChange={(e) => { setFree(e.target.checked); setPage(1); }}
            className="w-4 h-4 accent-[#1A56DB]"
          />
          Free courses only
        </label>
      </fieldset>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className={`text-sm font-semibold text-[#1A56DB] hover:underline rounded ${focusRing}`}
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-8 text-black">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">Browse courses</h1>
          <p className="text-black/60 text-sm mt-1.5" aria-live="polite">
            {pagination
              ? `${pagination.total} course${pagination.total !== 1 ? "s" : ""} found`
              : "Find the right course for your goals."}
          </p>
        </div>

        <form onSubmit={handleSearch} role="search" className="flex gap-2 w-full sm:w-auto sm:min-w-[360px]">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" strokeWidth={2} />
            <input
              type="search"
              aria-label="Search courses"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search courses"
              className={`${inputCls} pl-10`}
            />
          </div>
          <button
            type="submit"
            className={`px-5 py-3 bg-[#1A56DB] hover:bg-[#0D1B3E] text-white text-sm font-semibold rounded-lg transition ${focusRing}`}
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-[230px_1fr] gap-8 lg:gap-10 items-start">
        {/* Filters */}
        <aside aria-label="Filters" className="lg:sticky lg:top-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className={`lg:hidden w-full flex items-center justify-between px-4 py-3 border border-[#0D1B3E]/15 rounded-lg text-sm font-semibold text-[#0D1B3E] ${focusRing}`}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
              Filters
            </span>
            <span className="text-black/50 font-normal">{filtersOpen ? "Hide" : "Show"}</span>
          </button>
          <div className={`${filtersOpen ? "block mt-5" : "hidden"} lg:block`}>{filterPanel}</div>
        </aside>

        {/* Results */}
        <section className="min-w-0 space-y-5" aria-label="Courses">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#0D1B3E]/10">
            <p className="text-sm text-black/60">
              {pagination && pagination.pages > 1 ? `Page ${page} of ${pagination.pages}` : "\u00A0"}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-black/60">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className={`${inputCls} !w-auto !py-2 pr-8`}
              >
                <option value="newest">Newest</option>
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="border border-[#0D1B3E]/10 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-[#0D1B3E]/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-[#0D1B3E]/5 rounded w-1/3" />
                    <div className="h-4 bg-[#0D1B3E]/5 rounded w-3/4" />
                    <div className="h-3 bg-[#0D1B3E]/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="border border-dashed border-[#0D1B3E]/20 rounded-xl p-12 text-center">
              <p className="font-semibold text-[#0D1B3E]">No courses found</p>
              <p className="text-sm text-black/60 mt-1">Try adjusting your search or filters.</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-5 px-5 py-2.5 border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 text-sm font-semibold rounded-lg transition ${focusRing}`}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-5 py-2.5 text-sm font-semibold border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition ${focusRing}`}
              >
                Previous
              </button>
              <span className="text-sm text-black/60 px-2">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className={`px-5 py-2.5 text-sm font-semibold border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition ${focusRing}`}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}