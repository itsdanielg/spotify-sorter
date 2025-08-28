/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { fade: "fadeOut 0.5s 2.6s", linkFade: "fadeIn 0.25s", snackbar: "fadeIn 0.5s, fadeOut 0.5s 4.6s" },
      keyframes: () => ({
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        fadeOut: { "0%": { opacity: 1 }, "100%": { opacity: 0 } }
      }),
      fontSize: { xxs: "0.625rem" }
    }
  },
  plugins: []
};
