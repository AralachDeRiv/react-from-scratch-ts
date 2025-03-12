import * as Didact from "Didact";

// TODO : Voir si il y a un loyen + élégant d'utiliser le style
const element = (
  <div id="First" style={{ backgroundColor: "salmon" }} class="oki">
    <h1>Hello, world!</h1>
    <h2 style={{ textAlign: "right" }}>
      from <span style={{ fontSize: "60px" }}>Didact</span>
    </h2>
    <style>
      {`
        /* Scope functionning on google */
          h2 {
            cursor: pointer;
            color: red;      
        
            & span {
              transition: all 0.3s linear;

              &:hover{
                color: blue
              }     
            }
          }  
    `}
    </style>
  </div>
);

Didact.render(element, document.getElementById("root")!);
