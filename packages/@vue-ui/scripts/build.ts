import { existsSync, readdirSync, rmSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import chokidar from 'chokidar'
import minimist from 'minimist'
import { build as viteBuild, type UserConfig } from 'vite'
import { defineConfig } from 'vite'
import baseConfig from '../vite.base.config'
import dts from 'vite-plugin-dts'

let watchMode = false

// banners
const banners: { [key: string]: string } = {
  es: '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;69;204;155mi\x1B[39m\x1B[38;2;72;197;164ml\x1B[39m\x1B[38;2;75;190;173md\x1B[39m\x1B[38;2;77;183;182mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m\x1B[38;2;83;169;201mg\x1B[39m \x1B[38;2;86;161;210mE\x1B[39m\x1B[38;2;89;154;219mS\x1B[39m\x1B[38;2;92;147;228mM\x1B[39m \x1B[38;2;94;140;237m.\x1B[39m\x1B[38;2;97;133;246m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  umd: '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;69;204;155mi\x1B[39m\x1B[38;2;72;197;164ml\x1B[39m\x1B[38;2;75;190;173md\x1B[39m\x1B[38;2;77;183;182mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m\x1B[38;2;83;169;201mg\x1B[39m \x1B[38;2;86;161;210mU\x1B[39m\x1B[38;2;89;154;219mM\x1B[39m\x1B[38;2;92;147;228mD\x1B[39m \x1B[38;2;94;140;237m.\x1B[39m\x1B[38;2;97;133;246m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  cjs: '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;69;204;155mi\x1B[39m\x1B[38;2;72;197;164ml\x1B[39m\x1B[38;2;75;190;173md\x1B[39m\x1B[38;2;77;183;182mi\x1B[39m\x1B[38;2;80;176;191mn\x1B[39m\x1B[38;2;83;169;201mg\x1B[39m \x1B[38;2;86;161;210mc\x1B[39m\x1B[38;2;89;154;219mj\x1B[39m\x1B[38;2;92;147;228ms\x1B[39m \x1B[38;2;94;140;237m.\x1B[39m\x1B[38;2;97;133;246m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  createComponents:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;68;207;151ml\x1B[39m\x1B[38;2;69;203;156md\x1B[39m\x1B[38;2;71;199;162mi\x1B[39m\x1B[38;2;72;195;167mn\x1B[39m\x1B[38;2;74;191;172mg\x1B[39m \x1B[38;2;76;187;177mc\x1B[39m\x1B[38;2;77;183;182mo\x1B[39m\x1B[38;2;79;179;188mm\x1B[39m\x1B[38;2;81;175;193mp\x1B[39m\x1B[38;2;82;171;198mo\x1B[39m\x1B[38;2;84;166;203mn\x1B[39m\x1B[38;2;85;162;208me\x1B[39m\x1B[38;2;87;158;213mn\x1B[39m\x1B[38;2;89;154;219mt\x1B[39m\x1B[38;2;90;150;224ms\x1B[39m\x1B[38;2;92;146;229m.\x1B[39m\x1B[38;2;94;142;234mt\x1B[39m\x1B[38;2;95;138;239ms\x1B[39m \x1B[38;2;97;134;245m.\x1B[39m\x1B[38;2;98;130;250m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  createIndex:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;68;206;153ml\x1B[39m\x1B[38;2;70;200;160md\x1B[39m\x1B[38;2;72;195;166mi\x1B[39m\x1B[38;2;75;190;173mn\x1B[39m\x1B[38;2;77;184;180mg\x1B[39m \x1B[38;2;79;179;187mi\x1B[39m\x1B[38;2;81;174;194mn\x1B[39m\x1B[38;2;83;169;201md\x1B[39m\x1B[38;2;85;163;207me\x1B[39m\x1B[38;2;87;158;214mx\x1B[39m\x1B[38;2;89;153;221m.\x1B[39m\x1B[38;2;92;147;228mt\x1B[39m\x1B[38;2;94;142;235ms\x1B[39m \x1B[38;2;96;137;241m.\x1B[39m\x1B[38;2;98;131;248m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m',
  createNuxt3Index:
    '\x1B[38;2;66;211;146mB\x1B[39m\x1B[38;2;66;211;146mu\x1B[39m\x1B[38;2;66;211;146mi\x1B[39m\x1B[38;2;66;211;146ml\x1B[39m\x1B[38;2;68;207;151md\x1B[39m\x1B[38;2;69;203;156mi\x1B[39m\x1B[38;2;71;199;161mn\x1B[39m\x1B[38;2;72;196;166mg\x1B[39m \x1B[38;2;74;192;171mN\x1B[39m\x1B[38;2;75;188;176mu\x1B[39m\x1B[38;2;77;184;181mx\x1B[39m\x1B[38;2;78;180;186mt\x1B[39m\x1B[38;2;80;176;191m3\x1B[39m \x1B[38;2;81;172;196mA\x1B[39m\x1B[38;2;83;169;201mu\x1B[39m\x1B[38;2;85;165;205mt\x1B[39m\x1B[38;2;86;161;210mo\x1B[39m\x1B[38;2;88;157;215mI\x1B[39m\x1B[38;2;89;153;220mm\x1B[39m\x1B[38;2;91;149;225mp\x1B[39m\x1B[38;2;92;145;230mo\x1B[39m\x1B[38;2;94;141;235mr\x1B[39m\x1B[38;2;95;138;240mt\x1B[39m \x1B[38;2;97;134;245m.\x1B[39m\x1B[38;2;98;130;250m.\x1B[39m\x1B[38;2;100;126;255m.\x1B[39m'
}

// 删除打包出来的文件夹
function removeDirSync(dir: string) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true })
  }
}
removeDirSync(resolve('esm'))
removeDirSync(resolve('lib'))
removeDirSync(resolve('dist'))

const compNames = readdirSync(resolve('src/components'))

// 创建 components.ts
const createComponentsFile = () => {
  watchMode || console.log(banners.createComponents)
  let importStr = ``
  let componentsStr = '\nconst components = [\n'

  for (const compName of compNames) {
    importStr +=
      `import { ${compName} } from './components/${compName}'\n` +
      `export * from './components/${compName}'\n`
    componentsStr += `    ${compName},\n`
  }
  componentsStr.slice(0, -2)
  componentsStr += `]\n`
  writeFileSync(
    resolve('src/components.ts'),
    importStr + componentsStr + 'export default components',
    {
      encoding: 'utf8'
    }
  )
}

// 创建 index.ts
const createIndex = () => {
  watchMode || console.log(banners.createIndex)

  const codeStr = `import type { App } from 'vue'
import comps from './components'
export * from './components'

export default {
  install(app: App) {
    for (const compName in comps) {
      const Comp = comps[compName]
      if (Comp.install)
        app.use(Comp)
    }
    return app
  }
}`

  writeFileSync(resolve('src/index.ts'), codeStr, { encoding: 'utf8' })
}

// 创建 nuxt3 自动导入文件
const buildEsmNuxt3Index = () => {
  watchMode || console.log(banners.createNuxt3Index)

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

  writeFileSync(resolve('esm/nuxt.mjs'), codeStr, { encoding: 'utf8' })
}

// 打包
const buildLib = async (format: 'es' | 'cjs' | 'umd') => {
  watchMode || console.log(banners[format])

  const isEsm = format === 'es'
  const isUmd = format === 'umd'

  const outDirs = {
    es: resolve('esm'),
    cjs: resolve('lib'),
    umd: resolve('dist')
  }

  const fileEntry = resolve('src/index.ts')

  const plugins = baseConfig.plugins
  if (!watchMode && isEsm) {
    plugins!.push(
      dts({
        entryRoot: resolve('src'),
        outputDir: resolve('esm'),
        staticImport: true
      })
    )
  }

  await viteBuild(
    defineConfig({
      ...baseConfig,
      build: {
        target: 'modules',
        emptyOutDir: false,
        minify: isUmd,
        lib: {
          name: 'logical-ui-vue',
          entry: fileEntry
        },
        rollupOptions: {
          input: fileEntry,
          // 确保外部化处理那些你不想打包进库的依赖
          external: ['vue'],
          output: [
            {
              format,
              exports: 'named',
              dir: outDirs[format],
              entryFileNames: `[name]${isUmd ? '.full' : ''}.${
                isEsm ? 'mjs' : 'js'
              }`,
              ...(isUmd
                ? {}
                : { preserveModules: true, preserveModulesRoot: resolve('src') }),
              globals: {
                vue: 'Vue'
              }
            }
          ]
        }
      }
    }) as UserConfig
  )
}

let buildTimes = 0

async function build(logStr?: string) {
  buildTimes += 1
  const timeFlag = `built in${buildTimes > 1 ? ` (x${buildTimes} times)` : ''}`
  watchMode && console.clear()
  logStr && console.log(logStr)
  console.time(timeFlag)
  createComponentsFile()
  createIndex()
  watchMode || (await buildLib('cjs'))
  watchMode || (await buildLib('umd'))
  await buildLib('es')
  buildEsmNuxt3Index()
  console.timeEnd(timeFlag)
}

function dev() {
  watchMode = false
  const watchTip = () =>
    console.log(
      '\x1B[38;2;73;188;246mW\x1B[39m\x1B[38;2;73;188;246ma\x1B[39m\x1B[38;2;73;188;246mt\x1B[39m\x1B[38;2;73;188;246mc\x1B[39m\x1B[38;2;73;188;246mh\x1B[39m \x1B[38;2;73;188;246mB\x1B[39m\x1B[38;2;73;188;246mu\x1B[39m\x1B[38;2;73;188;246mi\x1B[39m\x1B[38;2;73;188;246ml\x1B[39m\x1B[38;2;73;188;246md\x1B[39m\x1B[38;2;73;188;246mi\x1B[39m\x1B[38;2;73;188;246mn\x1B[39m\x1B[38;2;73;188;246mg\x1B[39m \x1B[38;2;73;188;246m.\x1B[39m\x1B[38;2;73;188;246m.\x1B[39m\x1B[38;2;73;188;246m.\x1B[39m'
    )
  chokidar
    .watch(resolve('src'), {
      ignored: [resolve('src/index.ts'), resolve('src/components.ts')]
    })
    .on('ready', async () => {
      await build()
      watchMode = true
      watchTip()
    })
    .on('change', async (path) => {
      await build(
        `\x1B[38;2;73;188;246mu\x1B[39m\x1B[38;2;73;188;246mp\x1B[39m\x1B[38;2;73;188;246md\x1B[39m\x1B[38;2;73;188;246ma\x1B[39m\x1B[38;2;73;188;246mt\x1B[39m\x1B[38;2;73;188;246me\x1B[39m ${path}`
      )
      watchTip()
    })
}

function run() {
  const args = minimist(process.argv.slice(2))
  watchMode = args.watch || false
  watchMode ? dev() : build()
}

export default run()
