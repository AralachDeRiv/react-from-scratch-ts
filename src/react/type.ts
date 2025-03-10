export type Element = {
  type: keyof HTMLElementTagNameMap;
  props: {
    title: string;
    children: string;
  };
};

// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello",
//   },
// }
