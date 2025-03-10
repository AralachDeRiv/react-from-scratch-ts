export type ReactElement<
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> = {
  type: T;
  props: Partial<Record<string, any>> & {
    children: (ReactElement | TextElement)[];
  };
};

export type TextElement = {
  type: "TEXT_ELEMENT";
  props: {
    nodeValue: string;
    // N'aura pas d'enfants dans ce cas ci
  };
};
