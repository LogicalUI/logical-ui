import { defineComponent, createVNode, resolveDynamicComponent } from 'vue'

export const Icon = defineComponent({
  name: 'LCIcon',
  setup(_, { slots }) {
    return () => <button>123</button>
  }
})
