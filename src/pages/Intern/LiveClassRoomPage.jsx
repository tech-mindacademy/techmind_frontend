import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff,
  Hand, MessageSquare, Users, PhoneOff, Loader2, AlertTriangle,
} from "lucide-react";
import { joinLiveClass, leaveLiveClass } from "../../api/services/liveClass.service.js";
import useLiveKitRoom from "../../hooks/useLivekitRoom.js";
import VideoTile from "../../components/ui/VideoTile.jsx";
import SidePanel from "../../components/ui/Sidepanel.jsx";

function useElapsedTimer(startedAt) {
  const [label, setLabel] = useState("00:00");
  useEffect(() => {
    if (!startedAt) return undefined;
    const start = new Date(startedAt).getTime();
    const tick = () => {
      const diff = Math.max(0, Date.now() - start);
      const h = Math.floor(diff / 3.6e6);
      const m = Math.floor((diff % 3.6e6) / 6e4);
      const s = Math.floor((diff % 6e4) / 1000);
      setLabel(
        h > 0
          ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return label;
}

export default function LiveClassroomPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [joinData, setJoinData] = useState(null); // { token, url, role, liveClass }
  const [joinError, setJoinError] = useState(null);
  const [joining, setJoining] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const startedAtRef = useRef(null);

  // ── Secure join: the server re-checks shortlisted status, payment, batch,
  // and class status on every call. Nothing here can be spoofed from the
  // client — a stale/forged local state can't fabricate a valid token.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await joinLiveClass(id);
        if (cancelled) return;
        startedAtRef.current = new Date();
        setJoinData(data);
      } catch (err) {
        if (cancelled) return;
        setJoinError(
          err.response?.data?.message ||
            "Unable to join this class. You may not have access, or it hasn't started yet."
        );
      } finally {
        if (!cancelled) setJoining(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const {
    connectionState, participants, micEnabled, cameraEnabled, screenSharing,
    toggleMic, toggleCamera, toggleScreenShare,
    chatMessages, sendChatMessage, toggleRaiseHand, raisedHands,
    disconnect, error: rtcError,
  } = useLiveKitRoom({ url: joinData?.url, token: joinData?.token });

  const elapsed = useElapsedTimer(startedAtRef.current);

  const doLeave = useCallback(() => {
    disconnect();
    leaveLiveClass(id).catch(() => {});
    navigate(-1);
  }, [disconnect, id, navigate]);

  // Best-effort cleanup on tab close / hard navigation.
  useEffect(() => {
    const handler = () => {
      leaveLiveClass(id).catch(() => {});
    };
    window.addEventListener("pagehide", handler);
    return () => {
      window.removeEventListener("pagehide", handler);
      handler();
    };
  }, [id]);

  // ── Error / loading states ──────────────────────────────────────────────
  if (joining) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-gray-400">Connecting to classroom...</p>
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4 px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <h1 className="text-xl font-bold">Can't join this class</h1>
        <p className="text-gray-400 max-w-md">{joinError}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isHost = joinData?.role === "host";
  const settings = joinData?.liveClass?.settings || {};
  const canScreenShare = isHost || settings.allowStudentScreenShare;
  const chatEnabled = settings.allowChat !== false;
  const raiseHandEnabled = settings.allowRaiseHand !== false;

  const screenSharer = participants.find((p) => p.screenTrack);
  const gridParticipants = participants.filter((p) => p !== screenSharer);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ── TOP BAR ────────────────────────────────────────────────────── */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-3 flex-shrink-0">
        <span className="font-bold text-white text-sm">Tech Mind Academy</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-300 text-sm truncate">{joinData?.liveClass?.title}</span>
        <span className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
        </span>
        <span className="text-gray-400 text-xs font-mono">{elapsed}</span>
        <span
          className={`ml-auto text-xs px-2 py-1 rounded-lg ${
            connectionState === "connected"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          {connectionState}
        </span>
        <button
          onClick={doLeave}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
        >
          <PhoneOff className="w-3.5 h-3.5" /> Leave
        </button>
      </div>

      {rtcError && (
        <div className="bg-red-600/10 text-red-400 text-xs text-center py-1.5">{rtcError}</div>
      )}

      {/* ── MAIN AREA ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {screenSharer && (
            <div className="flex-1 min-h-0">
              <VideoTile participant={screenSharer} className="h-full" />
            </div>
          )}
          <div
            className={`grid gap-3 ${screenSharer ? "grid-cols-4 h-28 flex-shrink-0" : "flex-1"} ${
              !screenSharer && gridParticipants.length > 4
                ? "grid-cols-3 sm:grid-cols-4"
                : !screenSharer
                ? "grid-cols-1 sm:grid-cols-2"
                : ""
            } overflow-y-auto`}
          >
            {gridParticipants.map((p) => (
              <VideoTile key={p.identity} participant={p} />
            ))}
          </div>
        </div>

        <SidePanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          participants={participants}
          chatMessages={chatMessages}
          onSendChat={sendChatMessage}
          chatEnabled={chatEnabled}
        />
      </div>

      {/* ── BOTTOM CONTROLS ────────────────────────────────────────────── */}
      <div className="h-16 bg-gray-900 border-t border-gray-800 flex items-center justify-center gap-3 flex-shrink-0 px-4">
        <ControlButton active={micEnabled} onClick={toggleMic} onIcon={Mic} offIcon={MicOff} label="Mic" />
        <ControlButton active={cameraEnabled} onClick={toggleCamera} onIcon={Video} offIcon={VideoOff} label="Camera" />
        {canScreenShare && (
          <ControlButton
            active={screenSharing}
            onClick={toggleScreenShare}
            onIcon={ScreenShare}
            offIcon={ScreenShareOff}
            label="Share"
          />
        )}
        {raiseHandEnabled && !isHost && (
          <ControlButton
            active={!!raisedHands[participants.find((p) => p.isLocal)?.identity]}
            onClick={toggleRaiseHand}
            onIcon={Hand}
            offIcon={Hand}
            label="Raise Hand"
          />
        )}
        <ControlButton
          active={panelOpen}
          onClick={() => setPanelOpen((o) => !o)}
          onIcon={MessageSquare}
          offIcon={MessageSquare}
          label="Chat"
        />
        <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs ml-2">
          <Users className="w-4 h-4" /> {participants.length}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ active, onClick, onIcon: OnIcon, offIcon: OffIcon, label }) {
  const Icon = active ? OnIcon : OffIcon;
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
        active ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}