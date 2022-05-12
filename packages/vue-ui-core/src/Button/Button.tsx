import { defineComponent } from 'vue'
import { tagWithDefault } from '@/_utils/props-type'
import Box from '../Box'

const props = {
  Tag: tagWithDefault('button')
} as const

export const Button = defineComponent({
  name: 'Button',
  props,
  setup(props, { slots, attrs }) {
    return () => <Box Tag={props.Tag} {...attrs} v-slots={slots} />
  }
})
