import type { User, Message, ChatRoom } from '../types/chat';

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@kafkachat.dev',
    initials: 'AR',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya@kafkachat.dev',
    initials: 'PS',
    status: 'online',
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'u3',
    name: 'Jordan Kim',
    email: 'jordan@kafkachat.dev',
    initials: 'JK',
    status: 'away',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'u4',
    name: 'Sam Chen',
    email: 'sam@kafkachat.dev',
    initials: 'SC',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u5',
    name: 'Morgan Blake',
    email: 'morgan@kafkachat.dev',
    initials: 'MB',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
];

/** The currently logged-in mock user */
export const MOCK_ME: User = {
  id: 'me',
  name: 'You (Dev)',
  email: 'dev@kafkachat.dev',
  initials: 'YD',
  status: 'online',
  lastSeen: new Date().toISOString(),
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const ago = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

// ─── Mock Messages per room ───────────────────────────────────────────────────
export const MOCK_MESSAGES: Record<string, Message[]> = {
  room1: [
    { id: 'm1', roomId: 'room1', senderId: 'u2', content: 'Hey! Have you checked the new Kafka topic configs?', timestamp: ago(60), status: 'read' },
    { id: 'm2', roomId: 'room1', senderId: 'me', content: 'Yeah, I saw them this morning. The partition count looks good for our load.', timestamp: ago(58), status: 'read' },
    { id: 'm3', roomId: 'room1', senderId: 'u2', content: 'Great. I was worried about throughput on the auth events topic.', timestamp: ago(55), status: 'read' },
    { id: 'm4', roomId: 'room1', senderId: 'me', content: 'Should be fine. We're running 3 consumers per partition anyway. Let me know if you see lag.', timestamp: ago(52), status: 'read' },
    { id: 'm5', roomId: 'room1', senderId: 'u2', content: 'Will do! Also, the WebSocket reconnect logic needs a review—can you take a look?', timestamp: ago(30), status: 'read' },
    { id: 'm6', roomId: 'room1', senderId: 'me', content: 'Sure, I'll open a PR comment by EOD.', timestamp: ago(28), status: 'read' },
    { id: 'm7', roomId: 'room1', senderId: 'u2', content: 'Perfect, thanks! 🎉', timestamp: ago(5), status: 'delivered' },
  ],
  room2: [
    { id: 'm8', roomId: 'room2', senderId: 'u3', content: 'Standup in 10 mins?', timestamp: ago(20), status: 'read' },
    { id: 'm9', roomId: 'room2', senderId: 'me', content: 'Yep, joining now.', timestamp: ago(18), status: 'read' },
    { id: 'm10', roomId: 'room2', senderId: 'u3', content: 'Cool, I'll start the Zoom link.', timestamp: ago(17), status: 'delivered' },
  ],
  room3: [
    { id: 'm11', roomId: 'room3', senderId: 'u4', content: 'Can you share the PostgreSQL schema for the messages table?', timestamp: ago(120), status: 'read' },
    { id: 'm12', roomId: 'room3', senderId: 'me', content: 'Sure! It\'s in /db/migrations/003_messages.sql', timestamp: ago(115), status: 'read' },
    { id: 'm13', roomId: 'room3', senderId: 'u4', content: 'Got it, thanks!', timestamp: ago(110), status: 'read' },
  ],
  room4: [],
  room5: [
    { id: 'm14', roomId: 'room5', senderId: 'u5', content: 'Deployment is live on staging 🚀', timestamp: ago(45), status: 'read' },
    { id: 'm15', roomId: 'room5', senderId: 'me', content: 'Awesome! Running smoke tests now.', timestamp: ago(40), status: 'read' },
    { id: 'm16', roomId: 'room5', senderId: 'u5', content: 'Let me know if anything fails. I\'m on standby.', timestamp: ago(38), status: 'delivered' },
  ],
};

// ─── Mock Chat Rooms ──────────────────────────────────────────────────────────
export const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'room1',
    type: 'direct',
    name: 'Priya Sharma',
    participant: MOCK_USERS[1],
    lastMessage: MOCK_MESSAGES['room1'].at(-1),
    unreadCount: 1,
    updatedAt: ago(5),
  },
  {
    id: 'room2',
    type: 'direct',
    name: 'Jordan Kim',
    participant: MOCK_USERS[2],
    lastMessage: MOCK_MESSAGES['room2'].at(-1),
    unreadCount: 0,
    updatedAt: ago(17),
  },
  {
    id: 'room3',
    type: 'direct',
    name: 'Sam Chen',
    participant: MOCK_USERS[3],
    lastMessage: MOCK_MESSAGES['room3'].at(-1),
    unreadCount: 0,
    updatedAt: ago(110),
  },
  {
    id: 'room4',
    type: 'direct',
    name: 'Alex Rivera',
    participant: MOCK_USERS[0],
    lastMessage: undefined,
    unreadCount: 0,
    updatedAt: ago(300),
  },
  {
    id: 'room5',
    type: 'direct',
    name: 'Morgan Blake',
    participant: MOCK_USERS[4],
    lastMessage: MOCK_MESSAGES['room5'].at(-1),
    unreadCount: 2,
    updatedAt: ago(38),
  },
];

// ─── Format helpers ───────────────────────────────────────────────────────────
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitialsColor(initials: string): string {
  const colors = [
    'bg-accent/30 text-accent-glow',
    'bg-jade/20 text-jade',
    'bg-ember/20 text-ember',
    'bg-yellow-500/20 text-yellow-400',
    'bg-pink-500/20 text-pink-400',
    'bg-cyan-500/20 text-cyan-400',
  ];
  const index = (initials.charCodeAt(0) + initials.charCodeAt(1)) % colors.length;
  return colors[index];
}