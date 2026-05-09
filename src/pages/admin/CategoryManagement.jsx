import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const DEFAULT_CATEGORIES = [
  "Web Development", "Mobile Development", "Data Science", "Design",
  "Business", "Marketing", "Personal Development", "Photography",
  "Music", "Health & Fitness", "Other",
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCat, setNewCat] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editVal, setEditVal] = useState("");

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) { toast.error("Category already exists"); return; }
    setCategories(prev => [...prev, trimmed]);
    setNewCat("");
    toast.success("Category added");
  };

  const handleEdit = (i) => {
    const trimmed = editVal.trim();
    if (!trimmed) return;
    setCategories(prev => prev.map((c, idx) => idx === i ? trimmed : c));
    setEditIdx(null);
    toast.success("Category updated");
  };

  const handleDelete = (i) => {
    if (!confirm("Delete this category?")) return;
    setCategories(prev => prev.filter((_, idx) => idx !== i));
    toast.success("Category deleted");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Category Management</h1>
        <p className="text-slate-400 text-sm mt-1">Manage course categories shown to students and creators.</p>
      </motion.div>

      {/* Add category */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Add new category</h2>
        <div className="flex gap-2">
          <input value={newCat} onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Category name..."
            className="flex-1 px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" />
          <button onClick={handleAdd}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">
            Add
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">{categories.length} Categories</h2>
        </div>
        <div className="divide-y divide-slate-700/50">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-700/30 transition">
              {editIdx === i ? (
                <>
                  <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleEdit(i); if (e.key === "Escape") setEditIdx(null); }}
                    className="flex-1 px-3 py-1.5 bg-slate-700 border border-indigo-500 rounded-lg text-sm text-white focus:outline-none" />
                  <button onClick={() => handleEdit(i)} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Save</button>
                  <button onClick={() => setEditIdx(null)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-slate-200">{cat}</span>
                  <button onClick={() => { setEditIdx(i); setEditVal(cat); }}
                    className="text-xs text-slate-500 hover:text-indigo-400 transition font-medium">Edit</button>
                  <button onClick={() => handleDelete(i)}
                    className="text-xs text-slate-600 hover:text-red-400 transition font-medium">Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Note: In a production system these would be persisted to the database via API. Changes here are session-only.
      </p>
    </div>
  );
}
