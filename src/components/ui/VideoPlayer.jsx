import { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";

const fmtTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60),
    sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function VideoPlayer({ src, onEnded, className = "" }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const hideControlsRef = useRef(null);
  const hlsRef = useRef(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);
  const [wasPlayingBeforeOffline, setWasPlayingBeforeOffline] = useState(false);

  // ── HLS setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Destroy any previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari — native HLS
      video.src = `${src}${src.includes("?") ? "&" : "?"}_t=${Date.now()}`;
      video.load();
      return;
    }

    if (!Hls.isSupported()) {
      setError("Your browser does not support video streaming.");
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      startLevel: -1,
      abrEwmaDefaultEstimate: 5000000,
      fetchSetup: (context, initParams) => {
        // Send cookies only for requests to our own backend
        if (
          context.url.includes("techmindacademy.in") ||
          context.url.startsWith("/")
        ) {
          initParams.credentials = "include";
        }
        return new Request(context.url, initParams);
      },
    });

    hlsRef.current = hls;

    const bustUrl = `${src}${src.includes("?") ? "&" : "?"}_t=${Date.now()}`;
    hls.loadSource(bustUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
      console.log(
        `[HLS] Manifest parsed — ${data.levels.length} quality level(s)`,
        data.levels.map(
          (l) => `${l.height}p @ ${Math.round(l.bitrate / 1000)}kbps`,
        ),
      );
    });

    hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      } else if (data.details?.totalduration) {
        setDuration(data.details.totalduration);
      }
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error("[HLS] error:", data.type, data.details, data.fatal);
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            setError("Streaming failed. Please try again.");
            hls.destroy();
            hlsRef.current = null;
            break;
        }
      }
    });

    return () => {
      hls.destroy();
      hlsRef.current = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  // ── Online / offline detection ─────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      if (wasPlayingBeforeOffline && videoRef.current) {
        videoRef.current.load();
        videoRef.current.currentTime = currentTime;
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (videoRef.current && !videoRef.current.paused) {
        setWasPlayingBeforeOffline(true);
        videoRef.current.pause();
      } else {
        setWasPlayingBeforeOffline(false);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasPlayingBeforeOffline, currentTime]);

  // ── Auto-hide controls ─────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsRef.current);
    if (isPlaying) {
      hideControlsRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => clearTimeout(hideControlsRef.current);
  }, []);

  // ── Fullscreen change listener ─────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Video event handlers ───────────────────────────────────────────────────
  const handlePlay = () => {
    setIsPlaying(true);
    resetHideTimer();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
    clearTimeout(hideControlsRef.current);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (onEnded) onEnded();
  };

  // ── Controls ───────────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!isOnline || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.warn("[VideoPlayer] play() rejected:", err.message);
        // Only show error if it's not a benign "interrupted by pause" error
        if (err.name !== "AbortError") {
          setError("Playback failed. Please try again.");
        }
      });
    } else {
      videoRef.current.pause();
    }
    resetHideTimer();
  };

  const seek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (x / rect.width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    resetHideTimer();
  };

  const skip = (secs) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.currentTime + secs, duration),
    );
    resetHideTimer();
  };

  const changeVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (videoRef.current) videoRef.current.volume = v;
    resetHideTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const m = !isMuted;
    setIsMuted(m);
    videoRef.current.muted = m;
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.closest(".video-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    resetHideTimer();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`video-container relative bg-black select-none ${className}`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        preload="metadata"
        playsInline
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        // onError intentionally omitted — HLS.js owns all error handling
        onEnded={handleEnded}
      />

      {/* ── OFFLINE overlay ── */}
      {!isOnline && (
        <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center gap-4 z-30">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M12 12h.01M3 3l18 18"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base">
              No Internet Connection
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Video playback paused. Reconnect to continue.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-gray-500">
              Waiting for connection...
            </span>
          </div>
        </div>
      )}

      {/* ── BUFFERING overlay ── */}
      {isOnline && isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* ── ERROR overlay ── */}
      {error && isOnline && (
        <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center gap-3 z-20">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-white text-sm text-center px-4">{error}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setError(null);
              videoRef.current?.load();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Play icon (center, when paused and no error) ── */}
      {!isPlaying && !isBuffering && isOnline && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-20 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 space-y-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={seek}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
          >
            <div
              className="h-1.5 bg-indigo-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-indigo-300 transition flex-shrink-0"
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip back 10s */}
            <button
              onClick={() => skip(-10)}
              className="text-white/70 hover:text-white transition flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => skip(10)}
              className="text-white/70 hover:text-white transition flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                />
              </svg>
            </button>

            {/* Time */}
            <span className="text-white/80 text-xs flex-shrink-0">
              {fmtTime(currentTime)} / {fmtTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="text-white/70 hover:text-white transition flex-shrink-0"
            >
              {isMuted || volume === 0 ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              className="w-16 h-1 accent-indigo-500 cursor-pointer"
            />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white transition flex-shrink-0"
            >
              {isFullscreen ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Online restored banner ── */}
      {isOnline && wasPlayingBeforeOffline && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white" />
            Connection restored
          </div>
        </div>
      )}
    </div>
  );
}
