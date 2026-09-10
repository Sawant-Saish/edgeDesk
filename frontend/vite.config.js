import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8900',
        changeOrigin: true,
      },
    },
  },
});
