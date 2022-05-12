import { defineComponent, createVNode, resolveDynamicComponent } from 'vue'

export default defineComponent({
  name: 'LCIcon',
  setup(_, { slots }) {
    return () => <button>123</button>
  }
})
