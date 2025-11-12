import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Expose the server to external connections
    port: 5173,        // Use the default Vite port
    strictPort: true,  // Ensures Vite uses the specified port
    // Ignore files inside .git from the file watcher so Vite doesn't try to read
    // git object files for import analysis. This prevents binary files under
    // .git/objects from being picked up and parsed as JS.
    watch: {
      ignored: ['**/.git/**'],
    },
    // Disable the error overlay for HMR so binary parsing errors won't block
    // the browser while we investigate root causes. This is optional and
    // temporary — you can remove it once root cause is fixed.
    hmr: {
      overlay: false,
    },
  },
})
