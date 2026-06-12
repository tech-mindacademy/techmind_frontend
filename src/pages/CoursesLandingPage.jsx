import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCourses } from "../api/services/course.service";
import api from "../api/axios";

const ITEMS_PER_PAGE = 6;

/* ── Course Card ── */
function CourseCard({ course }) {
  const avgRating = course.stats?.avgRating;
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0D1B3E]/8 shadow-sm hover:shadow-xl hover:shadow-[#1A56DB]/10 transition-all duration-300"
    >
      <Link to={`/auth`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
          {course.thumbnail?.url ? (
            <img src={course.thumbnail.url}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <div className="h-full flex items-center justify-center text-4xl">📚</div>
          )}
          {course.isFree || course.price === 0 ? (
            <span className="absolute top-3 left-3 text-xs bg-[#1A56DB] text-white px-2.5 py-1 rounded-full font-bold shadow-sm">FREE</span>
          ) : null}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#0D1B3E] line-clamp-2 group-hover:text-[#1A56DB] transition text-sm leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-black/45 mt-1 font-medium">{course.creator?.name}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#0D1B3E]/6">
            {avgRating > 0 ? (
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">★</span>
                <span className="text-black font-bold text-xs">{avgRating.toFixed(1)}</span>
                {course.stats?.totalReviews > 0 && (
                  <span className="text-xs text-black/40">({course.stats.totalReviews})</span>
                )}
              </div>
            ) : <span className="text-xs text-black/40">No reviews yet</span>}
            <div className="font-black text-[#1A56DB] text-sm">
              {course.isFree || course.price === 0
                ? "Free"
                : `₹${(course.discountPrice || course.price).toLocaleString()}`}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Filter Panel ── */
function FilterPanel({ category, setCategory, price, setPrice, setPage, categories, onClose }) {
  const hasActiveFilters = category !== "All" || price !== "All";

  const itemClass = (active) =>
    `cursor-pointer text-sm mb-2 transition flex items-center gap-1.5 ${
      active ? "text-[#1A56DB] font-semibold" : "text-black/50 hover:text-[#1A56DB]"
    }`;

  return (
    <div className="p-5">
      {hasActiveFilters && (
        <button
          onClick={() => { setCategory("All"); setPrice("All"); setPage(1); onClose?.(); }}
          className="w-full mb-4 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition"
        >
          ✕ Reset Filters
        </button>
      )}

      <h3 className="font-black mb-3 text-[#1A56DB] text-sm uppercase tracking-wider">Category</h3>
      {["All", ...categories].map((c) => (
        <p key={c} onClick={() => { setCategory(c); setPage(1); }} className={itemClass(category === c)}>
          {category === c && <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] flex-shrink-0" />}
          {c}
        </p>
      ))}

      <hr className="my-4 border-[#0D1B3E]/8" />

      <h3 className="font-black mb-3 text-[#1A56DB] text-sm uppercase tracking-wider">Price</h3>
      {["All", "Free", "Paid"].map((p) => (
        <p key={p} onClick={() => { setPrice(p); setPage(1); }} className={itemClass(price === p)}>
          {price === p && <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] flex-shrink-0" />}
          {p}
        </p>
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function CoursesLandingPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [coursesData, catData] = await Promise.all([
          fetchCourses({ limit: 100 }),
          api.get("/courses/categories").then(r => r.data),
        ]);
        setCourses(coursesData.courses || []);
        setCategories(catData.categories || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];
    if (search) result = result.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((c) => c.category === category);
    if (price === "Free") result = result.filter((c) => c.isFree || c.price === 0);
    if (price === "Paid") result = result.filter((c) => !c.isFree && c.price > 0);
    if (sort === "priceLow")  result.sort((a, b) => (a.discountPrice||a.price) - (b.discountPrice||b.price));
    if (sort === "priceHigh") result.sort((a, b) => (b.discountPrice||b.price) - (a.discountPrice||a.price));
    if (sort === "newest")    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [courses, search, category, price, sort]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, page]);

  const activeFilterCount = [category !== "All", price !== "All"].filter(Boolean).length;

  return (
    <div className="bg-white min-h-screen">

      {/* Page header */}
      <div className="bg-white relative overflow-hidden border-b border-[#0D1B3E]/8">
  {/* Remove the grid div entirely */}
  <div className="relative max-w-7xl mx-auto px-4 py-12 text-center">
    <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="text-xs font-black uppercase tracking-widest text-[#1A56DB] mb-2">
      Tech Mind Academy
    </motion.p>
    <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      className="text-3xl sm:text-4xl font-black text-[#1A56DB]">
      Browse Courses
    </motion.h1>
    <motion.p initial={{ opacity:0 }} animate={{ opacity:1, transition:{ delay:0.2 } }}
      className="text-black/50 mt-2 text-sm">
      {filteredCourses.length} courses available
    </motion.p>
  </div>
</div>

      {/* Search + Sort toolbar */}
      <div className="bg-white border-b border-[#0D1B3E]/8 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#0D1B3E]/10 text-sm text-black placeholder-black/30 focus:outline-none focus:border-[#1A56DB] focus:ring-1 focus:ring-[#1A56DB]/30 transition" />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Sort */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#0D1B3E]/10 text-sm text-black focus:outline-none focus:border-[#1A56DB] transition">
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
            </select>

            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(p => !p)}
              className="lg:hidden relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#0D1B3E]/10 text-sm font-medium text-black hover:border-[#1A56DB] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#1A56DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1A56DB] text-white text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 mt-3">
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }} transition={{ duration:0.25, ease:"easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-[#0D1B3E]/8 shadow-sm">
                <FilterPanel category={category} setCategory={setCategory} price={price} setPrice={setPrice}
                  setPage={setPage} categories={categories} onClose={() => setFiltersOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 mt-5 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block bg-white rounded-2xl border border-[#0D1B3E]/8 h-fit sticky top-[120px] shadow-sm">
          <FilterPanel category={category} setCategory={setCategory} price={price} setPrice={setPrice}
            setPage={setPage} categories={categories} />
        </aside>

        {/* Courses grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-[#0D1B3E]/6 animate-pulse" />
              ))}
            </div>
          ) : paginatedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-lg font-black text-[#1A56DB]">No courses found</p>
              <p className="text-sm mt-1 text-black/50">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                        page === i + 1
                          ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                          : "bg-white text-black border-[#0D1B3E]/10 hover:border-[#1A56DB] hover:text-[#1A56DB]"
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
