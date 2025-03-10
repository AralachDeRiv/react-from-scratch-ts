import { DidactElement, TextElement, ElementType } from "./type";

export function createElement(
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

export function createTextElement(text: string | number): TextElement {
  return {
    type: ElementType.TEXT_ELEMENT,
    props: {
      nodeValue: String(text),
    },
  };
}

export function render(
  element: DidactElement | TextElement,
  container: HTMLElement
) {
  const dom =
    element.type == ElementType.TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type);

  if (element.type !== ElementType.TEXT_ELEMENT && dom instanceof HTMLElement) {
    element.props.children.forEach((child) => render(child, dom));

    const isProperty = (key: string) => key !== "children";
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((name) => {
        if (name in dom) {
          // Solution pas optimale mais ts ne semble pas accepter l'attribution dynamique de props de HTMLElement
          (dom as any)[name] = element.props[name];
        } else {
          dom.setAttribute(name, element.props[name]);
        }
      });
  }

  if (element.type == ElementType.TEXT_ELEMENT && dom instanceof Text) {
    dom.nodeValue = element.props.nodeValue;
  }

  container.appendChild(dom);
}

export const Didact = {
  createElement,
  createTextElement,
  render,
};
