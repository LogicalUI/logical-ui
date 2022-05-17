import { tagWithDefault } from '@/_utils/props-type'
import { defineComponent, h, toRef } from 'vue'

const props = {
  Tag: tagWithDefault('div')
} as const
export const Box = defineComponent({
  name: 'Box',
  props,
  setup(props, { slots, attrs }) {
    // <props.Tag {...attrs}>{slots.default?.()}</props.Tag>
    return () => h(props.Tag, { ...attrs }, slots.default?.())
  }
})
