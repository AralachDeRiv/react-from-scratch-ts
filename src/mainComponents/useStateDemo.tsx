import * as Didact from "Didact";
import { ContainerStyle } from "../types/types";
import { DemoTitle } from "../components/demoTitle";

export const UseStateDemo = () => {
  const [text, setText] = Didact.useState("");

  const updateValue = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;
    setText(() => inputElement.value);
  };

  return (
    <div id="reconciliatio-demo">
      <DemoTitle title="USESTATE" style={ContainerStyle.DARK} />

      <div class="input-container">
        <input
          type="text"
          name="text"
          placeholder="Write a message"
          onInput={updateValue}
        />
      </div>

      <div class="frame-container">
        <div class="frame">
          <h2>{text}</h2>
        </div>
      </div>

      <style>
        {`

                @keyframes hueRotation{
                    from{
                        filter: hue-rotate(0)
                    }
                    to{
                        filter: hue-rotate(360deg) 
                    } 
                }

                @scope{
                    position: relative;
                    padding: 25px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 25px;
                    justify-content: space-evenly;
                    align-items: end;
                  
                    & .input-container{
                        min-width: 320px;
                        display: flex;
                        justify-content: center;
    
                        & input{
                            font-weight: 600;
                            outline: 4px solid var(--white);
                            border: 4px solid var(--black);
                            padding: 0.5rem;
                            max-width: 300px;
    
                            &:hover{
                                border-width: 2px;
                            }
    
                            &:focus{
                                border-width: 2px;
                                outline-width: 7px;
              
                            } 
                        }
                    }
    
                    & .frame-container{
    
                        & .frame{
                            width: 300px;
                            height: 300px;
                            padding: 10px;
                            outline: 10px groove var(--white);
                            border: 10px groove var(--white);
    
                            background-image: linear-gradient(45deg,rgb(201, 30, 70),rgb(21, 82, 226));
                            background-clip: text;
                            animation: hueRotation 4s linear infinite;

                            display: flex;
                            justify-content: center;
                            align-items: center;
    
                            & h2{
                                --text-length: ${text.length};
                                text-align: center;
                                color: transparent;
                                line-height: 1;
                                font-size: clamp(40px, calc(300px / var(--text-length)), 200px);
                                font-weight: 900;
                                overflow-wrap: break-word; 
                                word-break: break-word;
                            }
                        }
                    }
                }
            `}
      </style>
    </div>
  );
};
