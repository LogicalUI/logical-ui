import { defineComponent, createVNode, resolveDynamicComponent } from 'vue'

export default defineComponent({
  name: 'LCButton',
  setup(_, { slots }) {
    return () => (
      <button>
        {slots
          .default?.()
          .map((it) => createVNode(resolveDynamicComponent(it), { arisx: '123' }))}
      </button>
    )
  }
})
