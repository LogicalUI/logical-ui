import type { PropType } from 'vue';
declare type HTMLTagName = keyof HTMLElementTagNameMap;
export declare const tagWithDefault: (defaultTag: HTMLTagName) => {
    type: PropType<keyof HTMLElementTagNameMap>;
    default: keyof HTMLElementTagNameMap;
};
export {};
