import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external connections for Docker
    proxy: {
      '/api': {
        target: 'http://backend:8000', // Use Docker service name
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 300000, // 5 minutes timeout for Ollama inference
      }
    }
  }
});
