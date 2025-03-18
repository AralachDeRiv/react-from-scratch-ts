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
  const [start, setStart] = Didact.useState(false);

  Didact.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (start) {
      interval = setInterval(() => {
        console.log("Interval");
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [start]);

  return (
    <div className="">
      <h1>Hi {name} okokok</h1>
      <button onClick={() => setStart(() => !start)}>Start</button>
    </div>
  );
}

function Counter() {
  const [count, setCount] = Didact.useState(-10);
  const [secondCount, setSecond] = Didact.useState(10);

  return (
    <div>
      {/* Ajuter des espaces */}
      <p> {count} </p>
      <button onClick={() => setCount(() => count + 1)}>Click</button>
      <p> {secondCount} </p>
      <button onClick={() => setSecond(() => secondCount + 1)}>Click</button>
    </div>
  );
}

function Posts() {
  const posts = ["post1", "post2", "post3"];
  const blue = "blue";

  return (
    <div>
      {posts.map((post) => (
        <div className="post">
          <p>{post}</p>
        </div>
      ))}

      <style>
        {`
    
          .post p {
          color: ${blue}         
          }    
     
        `}
      </style>
    </div>
  );
}

export function MyComponent() {
  const [count, setCount] = Didact.useState(0);
  const myInputRef = Didact.useRef(null);

  const handleClick = () => {
    setCount(() => count + 1);
    // Accéder à la référence

    // console.log(myInputRef);

    if (myInputRef.current) {
      console.log(myInputRef.current.value);
    }
  };

  return (
    <div>
      <input ref={myInputRef} />
      <button onClick={handleClick}>Increment</button>
      <p>{count}</p>
    </div>
  );
}

// Création d'un contexte pour le thème
const ThemeContext = Didact.createContext("light");

// Composant de l'application
function Page() {
  const [theme, setTheme] = Didact.useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <Header />
      <button
        onClick={() => setTheme(() => (theme === "light" ? "dark" : "light"))}
      >
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = Didact.useContext(ThemeContext); // Consommer le contexte du thème

  return (
    <header style={{ backgroundColor: theme === "light" ? "white" : "black" }}>
      <h1 style={{ color: theme === "light" ? "black" : "white" }}>
        Current theme: {theme}
      </h1>
    </header>
  );
}

const Container = () => {
  const [display, setDisplay] = Didact.useState(true);

  return (
    <div className="">
      <button onClick={() => setDisplay(() => !display)}>Display</button>
      {display && <p>Displayed</p>}
    </div>
  );
};

const element = <Container />;

Didact.render(element, container);
