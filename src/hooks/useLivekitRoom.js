import { useEffect, useRef, useState, useCallback } from "react";
import { Room, RoomEvent, Track, MediaDeviceFailure } from "livekit-client";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Turns a raw getUserMedia/publish rejection into a message a user can act on. */
function describeMediaError(err, device) {
  const failure = MediaDeviceFailure.getFailure(err);
  switch (failure) {
    case MediaDeviceFailure.PermissionDenied:
      return `${device === "camera" ? "Camera" : "Microphone"} permission was denied. Check your browser's site permissions and try again.`;
    case MediaDeviceFailure.NotFound:
      return `No ${device} was found on this device.`;
    case MediaDeviceFailure.DeviceInUse:
      return `Your ${device} is already in use by another app or browser tab.`;
    default:
      // Not a device-permission issue — most likely a publish permission
      // problem (e.g. the token's canPublishSources doesn't include this
      // source) or a transient connection issue.
      return err?.message || `Could not enable your ${device}. Please try again.`;
  }
}

/**
 * Wraps a LiveKit Room connection and exposes plain React state — no
 * @livekit/components-react UI primitives are used, so the classroom UI
 * (LiveClassroomPage) stays fully custom while this hook owns all the
 * actual WebRTC/track-management complexity.
 */
export default function useLiveKitRoom({ url, token }) {
  const roomRef = useRef(null);
  const raisedHandsRef = useRef({});

  const [connectionState, setConnectionState] = useState("connecting");
  const [participants, setParticipants] = useState([]);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [raisedHands, setRaisedHands] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    raisedHandsRef.current = raisedHands;
  }, [raisedHands]);

  const snapshot = useCallback((room) => {
    if (!room) return [];
    const all = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
    return all
      .map((p) => {
        // Defensive: some SDK/version-mismatch states can throw while reading
        // publication metadata (e.g. an incompatible TrackSource enum value).
        // One bad participant/publication should never take down the whole
        // classroom render — skip it and keep the rest of the room working.
        try {
          const pubs = Array.from(p.trackPublications.values());
          const videoPub = pubs.find(
            (pub) => pub.kind === Track.Kind.Video && pub.source === Track.Source.Camera
          );
          const screenPub = pubs.find((pub) => pub.source === Track.Source.ScreenShare);
          const audioPub = pubs.find((pub) => pub.kind === Track.Kind.Audio);
          return {
            identity: p.identity,
            name: p.name || p.identity,
            isLocal: p === room.localParticipant,
            videoTrack: videoPub?.track || null,
            screenTrack: screenPub?.track || null,
            audioTrack: audioPub?.track || null,
            isCameraOff: !videoPub || videoPub.isMuted,
            isMuted: !audioPub || audioPub.isMuted,
            isSpeaking: !!p.isSpeaking,
            handRaised: !!raisedHandsRef.current[p.identity],
          };
        } catch (err) {
          console.error(`Failed to read track state for participant ${p?.identity}:`, err);
          return {
            identity: p?.identity || `unknown-${Math.random()}`,
            name: p?.name || p?.identity || "Participant",
            isLocal: p === room.localParticipant,
            videoTrack: null,
            screenTrack: null,
            audioTrack: null,
            isCameraOff: true,
            isMuted: true,
            isSpeaking: false,
            handRaised: false,
          };
        }
      })
      .filter(Boolean);
  }, []);

  useEffect(() => {
    if (!url || !token) return undefined;

    // Guards against React StrictMode's dev-only mount→unmount→remount cycle:
    // without this, the room can be told to disconnect while still mid-connect,
    // leaving the SDK in a half-initialized state that surfaces as confusing
    // internal errors on the very next connect attempt.
    let cancelled = false;

    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    const refresh = () => {
      if (!cancelled) setParticipants(snapshot(room));
    };

    room.on(RoomEvent.ConnectionStateChanged, (state) => setConnectionState(state));
    room.on(RoomEvent.ParticipantConnected, refresh);
    room.on(RoomEvent.ParticipantDisconnected, refresh);
    room.on(RoomEvent.TrackSubscribed, refresh);
    room.on(RoomEvent.TrackUnsubscribed, refresh);
    room.on(RoomEvent.TrackMuted, refresh);
    room.on(RoomEvent.TrackUnmuted, refresh);
    room.on(RoomEvent.ActiveSpeakersChanged, refresh);
    room.on(RoomEvent.LocalTrackPublished, refresh);
    room.on(RoomEvent.LocalTrackUnpublished, refresh);
    room.on(RoomEvent.MediaDevicesError, (err) => {
      console.error("MediaDevicesError:", err);
      setError(describeMediaError(err, "camera/microphone"));
    });

    room.on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const msg = JSON.parse(decoder.decode(payload));
        if (msg.type === "chat") {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              senderName: msg.senderName || participant?.name || participant?.identity || "Unknown",
              text: msg.text,
              ts: msg.ts || Date.now(),
              isLocal: false,
            },
          ]);
        } else if (msg.type === "raise-hand" && participant) {
          setRaisedHands((prev) => ({ ...prev, [participant.identity]: !!msg.raised }));
          refresh();
        }
      } catch {
        /* ignore malformed data messages */
      }
    });

    room
      .connect(url, token)
      .then(refresh)
      .catch((err) => {
        console.error("LiveKit connect failed:", err);
        setError("Could not connect to the classroom. Please try again.");
        setConnectionState("failed");
      });

    return () => {
      cancelled = true;
      room.disconnect();
      roomRef.current = null;
    };
  }, [url, token, snapshot]);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !micEnabled;
    try {
      await room.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
      setError(null);
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
      setError(describeMediaError(err, "microphone"));
      // Do NOT flip micEnabled — the actual device/publish state didn't change,
      // so the button must reflect reality, not the attempted state.
    }
  }, [micEnabled]);

  const toggleCamera = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !cameraEnabled;
    try {
      await room.localParticipant.setCameraEnabled(next);
      setCameraEnabled(next);
      setError(null);
    } catch (err) {
      console.error("Failed to toggle camera:", err);
      setError(describeMediaError(err, "camera"));
    }
  }, [cameraEnabled]);

  const toggleScreenShare = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !screenSharing;
    try {
      await room.localParticipant.setScreenShareEnabled(next);
      setScreenSharing(next);
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  }, [screenSharing]);

  const sendChatMessage = useCallback((text) => {
    const room = roomRef.current;
    if (!room || !text?.trim()) return;
    const ts = Date.now();
    const msg = { type: "chat", text: text.trim(), senderName: room.localParticipant.name, ts };
    room.localParticipant.publishData(encoder.encode(JSON.stringify(msg)), { reliable: true });
    setChatMessages((prev) => [
      ...prev,
      { id: `local-${ts}`, senderName: "You", text: msg.text, ts, isLocal: true },
    ]);
  }, []);

  const toggleRaiseHand = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    const identity = room.localParticipant.identity;
    const next = !raisedHandsRef.current[identity];
    const msg = { type: "raise-hand", raised: next };
    room.localParticipant.publishData(encoder.encode(JSON.stringify(msg)), { reliable: true });
    setRaisedHands((prev) => ({ ...prev, [identity]: next }));
  }, []);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
  }, []);

  return {
    connectionState,
    participants,
    micEnabled,
    cameraEnabled,
    screenSharing,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    chatMessages,
    sendChatMessage,
    raisedHands,
    toggleRaiseHand,
    disconnect,
    error,
  };
}