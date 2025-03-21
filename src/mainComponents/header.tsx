export const Header = () => {
  return (
    <header>
      <div class="logo-container">
        <h2>DIDACT</h2>
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
            background-color: rgba(10, 181, 175, 0.175);
            backdrop-filter: blur(1px);

            & .logo-container{
                font-family: "Luckiest Guy", cursive;
                font-weight: 400;
                color: green; 
            }
                
            

        }

        `}
      </style>
    </header>
  );
};
