import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // This will suppress dependency deprecation warnings
      },
    },
  },
  define: {
    'process.env': process.env,
  },
});
