import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativ: merge pe GitHub Pages indiferent de numele repo-ului
export default defineConfig({
  plugins: [react()],
  base: './',
})
