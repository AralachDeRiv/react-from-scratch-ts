// For Update/CreateDom
const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    prev[key] !== next[key];
const isGone =
  (prev: Record<string, any>, next: Record<string, any>) => (key: string) =>
    !(key in next);

// Supprime les anciennes propriétés du DOM qui ne sont plus présentes
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

// Ajoute ou met à jour les nouvelles propriétés du DOM
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

// Ajoute ou supprime les événements
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
