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

    const updateLogoColor = () => {
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

    window.addEventListener("scroll", updateLogoColor);
    updateLogoColor();

    return () => {
      window.removeEventListener("scroll", updateLogoColor);
    };
  }, []);

  return (
    <header>
      <div class="logo-container">
        <h2 class="black-logo">DIDACT</h2>
      </div>

      <div className="link-container">
        <img src="/github-icon.svg" alt="github icon" />
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

            border-bottom: 1px solid #827a7a;

            & .logo-container{
                --scaleAmplitude: 0.2;

                &.animate-logo-container{
                    animation: pulse 0.5s ease-in-out;
                  }

                & h2{  
                    font-family: "Luckiest Guy", cursive;
                    font-weight: 400;      
                    transition: color 0.3s linear;

                    &.black-logo{
                      color: var(--black);
                    }
                    
                    &.white-logo{
                      color: var(--white);
                    }
                } 
            }

            & .link-container{
              background-color: var(--white);
              border: 1px solid var(--white);
              border-radius: 50%;
              cursor: pointer;
         
            }          
        }

        `}
      </style>
    </header>
  );
};
