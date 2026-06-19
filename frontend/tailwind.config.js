/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush:  "#EBC8C8",
        sage:   "#A8B8A2",
        butter: "#F6E6A8",
        taupe:  "#C7B8A3",
        dusty:  "#AFC5D6",
        silver: "#D9D9D9",
        ivory:  "#FAF8F5",
      },
      fontFamily: {
        heading:  ["Cormorant Garamond", "serif"],
        body:     ["Poppins", "sans-serif"],
        script:   ["Parisienne", "cursive"],
      },
      animation: {
        "fade-up":    "fadeUp 0.8s ease forwards",
        "bloom":      "bloom 1.2s ease forwards",
        "float":      "float 6s ease-in-out infinite",
        "petal-fall": "petalFall 3s ease-in forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        bloom: {
          "0%":   { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        petalFall: {
          "0%":   { opacity: 1, transform: "translateY(-20px) rotate(0deg)" },
          "100%": { opacity: 0, transform: "translateY(200px) rotate(180deg)" },
        },
      },
    },
  },
  plugins: [],
};