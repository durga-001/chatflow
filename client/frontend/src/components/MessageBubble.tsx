import type { Message } from "../types/chat";
import {
  MOCK_USERS,
  MOCK_ME,
  formatMessageTime,
  getInitialsColor,
} from "../assets/mockData";

interface MessageBubbleProps {
  message: Message;
  /** Whether this message starts a new sender group */
  isGroupStart: boolean;
}

// ─── Delivery status icons ────────────────────────────────────────────────────
function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sending") {
    return (
      <svg
        className="w-3.5 h-3.5 text-slate-500 animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg
        className="w-3.5 h-3.5 text-ember"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  if (status === "read") {
    return (
      <svg
        className="w-3.5 h-3.5 text-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }
  // sent or delivered
  return (
    <svg
      className="w-3.5 h-3.5 text-slate-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function MessageBubble({
  message,
  isGroupStart,
}: MessageBubbleProps) {
  const isMe = message.senderId === "me";
  const sender = isMe
    ? MOCK_ME
    : (MOCK_USERS.find((u) => u.id === message.senderId) ?? MOCK_ME);

  return (
    <div
      className={`
        flex gap-2.5 group animate-slide-up
        ${isMe ? "flex-row-reverse" : "flex-row"}
        ${isGroupStart ? "mt-4" : "mt-1"}
      `}
    >
      {/* Avatar — only show at group start */}
      <div className="w-8 flex-shrink-0">
        {isGroupStart && !isMe && (
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-display
            ring-2 ring-surface-border
            ${getInitialsColor(sender.initials)}
          `}
          >
            {sender.initials}
          </div>
        )}
      </div>

      {/* Message body */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
      >
        {/* Sender name + time — only on group start */}
        {isGroupStart && (
          <div
            className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
          >
            {!isMe && (
              <span className="text-xs font-semibold text-slate-300">
                {sender.name}
              </span>
            )}
            <span className="text-xs text-slate-600">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div className="relative">
          <div className={isMe ? "bubble-sent" : "bubble-received"}>
            {message.isOptimistic && (
              <span className="opacity-60">{message.content}</span>
            )}
            {!message.isOptimistic && message.content}
          </div>

          {/* Hover: timestamp for non-group-start messages */}
          {!isGroupStart && (
            <div
              className={`
              absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
              text-xs text-slate-600 whitespace-nowrap
              ${isMe ? "-left-2 -translate-x-full" : "-right-2 translate-x-full"}
            `}
            >
              {formatMessageTime(message.timestamp)}
            </div>
          )}
        </div>

        {/* Delivery status — only for my messages at group end */}
        {isMe && (
          <div className="flex items-center gap-1">
            <StatusIcon status={message.status} />
          </div>
        )}
      </div>
    </div>
  );
}
