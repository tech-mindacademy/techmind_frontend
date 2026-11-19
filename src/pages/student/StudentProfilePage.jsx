// import { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import useAuth from "../../hooks/useAuth";
// import api from "../../api/axios";
// import {updateUser } from "../../store/slices/authSlice"; // adjust import to your actual action

// export default function StudentProfilePage() {
//   const { user } = useAuth();
//   const dispatch = useDispatch();
//   const [tab, setTab] = useState("profile");
//   const [form, setForm] = useState({
//     name: user?.name || "",
//     bio: user?.bio || "",
//   });
//   const [passwords, setPasswords] = useState({
//     current: "",
//     newPass: "",
//     confirm: "",
//   });
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isChangingPass, setIsChangingPass] = useState(false);
//   const fileRef = useRef(null);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate type
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select an image file");
//       return;
//     }
//     // Validate size — 5 MB cap
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image must be smaller than 5 MB");
//       return;
//     }

//     setAvatar(file);
//     setAvatarPreview(URL.createObjectURL(file));
//   };

//   const handleProfileSave = async () => {
//     if (!form.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }
//     setIsSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("name", form.name);
//       fd.append("bio", form.bio);
//       if (avatar) fd.append("avatar", avatar);

//       const { data } = await api.put("/auth/profile", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Update Redux so header/navbar reflects the new avatar immediately
//       if (data.user) {
//   dispatch(updateUser(data.user));
//   setAvatarPreview(data.user.avatar?.url || avatarPreview);
// }

//       setAvatar(null); // clear pending file — preview already shows the new one
//       toast.success("Profile updated ✓");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (!passwords.current || !passwords.newPass) {
//       toast.error("Fill in all password fields");
//       return;
//     }
//     if (passwords.newPass.length < 8) {
//       toast.error("New password must be at least 8 characters");
//       return;
//     }
//     if (passwords.newPass !== passwords.confirm) {
//       toast.error("Passwords don't match");
//       return;
//     }
//     setIsChangingPass(true);
//     try {
//       await api.put("/auth/change-password", {
//         currentPassword: passwords.current,
//         newPassword: passwords.newPass,
//       });
//       toast.success("Password changed ✓");
//       setPasswords({ current: "", newPass: "", confirm: "" });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to change password");
//     } finally {
//       setIsChangingPass(false);
//     }
//   };

//   const tabs = [
//     { id: "profile", label: "Profile" },
//     { id: "security", label: "Security" },
//     { id: "account", label: "Account" },
//   ];

//   return (
//     <div className="p-6 lg:p-8 max-w-2xl">
//       <motion.div
//         initial={{ opacity: 0, y: -12 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-6"
//       >
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
//         <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account settings</p>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
//         {tabs.map((t) => (
//           <button
//             key={t.id}
//             onClick={() => setTab(t.id)}
//             className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
//               tab === t.id
//                 ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
//                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Profile Tab ─────────────────────────────────────────────────────── */}
//       {tab === "profile" && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
//           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-5">

//             {/* Avatar upload */}
//             <div className="flex items-center gap-5">
//               <div className="relative flex-shrink-0">
//                 {/* Avatar image / placeholder */}
//                 {avatarPreview ? (
//                   <img
//                     src={avatarPreview}
//                     alt="Avatar"
//                     className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800"
//                   />
//                 ) : (
//                   <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-300">
//                     {user?.name?.charAt(0).toUpperCase()}
//                   </div>
//                 )}

//                 {/* Camera overlay button */}
//                 <button
//                   type="button"
//                   onClick={() => fileRef.current?.click()}
//                   className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg transition"
//                   title="Change photo"
//                 >
//                   <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
//                   </svg>
//                 </button>

//                 {/* Hidden file input */}
//                 <input
//                   ref={fileRef}
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp,image/gif"
//                   className="hidden"
//                   onChange={handleAvatarChange}
//                 />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
//                 <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full mt-1 inline-block font-medium capitalize">
//                   {user?.role}
//                 </span>

//                 {/* Upload hint / pending indicator */}
//                 {avatar ? (
//                   <div className="flex items-center gap-2 mt-1.5">
//                     <span className="text-xs text-amber-500 font-medium">
//                       📎 {avatar.name} — save to upload
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => { setAvatar(null); setAvatarPreview(user?.avatar?.url || null); }}
//                       className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <p className="text-xs text-gray-400 mt-1.5">
//                     JPG, PNG, WEBP · max 5 MB
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Name */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
//                 Full Name
//               </label>
//               <input
//                 value={form.name}
//                 onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
//                 className="input-field"
//                 placeholder="Your name"
//               />
//             </div>

//             {/* Bio */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
//                 Bio
//               </label>
//               <textarea
//                 value={form.bio}
//                 onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
//                 rows={3}
//                 placeholder="Tell us a bit about yourself..."
//                 maxLength={500}
//                 className="input-field resize-none"
//               />
//               <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/500</p>
//             </div>

//             <button onClick={handleProfileSave} disabled={isSaving} className="btn-primary">
//               {isSaving ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Saving...
//                 </>
//               ) : "Save changes"}
//             </button>
//           </div>

//           {/* Account info */}
//           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 space-y-3">
//             <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Account details</h3>
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { label: "Email", value: user?.email },
//                 { label: "Email verified", value: user?.isVerified ? "✅ Verified" : "❌ Not verified" },
//                 { label: "Member since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—" },
//                 { label: "Role", value: user?.role || "—" },
//               ].map((item) => (
//                 <div key={item.label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 overflow-hidden">
//                   <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
//                   <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {/* ── Security Tab ────────────────────────────────────────────────────── */}
//       {tab === "security" && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 space-y-4">
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Change Password</h3>
//             {[
//               { label: "Current password", key: "current", placeholder: "Enter current password" },
//               { label: "New password", key: "newPass", placeholder: "Minimum 8 characters" },
//               { label: "Confirm new password", key: "confirm", placeholder: "Repeat new password" },
//             ].map((f) => (
//               <div key={f.key}>
//                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
//                   {f.label}
//                 </label>
//                 <input
//                   type="password"
//                   value={passwords[f.key]}
//                   placeholder={f.placeholder}
//                   onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
//                   className="input-field"
//                 />
//               </div>
//             ))}
//             {passwords.newPass && passwords.newPass.length < 8 && (
//               <p className="text-xs text-red-500">Password must be at least 8 characters</p>
//             )}
//             <button onClick={handlePasswordChange} disabled={isChangingPass} className="btn-primary">
//               {isChangingPass ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Changing...
//                 </>
//               ) : "Change password"}
//             </button>
//           </div>
//         </motion.div>
//       )}

//       {/* ── Account Tab ─────────────────────────────────────────────────────── */}
//       {tab === "account" && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//           <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Become a Creator</h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//               Apply to create and sell your own courses on Tech Minds.
//             </p>
//             <button
//               onClick={async () => {
//                 try {
//                   await api.post("/admin/creator-requests/apply");
//                   toast.success("Application submitted! We'll review it shortly.");
//                 } catch (err) {
//                   toast.error(err.response?.data?.message || "Failed to apply");
//                 }
//               }}
//               className="btn-secondary text-sm"
//             >
//               Apply to become a creator
//             </button>
//           </div>

//           <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl p-5">
//             <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Danger zone</h3>
//             <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-4">
//               Deleting your account is permanent and cannot be undone. All your data will be removed.
//             </p>
//             <button
//               onClick={() => toast.error("Please contact support to delete your account.")}
//               className="px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-700 dark:text-red-400 text-sm font-semibold rounded-xl transition"
//             >
//               Delete my account
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Camera, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";
import { updateUser } from "../../store/slices/authSlice"; // adjust import to your actual action

/* Palette: blue #1A56DB, navy #0D1B3E, white, black text */

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A56DB]";

const inputCls =
  "w-full px-3.5 py-3 border border-[#0D1B3E]/15 rounded-lg bg-white text-black text-sm placeholder-black/35 " +
  "hover:border-[#0D1B3E]/30 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] transition";

const primaryBtn =
  `inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1A56DB] hover:bg-[#0D1B3E] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition ${focusRing}`;

function Field({ id, label, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#0D1B3E] mb-1.5">{label}</label>
      {children}
      {hint}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white border border-[#0D1B3E]/12 rounded-xl p-5 sm:p-7">
      {title && <h2 className="text-base font-bold text-[#0D1B3E] mb-5">{title}</h2>}
      {children}
    </section>
  );
}

export default function StudentProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const fileRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    // Validate size, 5 MB cap
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async (e) => {
    e?.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("bio", form.bio);
      if (avatar) fd.append("avatar", avatar);

      const { data } = await api.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update Redux so the sidebar and header show the new name and avatar immediately
      if (data.user) {
        dispatch(updateUser(data.user));
        setAvatarPreview(data.user.avatar?.url || avatarPreview);
      }

      setAvatar(null); // clear pending file, the preview already shows the new one
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e?.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      toast.error("Fill in all password fields");
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setIsChangingPass(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      toast.success("Password changed");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleApplyCreator = async () => {
    try {
      await api.post("/admin/creator-requests/apply");
      toast.success("Application submitted! We'll review it shortly.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "account", label: "Account" },
  ];

  const details = [
    ["Email", user?.email],
    ["Role", user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"],
    [
      "Member since",
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "—",
    ],
  ];

  const mismatch = passwords.confirm && passwords.newPass !== passwords.confirm;
  const tooShort = passwords.newPass && passwords.newPass.length < 8;

  return (
    <div className="max-w-2xl space-y-8 text-black">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B3E] tracking-tight">My profile</h1>
        <p className="text-black/60 text-sm mt-1.5">Manage your account settings.</p>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Profile sections" className="flex gap-6 border-b border-[#0D1B3E]/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`pb-3 -mb-px text-sm font-semibold border-b-2 transition rounded-t ${focusRing} ${
              tab === t.id
                ? "border-[#1A56DB] text-[#1A56DB]"
                : "border-transparent text-black/55 hover:text-[#0D1B3E]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" className="space-y-6">
          <form onSubmit={handleProfileSave}>
            <Card>
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-7">
                <div className="relative shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-[#1A56DB]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#1A56DB] flex items-center justify-center text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Change profile photo"
                    className={`absolute -bottom-1 -right-1 w-8 h-8 bg-[#1A56DB] hover:bg-[#0D1B3E] rounded-full flex items-center justify-center shadow-md border-2 border-white transition ${focusRing}`}
                  >
                    <Camera className="w-4 h-4 text-white" strokeWidth={2} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0D1B3E] truncate">{user?.name}</p>
                  <p className="text-sm text-black/60 truncate">{user?.email}</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-[#1A56DB]/10 text-[#1A56DB] px-2 py-1 rounded-md capitalize">
                    {user?.role}
                  </span>

                  {avatar ? (
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="text-amber-700 font-medium truncate">
                        {avatar.name} <span className="font-normal">will upload when you save</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => { setAvatar(null); setAvatarPreview(user?.avatar?.url || null); }}
                        aria-label="Remove selected photo"
                        className={`p-1 text-black/45 hover:text-red-600 rounded shrink-0 ${focusRing}`}
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-black/50 mt-2">JPG, PNG or WEBP, up to 5 MB.</p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <Field id="p-name" label="Full name">
                  <input
                    id="p-name"
                    value={form.name}
                    autoComplete="name"
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={inputCls}
                    placeholder="Your name"
                  />
                </Field>

                <Field
                  id="p-bio"
                  label="Bio"
                  hint={<p className="text-xs text-black/50 mt-1.5 text-right">{form.bio.length}/500</p>}
                >
                  <textarea
                    id="p-bio"
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    placeholder="Tell us a bit about yourself..."
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <button type="submit" disabled={isSaving} className={primaryBtn}>
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </Card>
          </form>

          <Card title="Account details">
            <dl className="divide-y divide-[#0D1B3E]/10 -my-3">
              {details.map(([label, value]) => (
                <div key={label} className="py-3 flex items-center justify-between gap-6">
                  <dt className="text-sm text-black/60 shrink-0">{label}</dt>
                  <dd className="text-sm font-medium text-[#0D1B3E] truncate text-right">{value}</dd>
                </div>
              ))}
              <div className="py-3 flex items-center justify-between gap-6">
                <dt className="text-sm text-black/60">Email verified</dt>
                <dd
                  className={`text-sm font-medium inline-flex items-center gap-1.5 ${
                    user?.isVerified ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {user?.isVerified ? (
                    <><CheckCircle2 className="w-4 h-4" strokeWidth={2} /> Verified</>
                  ) : (
                    <><AlertCircle className="w-4 h-4" strokeWidth={2} /> Not verified</>
                  )}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      )}

      {/* Security tab */}
      {tab === "security" && (
        <div id="panel-security" role="tabpanel" aria-labelledby="tab-security">
          <form onSubmit={handlePasswordChange}>
            <Card title="Change password">
              <div className="space-y-5">
                <Field id="pw-current" label="Current password">
                  <input
                    id="pw-current" type="password" autoComplete="current-password"
                    value={passwords.current} placeholder="Enter current password"
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
                <Field
                  id="pw-new"
                  label="New password"
                  hint={
                    tooShort ? (
                      <p className="text-xs text-red-600 mt-1.5">Password must be at least 8 characters.</p>
                    ) : (
                      <p className="text-xs text-black/50 mt-1.5">Use at least 8 characters.</p>
                    )
                  }
                >
                  <input
                    id="pw-new" type="password" autoComplete="new-password"
                    value={passwords.newPass} placeholder="Minimum 8 characters"
                    onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
                <Field
                  id="pw-confirm"
                  label="Confirm new password"
                  hint={mismatch && <p className="text-xs text-red-600 mt-1.5">Passwords don't match.</p>}
                >
                  <input
                    id="pw-confirm" type="password" autoComplete="new-password"
                    value={passwords.confirm} placeholder="Repeat new password"
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    className={inputCls}
                  />
                </Field>

                <button type="submit" disabled={isChangingPass} className={primaryBtn}>
                  {isChangingPass && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isChangingPass ? "Changing..." : "Change password"}
                </button>
              </div>
            </Card>
          </form>
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <div id="panel-account" role="tabpanel" aria-labelledby="tab-account" className="space-y-6">
          {user?.role === "student" && (
            <Card title="Become a creator">
              <p className="text-sm text-black/60 mb-4">
                Apply to create and sell your own courses on Tech Mind Academy.
              </p>
              <button
                onClick={handleApplyCreator}
                className={`px-5 py-2.5 border border-[#0D1B3E]/20 text-[#0D1B3E] hover:bg-[#0D1B3E]/5 text-sm font-semibold rounded-lg transition ${focusRing}`}
              >
                Apply to become a creator
              </button>
            </Card>
          )}

          <section className="bg-white border border-red-200 rounded-xl p-5 sm:p-7">
            <h2 className="text-base font-bold text-red-700 mb-1.5">Danger zone</h2>
            <p className="text-sm text-black/60 mb-4">
              Deleting your account is permanent and cannot be undone. All your data will be removed.
            </p>
            <button
              onClick={() => toast.error("Please contact support to delete your account.")}
              className="px-5 py-2.5 border border-red-300 text-red-700 hover:bg-red-50 text-sm font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            >
              Delete my account
            </button>
          </section>
        </div>
      )}
    </div>
  );
}