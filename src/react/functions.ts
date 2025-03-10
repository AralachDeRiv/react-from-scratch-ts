import { ReactElement, TextElement } from "./type";

export function createElement(
  type: keyof HTMLElementTagNameMap,
  props: Record<string, any> | null,
  children: (ReactElement | (string | number))[]
): ReactElement {
  const processedChildren = children.map((child) => {
    if (typeof child === "string" || typeof child === "number") {
      return createTextElement(child);
    }
    return child;
  });

  return {
    type,
    props: {
      ...props,
      children: processedChildren,
    },
  };
}

export function createTextElement(text: string | number): TextElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(text),
    },
  };
}
