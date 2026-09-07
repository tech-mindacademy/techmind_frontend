import { useEffect, useRef } from "react";
import { MicOff } from "lucide-react";

export default function VideoTile({ participant, className = "" }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const track = participant.screenTrack || participant.videoTrack;
  const showVideo = track && (participant.screenTrack || !participant.isCameraOff);

  useEffect(() => {
    if (track && videoRef.current) {
      track.attach(videoRef.current);
    }
    return () => {
      if (track) track.detach();
    };
  }, [track]);

  useEffect(() => {
    if (participant.audioTrack && audioRef.current && !participant.isLocal) {
      participant.audioTrack.attach(audioRef.current);
    }
    return () => {
      if (participant.audioTrack) participant.audioTrack.detach();
    };
  }, [participant.audioTrack, participant.isLocal]);

  return (
    <div
      className={`relative bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center aspect-video ${
        participant.isSpeaking ? "ring-2 ring-emerald-400" : ""
      } ${className}`}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {participant.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}
      <audio ref={audioRef} autoPlay />

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/55 backdrop-blur px-2 py-1 rounded-lg max-w-[85%]">
        <span className="text-white text-xs font-medium truncate">
          {participant.isLocal ? `${participant.name} (You)` : participant.name}
        </span>
        {participant.isMuted && <MicOff className="w-3 h-3 text-red-400 flex-shrink-0" />}
        {participant.handRaised && <span className="flex-shrink-0">✋</span>}
      </div>
    </div>
  );
}