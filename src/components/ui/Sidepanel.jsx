import { useState, useRef, useEffect } from "react";
import { Send, MicOff, Mic, VideoOff, Video } from "lucide-react";

const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

function ChatTab({ messages, onSend, disabled }) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-6">No messages yet</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.isLocal ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                  m.isLocal
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                {!m.isLocal && <p className="text-[11px] font-bold opacity-70 mb-0.5">{m.senderName}</p>}
                <p className="break-words">{m.text}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5">{fmtTime(m.ts)}</span>
            </div>
          ))
        )}
      </div>
      {!disabled && (
        <form onSubmit={submit} className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

function ParticipantsTab({ participants }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      {participants.map((p) => (
        <div
          key={p.identity}
          className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300 flex-shrink-0">
              {p.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {p.name} {p.isLocal && "(You)"}
            </span>
            {p.handRaised && <span>✋</span>}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0">
            {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5" />}
            {p.isCameraOff ? <VideoOff className="w-3.5 h-3.5 text-red-400" /> : <Video className="w-3.5 h-3.5" />}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SidePanel({ participants, chatMessages, onSendChat, chatEnabled, open, onClose }) {
  const [tab, setTab] = useState("chat");

  if (!open) return null;

  return (
    <div className="w-full sm:w-80 flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setTab("chat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === "chat" ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white" : "text-gray-500"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setTab("participants")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === "participants" ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white" : "text-gray-500"
            }`}
          >
            People ({participants.length})
          </button>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 sm:hidden">✕</button>
      </div>

      {tab === "chat" ? (
        <ChatTab messages={chatMessages} onSend={onSendChat} disabled={!chatEnabled} />
      ) : (
        <ParticipantsTab participants={participants} />
      )}
    </div>
  );
}