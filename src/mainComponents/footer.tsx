export const Footer = () => {
  return (
    <footer>
      <p>
        Thank you for visiting! I really appreciate your time. Hope to see you
        again soon!
      </p>

      <style>
        {`
            @keyframes moveBg{
                from{
                    background-position: 100%;
                }

                to{
                    background-position: -100%;        
                }   
            }


            @scope{
                :scope{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                p{
                    text-align: center;
                    font-weight: 500; 
                    font-size: clamp(0.6rem, 5vw + 0.3rem, 1.2rem);
                    color: transparent;
                    
                    background-clip: text;
                    background-size: 200% auto;
                    background-image: linear-gradient(to right, 
                            var(--text-dark-secondary) 40%,
                            #ef476f 45%, 
                            #ffd166 50%, 
                            #06d6a0 55%, 
                            #118ab2 60%,
                            var(--text-dark-secondary) 65%
                            );

                    animation: moveBg 9s linear infinite;

                }

            }
        
        `}
      </style>
    </footer>
  );
};
