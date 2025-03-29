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
import { IncompatibleNotice } from "./mainComponents/incompatibleNotice";

const container = document.getElementById("root")!;
const userAgent = navigator.userAgent.toLowerCase();
const isChrome = userAgent.includes("chrome") && !userAgent.includes("edg");
const isDesktop = window.innerWidth > 768;

if (isChrome && isDesktop) {
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
  Didact.render(app, container);
} else {
  const notice = <IncompatibleNotice />;
  Didact.render(notice, container);
}
