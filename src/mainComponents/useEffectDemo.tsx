import * as Didact from "Didact";
import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseEffectDemo = () => {
  let [seconds, setSeconds] = Didact.useState(0);
  let [start, setStart] = Didact.useState(false);
  let secondsRef = Didact.useRef(seconds);
  let intervalRef = Didact.useRef(null);

  Didact.useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  Didact.useEffect(() => {
    // let interval: NodeJS.Timeout;

    // console.log(start);

    console.log(seconds);

    if (start) {
      intervalRef.current = setInterval(() => {
        setSeconds(() => secondsRef.current + 1); // Utilise la fonction de mise à jour
      }, 1000);
    } else {
      console.log("ici");

      clearInterval(intervalRef.current); // Nettoie l’intervalle quand `start` devient `false`
    }

    return () => clearInterval(intervalRef.current);
  }, [start]);

  return (
    <div>
      <DemoTitle title="USEEFFECT" style={ContainerStyle.LIGHT} />

      <div class="clock-container">
        <button onClick={() => setStart(() => (start == true ? false : true))}>
          start
        </button>

        <div class="clock">
          <div class="hand minute" id="minute"></div>
          <div class="hand second" id="second"></div>
          <div class="center"></div>

          <div
            class="mark big h12"
            style="transform: rotate(0deg) translateY(-140px)"
          ></div>
          <div
            class="mark h1-30"
            style="transform: rotate(45deg) translateY(-150px)"
          ></div>
          <div
            class="mark big h3"
            style="transform: rotate(90deg) translateY(-140px)"
          ></div>
          <div
            class="mark h4-30"
            style="transform: rotate(135deg) translateY(-150px)"
          ></div>
          <div
            class="mark big h6"
            style="transform: rotate(180deg) translateY(-140px)"
          ></div>
          <div
            class="mark h7-30"
            style="transform: rotate(225deg) translateY(-150px)"
          ></div>
          <div
            class="mark big h9"
            style="transform: rotate(270deg) translateY(-140px)"
          ></div>
          <div
            class="mark h10-30"
            style="transform: rotate(315deg) translateY(-150px)"
          ></div>
        </div>
      </div>

      <style>
        {`
            @scope{
                :scope{
                    position: relative;
                    min-height: 300px;
                    padding: 50px;
                    display: flex;
                    justify-content: center;
                }

                .clock {
                  position: relative;
                  overflow: hidden;
                  width: 300px;
                  height: 300px;
                  background: var(--white);
                  border-radius: 50%;
                  border: 10px double var(--black);
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  & .mark {
                    position: absolute;
                    border-radius: 10px;
                    width: 2px;
                    height: 40px;
                    background: var(--black);

                    &.big {
                      height: 45px;
                      width: 6px;
                    }
                  }

                  & .center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);

                    height: 13px;
                    width: 13px;
                    background-color: #ffd166;
                    border-radius: 50%;
                  }

                  & .hand {
                    position: absolute;
                    bottom: 50%;
                    left: 50%;
                    transform-origin: 50% 100%;
                    border-radius: 4px;

                    &.minute {
                      width: 5px;
                      height: 70px;
                      background-image: linear-gradient(to top, #ffd166, #ef476f);

                      transform: translateX(-50%);
                    }

                    &.second {
                      width: 6px;
                      height: 100px;
                      background-image: linear-gradient(
                        to top,
                        #ffd166 25%,
                        #06d6a0,
                        #118ab2
                      );

                      transform: translateX(-50%) rotate(${seconds * 6}deg);

                      &::after {
                        position: absolute;
                        content: "";
                        right: 50%;
                        top: -10%;
                        transform: translateX(50%);
                        width: 19px;
                        height: 19px;
                        background-color: #118ab2;
                        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
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
