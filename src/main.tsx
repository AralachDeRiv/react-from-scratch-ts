import * as Didact from "Didact";

// function Posts() {
//   const posts = ["post1", "post2", "post3"];
//   const blue = "blue";

//   return (
//     <div>
//       {posts.map((post) => (
//         <div className="post">
//           <p>{post}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // Création d'un contexte pour le thème
// const ThemeContext = Didact.createContext("light");

// // Composant de l'application
// function Page() {
//   const [theme, setTheme] = Didact.useState("light");

//   return (
//     <ThemeContext.Provider value={theme}>
//       <Header />
//       <button
//         onClick={() => setTheme(() => (theme === "light" ? "dark" : "light"))}
//       >
//         Toggle Theme
//       </button>
//     </ThemeContext.Provider>
//   );
// }

// function Header() {
//   const theme = Didact.useContext(ThemeContext); // Consommer le contexte du thème

//   return (
//     <header style={{ backgroundColor: theme === "light" ? "white" : "black" }}>
//       <h1 style={{ color: theme === "light" ? "black" : "white" }}>
//         Current theme: {theme}
//       </h1>
//     </header>
//   );
// }

// const Container = ({ children }: { children: DidactElementFiber }) => {
//   return (
//     <div className="container">
//       {children}

//       <style>
//         {`
//       .container p {
//         color: red;
//       }

//       `}
//       </style>
//     </div>
//   );
// };

const Test = () => {
  return <p>I'm a test !!</p>;
};

import { Header } from "./mainComponents/header";
import { ContainerWrapper } from "./components/containerWrapper";
import { Introduction } from "./mainComponents/introduction";
import { UseRefDemo } from "./mainComponents/useRefDemo";
import { ContainerStyle } from "./types/types";
import { UseStateDemo } from "./mainComponents/useStateDemo";

const App = () => {
  return (
    <div>
      <Header />
      <ContainerWrapper style={ContainerStyle.LIGHT} isFirst={true}>
        <Introduction />
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.DARK}>
        <UseStateDemo />
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.LIGHT}>
        <UseRefDemo />
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.DARK}>
        <Test></Test>
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.LIGHT}>
        <Test></Test>
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.DARK}>
        <Test></Test>
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.LIGHT}>
        <Test></Test>
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.DARK}>
        <Test></Test>
      </ContainerWrapper>
    </div>
  );
};

const app = <App />;

const container = document.getElementById("root")!;
Didact.render(app, container);
