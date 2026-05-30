import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type {
  AuthState,
  LoginCredentials,
  SignupCredentials,
  User,
} from "../types/chat";
import { MOCK_ME } from "../assets/mockData";

// ─── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Simulated API delay ───────────────────────────────────────────────────────
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start loading to check persisted session
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("kc_session");
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored) as {
          user: User;
          token: string;
        };
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem("kc_session");
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  /**
   * Mock login — replace body with real Axios call when backend is ready.
   * POST /api/auth/login → { user, token }
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((s) => ({ ...s, isLoading: true }));
    await delay(900); // Simulate network

    // Mock validation
    if (!credentials.email.includes("@")) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error("Invalid email address");
    }
    if (credentials.password.length < 6) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error("Password must be at least 6 characters");
    }

    const user: User = {
      ...MOCK_ME,
      name: credentials.email.split("@")[0].replace(/[._]/g, " "),
      email: credentials.email,
      initials: credentials.email.slice(0, 2).toUpperCase(),
    };
    const token = `mock-jwt-${Date.now()}`;

    localStorage.setItem("kc_session", JSON.stringify({ user, token }));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  /**
   * Mock signup — replace body with real Axios call when backend is ready.
   * POST /api/auth/signup → { user, token }
   */
  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState((s) => ({ ...s, isLoading: true }));
    await delay(1200); // Simulate network

    if (credentials.password !== credentials.confirmPassword) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error("Passwords do not match");
    }
    if (credentials.password.length < 8) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error("Password must be at least 8 characters");
    }

    const nameParts = credentials.name.trim().split(" ");
    const initials =
      nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts.at(-1)![0]}`.toUpperCase()
        : credentials.name.slice(0, 2).toUpperCase();

    const user: User = {
      id: `u_${Date.now()}`,
      name: credentials.name,
      email: credentials.email,
      initials,
      status: "online",
      lastSeen: new Date().toISOString(),
    };
    const token = `mock-jwt-${Date.now()}`;

    localStorage.setItem("kc_session", JSON.stringify({ user, token }));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("kc_session");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
