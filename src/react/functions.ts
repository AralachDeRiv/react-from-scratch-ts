import { DidactElement, TextElement } from "./type";

function createElement(
  type: keyof HTMLElementTagNameMap,
  props: Record<string, any> | null,
  children: (DidactElement | (string | number))[]
): DidactElement {
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

function createTextElement(text: string | number): TextElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(text),
    },
  };
}

export const Didact = {
  createElement,
  createTextElement,
};
