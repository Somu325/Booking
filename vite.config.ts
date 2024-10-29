import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expose the server to external connections
    port: 5173,        // Use the default Vite port
    strictPort: true,  // Ensures Vite uses the specified port
  },
})
