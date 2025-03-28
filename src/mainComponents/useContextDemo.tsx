import * as Didact from "Didact";
import { DemoTitle } from "../components/demoTitle";
import { ContainerStyle } from "../types/types";

const LightContext = Didact.createContext("OFF");

const Lights = () => {
  const light = Didact.useContext(LightContext);

  return (
    <div class="room">
      <div class={`light light-one ${light}`}>
        <div class="shape triangle"></div>
      </div>
      <div class={`light light-two ${light}`}>
        <div class="shape circle"></div>
      </div>
      <div class={`light light-three ${light}`}>
        <div class="shape star"></div>
      </div>
      <div class={`light light-four ${light}`}>
        <div class="shape diamond"></div>
      </div>

      <style>
        {`
            @scope{
                :scope{
                    position: relative;
                    width: 100%;
                    height: 100%;

                    h2{
                      color: var(--black);
                      position :absolute;
                      top: 50%;
                      z-index: 10;  
                    }

                    .light{
                        position: absolute;
                        top: -9%;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 1;

                        width: 750px; 
                        height: 800px; 
                        clip-path: polygon(50% 0%, 10% 100%, 90% 100%);

                        opacity: 0; 
                        transition: opacity 0.3s ease;

                        --light-color : ;
                        background: linear-gradient(
                              180deg,
                              var(--light-color) 0%,
                              rgba(255, 255, 255, 0) 50%,
                              rgba(255, 255, 255, 0) 100%
                            );

                        &.ON{
                          opacity: 1; 
                        }

                        &.OFF{
                          opacity: 0;
                        }

                        &.light-one{
                            --light-color: #ef476f;
                            left: 25%;
                            transition-delay: 0.5s;
                        }

                        &.light-two{
                            --light-color: #ffd166;
                            left: 45%; 
                            transition-delay: 0.7s;                       
                        }

                        &.light-three{
                            --light-color: #06d6a0;
                            left: 65%; 
                            transition-delay: 0.9s;                        
                        }

                        &.light-four{
                            --light-color: #118ab2;
                            left: 85%;
                            transition-delay: 1.1s; 
                        }

                        & .shape{
                          position : absolute;
                          top: 220px;
                          left: 50%;
                          transform: translateX(-50%);
                          z-index: 10;
                          width: 100px;
                          height: 100px;
                          background-color: var(--black);

                          --shape: ;
                          clip-path: var(--shape);

                          &.triangle{
                            --shape : polygon(50% 0%, 0% 100%, 100% 100%);
                          }

                          &.circle{
                            --shape: circle(50% at 50% 50%);
                          }

                          &.star{
                            --shape: polygon(
                                      50% 0%,
                                      61% 35%,
                                      98% 35%,
                                      68% 57%,
                                      79% 91%,
                                      50% 70%,
                                      21% 91%,
                                      32% 57%,
                                      2% 35%,
                                      39% 35%
                                    );  
                          }

                          &.diamond{
                            --shape: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)
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

export const UseContextDemo = () => {
  const [light, setLight] = Didact.useState("OFF");

  return (
    <div>
      <DemoTitle title="USECONTEXT" style={ContainerStyle.DARK} />
      <LightContext.Provider value={light}>
        <Lights />

        <div class="toggle-container">
          <h3>Toggle the switch</h3>
          <div class="toggle">
            <input
              type="checkbox"
              onChange={() => setLight(() => (light == "ON" ? "OFF" : "ON"))}
            />
            <label></label>
          </div>
        </div>
      </LightContext.Provider>

      <style>
        {`
            @scope{
                :scope{
                    position: relative;
                    min-height: 400px;

                    & > .context-provider {
                        width: 100%;
                        height: 100%;    
                    }

                  
                  .toggle-container{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    
                    display: flex;
                    gap: 20px;
                    align-items: center;


                    & h3{
                      color: var(--white);
                      font-family: var(--hand-write-font-family);
                      font-size: 1.4rem;
                      font-weight: 200;
                    }    
                  }

                  .toggle {
                    position: relative;
  
                    & input[type="checkbox"] {
                      position: absolute;
                      left: 0;
                      top: 0;
                      z-index: 10;
                      width: 100%;
                      height: 100%;
                      cursor: pointer;
                      opacity: 0;
                    }
                    
                    & label {
                      position: relative;
                      display: flex;
                    }
                    
                    & label:before {
                      content: "";
                      width: 28px;
                      height: 60px;
                      background: linear-gradient(#bbb, #bbb) no-repeat center;
                      background-size: 2px 64px;
                      display: inline-block;
                      transition: 0.2s ease-in;
                    }
                    
                    & label:after {
                      content: "";
                      position: absolute;
                      width: 28px;
                      height: 28px;
                      border: 6px solid #bbb;
                      border-radius: 50%;
                      left: 0;
                      top: 0;
                      z-index: 2;
                      background: #fff;
                      transition: 0.2s ease-in;
                    }
                  
                    & input[type="checkbox"]:checked + label:after {
                      top: 32px;
                    }
                  }
   
                }
            }  
        `}
      </style>
    </div>
  );
};
