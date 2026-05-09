import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserActive, changeUserRole, selectAdminUsers, selectUsersPagination, selectAdminLoading } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";

const roleBadge = { student: "bg-indigo-900/40 text-indigo-300", creator: "bg-teal-900/40 text-teal-300", admin: "bg-orange-900/40 text-orange-300" };

export default function UserManagement() {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);
  const pagination = useSelector(selectUsersPagination);
  const isLoading = useSelector(selectAdminLoading);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ search, role: roleFilter || undefined, page, limit: 20 }));
  }, [dispatch, search, roleFilter, page]);

  const handleToggleActive = async (userId, name, isActive) => {
    await dispatch(toggleUserActive(userId));
    toast.success(isActive ? `${name} deactivated` : `${name} reactivated`);
    dispatch(fetchUsers({ search, role: roleFilter || undefined, page, limit: 20 }));
  };

  const handleRoleChange = async (userId, newRole) => {
    await dispatch(changeUserRole({ userId, role: newRole }));
    toast.success("Role updated");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          {pagination?.total || 0} total users
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition">
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={user.role} onChange={e => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border-0 cursor-pointer focus:outline-none ${roleBadge[user.role]}`}
                        style={{ background: "transparent" }}>
                        <option value="student">Student</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${user.isActive ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleToggleActive(user._id, user.name, user.isActive)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${user.isActive ? "bg-red-900/30 hover:bg-red-900/60 text-red-400" : "bg-green-900/30 hover:bg-green-900/60 text-green-400"}`}>
                        {user.isActive ? "Ban" : "Unban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-lg transition">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
