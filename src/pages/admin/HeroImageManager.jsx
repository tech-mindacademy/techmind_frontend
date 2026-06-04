// src/pages/admin/HeroImageManager.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

/* ─── component ────────────────────────────────────────────────────────────── */
export default function HeroImageManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Upload form state
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState(0);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  /* ── Fetch all images ── */
  const fetchImages = async () => {
    try {
      const { data } = await api.get("/hero-images/admin");
      setImages(data.images);
    } catch {
      toast.error("Failed to load hero images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  /* ── File picker preview ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  /* ── Upload ── */
  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    formData.append("order", order);

    setUploading(true);
    try {
      await api.post("/hero-images/admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image uploaded ✓");
      setCaption(""); setOrder(0); setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ── Toggle active ── */
  const toggleActive = async (img) => {
    try {
      await api.patch(`/hero-images/admin/${img._id}`, { isActive: !img.isActive });
      setImages((prev) =>
        prev.map((i) => (i._id === img._id ? { ...i, isActive: !i.isActive } : i))
      );
      toast.success(img.isActive ? "Image hidden" : "Image shown");
    } catch {
      toast.error("Update failed");
    }
  };

  /* ── Update order inline ── */
  const updateOrder = async (img, newOrder) => {
    try {
      await api.patch(`/hero-images/admin/${img._id}`, { order: newOrder });
      setImages((prev) =>
        prev
          .map((i) => (i._id === img._id ? { ...i, order: newOrder } : i))
          .sort((a, b) => a.order - b.order)
      );
    } catch {
      toast.error("Update failed");
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero image? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/hero-images/admin/${id}`);
      setImages((prev) => prev.filter((i) => i._id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ─── render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Hero Image Carousel</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload photos to display as a carousel in the landing page hero section.
          If no images are active, the original gradient hero is shown.
        </p>
      </motion.div>

      {/* ── Upload card ── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-widest">
          Upload New Image
        </h2>

        {/* Drop zone / preview */}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative cursor-pointer border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl overflow-hidden transition group"
          style={{ minHeight: 180 }}
        >
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-45 object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-slate-500 group-hover:text-indigo-400 transition">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Click to select an image</span>
              <span className="text-xs">JPG, PNG, WebP — max 5 MB</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Caption + order */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Students collaborating"
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-slate-400 mb-1">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={0}
              className="w-full bg-slate-700 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition"
        >
          {uploading ? <><Spinner /> Uploading…</> : "Upload Image"}
        </button>
      </div>

      {/* ── Existing images ── */}
      <div>
        <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
          Uploaded Images ({images.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No hero images uploaded yet. Upload one above to enable the carousel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {images.map((img) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-slate-800 border rounded-2xl overflow-hidden transition ${
                    img.isActive ? "border-slate-700" : "border-slate-700 opacity-50"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-36 bg-slate-700">
                    <img src={img.url} alt={img.caption || "Hero"} className="w-full h-full object-cover" />
                    {!img.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full">
                          HIDDEN
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="p-4 space-y-3">
                    {img.caption && (
                      <p className="text-sm text-slate-300 truncate">{img.caption}</p>
                    )}

                    {/* Order */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Order:</span>
                      <input
                        type="number"
                        defaultValue={img.order}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== img.order) updateOrder(img, val);
                        }}
                        className="w-16 bg-slate-700 border border-slate-600 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(img)}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition ${
                          img.isActive
                            ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        {img.isActive ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        disabled={deletingId === img._id}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-red-900/40 hover:bg-red-700/60 text-red-400 hover:text-red-200 transition disabled:opacity-50"
                      >
                        {deletingId === img._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}