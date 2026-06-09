import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api/axios";
import {
  fetchAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../store/slices/blogSlice";

const emptyForm = {
  title: "",
  content: "",
  excerpt: "",
  tags: "",
  isPublished: false,
  coverImage: null,
};

export default function AdminBlogPage() {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((s) => s.blogs);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllBlogsAdmin());
  }, []);

  // ── Image upload handler called by Quill toolbar ──────────────────────────
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("image", file);

      setUploading(true);
      try {
        const { data } = await api.post("/blogs/upload-image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Insert image URL at current cursor position in editor
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", data.url);
        quill.setSelection(range.index + 1);
      } catch (err) {
        alert("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };
  };

  // ── Quill toolbar config ──────────────────────────────────────────────────
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],  // image button triggers handleImageUpload
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "color", "background", "list", "align",
    "blockquote", "code-block", "link", "image",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, coverImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("excerpt", form.excerpt);
    fd.append(
      "tags",
      JSON.stringify(
        form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      )
    );
    fd.append("isPublished", String(form.isPublished));
    if (form.coverImage) fd.append("coverImage", form.coverImage);

    if (editId) {
      await dispatch(updateBlog({ id: editId, formData: fd }));
    } else {
      await dispatch(createBlog(fd));
    }

    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setPreview(null);
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      tags: blog.tags?.join(", ") || "",
      isPublished: blog.isPublished,
      coverImage: null,
    });
    setPreview(blog.coverImage?.url || null);
    setEditId(blog._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this blog?")) dispatch(deleteBlog(id));
  };

  return (
    <div>
      {/* Quill dark mode override */}
      <style>{`
        .ql-toolbar { background: #1e293b; border-color: #334155 !important; border-radius: 12px 12px 0 0; }
        .ql-container { background: #0f172a; border-color: #334155 !important; border-radius: 0 0 12px 12px; min-height: 300px; }
        .ql-editor { color: #e2e8f0; min-height: 300px; font-size: 15px; line-height: 1.7; }
        .ql-editor.ql-blank::before { color: #64748b; font-style: normal; }
        .ql-stroke { stroke: #94a3b8 !important; }
        .ql-fill { fill: #94a3b8 !important; }
        .ql-picker-label { color: #94a3b8 !important; }
        .ql-picker-options { background: #1e293b !important; border-color: #334155 !important; }
        .ql-picker-item { color: #e2e8f0 !important; }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke { stroke: #f97316 !important; }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill { fill: #f97316 !important; }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(emptyForm);
            setPreview(null);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          + New Blog
        </button>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {editId ? "Edit Blog" : "New Blog"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
          />

          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Short excerpt (shown on blog cards)"
            rows={2}
            className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500 resize-none"
          />

          {/* Rich text editor */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Content</label>
            {uploading && (
              <p className="text-xs text-orange-400 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />
                Uploading image...
              </p>
            )}
            <ReactQuill
              ref={quillRef}
              value={form.content}
              onChange={(val) => setForm((f) => ({ ...f, content: val }))}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here. Use the image button in the toolbar to insert images."
            />
          </div>

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated: react, javascript)"
            className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-orange-500"
          />

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="text-slate-300 text-sm"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 h-40 object-cover rounded-xl"
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="accent-orange-500"
            />
            Publish immediately
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !form.title || !form.content || uploading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-medium"
            >
              {isLoading ? "Saving..." : editId ? "Update" : "Create"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm(emptyForm);
                setPreview(null);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Blog list ────────────────────────────────────────────────────────── */}
      {isLoading && !showForm ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-slate-400 text-center py-20">
          No blogs yet. Create your first one!
        </p>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-4"
            >
              {blog.coverImage?.url && (
                <img
                  src={blog.coverImage.url}
                  alt={blog.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{blog.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      blog.isPublished
                        ? "bg-green-900/40 text-green-400"
                        : "bg-yellow-900/40 text-yellow-400"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  {blog.tags?.map((t) => (
                    <span key={t} className="text-xs text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-xs bg-red-900/40 hover:bg-red-900/70 text-red-400 px-3 py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}