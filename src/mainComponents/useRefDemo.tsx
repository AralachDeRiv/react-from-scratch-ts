import * as Didact from "Didact";
import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseRefDemo = () => {
  let box1Ref = Didact.useRef(null);
  let box2Ref = Didact.useRef(null);
  let [message, setMessage] = Didact.useState("BOXES");

  Didact.useEffect(() => {
    const handleClick1 = () => {
      setMessage(() => "Box 1 clicked!");
    };

    const handleClick2 = () => {
      setMessage(() => "Box 2 clicked!");
    };

    console.log(box1Ref);

    if (box1Ref.current) {
      box1Ref.current.addEventListener("click", handleClick1);
    }
    if (box2Ref.current) {
      box2Ref.current.addEventListener("click", handleClick2);
    }

    return () => {
      if (box1Ref.current) {
        box1Ref.current.removeEventListener("click", handleClick1);
      }
      if (box2Ref.current) {
        box2Ref.current.removeEventListener("click", handleClick2);
      }
    };
  }, []);

  return (
    <div id="useRef-demo">
      <DemoTitle title="USEREF" style={ContainerStyle.LIGHT} />

      <h3>Click on the boxes</h3>

      <h4>{message}</h4>

      <div className="container-boxes">
        <div class="container-box-1">
          <div class="box" ref={box1Ref}></div>
        </div>
        <div class="container-box-2">
          <div class="box" ref={box2Ref}></div>
        </div>
      </div>

      <style>
        {`
            @scope{
                position: relative;
                min-height: 400px;
                padding: 25px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;


                & h3{
                    align-self: end;
                }

                & h4{
                    align-self: center;
                }

                & .container-boxes{
                  display: flex;
                  justify-content: space-evenly;


                & .box {
                      width: 175px;
                      height: 175px;
                      border-radius: 30px;
                      cursor: pointer;
                      background-color: #ff5733;
                  }
                }
            }
        `}
      </style>
    </div>
  );
};
