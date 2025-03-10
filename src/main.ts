import { Didact } from "./Didact/functions";

const element = Didact.createElement("h1", { title: "foo" }, ["Hello"]);

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title ?? "";

const text = document.createTextNode("");

if (typeof element.props.children?.[0] == "string") {
  text.nodeValue = element.props.children[0];
}

node.appendChild(text);
container?.appendChild(node);

/** @jsx Didact.createElement */
// const element  = (
//     <div style="background: salmon">
//       <h1>Hello World</h1>
//       <h2 style="text-align:right">from Didact</h2>
//     </div>
//   );
