import { DidactElement } from "./types";
// TODO : Commenter ici

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: Record<string, any>;
    }
  }
}
