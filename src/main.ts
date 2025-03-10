import { ReactElement } from "./react/type";

const element: ReactElement = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title ?? "";

const text = document.createTextNode("");

if (typeof element.props.children == "string") {
  text.nodeValue = element.props.children;
}

node.appendChild(text);
container?.appendChild(node);
