// ─── User types ───────────────────────────────────────────────────────────────
export type UserStatus = "online" | "away" | "offline";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  /** Initials derived from name when no avatar */
  initials: string;
  status: UserStatus;
  /** ISO timestamp of last activity */
  lastSeen: string;
}

// ─── Message types ────────────────────────────────────────────────────────────
export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  size: number; // bytes
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  /** ISO timestamp */
  timestamp: string;
  status: MessageStatus;
  attachments?: Attachment[];
  /** ID of message being replied to */
  replyToId?: string;
  /** True when this is an optimistic (not yet confirmed) message */
  isOptimistic?: boolean;
}

// ─── Chat room types ───────────────────────────────────────────────────────────
export type RoomType = "direct" | "group";

export interface ChatRoom {
  id: string;
  type: RoomType;
  name: string;
  /** For DMs, the other participant */
  participant?: User;
  /** For group chats */
  members?: User[];
  lastMessage?: Message;
  /** Count of unread messages */
  unreadCount: number;
  /** ISO timestamp of last activity */
  updatedAt: string;
}

// ─── Auth types ───────────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── API response wrappers ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── Socket event payloads ────────────────────────────────────────────────────
export interface SocketMessagePayload {
  roomId: string;
  content: string;
  senderId: string;
  tempId: string; // client-generated optimistic ID
}

export interface TypingPayload {
  roomId: string;
  userId: string;
  isTyping: boolean;
}
