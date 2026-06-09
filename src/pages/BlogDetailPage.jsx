import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlog, clearCurrentBlog } from "../store/slices/blogSlice";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog: blog, isLoading } = useSelector((s) => s.blogs);

  useEffect(() => {
    dispatch(fetchBlog(slug));
    return () => dispatch(clearCurrentBlog());
  }, [slug]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Blog not found.</p>
      <button onClick={() => navigate("/blogs")} className="text-indigo-600 underline">Back to blogs</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate("/blogs")} className="text-sm text-indigo-600 hover:underline mb-6 flex items-center gap-1">
        ← Back to blogs
      </button>

      {blog.coverImage?.url && (
        <img src={blog.coverImage.url} alt={blog.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>

      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
          {blog.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white">{blog.author?.name}</p>
          <p className="text-xs text-gray-400">
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Render HTML content safely */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}