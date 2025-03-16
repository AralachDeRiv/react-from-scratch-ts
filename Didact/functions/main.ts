import {
  DidactElement,
  DidactElementFiber,
  EffectTag,
  ElementType,
  Fiber,
  FiberRoot,
  hook,
  isDidactElementFiber,
  TextElement,
  TextElementFiber,
} from "../types/type";
import { commitDeletion, createDom, createFiber, updateDom } from "./utils";

// Variables globales
let wipRoot: FiberRoot | null = null;
let nextUnitOfWork: Fiber | null = null;
let currentRoot: FiberRoot | null = null;
let deletions: Fiber[] = [];

//  Rendu initial
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

function updateHostComponent(fiber: Fiber) {
  console.log(fiber);

  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (isDidactElementFiber(fiber)) {
    const elements = fiber.props.children;

    reconcileChildren(fiber, elements);
  }
}

let wipFiber: DidactElementFiber | null = null;
let hookIndex: number | null = null;

function updateFunctionComponent(fiber: Fiber) {
  if (!(fiber.type instanceof Function) || !isDidactElementFiber(fiber))
    throw Error("Error");
  wipFiber = fiber;
  hookIndex = 0;

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

export function useState(initial: any) {
  if (wipFiber == null || typeof hookIndex !== "number") throw Error("Error");

  const oldHook =
    wipFiber &&
    isDidactElementFiber(wipFiber?.alternate) &&
    wipFiber.alternate?.hooks?.[hookIndex];

  const hook: hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  console.log("Initial count state:", hook.state);

  const actions = oldHook ? oldHook.queue : [];

  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action: Function) => {
    hook.queue.push(action);

    wipRoot = {
      ...wipRoot!,
      dom: currentRoot!.dom,
      props: currentRoot!.props,
      alternate: currentRoot,
    };

    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  if (!wipFiber.hooks) {
    wipFiber.hooks = [];
  }

  wipFiber.hooks.push(hook);

  hookIndex!++;
  return [hook.state, setState];
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
