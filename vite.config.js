import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces (accessible via local IP)
    port: 5173, // You can specify any port here (5173 is default)
    strictPort: true, // Ensures Vite will always use the specified port (no fallback)
  },
});
