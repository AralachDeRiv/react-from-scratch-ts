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
  console.log(element);

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

// Fonction utilitaire pour détecter si une clé est un événement
const isEvent = (key: string) => key.startsWith("on");

// Fonction utilitaire pour détecter si une clé est une propriété du DOM (hors événements et "children")
const isProperty = (key: string) => key !== "children" && !isEvent(key);

// Détecte si une propriété est nouvelle ou modifiée
const isNew =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    prev[key] !== next[key];

// Détecte si une propriété a disparu
const isGone =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    !(key in next);

// Création du DOM pour un élément donné
export function createDom(fiber: Fiber): HTMLElement | Text {
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
  }

  if (fiber.type === ElementType.TEXT_ELEMENT && dom instanceof Text) {
    dom.nodeValue = fiber.props.nodeValue;
  }

  return dom;
}

// Met à jour les propriétés du DOM (ajout/suppression des attributs, styles, événements)
export function updateDom(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  removeOldProperties(dom, prevProps, nextProps);
  updateNewProperties(dom, prevProps, nextProps);
  updateEvents(dom, prevProps, nextProps);

  if (dom instanceof Text && nextProps.nodeValue !== prevProps.nodeValue) {
    dom.nodeValue = nextProps.nodeValue;
  }
}

// Supprime les anciennes propriétés du DOM qui ne sont plus présentes
function removeOldProperties(
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

// Ajoute ou met à jour les nouvelles propriétés du DOM
function updateNewProperties(
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

// Ajoute ou supprime les événements
function updateEvents(
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
      console.log(nextUnitOfWork);

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
