import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    manifest: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    }
  }
})
