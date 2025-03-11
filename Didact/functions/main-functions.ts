import { DidactElement, TextElement, ElementType } from "../types/type";

// TODO : Commenter ici
export function createElement(
  type: keyof HTMLElementTagNameMap,
  props: Record<string, any> | null,
  children: (DidactElement | string | number)[] = []
): DidactElement {
  // Si les enfants sont dans `props`, on les extrait
  const { children: propChildren, ...restProps } = props || {}; // Extraire les enfants si ils existent dans `props`

  // Les enfants passés explicitement (paramètre `children`) ont la priorité
  const finalChildren = children.length > 0 ? children : propChildren || [];

  // Dans le cas où le childre est un text element, celui-ci sera rendu comme une chaine de caractère et non une liste
  const normalizedChildren = Array.isArray(finalChildren)
    ? finalChildren
    : [finalChildren];

  const processedChildren = normalizedChildren.map(
    (child: string | number | DidactElement) => {
      if (typeof child === "string" || typeof child === "number") {
        return createTextElement(child);
      }
      return child;
    }
  );

  return {
    type,
    props: {
      ...restProps,
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

// TODO : Commenter ici
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
        // Si la propriété est 'style', on la gère différemment
        if (name === "style" && typeof element.props[name] === "object") {
          const styles = element.props[name] as Record<string, string>;
          Object.assign(dom.style, styles);
        } else if (name in dom) {
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
