/// <reference types="vitest" />
import { defineConfig } from 'vite'
import baseConfig from './vite.base.config'

export default defineConfig({
  test: {
    include: ['**/vue-*/**/*.{test,spec}.{js,ts,tsx}'],
    environment: 'jsdom',
    coverage: {
      reportsDirectory: '../../coverage/vue-ui'
    }
  },
  ...baseConfig
})
