import { defineComponent, h } from 'vue'
import { tagWithDefault } from '@/_utils/props-type'
import Box from '../Box'

const props = {
  Tag: tagWithDefault('button')
} as const

export const Button = defineComponent({
  name: 'LButton',
  props,
  setup(props, { slots, attrs }) {
    return () => h(Box, { Tag: props.Tag, ...attrs }, slots)
  }
})
