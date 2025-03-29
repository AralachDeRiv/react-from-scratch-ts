import * as Didact from "Didact";
import { Header } from "./mainComponents/header";
import { ContainerWrapper } from "./components/containerWrapper";
import { Introduction } from "./mainComponents/introduction";
import { UseRefDemo } from "./mainComponents/useRefDemo";
import { ContainerStyle } from "./types/types";
import { UseStateDemo } from "./mainComponents/useStateDemo";
import { UseContextDemo } from "./mainComponents/useContextDemo";
import { UseEffectDemo } from "./mainComponents/useEffectDemo";
import { Footer } from "./mainComponents/footer";

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
      <ContainerWrapper style={ContainerStyle.DARK} isLast={true}>
        <Footer />
      </ContainerWrapper>
    </div>
  );
};

const app = <App />;

const container = document.getElementById("root")!;
Didact.render(app, container);
