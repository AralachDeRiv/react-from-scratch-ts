import {
  DidactElement,
  TextElement,
  ElementType,
  Fiber,
  isDidactElementFiber,
  isTextElement,
  DidactElementFiber,
  EffectTag,
  TextElementFiber,
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
  // console.log("Creating fiber for element:", element);
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

// 2. Variables globales
let wipRoot: Fiber | null = null;
let nextUnitOfWork: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions: Fiber[] = [];

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
    alternate: currentRoot,
    effectTag: null,
  };

  wipRoot.child = createFiber(element, wipRoot);

  wipRoot.dom = container;
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 4. Gestion du DOM et des Fibers
export function createDom(fiber: Fiber) {
  // console.log("Create Dom", fiber);

  const dom =
    fiber.type == ElementType.TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

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

// TODO : Revenir ici, facturé cette fonction
export function updateDom(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  // TODO : voir ici pour les event si pas de meilleur façon de faire
  const isEvent = (key: string) => key.startsWith("on");
  const isProperty = (key: string) => key !== "children" && !isEvent(key);
  const isNew =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
      prev[key] !== next[key];
  const isGone =
    (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
      !(key in next);

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      // Enlever la propriété sur le DOM
      if (name === "style" && dom instanceof HTMLElement) {
        Object.assign(dom.style, {});
      } else if (name in dom) {
        (dom as any)[name] = ""; // Réinitialiser l'attribut
      } else if (!(dom instanceof Text)) {
        dom.removeAttribute(name); // Retirer l'attribut du DOM
      }
    });

  Object.keys(nextProps)
    .filter(isProperty) // Ignore "children"
    .filter(isNew(prevProps, nextProps)) // Filtrer les propriétés nouvelles ou modifiées
    .forEach((name) => {
      const value = nextProps[name];

      if (
        name === "style" &&
        typeof value === "object" &&
        dom instanceof HTMLElement
      ) {
        // Si la propriété est 'style' et que c'est un objet, on l'applique au DOM
        Object.assign(dom.style, value as Record<string, string>);
      } else if (name in dom) {
        // Si la propriété existe sur l'élément DOM (par exemple, 'className', 'value', etc.)
        (dom as any)[name] = value;
      } else if (!(dom instanceof Text)) {
        // Sinon, on utilise `setAttribute` pour définir la propriété (par exemple, 'id', 'data-*', etc.)
        dom.setAttribute(name, value);
      }
    });

  // Pour les props Event
  // Remove
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Add
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  if (dom instanceof Text && nextProps.nodeValue !== prevProps.nodeValue) {
    // Si c'est un noeud texte et que la valeur a changé
    dom.nodeValue = nextProps.nodeValue;
  }
}

export function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (isDidactElementFiber(fiber)) {
    reconcileChildren(fiber);
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

  return null;
}

function reconcileChildren(fiber: DidactElementFiber) {
  const elements = fiber.props.children;
  let index = 0;
  let oldFiber = fiber.alternate && fiber.alternate.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber != null) {
    let newFiber: Fiber | null = null;
    const element = elements[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType && oldFiber) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber,
        effectTag: EffectTag.UPDATE,
      } as DidactElementFiber | TextElementFiber;
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: EffectTag.PLACEMENT,
      } as DidactElementFiber | TextElementFiber;
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = EffectTag.DELETION;
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else if (element) {
      prevSibling!.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child ?? null);
  currentRoot = wipRoot;
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
    if (fiber.effectTag == EffectTag.PLACEMENT) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag == EffectTag.DELETION) {
      domParent.removeChild(fiber.dom);
    } else if (fiber.effectTag == EffectTag.UPDATE) {
      const props = fiber?.alternate?.props ?? {};

      updateDom(fiber.dom, props, fiber.props);
    }
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
