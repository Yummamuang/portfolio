import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/portfolio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        loops: resolve(import.meta.dirname, 'writing/loop-engineering.html'),
        agents: resolve(import.meta.dirname, 'writing/agent-workflow.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
})
