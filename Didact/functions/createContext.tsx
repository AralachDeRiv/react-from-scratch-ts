import { ContextType } from "Didact/types/type";

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
