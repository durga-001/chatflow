import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginCredentials } from "../types/chat";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect back to the page they tried to access, or /chat
  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/chat";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({ mode: "onBlur" });

  const onSubmit = async (data: LoginCredentials) => {
    setApiError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-jade/6 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-card">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="w-16 h-16 mx-auto mb-5">
              <img
                src="/favicon.svg"
                alt="ChatFlow Logo"
                className="w-full h-full"
              />
            </div>
            <h1 className="font-display text-2xl font-800 text-white mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to your KafkaChat account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`input-base ${errors.email ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-ember flex items-center gap-1 mt-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium text-slate-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-accent hover:text-accent-glow transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input-base ${errors.password ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-ember flex items-center gap-1 mt-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="flex items-center gap-2 bg-ember/10 border border-ember/30 rounded-xl px-4 py-3 animate-fade-in">
                <svg
                  className="w-4 h-4 text-ember flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-ember">{apiError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-surface-border" />
            <span className="text-xs text-slate-600">OR</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          {/* Demo hint */}
          <div className="bg-accent/8 border border-accent/20 rounded-xl px-4 py-3 text-center mb-6">
            <p className="text-xs text-slate-400">
              <span className="text-accent font-medium">Demo mode</span> — enter
              any email & password (6+ chars) to log in
            </p>
          </div>

          {/* Signup link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent hover:text-accent-glow font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
