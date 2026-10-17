import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/portfolio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})
