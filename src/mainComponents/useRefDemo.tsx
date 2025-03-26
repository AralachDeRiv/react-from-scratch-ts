import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseRefDemo = () => {
  return (
    <div id="reconciliatio-demo">
      <DemoTitle title="USEREF" style={ContainerStyle.LIGHT} />

      <style>
        {`
                @scope{
                    position: relative;
                }
            `}
      </style>
    </div>
  );
};
