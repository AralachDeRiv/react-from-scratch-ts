export type ReactElement<
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> = {
  type: T;
  props: Partial<Record<string, any>> & {
    children?: ReactElement | ReactElement[] | string;
  };
};
