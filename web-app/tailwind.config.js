 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 🌱 AgroHub Brand Colors
        primary: {
          DEFAULT: "#16a34a", // hijau utama (pertanian)
          foreground: "#ffffff",
        },

        secondary: {
          DEFAULT: "#facc15", // kuning panen/pupuk
          foreground: "#000000",
        },

        success: {
          DEFAULT: "#22c55e",
        },

        warning: {
          DEFAULT: "#f59e0b",
        },

        danger: {
          DEFAULT: "#ef4444",
        },

        earth: {
          light: "#f5f5f4",
          DEFAULT: "#a16207",
          dark: "#3f3f46",
        },
      },

      // 🎬 Animation system
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },

        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },

        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },

        slideUp: {
          from: { transform: "translateY(10px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      },

      // 🧠 Typography system
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      // 📐 Spacing system (biar UI konsisten kayak marketplace besar)
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      // 📦 Border radius system
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      // 🌫 Shadow system (UI modern marketplace)
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.05)",
        medium: "0 6px 20px rgba(0,0,0,0.08)",
        strong: "0 10px 30px rgba(0,0,0,0.12)",
      },
    },
  },

  plugins: [],
};