import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.ELECTRON ? './' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      external: [
        'electron',
        'fsevents',
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').devDependencies || {}),
      ]
    },
  },
  optimizeDeps: {
    exclude: ['fsevents', 'electron']
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) 