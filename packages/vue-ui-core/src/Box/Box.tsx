import { tagWithDefault } from '@/_utils/props-type'
import { defineComponent } from 'vue'

const props = {
  Tag: tagWithDefault('div')
} as const
export const Box = defineComponent({
  name: 'Box',
  props,
  setup(props, { slots, attrs }) {
    return () => <props.Tag {...attrs}>{slots.default?.()}</props.Tag>
  }
})
