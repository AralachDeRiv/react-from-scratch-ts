import * as Didact from "Didact";
import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseRefDemo = () => {
  let box1Ref = Didact.useRef(null);
  let box2Ref = Didact.useRef(null);
  let messageRef = Didact.useRef(null);
  let [message, setMessage] = Didact.useState("BOXES");

  Didact.useEffect(() => {
    const getRandomHexColor = () => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      return `#${randomColor.padStart(6, "0")}`;
    };

    const handleMessageAnimation = (newMessage: string) => {
      messageRef.current.classList.add("fade-out");
      messageRef.current.classList.remove("fade-in");
      setTimeout(() => {
        setMessage(() => newMessage);
        messageRef.current.classList.remove("fade-out");
        messageRef.current.classList.add("fade-in");
      }, 500);
    };

    const handleClick1 = () => {
      box1Ref.current.classList.add("animating");
      box1Ref.current.style.animation = "none";
      box1Ref.current.offsetHeight; /* Force reflow */
      box1Ref.current.style.animation = "jello 1s ease-in";

      const newColor = getRandomHexColor();
      box1Ref.current.style.backgroundColor = newColor;
      messageRef.current.style.color = newColor;

      handleMessageAnimation("Box 1 clicked!");
    };

    const handleClick2 = () => {
      box2Ref.current.classList.add("animating");
      box2Ref.current.style.animation = "none";
      box2Ref.current.offsetHeight;
      box2Ref.current.style.animation = "wiggle 75ms linear 9";

      const newColor = getRandomHexColor();
      box2Ref.current.style.backgroundColor = newColor;
      messageRef.current.style.color = newColor;

      handleMessageAnimation("Box 2 clicked!");
    };

    const handleAnimationEndBox1 = () => {
      box1Ref.current.classList.remove("animating");
    };

    const handleAnimationEndBox2 = () => {
      box2Ref.current.classList.remove("animating");
    };

    if (box1Ref.current && messageRef.current) {
      box1Ref.current.addEventListener("click", handleClick1);
      box1Ref.current.addEventListener("animationend", handleAnimationEndBox1);
    }
    if (box2Ref.current && messageRef.current) {
      box2Ref.current.addEventListener("click", handleClick2);
      box2Ref.current.addEventListener("animationend", handleAnimationEndBox2);
    }

    return () => {
      if (box1Ref.current) {
        box1Ref.current.removeEventListener("click", handleClick1);
        box1Ref.current.removeEventListener(
          "animationend",
          handleAnimationEndBox1
        );
      }
      if (box2Ref.current) {
        box2Ref.current.removeEventListener("click", handleClick2);
        box2Ref.current.removeEventListener(
          "animationend",
          handleAnimationEndBox2
        );
      }
    };
  }, []);

  return (
    <div id="useRef-demo">
      <DemoTitle title="USEREF" style={ContainerStyle.LIGHT} />

      <h3>Click on the boxes</h3>

      <h4 ref={messageRef}>{message}</h4>

      <div className="container-boxes">
        <div class="container-box-1">
          <div class="box box-1" ref={box1Ref}></div>
        </div>
        <div class="container-box-2">
          <div class="box box-2" ref={box2Ref}></div>
        </div>
      </div>

      <style>
        {`

            @keyframes jello {
              0% { transform: scale3d(0.75, 1.25, 1); }
              30% { transform: scale3d(1.25, 0.75, 1); }
              40% { transform: scale3d(0.85, 1.15, 1); }
              50% { transform: scale3d(1.15, 0.85, 1); }
              65% { transform: scale3d(0.95, 1.05, 1); }
              75% { transform: scale3d(1.05, 0.95, 1); }
              100% { transform: scale3d(1, 1, 1); }
            }

            @keyframes wiggle {
              0% { transform: translate(10px, 0); }
              50% { transform: translate(-10px, 0); }
              100% { transform: translate(10px, 0); }
            }

            @keyframes fade-out {
              0% { opacity: 1; }
              100% { opacity: 0; }
            }

            @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }


            @scope{
                position: relative;
                min-height: 400px;
                padding: 25px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;


                & h3{
                    align-self: end;
                    font-family: var(--hand-write-font-family);
                    font-size: 1.8rem;
                    transform:  translate(-50px, 20px);
                }

                & h4{
                    align-self: center;
                    text-transform: uppercase;
                    font-weight: 900;
                    font-size: 1.8rem;
                    color: #ff5733;
                    transition: color 0.4s linear 0.3s;

                    &.fade-out {
                      animation: fade-out 0.3s forwards;
                    }

                    &.fade-in {
                      animation: fade-in 0.5s forwards;
                    }
                }

                & .container-boxes{
                  margin-bottom: 30px;
                  display: flex;
                  justify-content: space-evenly;

                & .box {
                      width: clamp(11rem, 15vw, 15rem); 
                      height: clamp(11rem, 15vw, 15rem);
                      border-radius: 30px;
                      cursor: pointer;
                      background-color: #ff5733;

                      &.box-1{
                        transition:transform 0.5s ease-in-out, background-color 1s ease-in;
          
                        &.animating {
                          pointer-events: none; 
                        }

                        &:not(.animating):hover {
                            transform: scale3d(0.75, 1.25, 1);
                        }
                      }

                      &.box-2{
                        transition: background-color 1s ease-in, transform 0.5s ease 0.1s;

                        &.animating {
                          pointer-events: none; 
                        }

                        &:not(.animating):hover {
                          transform: translateX(20px);
                        }
                      }
                  }
                }
            }
        `}
      </style>
    </div>
  );
};
