import { defineConfig, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
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
    vueJsx(),
    dts({
      entryRoot: resolve('src'),
      outputDir: resolve(env.mode === 'dev' ? 'types' : 'lib/es'),
      staticImport: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'modules',
    outDir: resolve('lib'),
    minify: false,
    lib: {
      name: 'logical-ui-vue-core',
      entry: 'src/index.ts'
    },
    rollupOptions: {
      input: 'src/index.ts',
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: [createOutputConfig('es'), createOutputConfig('cjs')]
    }
  }
}))
