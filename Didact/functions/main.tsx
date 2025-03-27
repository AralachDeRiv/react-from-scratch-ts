import {
  ContextHook,
  ContextType,
  DidactElement,
  DidactElementFiber,
  EffectHook,
  EffectTag,
  ElementType,
  Fiber,
  FiberRoot,
  HookType,
  isDidactElementFiber,
  RefHook,
  StateHook,
  TextElement,
  TextElementFiber,
} from "../types/type";
import { createDom, createFiber, updateDom } from "./utils";

// GLOBAL VARIABLES
let wipRoot: FiberRoot | null = null;
let currentRoot: FiberRoot | null = null;
let nextUnitOfWork: Fiber | null = null;
let deletions: Fiber[] = [];
let wipFiber: DidactElementFiber | null = null;
let hookIndex: number | null = null;

//  RENDER
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

// HOOKS
export function useState(initial: any) {
  if (wipFiber == null || typeof hookIndex !== "number")
    throw Error(
      "Unexpected error: wipFiber is null or hookIndex is not a number."
    );

  const oldHook =
    wipFiber &&
    isDidactElementFiber(wipFiber?.alternate) &&
    wipFiber.alternate?.hooks?.[hookIndex];

  if (oldHook && oldHook.type !== HookType.STATE) {
    console.error(
      "Error: The previous hook is not of the expected type. Previous hook: ",
      oldHook
    );
    throw Error("Error in useState: The previous hook is not of type 'STATE'.");
  }

  const hook: StateHook = {
    type: HookType.STATE,
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];

  actions!.forEach((action) => {
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

export function useRef(initial: any) {
  if (wipFiber == null || typeof hookIndex !== "number")
    throw Error(
      "Unexpected error: wipFiber is null or hookIndex is not a number."
    );

  const oldHook =
    wipFiber &&
    isDidactElementFiber(wipFiber?.alternate) &&
    wipFiber.alternate?.hooks?.[hookIndex];

  if (oldHook && oldHook.type !== HookType.REF) {
    console.error(
      "Error: Invalid hook type in useRef. Expected HookType.REF, got:",
      oldHook
    );
    throw Error("Error: Invalid hook type in useRef. Expected HookType.REF.");
  }

  const hook: RefHook = {
    type: HookType.REF,
    current: oldHook ? oldHook.current : initial,
  };

  if (!wipFiber.hooks) {
    wipFiber.hooks = [];
  }

  wipFiber.hooks.push(hook);
  hookIndex!++;

  return hook;
}

export function useEffect(effect: () => void | (() => void), deps: any[]) {
  if (wipFiber == null || typeof hookIndex !== "number")
    throw Error(
      "Unexpected error: wipFiber is null or hookIndex is not a number."
    );

  const oldHook =
    wipFiber.alternate &&
    isDidactElementFiber(wipFiber.alternate) &&
    wipFiber.alternate.hooks?.[hookIndex];

  if (oldHook && oldHook.type !== HookType.EFFECT) {
    console.error(
      "Error: Invalid hook type in useEffect. Expected HookType.EFFECT, got:",
      oldHook
    );
    throw Error(
      "Error: Invalid hook type in useEffect. Expected HookType.EFFECT."
    );
  }

  const hasChanged =
    !oldHook || !deps || deps.some((dep, i) => dep !== oldHook.deps![i]);

  let cleanup: (() => void) | null | undefined;

  if (hasChanged && oldHook && oldHook.cleanup) {
    cleanup = oldHook.cleanup;
  } else {
    cleanup = null;
  }

  const hook: EffectHook = {
    type: HookType.EFFECT,
    effect,
    deps,
    cleanup,
  };

  if (!wipFiber.hooks) {
    wipFiber.hooks = [];
  }

  wipFiber.hooks.push(hook);
  hookIndex!++;
}

export function createContext<T>(defaultValue: T): ContextType<T> {
  const context: ContextType<T> = {
    _currentValue: defaultValue,
    Provider: ({ value, children }) => {
      context._currentValue = value;
      return <div className="context-provider">{children}</div>;
    },
  };
  return context;
}

export function useContext<T>(context: ContextType<T>): T {
  if (wipFiber == null || typeof hookIndex !== "number")
    throw Error(
      "Unexpected error: wipFiber is null or hookIndex is not a number."
    );

  const oldHook =
    wipFiber.alternate &&
    isDidactElementFiber(wipFiber.alternate) &&
    wipFiber.alternate.hooks?.[hookIndex];

  if (oldHook && oldHook.type !== HookType.CONTEXT) {
    console.error("Error with oldHook inside useContext : ", oldHook);
    throw Error("Error with oldHook inside useContext");
  }

  const hook: ContextHook = {
    type: HookType.CONTEXT,
    state: context._currentValue,
  };

  if (!wipFiber.hooks) {
    wipFiber.hooks = [];
  }

  wipFiber.hooks.push(hook);
  hookIndex!++;

  return hook.state;
}

// PERFORM UNIT OF WORK
function performUnitOfWork(fiber: Fiber) {
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

function updateHostComponent(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (isDidactElementFiber(fiber)) {
    const elements = fiber.props.children.flat();
    reconcileChildren(fiber, elements);
  }
}

function updateFunctionComponent(fiber: Fiber) {
  if (!(fiber.type instanceof Function) || !isDidactElementFiber(fiber))
    throw Error(
      "The fiber type is not a function or the fiber is not a valid Didact element"
    );

  wipFiber = fiber;
  hookIndex = 0;

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
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

// COMMITS
function commitDeletion(fiber: Fiber | null, domParent: HTMLElement | Text) {
  if (!fiber) return;
  if (fiber.dom instanceof HTMLElement || fiber.dom instanceof Text) {
    try {
      domParent.removeChild(fiber.dom);
    } catch (error) {
      console.error(error);
    }
  } else {
    let child = fiber.child;
    while (child) {
      commitDeletion(child, domParent);
      child = child.sibling;
    }
  }
}

function commitEffects() {
  if (!currentRoot) return;

  function runEffects(fiber: Fiber | null) {
    if (!fiber) return;

    if (isDidactElementFiber(fiber) && fiber.hooks) {
      fiber.hooks.forEach((hook) => {
        if (hook.type === HookType.EFFECT) {
          if (hook.cleanup) {
            hook.cleanup();
          }
          const cleanupFn = hook.effect();
          hook.cleanup = typeof cleanupFn === "function" ? cleanupFn : null;
        }
      });
    }

    runEffects(fiber.child);
    runEffects(fiber.sibling);
  }

  runEffects(currentRoot.child);
}

function commitRefs(fiber: Fiber | null) {
  if (!fiber || !isDidactElementFiber(fiber)) return;
  if (fiber.props.ref && fiber.dom) {
    fiber.props.ref.current = fiber.dom;
  }
  commitRefs(fiber.child);
  commitRefs(fiber.sibling);
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child ?? null);
  currentRoot = wipRoot;

  commitRefs(currentRoot?.child ?? null);
  commitEffects();

  wipRoot = null;
}

function commitWork(fiber: Fiber | null) {
  if (!fiber) return;

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
      commitDeletion(fiber, domParent);
    } else if (fiber.effectTag == EffectTag.UPDATE) {
      const props = fiber?.alternate?.props ?? {};
      updateDom(fiber.dom, props, fiber.props);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// WORKLOOP
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
