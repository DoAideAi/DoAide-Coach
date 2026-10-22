import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React rarely changes between deploys; a separate chunk stays cached.
        manualChunks: { vendor: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  server: {
    port: 3104,
    proxy: { '/api': 'http://localhost:3103' },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: { include: ['src/**/*.{js,jsx}'], exclude: ['src/test/**', 'src/main.jsx'] },
  },
})
