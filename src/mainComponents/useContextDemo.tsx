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

      <style>
        {`
            @scope{
                :scope{
                    position: relative;
                    width: 100%;
                    height: 100%;

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
        <div class="switch">
          <input
            id="toggle"
            type="checkbox"
            onChange={() => setLight(() => (light == "ON" ? "OFF" : "ON"))}
          />
          <label class="toggle" for="toggle">
            <i></i>
          </label>
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

                    .switch {
                        position: absolute;
                        bottom: 10px;
                        right: 40px;
                        width: 210px;
                        height: 50px;
                        box-sizing: border-box;
                        padding: 3px;
                        background: #0d0d0d;
                        border-radius: 6px;
                        box-shadow: inset 0 1px 1px 1px rgba(0, 0, 0, 0.5),
                          0 1px 0 0 rgba(255, 255, 255, 0.1);

                        & input[type="checkbox"] {
                          position: absolute;
                          z-index: 1;
                          width: 100%;
                          height: 100%;
                          opacity: 0;
                          cursor: pointer;

                          & + label {
                            position: relative;
                            display: block;
                            left: 0;
                            width: 50%;
                            height: 100%;
                            background: #1b1c1c;
                            border-radius: 3px;
                            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
                            transition: all 0.5s ease-in-out;
                          }

                          & + label:before {
                            content: "";
                            display: inline-block;
                            width: 5px;
                            height: 5px;
                            margin-left: 10px;
                            background: #fff;
                            border-radius: 50%;
                            vertical-align: middle;
                            box-shadow: 0 0 5px 2px rgba(165, 15, 15, 0.9),
                              0 0 3px 1px rgba(165, 15, 15, 0.9);
                            transition: all 0.5s ease-in-out;
                          }

                          & + label:after {
                            content: "";
                            display: inline-block;
                            width: 0;
                            height: 100%;
                            vertical-align: middle;
                          }

                          & + label i {
                            display: block;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 3px;
                            height: 24px;
                            margin-top: -12px;
                            margin-left: -1.5px;
                            border-radius: 2px;
                            background: #0d0d0d;
                            box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.3);
                          }

                          & label i:before,
                          & + label i:after {
                            content: "";
                            display: block;
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                            background: #0d0d0d;
                            box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.3);
                          }

                          & + label i:before {
                            left: -7px;
                          }

                          & + label i:after {
                            left: 7px;
                          }

                          &:checked + label {
                            left: 50%;
                          }

                          &:checked + label:before {
                            box-shadow: 0 0 5px 2px rgba(15, 165, 70, 0.9),
                              0 0 3px 1px rgba(15, 165, 70, 0.9);
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
