import { DidactElementFiber } from "Didact/types/type";
import { ContainerStyle } from "../types/types";

export const ContainerWrapper = ({
  style,
  children,
  isFirst,
  isLast,
}: {
  style: ContainerStyle;
  children: DidactElementFiber;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const backgroundColor =
    style == ContainerStyle.LIGHT ? "var(--white)" : "var(--black)";

  return (
    <section
      className={`container-wrapper ${
        style == ContainerStyle.LIGHT ? "white-bg" : "black-bg"
      }`}
    >
      {children}

      <style>
        {`
            @scope{
                :scope{
                    /* To let some space for the header */
                    ${isFirst && "margin-top: 50px"};

                
                    min-height: 200px;
                    overflow: hidden;
                    padding: 20px 30px;
                    margin-inline: 2px;
                    border-radius: 20px;
                    ${isLast ? "border-radius: 20px 20px 0 0;" : ""}
                    background-color: ${backgroundColor};

                    display: flex;
                    & > div{
                      flex-grow: 1;
                  }
                }
            }                   
        `}
      </style>
    </section>
  );
};
