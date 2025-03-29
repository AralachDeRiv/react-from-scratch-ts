// ENUMS
export enum ElementType {
  TEXT_ELEMENT = "TEXT_ELEMENT",
  ROOT = "ROOT",
}

export enum EffectTag {
  UPDATE = "UPDATE",
  PLACEMENT = "PLACEMENT",
  DELETION = "DELETION",
}

// ELEMENTS
export type DidactElement<
  T extends keyof HTMLElementTagNameMap | Function =
    | keyof HTMLElementTagNameMap
    | Function
> = {
  type: T;
  props: Partial<Record<string, any>> & {
    children: (DidactElement | TextElement)[];
    ref?: any;
  };
};

export type TextElement = {
  type: ElementType.TEXT_ELEMENT;
  props: {
    nodeValue?: string;
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
  alternate: Fiber | null;
  effectTag: EffectTag | null;
};

export type FiberWithElement<T> = T & FiberBase;
export type DidactElementFiber = FiberWithElement<DidactElement> & {
  hooks?: hook[];
};

export type TextElementFiber = FiberWithElement<TextElement>;

export type FiberRoot = FiberBase & {
  type: ElementType.ROOT;
  parent: null;
  props: { children: (DidactElement | TextElement)[] };
};

export type Fiber = FiberRoot | DidactElementFiber | TextElementFiber;

export function isDidactElementFiber(
  fiber: Fiber | null
): fiber is DidactElementFiber {
  return fiber !== null && "children" in fiber.props;
}

// HOOKS
export enum HookType {
  STATE = "state",
  EFFECT = "effect",
  REF = "ref",
  CONTEXT = "context",
}

export type StateHook = {
  type: HookType.STATE;
  state: any;
  queue: Function[];
};

export type RefHook = {
  type: HookType.REF;
  current: any;
};

export type EffectHook = {
  type: HookType.EFFECT;
  effect: () => void | (() => void);
  deps: any[];
  cleanup?: (() => void) | null;
};

export type ContextType<T> = {
  Provider: ({ value, children }: { value: T; children?: any }) => any;
  _currentValue: T;
};

export type ContextHook = {
  type: HookType.CONTEXT;
  state: any;
};

export type hook = StateHook | EffectHook | RefHook | ContextHook;
