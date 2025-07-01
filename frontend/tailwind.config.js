/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulseCustom: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        notificacion: "pulseCustom 2s ease-in-out alternate infinite",
      },
    },
  },
  // Asegúrate de incluir los paths a tus archivos
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  plugins: [],
};
