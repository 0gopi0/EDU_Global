import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,

    // Proxying keeps the API same-origin in development. That means no CORS
    // configuration and no `sameSite=None` for the httpOnly session cookie.
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      // Cover images are served by Express, so they need proxying too.
      // Forgetting this is why uploaded images 404 in dev.
      '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})
