import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        ink: {
          950: "#05060A",
          900: "#0A0C14",
          800: "#10121C",
          700: "#171A26",
          600: "#1F2230"
        },
        // Risk colors
        safe: { DEFAULT: "#10B981", soft: "#10B98122" },
        suspicious: { DEFAULT: "#F59E0B", soft: "#F59E0B22" },
        warning: { DEFAULT: "#F97316", soft: "#F9731622" },
        critical: { DEFAULT: "#EF4444", soft: "#EF444422" },
        privacy: { DEFAULT: "#3B82F6", soft: "#3B82F622" },
        premium: { DEFAULT: "#A78BFA", soft: "#A78BFA22" }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.5)",
        "glow-critical": "0 0 0 1px rgba(239,68,68,0.4), 0 0 80px -10px rgba(239,68,68,0.4)",
        "glow-safe": "0 0 0 1px rgba(16,185,129,0.4), 0 0 80px -10px rgba(16,185,129,0.4)",
        "glow-privacy": "0 0 0 1px rgba(59,130,246,0.4), 0 0 80px -10px rgba(59,130,246,0.4)"
      },
      backgroundImage: {
        "premium-gradient": "radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(167,139,250,0.12), transparent 60%), linear-gradient(180deg, #05060A 0%, #0A0C14 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite"
      }
    }
  },
  plugins: []
};

export default config;
