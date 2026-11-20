import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { target: 'es2020', modulePreload: { polyfill: false }, assetsInlineLimit: 0, sourcemap: false },
});
