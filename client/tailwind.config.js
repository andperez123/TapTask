/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // TapTask "Electric Focus" Theme
        background: "#050505",
        foreground: "#FFFFFF",
        
        // Purple Glow System
        primary: {
          DEFAULT: "#A020FF",
          light: "#C632FF",
          dark: "#7B2DFF",
          glow: "rgba(160, 32, 255, 0.6)",
        },
        
        // Accent Colors
        accent: {
          purple: "#A020FF",
          pink: "#C632FF",
          success: "#52FF8B",
        },
        
        // Neutral Grays
        card: {
          DEFAULT: "#1A1A1A",
          light: "#2A2A2A",
        },
        
        // Legacy support
        border: "#2A2A2A",
        input: "#1A1A1A",
        ring: "#A020FF",
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#999999",
        },
        destructive: {
          DEFAULT: "#FF4444",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'glow': '0 0 14px rgba(160, 32, 255, 0.6)',
        'glow-lg': '0 0 24px rgba(160, 32, 255, 0.8)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px #A020FF',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(90deg, #7B2DFF, #C632FF)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 14px rgba(160, 32, 255, 0.6)" },
          "50%": { boxShadow: "0 0 24px rgba(160, 32, 255, 1)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "check-flip": {
          "0%": { transform: "scale(0) rotate(-45deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "ripple": "ripple 0.6s ease-out",
        "check-flip": "check-flip 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}