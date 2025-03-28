import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseEffectDemo = () => {
  return (
    <div>
      <DemoTitle title="USEEFFECT" style={ContainerStyle.LIGHT} />

      <style>
        {`
            @scope{
                :scope{
                    position: relative;
                }
            }  
        `}
      </style>
    </div>
  );
};
