import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    eslint()
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
