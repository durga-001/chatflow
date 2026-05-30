import type { ChatRoom } from "../types/chat";
import Avatar from "./Avatar";

interface ChatHeaderProps {
  room: ChatRoom;
}

const statusLabel: Record<string, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

const statusColor: Record<string, string> = {
  online: "text-jade",
  away: "text-yellow-400",
  offline: "text-slate-500",
};

export default function ChatHeader({ room }: ChatHeaderProps) {
  const participant = room.participant;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface flex-shrink-0">
      {/* Left: avatar + name + status */}
      <div className="flex items-center gap-3">
        {participant ? (
          <Avatar user={participant} size="md" showStatus />
        ) : (
          /* Group icon placeholder */
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        <div>
          <h2 className="font-semibold text-white text-base leading-tight">
            {room.name}
          </h2>
          {participant && (
            <p
              className={`text-xs font-medium ${statusColor[participant.status]}`}
            >
              ● {statusLabel[participant.status]}
            </p>
          )}
        </div>
      </div>

      {/* Right: action icons */}
      <div className="flex items-center gap-1">
        <HeaderIconButton title="Voice call">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </HeaderIconButton>

        <HeaderIconButton title="Video call">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </HeaderIconButton>

        <HeaderIconButton title="Search messages">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </HeaderIconButton>

        <HeaderIconButton title="More options">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </HeaderIconButton>
      </div>
    </header>
  );
}

// ─── Icon button helper ────────────────────────────────────────────────────────
function HeaderIconButton({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      title={title}
      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-card transition-all duration-150"
    >
      {children}
    </button>
  );
}
