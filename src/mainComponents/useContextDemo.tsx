// function Header() {
//   const theme = Didact.useContext(ThemeContext); // Consommer le contexte du thème

//   return (
//     <header style={{ backgroundColor: theme === "light" ? "white" : "black" }}>
//       <h1 style={{ color: theme === "light" ? "black" : "white" }}>
//         Current theme: {theme}
//       </h1>
//     </header>
//   );
// }

import * as Didact from "Didact";
import { DemoTitle } from "../components/demoTitle";
import { ContainerStyle } from "../types/types";

const LightContext = Didact.createContext("OFF");

const Lights = () => {
  const light = Didact.useContext(LightContext);

  return (
    <div class="room">
      <div class={`light light-one   ${light}`}></div>
      <div class={`light light-two   ${light}`}></div>
      <div class={`light light-three ${light}`}></div>
      <div class={`light light-four  ${light}`}></div>
      <div class={`light light-five  ${light}`}></div>

      <h2>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellendus,
        delectus!
      </h2>

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
                        top: -5%;
                        z-index: 3;

                        width: 800px; /* Largeur du faisceau lumineux */
                        height: 700px; /* Hauteur du faisceau lumineux */
                        clip-path: polygon(50% 0%, 25% 100%, 75% 100%);

                        &.ON{
                            background: linear-gradient(
                              180deg,
                              rgb(142, 154, 160) 0%,
                              rgba(255, 255, 255, 0) 50%,
                              rgba(255, 255, 255, 0) 100%
                            );
                        }

                        &.light-one{
                            transform: rotate(-45deg);
                        }

                        &.light-two{
                            left: 0;
                        }

                        &.light-three{
                            left: 5%;
                            transform: rotate(20deg);
                        }

                        &.light-four{
                            left: 8%;
                            transform: rotate(30deg);
                        }

                        &.light-five{
                            left: 10%;
                            transform: rotate(35deg);
                        
                        
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

        <div class="toggle">
          <input
            type="checkbox"
            onChange={() => setLight(() => (light == "ON" ? "OFF" : "ON"))}
          />
          <label></label>
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


                  .toggle {
                    position: absolute;
                    bottom: 20px;
                    right: 30px;
                  
                    
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
                    
                    & input[type="checkbox"]:checked + label:before {
                      background-image: linear-gradient(#77c2bb, #77c2bb);
                    }
                    
                    & input[type="checkbox"]:checked + label:after {
                      top: 32px;
                      border-color: #009688;
                    }
                  }
   
                }
            }  
        `}
      </style>
    </div>
  );
};

// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Faisceau Lumineux</title>
//     <style>
//       /* Style pour le faisceau lumineux */
//       .light-holder {
//         position: relative;
//         height: 300px; /* Hauteur du faisceau lumineux */
//         width: 300px; /* Largeur du faisceau lumineux */
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         background-color: #121212;
//       }

//       .light {
//         position: absolute;
//         z-index: 3;
//         top: 0;
//         width: 500px; /* Largeur du faisceau lumineux */
//         height: 600px; /* Hauteur du faisceau lumineux */

//         clip-path: polygon(50% 0%, 25% 100%, 75% 100%);
//         background: linear-gradient(
//           180deg,
//           rgb(142, 154, 160) 0%,
//           rgba(255, 255, 255, 0) 50%,
//           rgba(255, 255, 255, 0) 100%
//         );
//       }

//       .light-two {
//         position: absolute;
//         z-index: 2;
//         top: -50%;
//         right: 20%;

//         width: 500px; /* Largeur du faisceau lumineux */
//         height: 600px; /* Hauteur du faisceau lumineux */

//         transform: rotate(90deg);

//         clip-path: polygon(50% 0%, 25% 100%, 75% 100%);
//         background: linear-gradient(
//           180deg,
//           rgb(142, 154, 160) 0%,
//           rgba(255, 255, 255, 0) 50%,
//           rgba(255, 255, 255, 0) 100%
//         );
//       }

//       /* Style pour le mot à illuminer */
//       .text {
//         font-size: 30px;
//         font-weight: bold;
//         color: transparent;
//         background-clip: text;

//         text-align: center;
//         z-index: 0;
//         position: absolute;
//         bottom: 10px;

//         color: rgba(255, 255, 255, 0.546);
//         text-shadow: rgba(172, 164, 164, 0.297) 0 5px;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="light-holder">
//       <div class="light"></div>
//       <div class="light-two"></div>
//       <span class="text">Illuminé</span>
//     </div>
//   </body>
// </html>
