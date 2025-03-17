import * as Didact from "Didact";

// TODO : Voir si il y a un loyen + élégant d'utiliser le style
// const element = (
//   <div id="First" style={{ backgroundColor: "salmon" }} class="oki">
//     <h1>Hello, world!</h1>
//     <h2 style={{ textAlign: "right" }}>
//       from <span style={{ fontSize: "60px" }}>Didact</span>
//     </h2>
//     <style>
//       {`
//         /* Scope functionning on google */
//           h2 {
//             cursor: pointer;
//             color: red;

//             & span {
//               transition: all 0.3s linear;

//               &:hover{
//                 color: blue
//               }
//             }
//           }
//     `}
//     </style>
//   </div>
// );

// Didact.render(element, document.getElementById("root")!);

const container = document.getElementById("root")!;

// const updateValue = (e: Event) => {
//   console.log(e);
//   const inputElement = e.target as HTMLInputElement;
//   rerender(inputElement.value);
// };

// const rerender = (value: string) => {
//   const element = (
//     <div class="ok">
//       <div class="okok">
//         <input onInput={updateValue} value={value} />
//         <h2>Hello {value}</h2>
//       </div>
//       <p>Helllooo</p>
//       <div>
//         <p>Helllooo</p>
//         <style>
//           {`
//           /* Scope functionning on google */
//             @scope{
//               p{
//                 color: red
//               }
//            }
//           `}
//         </style>
//       </div>
//     </div>
//   );
//   Didact.render(element, container);
// };

// rerender("World");
// type ValidCSS = string & { __brand: "ValidCSS" };

// TODO: pt utiliser ceci avec @scope par défault?
// const ScopedStyle = ({ css }: { css: string }) => <style>{css}</style>;

function App({ name }: { name: string }) {
  return <h1>Hi {name} okokok</h1>;
}

function Counter() {
  const [count, setCount] = Didact.useState(-10);

  return (
    <div>
      {/* Ajuter des espaces */}
      <p> {count} </p>
      <button onClick={() => setCount(() => count + 1)}>Click</button>
    </div>
  );
}

function Posts() {
  const posts = ["post1", "post2", "post3"];

  return (
    <div>
      {posts.map((post) => (
        <div className="post">
          <p>{post}</p>
        </div>
      ))}

      <style>
        {`
        @scope{
          p {
          color: red         
          }    
        }    
        `}
      </style>
    </div>
  );
}
const element = (
  <div className="YO">
    <App name="YOO" />
    <Counter />
    <Posts />
  </div>
);

Didact.render(element, container);
