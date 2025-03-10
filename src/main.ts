import { DidactElement } from "./react/type";
import { Didact } from "./react/functions";

const element: DidactElement = Didact.createElement("h1", { title: "foo" }, [
  "Hello",
]);

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title ?? "";

const text = document.createTextNode("");

if (typeof element.props.children?.[0] == "string") {
  text.nodeValue = element.props.children[0];
}

node.appendChild(text);
container?.appendChild(node);
