import type { DefineComponent, PropType, VNode, RendererNode, RendererElement, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
export declare const Button: DefineComponent<{
    readonly Tag: {
        type: PropType<keyof HTMLElementTagNameMap>;
        default: keyof HTMLElementTagNameMap;
    };
}, () => VNode<RendererNode, RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, Record<string, any>, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{
    readonly Tag: {
        type: PropType<keyof HTMLElementTagNameMap>;
        default: keyof HTMLElementTagNameMap;
    };
}>>, {
    Tag: keyof HTMLElementTagNameMap;
}>;
