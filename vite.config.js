import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    watch: {
      // Raw Figma exports live here; watching them locks files and crashes the dev server.
      ignored: ['**/Design PNG/**'],
    },
  },
})
