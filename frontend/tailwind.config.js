/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 12px 30px rgba(6, 12, 20, 0.45)",
        soft: "0 6px 18px rgba(6, 12, 20, 0.35)"
      }
    }
  },
  plugins: []
};
