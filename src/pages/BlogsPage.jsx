import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/slices/blogSlice";
import { Link } from "react-router-dom";

export default function BlogsPage() {
  const dispatch = useDispatch();
  const { blogs, totalPages, currentPage, isLoading } = useSelector((s) => s.blogs);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogs({ page }));
  }, [page]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Insights, tutorials and updates from our team.</p>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No blogs published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
            >
              {blog.coverImage?.url && (
                <img
                  src={blog.coverImage.url}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags?.map((tag) => (
                    <span key={tag} className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {blog.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-500">{blog.author?.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                p === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}