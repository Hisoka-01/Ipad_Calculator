import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for the src folder
    },
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'), // Add this line to reference PostCSS config
  },
})
