import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SignupCredentials } from "../types/chat";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupCredentials>({ mode: "onBlur" });

  const password = watch("password");

  const onSubmit = async (data: SignupCredentials) => {
    setApiError(null);
    try {
      await signup(data);
      navigate("/chat", { replace: true });
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-jade/6 blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass rounded-3xl p-8 shadow-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-jade/15 border border-jade/30 flex items-center justify-center mx-auto mb-5">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="text-jade"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-800 text-white mb-1">
              Create account
            </h1>
            <p className="text-sm text-slate-400">
              Join KafkaChat and start messaging
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="name"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                className={`input-base ${errors.name ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
              />
              {errors.name && <FieldError message={errors.name.message!} />}
            </div>

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
                placeholder="jane@example.com"
                className={`input-base ${errors.email ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <FieldError message={errors.email.message!} />}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                className={`input-base ${errors.password ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Include uppercase, lowercase, and a number",
                  },
                })}
              />
              {errors.password && (
                <FieldError message={errors.password.message!} />
              )}

              {/* Password strength hint */}
              {password && <PasswordStrength password={password} />}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-slate-300"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`input-base ${errors.confirmPassword ? "border-ember/60 focus:ring-ember/40" : ""}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <FieldError message={errors.confirmPassword.message!} />
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2 mt-2 !bg-jade/80 hover:!bg-jade/60 !shadow-none"
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-slate-600 mt-4">
            By signing up you agree to our{" "}
            <button className="text-slate-400 hover:text-white underline transition-colors">
              Terms
            </button>{" "}
            and{" "}
            <button className="text-slate-400 hover:text-white underline transition-colors">
              Privacy Policy
            </button>
          </p>

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-surface-border text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent hover:text-accent-glow font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Field error helper ────────────────────────────────────────────────────────
function FieldError({ message }: { message: string }) {
  return (
    <p className="text-xs text-ember flex items-center gap-1 mt-1">
      <svg
        className="w-3.5 h-3.5 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}

// ─── Password strength indicator ──────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-ember", "bg-yellow-400", "bg-jade/70", "bg-jade"];
  const textColors = [
    "text-ember",
    "text-yellow-400",
    "text-jade/80",
    "text-jade",
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score - 1] : "bg-surface-border"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs ${textColors[score - 1]}`}>
          {labels[score - 1]} password
        </p>
      )}
    </div>
  );
}
