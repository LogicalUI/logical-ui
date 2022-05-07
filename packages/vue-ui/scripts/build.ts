import { readdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { build as viteBuild, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// banners
const banners = {
  es: '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;69;204;155mi\x1B[39m\x1B[38;2;72;197;164ml\x1B[39m\x1B[38;2;75;190;173md\x1B[39m\x1B[38;2;77;183;182mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m\x1B[38;2;83;169;201mg\x1B[39m \x1B[38;2;86;161;210mE\x1B[39m\x1B[38;2;89;154;219mS\x1B[39m\x1B[38;2;92;147;228mM\x1B[39m \x1B[38;2;94;140;237m.\x1B[39m\x1B[38;2;97;133;246m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  umd: '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;69;204;155mi\x1B[39m\x1B[38;2;72;197;164ml\x1B[39m\x1B[38;2;75;190;173md\x1B[39m\x1B[38;2;77;183;182mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m\x1B[38;2;83;169;201mg\x1B[39m \x1B[38;2;86;161;210mU\x1B[39m\x1B[38;2;89;154;219mM\x1B[39m\x1B[38;2;92;147;228mD\x1B[39m \x1B[38;2;94;140;237m.\x1B[39m\x1B[38;2;97;133;246m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  esmIndex:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;68;207;151ml\x1B[39m\x1B[38;2;69;203;156md\x1B[39m\x1B[38;2;71;199;161mi\x1B[39m\x1B[38;2;72;196;166mn\x1B[39m\x1B[38;2;74;192;171mg\x1B[39m \x1B[38;2;75;188;176mm\x1B[39m\x1B[38;2;77;184;181ma\x1B[39m\x1B[38;2;78;180;186mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m \x1B[38;2;81;172;196mf\x1B[39m\x1B[38;2;83;169;201mi\x1B[39m\x1B[38;2;85;165;205ml\x1B[39m\x1B[38;2;86;161;210me\x1B[39m \x1B[38;2;88;157;215mf\x1B[39m\x1B[38;2;89;153;220mo\x1B[39m\x1B[38;2;91;149;225mr\x1B[39m \x1B[38;2;92;145;230mE\x1B[39m\x1B[38;2;94;141;235mS\x1B[39m\x1B[38;2;95;138;240mM\x1B[39m \x1B[38;2;97;134;245m.\x1B[39m\x1B[38;2;98;130;250m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  index:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;68;206;153ml\x1B[39m\x1B[38;2;70;200;160md\x1B[39m\x1B[38;2;72;195;166mi\x1B[39m\x1B[38;2;75;190;173mn\x1B[39m\x1B[38;2;77;184;180mg\x1B[39m \x1B[38;2;79;179;187mi\x1B[39m\x1B[38;2;81;174;194mn\x1B[39m\x1B[38;2;83;169;201md\x1B[39m\x1B[38;2;85;163;207me\x1B[39m\x1B[38;2;87;158;214mx\x1B[39m\x1B[38;2;89;153;221m.\x1B[39m\x1B[38;2;92;147;228mt\x1B[39m\x1B[38;2;94;142;235ms\x1B[39m \x1B[38;2;96;137;241m.\x1B[39m\x1B[38;2;98;131;248m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  nuxt3Index:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;66;211;146ml\x1B[39m\x1B[38;2;68;207;151md\x1B[39m\x1B[38;2;69;203;156mi\x1B[39m\x1B[38;2;71;199;161mn\x1B[39m\x1B[38;2;72;196;166mg\x1B[39m \x1B[38;2;74;192;171mN\x1B[39m\x1B[38;2;75;188;176mu\x1B[39m\x1B[38;2;77;184;181mx\x1B[39m\x1B[38;2;78;180;186mt\x1B[39m\x1B[38;2;80;176;191m3\x1B[39m \x1B[38;2;81;172;196mA\x1B[39m\x1B[38;2;83;169;201mu\x1B[39m\x1B[38;2;85;165;205mt\x1B[39m\x1B[38;2;86;161;210mo\x1B[39m\x1B[38;2;88;157;215mI\x1B[39m\x1B[38;2;89;153;220mm\x1B[39m\x1B[38;2;91;149;225mp\x1B[39m\x1B[38;2;92;145;230mo\x1B[39m\x1B[38;2;94;141;235mr\x1B[39m\x1B[38;2;95;138;240mt\x1B[39m \x1B[38;2;97;134;245m.\x1B[39m\x1B[38;2;98;130;250m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m'
}

const compNames = readdirSync(resolve('components'))

// 获取 esm 组件入口配置
const getEsmInputFiles = () =>
  compNames.map((compName) => resolve(`./components/${compName}/${compName}.ts`))

// 创建 esm 格式下的 index.js
const buildEsmIndex = () => {
  console.log(banners.esmIndex)
  let codeStr = ''

  for (const compName of compNames) {
    codeStr += `export * from './components/${compName}.js'\n`
  }

  writeFileSync(resolve('lib/es/index.js'), codeStr, { encoding: 'utf8' })
}

const buildEsmNuxt3Index = () => {
  console.log(banners.nuxt3Index)

  const codeStr = `import { defineNuxtModule } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'

export default defineNuxtModule({
  hooks: {
    'components:dirs'(dirs) {
      dirs.push({
        path: fileURLToPath(new URL('./components', import.meta.url)),
        prefix: 'L'
      })
    }
  }
})`

  writeFileSync(resolve('lib/es/nuxt.mjs'), codeStr, { encoding: 'utf8' })
}

const createIndex = () => {
  console.log(banners.index)
  let codeStr = ''

  for (const compName of compNames) {
    codeStr += `export * from './components/${compName}/${compName}'\n`
  }

  writeFileSync(resolve('./index.ts'), codeStr, { encoding: 'utf8' })
}

// 打包 umd.js 和 分组件的 esm 文件
const buildLib = async (format: 'es' | 'umd') => {
  console.log(banners[format])

  await viteBuild(
    defineConfig({
      root: resolve('.'),
      plugins: [vue(), vueJsx()],
      build: {
        target: 'es2020',
        minify: true,
        rollupOptions: {
          input: format === 'umd' ? resolve('index.ts') : getEsmInputFiles(),
          // 确保外部化处理那些你不想打包进库的依赖
          external: ['vue'],
          output: {
            format,
            dir: resolve('.'),
            entryFileNames:
              format === 'umd'
                ? `lib/umd/index.js`
                : `lib/${format}/components/[name].js`,
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }) as UserConfig
  )
}

;(async () => {
  createIndex()
  await buildLib('es')
  buildEsmIndex()
  buildEsmNuxt3Index()
  await buildLib('umd')
})()
