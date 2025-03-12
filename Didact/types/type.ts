export enum ElementType {
  TEXT_ELEMENT = "TEXT_ELEMENT",
  ROOT = "ROOT",
}

// ELEMENTS
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

export function isTextElement(
  element: DidactElement | TextElement
): element is TextElement {
  return (element as TextElement).type === ElementType.TEXT_ELEMENT;
}

// FIBERS
export type FiberBase = {
  dom: HTMLElement | Text | null;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
};

export type FiberWithElement<T> = T & FiberBase;
export type DidactElementFiber = FiberWithElement<DidactElement>;
export type TextElementFiber = FiberWithElement<TextElement>;

export type FiberRoot = {
  type: ElementType.ROOT;
  props: { children: (DidactElement | TextElement)[] };
} & FiberBase;

export type Fiber = FiberRoot | DidactElementFiber | TextElementFiber;

export function isDidactElementFiber(
  fiber: Fiber
): fiber is DidactElementFiber {
  return "children" in fiber.props;
}
