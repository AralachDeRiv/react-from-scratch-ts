import { error } from "console";
import {
  DidactElement,
  DidactElementFiber,
  EffectTag,
  ElementType,
  Fiber,
  isDidactElementFiber,
  isTextElement,
  TextElement,
  TextElementFiber,
} from "../types/type";
import {
  removeOldProperties,
  updateEvents,
  updateNewProperties,
} from "./utils";

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
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 4. Gestion du DOM et des Fibers

// Création du DOM pour un élément donné
export function createDom(fiber: Fiber): HTMLElement | Text {
  if (
    !(fiber.type === ElementType.TEXT_ELEMENT || typeof fiber.type === "string")
  ) {
    throw Error("Error");
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

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (isDidactElementFiber(fiber)) {
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);
  }
}

function updateFunctionComponent(fiber: Fiber) {
  if (!(fiber.type instanceof Function) || !isDidactElementFiber(fiber))
    throw Error("Error");
  const children = [fiber.type(fiber.props)];
  console.log(children);

  reconcileChildren(fiber, children);
}

export function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
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

// Revoir plus précisément comment fonctionne ceci
function reconcileChildren(
  fiber: DidactElementFiber,
  elements: (
    | DidactElement<Function | keyof HTMLElementTagNameMap>
    | TextElement
  )[]
) {
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
  let domParentFiber = fiber?.parent ?? null;

  // let domParentFiber = fiber.parent
  while (!domParentFiber?.dom) {
    domParentFiber = domParentFiber?.parent ?? null;
  }
  const domParent = domParentFiber.dom;

  if (
    domParent instanceof HTMLElement &&
    (fiber.dom instanceof HTMLElement || fiber.dom instanceof Text)
  ) {
    if (fiber.effectTag == EffectTag.PLACEMENT) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag == EffectTag.DELETION) {
      commitDeletion(fiber.child, domParent);
    } else if (fiber.effectTag == EffectTag.UPDATE) {
      const props = fiber?.alternate?.props ?? {};
      updateDom(fiber.dom, props, fiber.props);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// TODO : Refaire toute l'implémentation des fonctions
function commitDeletion(fiber: Fiber | null, domParent: HTMLElement | Text) {
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

// 5. Boucle de travail
function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    if (nextUnitOfWork) {
      // console.log(nextUnitOfWork);
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
