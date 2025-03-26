import { ContainerStyle } from "../types/types";

export const DemoTitle = ({
  title,
  style,
}: {
  title: string;
  style: ContainerStyle;
}) => {
  const colorTitle =
    style == ContainerStyle.DARK ? "var(--black)" : "var(--white)";
  const bgColor =
    style == ContainerStyle.DARK ? "var(--white)" : "var(--black)";

  return (
    <div className="demo-title">
      <h2>{title}</h2>

      <style>
        {`
            @scope{
                --color-title: ${colorTitle};
                --bg-color-title: ${bgColor};
                --shape-title: polygon(100% 0%, 85% 50%, 100% 100%, 0 100%, 0 0);

                position: absolute;
                z-index: 1;
                top: 0;
                left: -28px;
                width: 10rem;
                height: 2rem;
                display: flex;
                justify-content: left;
                align-items: center;
                clip-path: var(--shape-title);
                background-color: var(--bg-color-title);


                :scope::before {
                    content: "";
                    position: absolute;
                    top:  4px;
                    left: 2px;
                    width: calc(100% - 16px); 
                    height: calc(100% - 8px); 
                    z-index: 3;
                    clip-path: var(--shape-title);
                    background-color: var(--bg-color-title);
                }
                
                :scope::after{
                    content: "";
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: calc(100% - 10px); 
                    height: calc(100% - 4px); 
                    z-index: 2;
                    clip-path: var(--shape-title);
                    background-color: var(--color-title);

                }

                h2{
                    position: relative;
                    z-index: 3;
                    padding-left: 0.3rem;
                    font-family: var(--title-font-family);
                    font-size: clamp(0.8rem, 0.8vw, 1rem);
                    color: var(--color-title);
                }

            }
        `}
      </style>
    </div>
  );
};
