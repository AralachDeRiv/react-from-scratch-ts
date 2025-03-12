import {
  DidactElement,
  TextElement,
  ElementType,
  Fiber,
  isDidactElementFiber,
  isTextElement,
} from "../types/type";

// 1. Création des éléments
// TODO : Commenter ici + voir s'il ne faudra pas retirer le 3eme argument
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

// TODO : Pt un moyen de rendre ceci + élégant
function createFiber(
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
    };
  } else {
    return {
      type: element.type,
      props: element.props,
      dom: null,
      parent: parent,
      child: null,
      sibling: null,
    };
  }
}

// 2. Variables globales
let wipRoot: Fiber | null = null;
let nextUnitOfWork: Fiber | null = null;

// 3. Rendu initial
export function render(
  element: DidactElement | TextElement,
  container: HTMLElement
) {
  wipRoot = {
    type: ElementType.ROOT,
    props: { children: [element] },
    dom: container,
    parent: null,
    child: null,
    sibling: null,
  };

  wipRoot.child = createFiber(element, wipRoot);
  wipRoot.dom = container;
  nextUnitOfWork = wipRoot;
}

// 4. Gestion du DOM et des Fibers
export function createDom(fiber: Fiber) {
  const dom =
    fiber.type == ElementType.TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  if (fiber.type === "style") {
    console.log(fiber);
  }

  if (
    fiber.type !== ElementType.TEXT_ELEMENT &&
    fiber.type !== ElementType.ROOT &&
    dom instanceof HTMLElement
  ) {
    const isProperty = (key: string) => key !== "children";

    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name) => {
        // Si la propriété est 'style', on la gère différemment
        if (name === "style" && typeof fiber.props[name] === "object") {
          const styles = fiber.props[name] as Record<string, string>;
          Object.assign(dom.style, styles);
        } else if (name in dom) {
          (dom as any)[name] = fiber.props[name];
        } else {
          dom.setAttribute(name, fiber.props[name]);
        }
      });
  }

  if (fiber.type == ElementType.TEXT_ELEMENT && dom instanceof Text) {
    dom.nodeValue = fiber.props.nodeValue;
  }

  return dom;
}

export function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (isDidactElementFiber(fiber)) {
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling: Fiber | null = null;

    while (index < elements.length) {
      const element = elements[index];
      const newFiber: Fiber = createFiber(element, fiber);

      if (index === 0) {
        fiber.child = newFiber;
      } else if (prevSibling) {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function commitRoot() {
  commitWork(wipRoot?.child ?? null);
  wipRoot = null;
}

function commitWork(fiber: Fiber | null) {
  if (!fiber) {
    return;
  }
  const domParent = fiber?.parent?.dom ?? null;

  if (
    domParent instanceof HTMLElement &&
    (fiber.dom instanceof HTMLElement || fiber.dom instanceof Text)
  ) {
    domParent.appendChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 5. Boucle de travail
function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    if (nextUnitOfWork) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork) ?? null;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
