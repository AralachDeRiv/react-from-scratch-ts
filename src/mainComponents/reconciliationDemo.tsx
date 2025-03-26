import { DemoTitle } from "../components/demoTitle";
import { ContainerStyle } from "../types/types";

export const ReconciliationDemo = () => {
  return (
    <div id="reconciliatio-demo">
      <DemoTitle title="RECONCILIATION" style={ContainerStyle.DARK} />

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
