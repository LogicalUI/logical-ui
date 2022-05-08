import type { App, Plugin } from 'vue'
const withInstall = <T extends { name: string }>(comp: T): Plugin => ({
  install(app: App): void {
    app.component(comp.name, comp)
  }
})

export default withInstall
