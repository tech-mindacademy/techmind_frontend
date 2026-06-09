import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/slices/blogSlice";
import { Link } from "react-router-dom";
import { Tag, Calendar, User, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BlogsPage() {
  const dispatch = useDispatch();
  const { blogs, totalPages, currentPage, isLoading } = useSelector(
    (s) => s.blogs,
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogs({ page }));
  }, [page]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FF]">
        <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
        <Navbar/>
      <div className="min-h-screen bg-[#F4F6FF]">
        {/* Hero header */}
        <div className="bg-[#0D1B3E] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#93C5FD] uppercase mb-3">
              Tech Vidya Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              Insights & Tutorials
            </h1>
            <p className="text-[#93C5FD] text-lg max-w-xl">
              Deep dives, how-tos, and updates from our instructors and team.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">No blogs published yet.</p>
              <p className="text-gray-300 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured first blog */}
              {blogs[0] && (
                <Link
                  to={`/blogs/${blogs[0].slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow mb-10"
                >
                  <div className="md:flex">
                    {blogs[0].coverImage?.url ? (
                      <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                        <img
                          src={blogs[0].coverImage.url}
                          alt={blogs[0].title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-[#0D1B3E] to-[#1A56DB] flex items-center justify-center">
                        <span className="text-white text-5xl font-black opacity-20">
                          TV
                        </span>
                      </div>
                    )}
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-[#1A56DB] uppercase tracking-wider mb-2">
                        Featured
                      </span>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blogs[0].tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-50 text-[#1A56DB] px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#0D1B3E] mb-3 group-hover:text-[#1A56DB] transition-colors leading-snug">
                        {blogs[0].title}
                      </h2>
                      <p className="text-gray-500 line-clamp-3 mb-5">
                        {blogs[0].excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="w-7 h-7 rounded-full bg-[#0D1B3E] flex items-center justify-center text-xs font-bold text-white">
                          {blogs[0].author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-600 font-medium">
                          {blogs[0].author?.name}
                        </span>
                        <span className="ml-auto">
                          {new Date(blogs[0].publishedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div className="mt-5 flex items-center gap-1 text-[#1A56DB] text-sm font-semibold group-hover:gap-2 transition-all">
                        Read article <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Remaining blogs grid */}
              {blogs.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.slice(1).map((blog) => (
                    <Link
                      key={blog._id}
                      to={`/blogs/${blog.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="h-48 overflow-hidden">
                        {blog.coverImage?.url ? (
                          <img
                            src={blog.coverImage.url}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0D1B3E] to-[#1A56DB] flex items-center justify-center">
                            <span className="text-white text-4xl font-black opacity-20">
                              TV
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {blog.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-base font-bold text-[#0D1B3E] mb-2 line-clamp-2 group-hover:text-[#1A56DB] transition-colors leading-snug">
                          {blog.title}
                        </h2>
                        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                          <div className="w-6 h-6 rounded-full bg-[#0D1B3E] flex items-center justify-center text-xs font-bold text-white">
                            {blog.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-600 font-medium">
                            {blog.author?.name}
                          </span>
                          <span className="ml-auto flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(blog.publishedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-[#1A56DB] hover:text-[#1A56DB] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                    p === currentPage
                      ? "bg-[#1A56DB] text-white shadow"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#1A56DB] hover:text-[#1A56DB]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-[#1A56DB] hover:text-[#1A56DB] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
