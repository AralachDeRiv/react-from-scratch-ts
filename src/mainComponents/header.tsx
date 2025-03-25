import * as Didact from "Didact";

export const Header = () => {
  Didact.useEffect(() => {
    const logoText = document.querySelector<HTMLElement>(".logo-container h2");
    const header = document.querySelector<HTMLElement>("header");

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".black-bg, .white-bg")
    );

    if (!logoText || !header || sections.length === 0) return;

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
          logoText.classList.remove("black-logo");
          logoText.classList.add("white-logo");
        } else {
          logoText.classList.remove("white-logo");
          logoText.classList.add("black-logo");
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
            backdrop-filter:  blur(1px);

            & .logo-container{

                & h2{  
                    font-family: "Luckiest Guy", cursive;
                    font-weight: 400;      
                    transition: color 1s linear;

                    &.black-logo{
                      color: var(--black);
                    }
                    
                    &.white-logo{
                      color: var(--white);
                    }                   
                } 
            }       
        }

        `}
      </style>
    </header>
  );
};
