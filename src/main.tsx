import * as Didact from "Didact";

const element = (
  <div style={{ backgroundColor: "salmon" }}>
    <h1>Hello, world!</h1>
    <h2 style={{ textAlign: "right" }}>from Didact</h2>
  </div>
);

Didact.render(element, document.getElementById("root")!);
