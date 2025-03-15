import {
  DidactElement,
  ElementType,
  Fiber,
  isTextElement,
  TextElement,
} from "Didact/types/type";

// ELEMENT CREATION
// TODO : Commenter ici + voir s'il ne faudra pas retirer le 3eme argument
// TODO : Ajouter ici le @scope par défault pour les tag style ?
export function createElement(
  type: keyof HTMLElementTagNameMap | Function,
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

export function createFiber(
  element: DidactElement | TextElement,
  parent: Fiber | null
): Fiber {
  if (isTextElement(element)) {
    return {
      type: element.type,
      props: element.props,
      dom: null,
      parent: parent,
      child: null,
      sibling: null,
      alternate: null,
      effectTag: null,
    };
  } else {
    return {
      type: element.type,
      props: element.props,
      dom: null,
      parent: parent,
      child: null,
      sibling: null,
      alternate: null,
      effectTag: null,
    };
  }
}

// GESTION DOM

const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    prev[key] !== next[key];
const isGone =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    !(key in next);

export function removeOldProperties(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      if (name === "style" && dom instanceof HTMLElement) {
        dom.style.cssText = "";
      } else if (name in dom) {
        (dom as any)[name] = "";
      } else if (!(dom instanceof Text)) {
        dom.removeAttribute(name);
      }
    });
}

export function updateNewProperties(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const value = nextProps[name];
      if (
        name === "style" &&
        typeof value === "object" &&
        dom instanceof HTMLElement
      ) {
        Object.assign(dom.style, value);
      } else if (name in dom) {
        (dom as any)[name] = value;
      } else if (!(dom instanceof Text)) {
        dom.setAttribute(name, value);
      }
    });
}

export function updateEvents(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export function createDom(fiber: Fiber): HTMLElement | Text {
  if (
    !(fiber.type === ElementType.TEXT_ELEMENT || typeof fiber.type === "string")
  ) {
    throw Error(`ERROR: NOT VALID FIBER : ${fiber}`);
  }

  const dom =
    fiber.type === ElementType.TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  if (
    fiber.type !== ElementType.TEXT_ELEMENT &&
    fiber.type !== ElementType.ROOT &&
    dom instanceof HTMLElement
  ) {
    updateNewProperties(dom, {}, fiber.props);
    updateEvents(dom, {}, fiber.props);
  }

  if (fiber.type === ElementType.TEXT_ELEMENT && dom instanceof Text) {
    dom.nodeValue = fiber.props.nodeValue;
  }

  return dom;
}

// Met à jour les propriétés du DOM
export function updateDom(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  removeOldProperties(dom, prevProps, nextProps);
  updateEvents(dom, prevProps, nextProps);
  updateNewProperties(dom, prevProps, nextProps);

  if (dom instanceof Text && nextProps.nodeValue !== prevProps.nodeValue) {
    dom.nodeValue = nextProps.nodeValue;
  }
}

// TODO : Refaire toute l'implémentation des fonctions
export function commitDeletion(
  fiber: Fiber | null,
  domParent: HTMLElement | Text
) {
  if (!fiber) return;
  if (fiber.dom instanceof HTMLElement || fiber.dom instanceof Text) {
    domParent.removeChild(fiber.dom);
  } else {
    // 🔽 Descend récursivement jusqu'à trouver un élément DOM à supprimer
    let child = fiber.child;
    while (child) {
      commitDeletion(child, domParent);
      child = child.sibling;
    }
  }
}
