import { defineConfig, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const createOutputConfig = (format: 'es' | 'cjs') => ({
  format,
  dir: resolve(`lib/${format}`),
  exports: 'named' as 'named',
  entryFileNames: `[name].${format === 'es' ? 'mjs' : 'js'}`,
  preserveModules: true,
  preserveModulesRoot: resolve('src')
})

// @ts-ignore
export default defineConfig((env: ConfigEnv) => ({
  root: '.',
  plugins: [
    vue(),
    dts({
      entryRoot: resolve('src'),
      outputDir: resolve('types'),
      staticImport: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2019',
    outDir: resolve('lib'),
    minify: false,
    emptyOutDir: true,
    lib: {
      name: 'logical-ui-vue-core',
      entry: 'src/index.ts'
    },
    rollupOptions: {
      input: 'src/index.ts',
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: [
        createOutputConfig('es'),
        ...(env.mode === 'dev' ? [] : [createOutputConfig('cjs')])
      ]
    }
  }
}))
