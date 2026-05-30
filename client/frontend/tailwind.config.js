/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        display: ['"Syne"', "sans-serif"],
      },
      colors: {
        // Deep space dark theme
        void: {
          DEFAULT: "#09090f",
          50: "#0d0d17",
          100: "#11111e",
          200: "#16162a",
          300: "#1c1c34",
        },
        surface: {
          DEFAULT: "#13131f",
          light: "#1a1a2e",
          card: "#1e1e30",
          border: "#2a2a42",
        },
        accent: {
          DEFAULT: "#7c6aff",
          dim: "#5b4fd4",
          glow: "#9d8fff",
          muted: "#4a3fbf",
        },
        ember: { DEFAULT: "#ff6b6b", dim: "#cc4444" },
        jade: { DEFAULT: "#4fffb0", dim: "#2dd68a" },
        slate: { 400: "#8b8ba7", 500: "#6b6b8a", 600: "#4a4a66" },
      },
      boxShadow: {
        "accent-glow": "0 0 20px rgba(124, 106, 255, 0.35)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        message: "0 2px 8px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        mesh: "radial-gradient(at 40% 20%, rgba(124,106,255,0.15) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(79,255,176,0.08) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slideRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-dot": "bounceDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
