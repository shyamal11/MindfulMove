import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "./App.css"; // Ensure your global styles are imported correctly
import Footer from "./UI/Footer";
import Header from "./component/Header";
import AllRoutes from "./component/AllRoutes";
import Bot from "./component/bot"; // Ensure the path is correct
import Spinner from "./component/Spinner"; // Import the spinner component


function App() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [showBot, setShowBot] = useState(false); // Track bot visibility

  useEffect(() => {
    Aos.init();

    const loadCss = () => {
      const cssBaseUrl = process.env.REACT_APP_CSS_BASE_URL;
      const cssFiles = [
        'header.css',
        'bot.css',
        'footer.css',
        'hero.css',
        'pricing.css',
       
        'exercise.css',
        'modal.css',
        'start.css',
        'track.css'
      ];

      let loadedCount = 0;

      cssFiles.forEach((cssFile) => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = `${cssBaseUrl}${cssFile}`;

        linkElement.onload = () => {
          loadedCount += 1;
          if (loadedCount === cssFiles.length) {
            setIsLoading(false); // All CSS files are loaded
          }
        };

        linkElement.onerror = () => {
          console.error(`Error loading CSS file: ${cssFile}`);
          setTimeout(() => setIsLoading(false), 3000);
        };

        document.head.appendChild(linkElement);
      });
    };

    loadCss();

    const maxTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(maxTimeout);
    };
  }, []);

  const toggleBot = () => {
    setShowBot((prev) => !prev);
  };

  return (
    <div className="App">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Header toggleBot={toggleBot} /> {/* Pass the toggle function to the Header */}

          <AllRoutes />
          <Bot isOpen={showBot} toggleBot={toggleBot} /> {/* Show bot only if visible */}



          {/* Always display the bot icon and GIF */}
          <div
            className="ask-doctor-container"
            style={{
              position: 'fixed',
              bottom: '50px',
              right: '25px',
              zIndex: 1000,
            }}
          >
            <button
              className="ask-doctor-button"
              onClick={toggleBot}

            >
              Ask Virtual Doc
            </button>
            {!showBot && (
              <div className="ask-doctor-gif">
                <img
                  src={require('./assets/img/turing-test.gif')} // Replace with your GIF URL
                  alt="AI Animation"
                  className="ask-doctor-gif"

                />
              </div>
            )}
          </div>

          <Footer />

        </>
      )}
    </div>
  );
}

export default App;
