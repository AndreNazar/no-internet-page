import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/no-internet-page/',
  build: {
    manifest: "manifest.json",
  }
})