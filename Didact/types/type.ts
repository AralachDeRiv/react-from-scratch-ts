export enum ElementType {
  TEXT_ELEMENT = "TEXT_ELEMENT",
}

export type DidactElement<
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> = {
  type: T;
  props: Partial<Record<string, any>> & {
    children: (DidactElement | TextElement)[];
  };
};

export type TextElement = {
  type: ElementType.TEXT_ELEMENT;
  props: {
    nodeValue: string;
    // N'aura pas d'enfants dans ce cas ci
  };
};

// TODO : be more precise with the children
export type UnitOfWork = {
  dom: HTMLElement;
  props: {
    children: any[];
  };
};
