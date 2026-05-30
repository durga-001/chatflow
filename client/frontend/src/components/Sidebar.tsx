import { useState, useMemo } from "react";
import type { ChatRoom, User } from "../types/chat";
import { useAuth } from "../context/AuthContext";
import { MOCK_USERS } from "../assets/mockData";
import { formatTime } from "../assets/mockData";
import Avatar from "./Avatar";

interface SidebarProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelectRoom: (room: ChatRoom) => void;
}

export default function Sidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);

  // Filter rooms by search query
  const filteredRooms = useMemo(() => {
    if (!searchQuery.trim()) return rooms;
    const q = searchQuery.toLowerCase();
    return rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.lastMessage?.content.toLowerCase().includes(q),
    );
  }, [rooms, searchQuery]);

  // Filter mock users for "new chat" search
  const searchedUsers = useMemo<User[]>(() => {
    if (!searchQuery.trim()) return MOCK_USERS;
    const q = searchQuery.toLowerCase();
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const totalUnread = rooms.reduce((acc, r) => acc + r.unreadCount, 0);

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col bg-surface border-r border-surface-border h-full">
      {/* ── Header ── */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Logo */}
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-sm font-700 text-white leading-none">
                KafkaChat
              </h1>
              <p className="text-xs text-slate-500 leading-none mt-0.5">
                Real-time messaging
              </p>
            </div>
          </div>

          {/* Unread badge */}
          {totalUnread > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-xs font-semibold font-mono">
              {totalUnread}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowUserSearch(true)}
            onBlur={() => setTimeout(() => setShowUserSearch(false), 200)}
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2.5
                       text-sm text-white placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50
                       transition-all duration-200"
          />
        </div>
      </div>

      {/* ── Room list / User search results ── */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {showUserSearch && searchQuery && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-2 mb-2">
              People
            </p>
            {searchedUsers.map((u) => (
              <UserSearchItem key={u.id} user={u} />
            ))}
            <div className="border-t border-surface-border my-2" />
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-2 mb-2">
              Chats
            </p>
          </div>
        )}

        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-slate-500"
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
            <p className="text-sm text-slate-400">No conversations found</p>
            <p className="text-xs text-slate-600 mt-1">
              Try searching for a user
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              isActive={room.id === activeRoomId}
              onClick={() => onSelectRoom(room)}
            />
          ))
        )}
      </div>

      {/* ── Current user footer ── */}
      {user && (
        <div className="p-3 border-t border-surface-border">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-card transition-colors group">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-sm font-semibold text-accent-glow font-display">
                {user.initials}
              </div>
              <span className="status-dot online absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-jade truncate">● Online</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-surface-border"
            >
              <svg
                className="w-4 h-4 text-slate-400 hover:text-ember transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Room list item ────────────────────────────────────────────────────────────
function RoomItem({
  room,
  isActive,
  onClick,
}: {
  room: ChatRoom;
  isActive: boolean;
  onClick: () => void;
}) {
  const participant = room.participant;

  return (
    <button
      onClick={onClick}
      className={`w-full sidebar-item text-left ${isActive ? "active" : ""}`}
    >
      {/* Avatar */}
      {participant ? (
        <div className="relative flex-shrink-0">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold font-display
            ring-2 ring-surface-border
            ${getInitialsColorClass(participant.initials)}
          `}
          >
            {participant.initials}
          </div>
          <span
            className={`status-dot absolute -bottom-0.5 -right-0.5 ${participant.status}`}
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-600/30 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-slate-400"
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1">
          <p
            className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-slate-200"}`}
          >
            {room.name}
          </p>
          {room.lastMessage && (
            <span className="text-xs text-slate-600 flex-shrink-0">
              {formatTime(room.lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <p className="text-xs text-slate-500 truncate">
            {room.lastMessage?.content ?? "No messages yet"}
          </p>
          {room.unreadCount > 0 && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-white font-mono">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── User search result item ───────────────────────────────────────────────────
function UserSearchItem({ user }: { user: User }) {
  return (
    <button className="w-full sidebar-item">
      <Avatar user={user} size="sm" showStatus />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-white truncate">{user.name}</p>
        <p className="text-xs text-slate-500 truncate">{user.email}</p>
      </div>
      <svg
        className="w-4 h-4 text-slate-600 group-hover:text-accent transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}

function getInitialsColorClass(initials: string): string {
  const colors = [
    "bg-accent/20 text-accent-glow",
    "bg-jade/15 text-jade",
    "bg-ember/15 text-ember",
    "bg-yellow-500/15 text-yellow-400",
    "bg-pink-500/15 text-pink-400",
    "bg-cyan-500/15 text-cyan-400",
  ];
  const i =
    (initials.charCodeAt(0) + (initials[1]?.charCodeAt(0) ?? 0)) %
    colors.length;
  return colors[i];
}
