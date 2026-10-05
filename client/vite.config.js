import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Le richieste a /api/... vengono girate dal dev server di Vite all'API Express.
    // Cosi nel codice React scriviamo solo fetch('/api/drinks'), senza indirizzo del server.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
