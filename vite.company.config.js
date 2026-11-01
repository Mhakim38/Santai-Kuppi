import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Separate build for the private /company/ page. Org data is NOT bundled:
// it is fetched at runtime from ./organisation.json (kept out of git).
export default defineConfig({
  root: 'company',
  base: '/company/',
  publicDir: false,
  plugins: [vue()],
  build: {
    outDir: '../dist/company',
    emptyOutDir: false,
  },
})
