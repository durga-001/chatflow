import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatRoom, Message } from "../types/chat";
import { MOCK_ROOMS, MOCK_MESSAGES } from "../assets/mockData";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-2 animate-fade-in">
      <div className="flex gap-1 bg-surface-card border border-surface-border rounded-2xl rounded-tl-sm px-3 py-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">{name} is typing…</span>
    </div>
  );
}

// ─── Empty state (no room selected) ───────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          className="text-accent/60"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="font-display text-xl font-700 text-white mb-2">
        Select a conversation
      </h2>
      <p className="text-sm text-slate-500 max-w-xs">
        Choose from your recent chats or search for a contact to start messaging
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-600">
        <div className="w-2 h-2 rounded-full bg-jade animate-pulse-slow" />
        Kafka event stream ready
      </div>
    </div>
  );
}

// ─── Empty room (no messages) ─────────────────────────────────────────────────
function EmptyRoom({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mb-5">
        <svg
          className="w-8 h-8 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-white mb-1">No messages yet</h3>
      <p className="text-sm text-slate-500">
        Say hello to <span className="text-slate-300">{name}</span>!
      </p>
    </div>
  );
}

// ─── Date separator ────────────────────────────────────────────────────────────
function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-surface-border" />
      <span className="text-xs text-slate-600 font-medium px-2 py-1 bg-surface-card rounded-full border border-surface-border">
        {label}
      </span>
      <div className="flex-1 h-px bg-surface-border" />
    </div>
  );
}

// ─── Main Chat page ────────────────────────────────────────────────────────────
export default function Chat() {
  const [rooms, setRooms] = useState<ChatRoom[]>(MOCK_ROOMS);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom?.id, messages]);

  // Simulate "user is typing" response after sending
  const simulateTyping = useCallback(
    (roomId: string) => {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      typingTimerRef.current = setTimeout(
        () => {
          setIsTyping(false);

          // Simulate reply
          const replies = [
            "Got it, thanks!",
            "Sure, sounds good 👍",
            "Interesting! Let me check that.",
            "On it! Will update you shortly.",
            "Makes sense. Let's sync tomorrow.",
            "🚀 Deploying now!",
            "Kafka consumer lag is looking good btw.",
          ];
          const content = replies[Math.floor(Math.random() * replies.length)];
          const participant = rooms.find((r) => r.id === roomId)?.participant;

          const replyMsg: Message = {
            id: `m_${Date.now()}_reply`,
            roomId,
            senderId: participant?.id ?? "u1",
            content,
            timestamp: new Date().toISOString(),
            status: "delivered",
          };

          setMessages((prev) => ({
            ...prev,
            [roomId]: [...(prev[roomId] ?? []), replyMsg],
          }));

          // Update room's last message
          setRooms((prev) =>
            prev.map((r) =>
              r.id === roomId
                ? { ...r, lastMessage: replyMsg, updatedAt: replyMsg.timestamp }
                : r,
            ),
          );
        },
        1500 + Math.random() * 1000,
      );
    },
    [rooms],
  );

  const handleSend = useCallback(
    (content: string) => {
      if (!activeRoom) return;

      const newMsg: Message = {
        id: `m_${Date.now()}`,
        roomId: activeRoom.id,
        senderId: "me",
        content,
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => ({
        ...prev,
        [activeRoom.id]: [...(prev[activeRoom.id] ?? []), newMsg],
      }));

      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id
            ? {
                ...r,
                lastMessage: newMsg,
                updatedAt: newMsg.timestamp,
                unreadCount: 0,
              }
            : r,
        ),
      );

      // Mark room messages as read
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id ? { ...r, unreadCount: 0 } : r,
        ),
      );

      simulateTyping(activeRoom.id);
    },
    [activeRoom, simulateTyping],
  );

  const handleSelectRoom = useCallback((room: ChatRoom) => {
    setActiveRoom(room);
    // Mark as read
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r)),
    );
    setSidebarOpen(false); // Close sidebar on mobile after selection
  }, []);

  const activeMessages = activeRoom ? (messages[activeRoom.id] ?? []) : [];

  // Group messages by sender for bubble rendering
  const isGroupStart = (idx: number) => {
    if (idx === 0) return true;
    return activeMessages[idx].senderId !== activeMessages[idx - 1].senderId;
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar — hidden on mobile unless open */}
      <div
        className={`
        ${sidebarOpen ? "flex" : "hidden md:flex"}
        flex-shrink-0
      `}
      >
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoom?.id ?? null}
          onSelectRoom={handleSelectRoom}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile: back button */}
        {!sidebarOpen && activeRoom && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-10 p-2 rounded-xl bg-surface-card border border-surface-border text-slate-400 hover:text-white"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {activeRoom ? (
          <>
            <ChatHeader room={activeRoom} />

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {activeMessages.length === 0 ? (
                <EmptyRoom name={activeRoom.name} />
              ) : (
                <div className="max-w-3xl mx-auto">
                  <DateSeparator label="Today" />

                  {activeMessages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isGroupStart={isGroupStart(idx)}
                    />
                  ))}

                  {/* Typing indicator */}
                  {isTyping && activeRoom.participant && (
                    <TypingIndicator
                      name={activeRoom.participant.name.split(" ")[0]}
                    />
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
