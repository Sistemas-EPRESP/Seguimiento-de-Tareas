import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite que Vite sea accesible desde otras máquinas
    port: 5173,       // Usa el puerto 5173
  },
})
