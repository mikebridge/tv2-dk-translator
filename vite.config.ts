import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background.ts',
        content: 'src/content.ts'
      },
      output: {
        format: 'esm',
        entryFileNames: 'assets/[name].js'
      }
    }
  }
})
