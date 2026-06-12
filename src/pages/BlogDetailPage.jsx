import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlog, clearCurrentBlog } from "../store/slices/blogSlice";
import { ArrowLeft, Calendar } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog: blog, isLoading } = useSelector((s) => s.blogs);

  useEffect(() => {
    dispatch(fetchBlog(slug));
    return () => dispatch(clearCurrentBlog());
  }, [slug]);

  // if (isLoading)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#F4F6FF]">
  //       <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );

  if (!blog)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F4F6FF]">
          <p className="text-gray-500">Blog not found.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="text-[#1A56DB] underline text-sm"
          >
            Back to blogs
          </button>
        </div>
    );

  return (
      <div className="min-h-screen bg-[#F4F6FF] w-full overflow-x-hidden">
        {/* Back nav bar */}
        <div className="bg-[#0D1B3E] px-6 py-4 w-full">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 text-[#93C5FD] hover:text-white transition text-sm font-medium"
            >
              <ArrowLeft size={15} /> Back to Blogs
            </button>
          </div>
        </div>

        {/* Cover image — full width, no side gaps */}
        {blog.coverImage?.url && (
          <div className="w-full h-72 md:h-[420px] overflow-hidden">
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="w-full h-full object-contain object-top"
            />
          </div>
        )}

        {/* Main content card */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#1A56DB]/10 border border-[#1A56DB]/20 text-[#1A56DB] px-3 py-1 rounded-full font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0D1B3E] mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-[#0D1B3E] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {blog.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D1B3E]">
                {blog.author?.name}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar size={11} />
                {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Blog HTML content */}
          <style>{`
            .blog-content {
              width: 100%;
              overflow-x: hidden;
              word-break: break-word;
            }
            .blog-content h1,
            .blog-content h2,
            .blog-content h3 {
              color: #0D1B3E;
              font-weight: 700;
              margin: 2rem 0 0.75rem;
              line-height: 1.3;
            }
            .blog-content h1 { font-size: 1.875rem; }
            .blog-content h2 { font-size: 1.5rem; }
            .blog-content h3 { font-size: 1.25rem; }
            .blog-content p {
              color: #374151;
              line-height: 1.85;
              margin-bottom: 1.1rem;
              font-size: 1rem;
            }
            .blog-content a {
              color: #1A56DB;
              text-decoration: underline;
            }
            .blog-content a:hover { color: #0D1B3E; }
            .blog-content img {
              border-radius: 12px;
              max-width: 100%;
              height: auto;
              margin: 1.75rem auto;
              display: block;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .blog-content ul,
            .blog-content ol {
              padding-left: 1.6rem;
              margin-bottom: 1.1rem;
              color: #374151;
              line-height: 1.85;
            }
            .blog-content li { margin-bottom: 0.45rem; }
            .blog-content blockquote {
              border-left: 4px solid #1A56DB;
              padding: 0.85rem 1.25rem;
              background: #EFF6FF;
              border-radius: 0 8px 8px 0;
              margin: 1.75rem 0;
              color: #1e40af;
              font-style: italic;
            }
            .blog-content pre {
              background: #0D1B3E;
              color: #e2e8f0;
              padding: 1.25rem 1.5rem;
              border-radius: 12px;
              overflow-x: auto;
              margin: 1.75rem 0;
              font-size: 0.875rem;
              line-height: 1.65;
            }
            .blog-content code {
              background: #EFF6FF;
              color: #1A56DB;
              padding: 0.15em 0.45em;
              border-radius: 4px;
              font-size: 0.9em;
            }
            .blog-content pre code {
              background: none;
              color: inherit;
              padding: 0;
              font-size: inherit;
            }
            .blog-content strong { color: #0D1B3E; font-weight: 700; }
            .blog-content em { color: #4B5563; }
            .blog-content hr {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 2rem 0;
            }
            .blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.75rem 0;
              font-size: 0.95rem;
            }
            .blog-content th {
              background: #0D1B3E;
              color: white;
              padding: 0.65rem 1rem;
              text-align: left;
              font-weight: 600;
            }
            .blog-content td {
              padding: 0.6rem 1rem;
              border-bottom: 1px solid #e5e7eb;
              color: #374151;
            }
            .blog-content tr:nth-child(even) td { background: #f8faff; }
          `}</style>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Bottom back link */}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 text-[#1A56DB] hover:text-[#0D1B3E] transition text-sm font-semibold"
            >
              <ArrowLeft size={15} /> More articles
            </button>
          </div>
        </div>
      </div>
  );
}
