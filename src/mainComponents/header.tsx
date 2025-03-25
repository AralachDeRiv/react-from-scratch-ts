import * as Didact from "Didact";

export const Header = () => {
  Didact.useEffect(() => {
    const logoContainer =
      document.querySelector<HTMLElement>(".logo-container");
    const logoText = document.querySelector<HTMLElement>(".logo-container h2");
    const header = document.querySelector<HTMLElement>("header");

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".black-bg, .white-bg")
    );

    if (!logoText || !header || !logoContainer || sections.length === 0) return;

    // These variables will be used to active the animation
    let previousColorClass = "";
    let currentColorClass = "";

    const updateLogoColorAndAnimation = () => {
      let closestSection: HTMLElement | null = null;
      let minDistance = Infinity;

      for (let section of sections) {
        const sectionTop = section.getBoundingClientRect().top;
        const headerHeight = header.offsetHeight;

        if (
          sectionTop <= headerHeight &&
          sectionTop + section.offsetHeight > 0
        ) {
          const distance = Math.abs(sectionTop - headerHeight);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        }
      }

      if (closestSection instanceof HTMLElement) {
        if (closestSection.classList.contains("black-bg")) {
          currentColorClass = "black-logo";
          logoText.classList.remove("black-logo");
          logoText.classList.add("white-logo");
        } else {
          currentColorClass = "white-logo";
          logoText.classList.remove("white-logo");
          logoText.classList.add("black-logo");
        }

        if (currentColorClass !== previousColorClass) {
          logoContainer.classList.remove("animate-logo-container");
          void logoContainer.offsetWidth;
          logoContainer.classList.add("animate-logo-container");
          previousColorClass = currentColorClass;
        }
      }
    };

    window.addEventListener("scroll", updateLogoColorAndAnimation);
    updateLogoColorAndAnimation();

    return () => {
      window.removeEventListener("scroll", updateLogoColorAndAnimation);
    };
  }, []);

  return (
    <header>
      <div class="logo-container">
        <h2 class="black-logo">DIDACT</h2>
      </div>

      <div className="link-container">
        <img src="/github-icon.svg" alt="github icon" />
        <a href="https://github.com/" target="_blanc">
          See the code
        </a>
      </div>

      <style>
        {`

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(calc(1 + var(--scaleAmplitude)));
          }
          100% {
            transform: scale(1);
          }
        }

        header{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 1rem;
            background-color: transparent;
            backdrop-filter: blur(2px);

            border-bottom: 1px solid rgba(130, 122, 122, 0.24);

            & .logo-container{
                --scaleAmplitude: 0.2;

                &.animate-logo-container{
                    animation: pulse 0.5s ease-in-out;
                  }

                & h2{  
                    font-family: "Luckiest Guy", cursive;
                    font-weight: 400;      
                    transition: color 0.5s ease-in-out;

                    &.black-logo{
                      color: var(--black);
                    }
                    
                    &.white-logo{
                      color: var(--white);
                    }
                } 
            }

            & .link-container{
              position: relative;
              background-color: var(--white);
              border: 1px solid var(--white);
              border-radius: 50%;

              & a{
                position: absolute;
                overflow: hidden;
                opacity: 0;
                top: 50%;
                left: 0;
                transform: translate(-110%, -50%);

                color: var(--black);
                white-space: nowrap;
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;

                background-color: var(--white);
                padding: 9px 20px;
                border: 1px solid var(--black);
                border-radius: 50px;

                transition: box-shadow 0.4s, background-color 0.4s, color 0.4s, opacity 0.7s ;

                &:hover{
                  box-shadow: inset 0 0 0 3px #ef476f, 
                                  inset 0 0 0 6px #ffd166, 
                                  inset 0 0 0 9px #06d6a0,
                                  inset 0 0 0 12px #118ab2;
                  background-color: #073b4c;
                  color: var(--white);
                }     
              }

              &:hover a{
                opacity: 1;
              }
         
            }          
        }

        `}
      </style>
    </header>
  );
};
