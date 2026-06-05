import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchCourses } from "../api/services/course.service";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

/* ───────────────────────── COURSE CARD ───────────────────────── */

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
      >
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {course.thumbnail?.url ? (
            <img
              src={course.thumbnail.url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📚
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
              {course.level}
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="text-xs text-gray-500">{course.category}</span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title}
          </h3>

          {course.shortDescription && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {course.shortDescription}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {course.creator?.avatar?.url ? (
              <img
                src={course.creator.avatar.url}
                alt={course.creator.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                {course.creator?.name?.charAt(0)}
              </div>
            )}
            <span className="text-xs text-gray-400">{course.creator?.name}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {course.stats?.totalStudents > 0 && (
                <span>👥 {course.stats.totalStudents.toLocaleString()}</span>
              )}
              {course.stats?.totalLessons > 0 && (
                <span>📹 {course.stats.totalLessons} lessons</span>
              )}
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              {course.isFree || course.price === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                <span>
                  ₹
                  {(
                    course.discountPrice > 0
                      ? course.discountPrice
                      : course.price
                  ).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
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
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [free, setFree] = useState(false);

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

// Simple form submit — just prevents page reload
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* <Navbar /> */}

      {/* HERO / SEARCH HEADER */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            Find your next course
          </motion.h1>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* FILTERS ROW */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {/* CATEGORY PILLS */}
          <div className="flex gap-1 flex-wrap">
            {categoriesLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
                    />
                  ))
              : categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCategoryChange(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
                      category === c
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
          </div>

          {/* RIGHT-SIDE CONTROLS */}
          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={free}
                onChange={(e) => {
                  setFree(e.target.checked);
                  setPage(1);
                }}
                className="accent-indigo-600"
              />
              Free only
            </label>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        {pagination && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {pagination.total} course{pagination.total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* COURSE GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No courses found.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:border-indigo-300 transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 px-2">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-40 hover:border-indigo-300 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </div>
  );
}

