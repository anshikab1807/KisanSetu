/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#f0f9f1",
          100: "#dcf1de",
          200: "#bae3be",
          300: "#8ecd95",
          400: "#5fb06a",
          500: "#4f7942",
          600: "#3a5a31",
          700: "#2f4728",
          800: "#273921",
          900: "#22301d",
        },
        yellow: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#f9a826",
          600: "#ffb300",
          700: "#ffa000",
          800: "#ff8f00",
          900: "#ff6f00",
        },
        orange: {
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(31, 38, 135, 0.1)",
        cardHover: "0 12px 48px rgba(31, 38, 135, 0.15)",
        button: "0 4px 12px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeInDelay: "fadeIn 0.5s ease-out forwards 0.2s",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
