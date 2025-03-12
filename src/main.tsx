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

const updateValue = (e: Event) => {
  const inputElement = e.target as HTMLInputElement;
  rerender(inputElement.value);
};

const rerender = (value: string) => {
  const element = (
    <div class="ok">
      <div class="okok">
        <input onInput={updateValue} value={value} />
        <h2>Hello {value}</h2>
      </div>
      <h1>YO</h1>
      <style>
        {`
        /* Scope functionning on google */
           h2 {
            cursor: pointer;
             color: red;
            transition: all 0.3s linear;
             &:hover{
               color: blue
              }
           
          }
      `}
      </style>
    </div>
  );
  Didact.render(element, container);
};

rerender("World");
