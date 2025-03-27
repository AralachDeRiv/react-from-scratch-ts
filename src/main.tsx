import * as Didact from "Didact";

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
import { UseContextDemo } from "./mainComponents/useContextDemo";
import { UseEffectDemo } from "./mainComponents/useEffectDemo";

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
        <UseContextDemo />
      </ContainerWrapper>
      <ContainerWrapper style={ContainerStyle.LIGHT}>
        <UseEffectDemo />
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
