/// <reference types="vitest/config" />
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// Relative base so the build works under https://<user>.github.io/heline-bday-quiz/
export default defineConfig({
  base: './',
  plugins: [preact()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
