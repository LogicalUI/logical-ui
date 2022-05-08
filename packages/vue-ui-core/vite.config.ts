import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  root: '.',
  plugins: [vue(), vueJsx()],
  build: {
    target: 'modules',
    rollupOptions: {
      input: 'src/index.ts',
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.mjs'
        },
        {
          format: 'cjs',
          entryFileNames: 'index.js'
        }
      ]
    }
  }
})
