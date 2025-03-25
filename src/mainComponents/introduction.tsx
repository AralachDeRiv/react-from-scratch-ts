export const Introduction = () => {
  return (
    <div id="introduction-container">
      <p>
        This site is built using Didact, a React-from-scratch library inspired
        by Rodrigo Pombo's article,{" "}
        <a href="https://pomb.us/build-your-own-react/" target="_blanc">
          Build Your Own React
        </a>
        . Didact implements a custom-rendered version of React, showcasing how
        the Virtual DOM, reconciliation, and fiber architecture work under the
        hood.
      </p>

      <style>
        {`
            @scope{
                :scope{
                    display: flex;
                    justify-content: center;
                    align-items: center;  
                }

                p {
                    max-width: 1100px;
                    text-align: center;
                    color: var(--text-light-primary);  
                }

                a {
                    white-space: nowrap;
                    color: inherit;
                    text-decoration: none;

                    background:
                        linear-gradient(
                          to right,
                          rgba(100, 200, 200, 1),
                          rgba(100, 200, 200, 1)
                        ),
                        linear-gradient(to right, #ef476f 0%, #ffd166 25%, #06d6a0 50%, #118ab2 75%);

                    background-size: 100% 1px, 0 1px;
                    background-position: 100% 100%, 0 100%;
                    background-repeat: no-repeat;
                    transition: background-size 400ms;

                    &:hover{
                        background-size: 0 1px, 100% 1px;
                    }
                }


 




            }
        
        `}
      </style>
    </div>
  );
};
