import type { App } from 'vue'
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
}