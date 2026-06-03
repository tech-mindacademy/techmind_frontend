import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedReviews,
  selectFeatured,
  selectReviewLoading,
} from "../store/slices/ReviewSlice";

const TYPE_CONFIG = {
  course: {
    label: "Course",
    color: "text-[#1A56DB]",
    dot: "bg-[#1A56DB]",
    badge: "bg-blue-50 border-blue-200",
  },
  platform: {
    label: "Platform",
    color: "text-[#0D1B3E]",
    dot: "bg-[#0D1B3E]",
    badge: "bg-slate-50 border-slate-200",
  },
  internship: {
    label: "Internship",
    color: "text-[#2563EB]",
    dot: "bg-[#2563EB]",
    badge: "bg-indigo-50 border-indigo-200",
  },
};

function Stars({ rating }) {
  return (
    <span className="text-amber-400 text-sm tracking-tight">
      {"★".repeat(rating)}
      <span className="text-[#0D1B3E]/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function Avatar({ user }) {
  if (user?.avatar?.url) {
    return (
      <img
        src={user.avatar.url}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1A56DB]/20"
      />
    );
  }
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D1B3E] to-[#1A56DB] flex items-center justify-center text-sm font-bold text-white ring-2 ring-[#1A56DB]/20">
      {initials}
    </div>
  );
}

function ReviewCard({ review }) {
  const cfg = TYPE_CONFIG[review.reviewType] || TYPE_CONFIG.platform;
  return (
    <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md hover:shadow-[#1A56DB]/10 transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
          {review.reviewType === "course" && review.course?.title && (
            <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
              — {review.course.title}
            </span>
          )}
          {review.reviewType === "internship" && review.internshipCompany && (
            <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
              — {review.internshipCompany}
            </span>
          )}
        </span>
        <Stars rating={review.rating} />
      </div>
      <p className="font-semibold text-sm text-[#0D1B3E] leading-snug line-clamp-2">
        {review.title}
      </p>
      <p className="text-[#0D1B3E]/55 text-xs leading-relaxed line-clamp-3">
        {review.body}
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
        <Avatar user={review.user} />
        <div>
          <p className="text-sm font-semibold text-[#0D1B3E] leading-tight">
            {review.user?.name || "Anonymous"}
          </p>
          <p className="text-xs text-[#0D1B3E]/35">
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ reviews = [], reverse = false, speed = 0.4 }) {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const repeatCount = Math.max(Math.ceil(6 / safeReviews.length), 2);
  const items = Array(repeatCount).fill(safeReviews).flat();

  useAnimationFrame((time, delta) => {
    if (!trackRef.current || items.length === 0) return;

    // If we're in a pause window, do nothing
    if (time < pauseUntilRef.current) return;

    const dir = reverse ? 1 : -1;
    xRef.current += dir * speed * (delta / 16);
    const singleSetWidth = trackRef.current.scrollWidth / repeatCount;

    if (!reverse && xRef.current <= -singleSetWidth) {
      xRef.current = 0;
      pauseUntilRef.current = time + 6000; // 6 second pause
    }
    if (reverse && xRef.current >= 0) {
      xRef.current = -singleSetWidth;
      pauseUntilRef.current = time + 6000; // 6 second pause
    }

    trackRef.current.style.transform = `translateX(${xRef.current}px)`;
  });

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
        {items.map((review, i) => (
          <ReviewCard key={review._id + "-" + i} review={review} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
        <div className="h-3 bg-[#0D1B3E]/8 rounded w-16" />
      </div>
      <div className="h-4 bg-[#0D1B3E]/8 rounded w-4/5" />
      <div className="space-y-1.5">
        <div className="h-3 bg-[#0D1B3E]/8 rounded w-full" />
        <div className="h-3 bg-[#0D1B3E]/8 rounded w-5/6" />
        <div className="h-3 bg-[#0D1B3E]/8 rounded w-3/4" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
        <div className="w-10 h-10 rounded-full bg-[#0D1B3E]/8" />
        <div className="space-y-1.5">
          <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
          <div className="h-2.5 bg-[#0D1B3E]/8 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const dispatch = useDispatch();
  const rawReviews = useSelector(selectFeatured);
  const isLoading = useSelector(selectReviewLoading);
  const reviews = Array.isArray(rawReviews) ? rawReviews : [];

  useEffect(() => {
    dispatch(fetchFeaturedReviews());
  }, [dispatch]);

  const half = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, half);
  const row2 = reviews.slice(half);
  const showTwoRows = reviews.length >= 6;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";
  const recommendPct =
    reviews.length > 0
      ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
      : 0;

  return (
    <section className="py-24 relative overflow-hidden bg-[#F7F5F0]">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #0D1B3E22 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Grey grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(156,163,175,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(156,163,175,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#0D1B3E] to-[#1A56DB]" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="text-center mb-14 px-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A56DB]/8 border border-[#1A56DB]/20 text-sm text-[#1A56DB] font-medium mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
            What learners say
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[#1A56DB] leading-tight tracking-tight"
          >
            Loved by thousands of{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#0D1B3E] to-[#1A56DB] bg-clip-text text-transparent">
                learners
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#1A56DB]/15 rounded-full -z-0" />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-black/60 mt-4 max-w-xl mx-auto text-sm leading-relaxed"
          >
            Real reviews from students, creators, and interns who built their
            careers on Tech Minds.
          </motion.p>
        </div>

        {/* Marquee rows */}
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-4 overflow-hidden px-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-[#0D1B3E]/40 text-sm py-8">
            No reviews yet — be the first!
          </p>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
              <MarqueeRow reviews={showTwoRows ? row1 : reviews} speed={0.35} />
            </div>
            {showTwoRows && (
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
                <MarqueeRow reviews={row2} reverse speed={0.28} />
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-6 mt-14 px-4 flex-wrap"
          >
            {[
              { label: "Average rating", value: `${avgRating} ★` },
              { label: "Total reviews", value: `${reviews.length}+` },
              { label: "Would recommend", value: `${recommendPct}%` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white border border-[#0D1B3E]/8 rounded-2xl px-8 py-5 shadow-sm"
              >
                <p className="text-2xl font-black text-[#1A56DB]">{stat.value}</p>
                <p className="text-xs text-black/50 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
// import { useEffect, useRef } from "react";
// import { motion, useAnimationFrame } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFeaturedReviews,
//   selectFeatured,
//   selectReviewLoading,
// } from "../store/slices/ReviewSlice";

// // ─── Theme palette (logo-matched) ─────────────────────────────────────────────
// // Cream bg: #F7F5F0  Navy: #0D1B3E  Blue: #1A56DB

// const TYPE_CONFIG = {
//   course: {
//     label: "Course",
//     color: "text-[#1A56DB]",
//     dot: "bg-[#1A56DB]",
//     badge: "bg-blue-50 border-blue-200",
//   },
//   platform: {
//     label: "Platform",
//     color: "text-[#0D1B3E]",
//     dot: "bg-[#0D1B3E]",
//     badge: "bg-slate-50 border-slate-200",
//   },
//   internship: {
//     label: "Internship",
//     color: "text-[#2563EB]",
//     dot: "bg-[#2563EB]",
//     badge: "bg-indigo-50 border-indigo-200",
//   },
// };

// function Stars({ rating }) {
//   return (
//     <span className="text-amber-400 text-sm tracking-tight">
//       {"★".repeat(rating)}
//       <span className="text-[#0D1B3E]/15">{"★".repeat(5 - rating)}</span>
//     </span>
//   );
// }

// function Avatar({ user }) {
//   if (user?.avatar?.url) {
//     return (
//       <img
//         src={user.avatar.url}
//         alt={user.name}
//         className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1A56DB]/20"
//       />
//     );
//   }
//   const initials = user?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
//   return (
//     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D1B3E] to-[#1A56DB] flex items-center justify-center text-sm font-bold text-white ring-2 ring-[#1A56DB]/20">
//       {initials}
//     </div>
//   );
// }

// // ─── Single card ──────────────────────────────────────────────────────────────
// function ReviewCard({ review }) {
//   const cfg = TYPE_CONFIG[review.reviewType] || TYPE_CONFIG.platform;
//   return (
//     <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md hover:shadow-[#1A56DB]/10 transition-shadow duration-300">
//       {/* Header row */}
//       <div className="flex items-center justify-between">
//         <span className={`text-xs font-semibold flex items-center gap-1.5 ${cfg.color}`}>
//           <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//           {cfg.label}
//           {review.reviewType === "course" && review.course?.title && (
//             <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
//               — {review.course.title}
//             </span>
//           )}
//           {review.reviewType === "internship" && review.internshipCompany && (
//             <span className="text-[#0D1B3E]/30 font-normal truncate max-w-[110px]">
//               — {review.internshipCompany}
//             </span>
//           )}
//         </span>
//         <Stars rating={review.rating} />
//       </div>

//       {/* Title */}
//       <p className="font-semibold text-sm text-[#0D1B3E] leading-snug line-clamp-2">
//         {review.title}
//       </p>

//       {/* Body */}
//       <p className="text-[#0D1B3E]/55 text-xs leading-relaxed line-clamp-3">
//         {review.body}
//       </p>

//       {/* Footer */}
//       <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
//         <Avatar user={review.user} />
//         <div>
//           <p className="text-sm font-semibold text-[#0D1B3E] leading-tight">
//             {review.user?.name || "Anonymous"}
//           </p>
//           <p className="text-xs text-[#0D1B3E]/35">
//             {new Date(review.createdAt).toLocaleDateString("en-IN", {
//               month: "short",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Marquee row ──────────────────────────────────────────────────────────────
// function MarqueeRow({ reviews = [], reverse = false, speed = 0.4 }) {
//   const trackRef = useRef(null);
//   const xRef = useRef(0);
//   const safeReviews = Array.isArray(reviews) ? reviews : [];
//   const repeatCount = Math.max(Math.ceil(6 / safeReviews.length), 2);
//   const items = Array(repeatCount).fill(safeReviews).flat();

//   useAnimationFrame((_, delta) => {
//     if (!trackRef.current || items.length === 0) return;
//     const dir = reverse ? 1 : -1;
//     xRef.current += dir * speed * (delta / 16);
//     const singleSetWidth = trackRef.current.scrollWidth / repeatCount;
//     if (!reverse && xRef.current <= -singleSetWidth) xRef.current = 0;
//     if (reverse && xRef.current >= 0) xRef.current = -singleSetWidth;
//     trackRef.current.style.transform = `translateX(${xRef.current}px)`;
//   });

//   if (items.length === 0) return null;

//   return (
//     <div className="overflow-hidden">
//       <div ref={trackRef} className="flex gap-4 w-max" style={{ willChange: "transform" }}>
//         {items.map((review, i) => (
//           <ReviewCard key={review._id + "-" + i} review={review} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="w-[320px] shrink-0 bg-white border border-[#0D1B3E]/8 rounded-2xl p-5 space-y-3 animate-pulse">
//       <div className="flex justify-between">
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-16" />
//       </div>
//       <div className="h-4 bg-[#0D1B3E]/8 rounded w-4/5" />
//       <div className="space-y-1.5">
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-full" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-5/6" />
//         <div className="h-3 bg-[#0D1B3E]/8 rounded w-3/4" />
//       </div>
//       <div className="flex items-center gap-3 pt-2 border-t border-[#0D1B3E]/8">
//         <div className="w-10 h-10 rounded-full bg-[#0D1B3E]/8" />
//         <div className="space-y-1.5">
//           <div className="h-3 bg-[#0D1B3E]/8 rounded w-24" />
//           <div className="h-2.5 bg-[#0D1B3E]/8 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main export ──────────────────────────────────────────────────────────────
// export default function TestimonialsSection() {
//   const dispatch = useDispatch();
//   const rawReviews = useSelector(selectFeatured);
//   const isLoading = useSelector(selectReviewLoading);
//   const reviews = Array.isArray(rawReviews) ? rawReviews : [];

//   useEffect(() => {
//     dispatch(fetchFeaturedReviews());
//   }, [dispatch]);

//   const half = Math.ceil(reviews.length / 2);
//   const row1 = reviews.slice(0, half);
//   const row2 = reviews.slice(half);
//   const showTwoRows = reviews.length >= 6;

//   const avgRating =
//     reviews.length > 0
//       ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//       : "0.0";
//   const recommendPct =
//     reviews.length > 0
//       ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
//       : 0;

//   return (
//     <section className="py-24 relative overflow-hidden bg-[#F7F5F0]">
//       {/* Subtle dot-grid texture */}
//       <div
//         className="absolute inset-0 opacity-30"
//         style={{
//           backgroundImage: `radial-gradient(circle, #0D1B3E22 1px, transparent 1px)`,
//           backgroundSize: "28px 28px",
//         }}
//       />
//       {/* Top accent line */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#0D1B3E] to-[#1A56DB]" />

//       <div className="relative z-10">
//         {/* Heading */}
//         <div className="text-center mb-14 px-4">
//           <motion.span
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A56DB]/8 border border-[#1A56DB]/20 text-sm text-[#1A56DB] font-medium mb-5"
//           >
//             <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
//             What learners say
//           </motion.span>

//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-black text-[#0D1B3E] leading-tight tracking-tight"
//           >
//             Loved by thousands of{" "}
//             <span className="relative inline-block">
//               <span className="relative z-10 bg-gradient-to-r from-[#0D1B3E] to-[#1A56DB] bg-clip-text text-transparent">
//                 learners
//               </span>
//               <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#1A56DB]/15 rounded-full -z-0" />
//             </span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-[#0D1B3E]/55 mt-4 max-w-xl mx-auto text-sm leading-relaxed"
//           >
//             Real reviews from students, creators, and interns who built their
//             careers on Tech Minds.
//           </motion.p>
//         </div>

//         {/* Marquee rows */}
//         {isLoading ? (
//           <div className="space-y-4">
//             {[0, 1].map((row) => (
//               <div key={row} className="flex gap-4 overflow-hidden px-4">
//                 {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
//               </div>
//             ))}
//           </div>
//         ) : reviews.length === 0 ? (
//           <p className="text-center text-[#0D1B3E]/40 text-sm py-8">
//             No reviews yet — be the first!
//           </p>
//         ) : (
//           <div className="space-y-4">
//             <div className="relative">
//               <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//               <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//               <MarqueeRow reviews={showTwoRows ? row1 : reviews} speed={0.35} />
//             </div>
//             {showTwoRows && (
//               <div className="relative">
//                 <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//                 <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10 pointer-events-none" />
//                 <MarqueeRow reviews={row2} reverse speed={0.28} />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Stats */}
//         {reviews.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//             className="flex justify-center gap-6 mt-14 px-4 flex-wrap"
//           >
//             {[
//               { label: "Average rating", value: `${avgRating} ★` },
//               { label: "Total reviews", value: `${reviews.length}+` },
//               { label: "Would recommend", value: `${recommendPct}%` },
//             ].map((stat, i) => (
//               <div
//                 key={stat.label}
//                 className="text-center bg-white border border-[#0D1B3E]/8 rounded-2xl px-8 py-5 shadow-sm"
//               >
//                 <p className="text-2xl font-black text-[#1A56DB]">{stat.value}</p>
//                 <p className="text-xs text-[#0D1B3E]/45 mt-1 font-medium">{stat.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }
// import { useEffect, useRef } from "react";
// import { motion, useAnimationFrame } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFeaturedReviews,
//   selectFeatured,
//   selectReviewLoading,
// } from "../store/slices/ReviewSlice";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const TYPE_CONFIG = {
//   course: { label: "Course", color: "text-indigo-400", dot: "bg-indigo-400" },
//   platform: {
//     label: "Platform",
//     color: "text-purple-400",
//     dot: "bg-purple-400",
//   },
//   internship: {
//     label: "Internship",
//     color: "text-teal-400",
//     dot: "bg-teal-400",
//   },
// };

// function Stars({ rating }) {
//   return (
//     <span className="text-yellow-400 text-sm">
//       {"★".repeat(rating)}
//       <span className="text-white/15">{"★".repeat(5 - rating)}</span>
//     </span>
//   );
// }

// function Avatar({ user }) {
//   if (user?.avatar?.url) {
//     return (
//       <img
//         src={user.avatar.url}
//         alt={user.name}
//         className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
//       />
//     );
//   }
//   const initials = user?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold ring-2 ring-white/10">
//       {initials}
//     </div>
//   );
// }

// // ─── Single card ──────────────────────────────────────────────────────────────
// function ReviewCard({ review }) {
//   const cfg = TYPE_CONFIG[review.reviewType] || TYPE_CONFIG.platform;

//   return (
//     <div className="w-[320px] shrink-0 bg-white/5 border border-white/8 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
//       <div className="flex items-center justify-between">
//         <span
//           className={`text-xs font-medium flex items-center gap-1.5 ${cfg.color}`}
//         >
//           <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//           {cfg.label}
//           {review.reviewType === "course" && review.course?.title && (
//             <span className="text-white/30 font-normal truncate max-w-[120px]">
//               — {review.course.title}
//             </span>
//           )}
//           {review.reviewType === "internship" && review.internshipCompany && (
//             <span className="text-white/30 font-normal truncate max-w-[120px]">
//               — {review.internshipCompany}
//             </span>
//           )}
//         </span>
//         <Stars rating={review.rating} />
//       </div>

//       <p className="font-semibold text-sm text-white leading-snug line-clamp-2">
//         {review.title}
//       </p>

//       <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
//         {review.body}
//       </p>

//       <div className="flex items-center gap-3 pt-2 border-t border-white/8">
//         <Avatar user={review.user} />
//         <div>
//           <p className="text-sm font-medium text-white leading-tight">
//             {review.user?.name || "Anonymous"}
//           </p>
//           <p className="text-xs text-white/30">
//             {new Date(review.createdAt).toLocaleDateString("en-IN", {
//               month: "short",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Infinite scroll ticker ───────────────────────────────────────────────────
// // ─── Infinite scroll ticker ───────────────────────────────────────────────────
// function MarqueeRow({ reviews = [], reverse = false, speed = 0.4 }) {
//   const trackRef = useRef(null);
//   const xRef = useRef(0);

//   const safeReviews = Array.isArray(reviews) ? reviews : [];

//   // Repeat enough times to always fill the screen and loop smoothly
//   const repeatCount = Math.max(Math.ceil(6 / safeReviews.length), 2);
//   const items = Array(repeatCount).fill(safeReviews).flat();

//   useAnimationFrame((_, delta) => {
//     if (!trackRef.current || items.length === 0) return;
//     const dir = reverse ? 1 : -1;
//     xRef.current += dir * speed * (delta / 16);

//     const singleSetWidth = trackRef.current.scrollWidth / repeatCount;
//     if (!reverse && xRef.current <= -singleSetWidth) xRef.current = 0;
//     if (reverse && xRef.current >= 0) xRef.current = -singleSetWidth;

//     trackRef.current.style.transform = `translateX(${xRef.current}px)`;
//   });

//   if (items.length === 0) return null;

//   return (
//     <div className="overflow-hidden">
//       <div
//         ref={trackRef}
//         className="flex gap-4 w-max"
//         style={{ willChange: "transform" }}
//       >
//         {items.map((review, i) => (
//           <ReviewCard key={review._id + "-" + i} review={review} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="w-[320px] shrink-0 bg-white/5 border border-white/8 rounded-2xl p-5 space-y-3 animate-pulse">
//       <div className="flex justify-between">
//         <div className="h-3 bg-white/10 rounded w-24" />
//         <div className="h-3 bg-white/10 rounded w-16" />
//       </div>
//       <div className="h-4 bg-white/10 rounded w-4/5" />
//       <div className="space-y-1.5">
//         <div className="h-3 bg-white/10 rounded w-full" />
//         <div className="h-3 bg-white/10 rounded w-5/6" />
//         <div className="h-3 bg-white/10 rounded w-3/4" />
//       </div>
//       <div className="flex items-center gap-3 pt-2 border-t border-white/8">
//         <div className="w-10 h-10 rounded-full bg-white/10" />
//         <div className="space-y-1.5">
//           <div className="h-3 bg-white/10 rounded w-24" />
//           <div className="h-2.5 bg-white/10 rounded w-16" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main export ──────────────────────────────────────────────────────────────
// export default function TestimonialsSection() {
//   const dispatch = useDispatch();
//   const rawReviews = useSelector(selectFeatured);
//   const isLoading = useSelector(selectReviewLoading);

//   // Always a safe array regardless of Redux hydration state
//   const reviews = Array.isArray(rawReviews) ? rawReviews : [];

//   useEffect(() => {
//     dispatch(fetchFeaturedReviews());
//   }, [dispatch]);

//   const half = Math.ceil(reviews.length / 2);
//   const row1 = reviews.slice(0, half);
//   const row2 = reviews.slice(half);
//   const showTwoRows = reviews.length >= 6;

//   const avgRating =
//     reviews.length > 0
//       ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//       : "0.0";

//   const recommendPct =
//     reviews.length > 0
//       ? Math.round(
//           (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100,
//         )
//       : 0;

//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Background glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(99,102,241,0.08),transparent)]" />

//       <div className="relative z-10">
//         {/* Heading */}
//         <div className="text-center mb-14 px-4">
//           <motion.span
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-4"
//           >
//             What learners say
//           </motion.span>

//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-bold text-white leading-tight"
//           >
//             Loved by thousands of{" "}
//             <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
//               learners
//             </span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-gray-400 mt-4 max-w-xl mx-auto"
//           >
//             Real reviews from students, creators, and interns who built their
//             careers on Tech Minds.
//           </motion.p>
//         </div>

//         {/* Marquee rows */}
//         {/* Marquee rows */}
//         {isLoading ? (
//           <div className="space-y-4">
//             {[0, 1].map((row) => (
//               <div key={row} className="flex gap-4 overflow-hidden px-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <SkeletonCard key={i} />
//                 ))}
//               </div>
//             ))}
//           </div>
//         ) : reviews.length === 0 ? (
//           <p className="text-center text-gray-500 text-sm py-8">
//             No reviews yet — be the first!
//           </p>
//         ) : (
//           <div className="space-y-4">
//   <div className="relative">
//     <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
//     <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />
//     <MarqueeRow reviews={showTwoRows ? row1 : reviews} speed={0.35} />
//   </div>

//   {showTwoRows && (
//     <div className="relative">
//       <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
//       <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />
//       <MarqueeRow reviews={row2} reverse speed={0.28} />
//     </div>
//   )}
// </div>
//         )}

//         {/* Summary stats */}
//         {reviews.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//             className="flex justify-center gap-10 mt-14 px-4"
//           >
//             {[
//               { label: "Average rating", value: `${avgRating} ★` },
//               { label: "Total reviews", value: `${reviews.length}+` },
//               { label: "Would recommend", value: `${recommendPct}%` },
//             ].map((stat) => (
//               <div key={stat.label} className="text-center">
//                 <p className="text-2xl font-bold text-indigo-300">
//                   {stat.value}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }
