import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  plugins: [vue(), vueJsx()],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    rollupOptions: {
      input: ['./index.ts'],
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.esm.js'
        },
        // umd
        {
          format: 'umd',
          entryFileNames: 'index.umd.js',
          globals: {
            vue: 'Vue'
          }
        }
      ]
    }
  }
})
