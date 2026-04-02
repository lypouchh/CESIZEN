import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Ajoute ça

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Et ça
  ],
  server: {
    host: true, // Permet d'accéder au serveur depuis d'autres appareils sur le réseau local (e.g. téléphone)
    port: 5173, // Port par défaut de Vite
  },
})