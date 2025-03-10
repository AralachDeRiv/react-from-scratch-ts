import { DidactElement } from "./types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: Record<string, any>;
    }
  }
}
