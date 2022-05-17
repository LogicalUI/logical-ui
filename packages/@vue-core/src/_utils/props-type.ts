import type { PropType } from 'vue'

type HTMLTagName = keyof HTMLElementTagNameMap
export const tagWithDefault = (defaultTag: HTMLTagName) => ({
  type: String as PropType<HTMLTagName>,
  default: defaultTag
})
