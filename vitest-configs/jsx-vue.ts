/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  test: {
    include: ['**/vue-*/**/*.{test,spec}.{js,ts,tsx}'],
    environment: 'jsdom',
    coverage: {
      reportsDirectory: './coverage/vue'
    }
  },
  plugins: [vue(), vueJsx()]
})
