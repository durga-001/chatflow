import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  ApiResponse,
  LoginCredentials,
  SignupCredentials,
  User,
  Message,
  ChatRoom,
} from "../types/chat";

// ─── Create Axios instance ─────────────────────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor: attach JWT ──────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem("kc_session");
  if (stored) {
    const { token } = JSON.parse(stored) as { token: string };
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 ────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("kc_session");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ─── Generic request wrapper ──────────────────────────────────────────────────
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await axiosInstance.request<ApiResponse<T>>(config);
  return res.data.data;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────
export const authApi = {
  login: (credentials: LoginCredentials) =>
    request<{ user: User; token: string }>({
      method: "POST",
      url: "/auth/login",
      data: credentials,
    }),

  signup: (credentials: SignupCredentials) =>
    request<{ user: User; token: string }>({
      method: "POST",
      url: "/auth/signup",
      data: credentials,
    }),

  me: () => request<User>({ method: "GET", url: "/auth/me" }),

  logout: () => request<void>({ method: "POST", url: "/auth/logout" }),
};

// ─── Chat room endpoints ──────────────────────────────────────────────────────
export const roomsApi = {
  getAll: () => request<ChatRoom[]>({ method: "GET", url: "/rooms" }),

  getById: (roomId: string) =>
    request<ChatRoom>({ method: "GET", url: `/rooms/${roomId}` }),

  createDirect: (userId: string) =>
    request<ChatRoom>({
      method: "POST",
      url: "/rooms/direct",
      data: { userId },
    }),
};

// ─── Message endpoints ────────────────────────────────────────────────────────
export const messagesApi = {
  getByRoom: (roomId: string, page = 1, limit = 50) =>
    request<Message[]>({
      method: "GET",
      url: `/rooms/${roomId}/messages`,
      params: { page, limit },
    }),

  send: (roomId: string, content: string) =>
    request<Message>({
      method: "POST",
      url: `/rooms/${roomId}/messages`,
      data: { content },
    }),
};

// ─── Users endpoints ──────────────────────────────────────────────────────────
export const usersApi = {
  search: (query: string) =>
    request<User[]>({
      method: "GET",
      url: "/users/search",
      params: { q: query },
    }),
};

export default axiosInstance;
