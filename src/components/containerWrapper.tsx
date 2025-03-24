import { DidactElementFiber } from "Didact/types/type";
import { ContainerStyle } from "../types/types";

export const ContainerWrapper = ({
  style,
  children,
  isFirst,
}: {
  style: ContainerStyle;
  children: DidactElementFiber;
  isFirst?: boolean;
}) => {
  const backgroundColor = style == ContainerStyle.LIGHT ? "white" : "black";
  const color = style == ContainerStyle.LIGHT ? "black" : "white";

  return (
    <div className="container-wrapper">
      {children}

      <style>
        {`
            @scope{
                :scope{
                    ${isFirst && "margin-top: 200px"};
                    background-color: ${backgroundColor};
                    & p {
                        color: ${color}    
                    }
                    
             
                  

                    
                }
            }                   
        `}
      </style>
    </div>
  );
};
