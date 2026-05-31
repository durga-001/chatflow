import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

/**
 * Thin top navbar used primarily on mobile.
 * On desktop the sidebar serves as the primary nav.
 */
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface md:hidden">
      {/* Brand */}
      <Link to="/chat" className="flex items-center gap-2">
        <div className="w-16 h-16 mx-auto mb-5">
          <img
            src="/favicon.svg"
            alt="ChatFlow Logo"
            className="w-full h-full"
          />
        </div>
        <span className="font-display font-700 text-sm text-white">
          ChatFlow
        </span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-semibold text-accent-glow font-display">
              {user.initials}
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-ember transition-colors"
              title="Sign out"
            >
              <svg
                className="w-4 h-4"
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
        )}
      </div>
    </nav>
  );
}
