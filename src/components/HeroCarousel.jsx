// src/components/HeroCarousel.jsx
//
// Drop-in replacement for the static hero background.
// - Fetches admin-uploaded images from /api/hero-images
// - If no active images exist, renders null → caller shows the original gradient hero
// - Auto-advances every 5 seconds; has prev/next arrows and dot indicators
//
// src/components/HeroCarousel.jsx
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const INTERVAL_MS = 5000;

export default function HeroCarousel({ className = "", onHasImages }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState(null); // for swipe support

  /* ── Fetch images ── */
  useEffect(() => {
    api
      .get("/hero-images")
      .then(({ data }) => {
        const imgs = data?.images;
        setImages(Array.isArray(imgs) ? imgs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      onHasImages?.(images.length > 0);
    }
  }, [loading, images.length, onHasImages]);

  /* ── Navigation ── */
  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(next, INTERVAL_MS);
    return () => clearInterval(t);
  }, [next, images.length]);

  /* ── Touch / swipe support ── */
  const handleTouchStart = (e) => {
    setTouched(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touched === null) return;
    const delta = touched - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    setTouched(null);
  };

  if (loading || images.length === 0) return null;

  const active = images[current];

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: "clamp(260px, 55vw, 680px)" }}   /* fluid height — works on all screen sizes */
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Slides ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active._id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={active.url}
            alt={active.caption || "Hero"}
            className="w-full max-h-[580px] object-cover"
            draggable={false}
          />
          {/* Gradient overlay — bottom-heavy for caption readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* ── Caption ── */}
      <AnimatePresence mode="wait">
        {active.caption && (
          <motion.div
            key={active._id + "-cap"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-10 sm:bottom-14 left-0 right-0 z-20 px-4 sm:px-8 text-center pointer-events-none"
          >
            <span className="inline-block text-white/90 text-xs sm:text-sm md:text-base
                             backdrop-blur-sm bg-black/25 border border-white/10
                             px-3 sm:px-5 py-1.5 sm:py-2 rounded-full max-w-[90vw] truncate">
              {active.caption}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prev / Next arrows — hidden on small phones, shown from sm ── */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20
                       w-8 h-8 md:w-10 md:h-10 rounded-full
                       bg-black/30 hover:bg-black/60 active:scale-95
                       border border-white/20 text-white
                       items-center justify-center transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20
                       w-8 h-8 md:w-10 md:h-10 rounded-full
                       bg-black/30 hover:bg-black/60 active:scale-95
                       border border-white/20 text-white
                       items-center justify-center transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {images.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 sm:w-7 bg-white"
                  : "w-1 sm:w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter (mobile only, top-right) ── */}
      {images.length > 1 && (
        <div className="sm:hidden absolute top-3 right-3 z-20
                        text-[10px] font-semibold text-white/70
                        bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../api/axios";

// const INTERVAL_MS = 5000;

// export default function HeroCarousel({ className = "", onHasImages }) {
//   const [images, setImages] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [hasImages, setHasImages] = useState(false);

//   /* ── Fetch images ── */
//   useEffect(() => {
//     api
//       .get("/hero-images")
//       .then(({ data }) => {
//   const imgs = data?.images;
//   setImages(Array.isArray(imgs) ? imgs : []);
// })
//       .catch(() => {}) // silently fall back to no carousel
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       onHasImages?.(images.length > 0);
//     }
//   }, [loading, images.length, onHasImages]);

//   /* ── Auto-advance ── */
//   const next = useCallback(() => {
//     setCurrent((p) => (p + 1) % images.length);
//   }, [images.length]);

//   const prev = useCallback(() => {
//     setCurrent((p) => (p - 1 + images.length) % images.length);
//   }, [images.length]);

//   useEffect(() => {
//     if (images.length < 2) return;
//     const t = setInterval(next, INTERVAL_MS);
//     return () => clearInterval(t);
//   }, [next, images.length]);

//   // Still loading or no images → let the parent render the original hero
//   if (loading || images.length === 0) return null;

//   const active = images[current];

//   return (
//     <div
//       className={`relative w-full h-[70vh] md:h-[85vh] overflow-hidden ${className}`}
//     >
//       {/* Slides */}
//       <AnimatePresence mode="wait">
//         <motion.img
//           key={active._id}
//           src={active.url}
//           alt={active.caption || "Hero"}
//           initial={{ opacity: 0, scale: 1.04 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.8 }}
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//       </AnimatePresence>

//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black/55" />

//       {/* Caption */}
//       {active.caption && (
//         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center px-4 z-20">
//           <AnimatePresence mode="wait">
//             <motion.p
//               key={active._id + "-caption"}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="text-white/80 text-sm backdrop-blur-sm bg-black/20 px-4 py-1.5 rounded-full"
//             >
//               {active.caption}
//             </motion.p>
//           </AnimatePresence>
//         </div>
//       )}

//       {/* Arrows */}
//       {images.length > 1 && (
//         <>
//           <button
//             onClick={prev}
//             aria-label="Previous slide"
//             className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>

//           <button
//             onClick={next}
//             aria-label="Next slide"
//             className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>
//         </>
//       )}

//       {/* Dots */}
//       {images.length > 1 && (
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
//           {images.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrent(i)}
//               className={`h-1.5 rounded-full transition-all ${
//                 i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
