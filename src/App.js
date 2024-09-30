import React, { useEffect, useState, useContext } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "./App.css"; // Ensure your global styles are imported correctly
import Footer from "./UI/Footer";
import Header from "./component/Header";
import AllRoutes from "./component/AllRoutes";
import Bot from "./component/bot";
import { AuthContext } from "./component/AuthContextProvider";
import HashLoader from "react-spinners/HashLoader"; // Import the spinner component

function App() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    Aos.init();

    // Function to dynamically load CSS files
    const loadCss = () => {
      const cssBaseUrl = process.env.REACT_APP_CSS_BASE_URL;
      const cssFiles = [
        'header.css',
        'bot.css',
        'footer.css',
        'hero.css',
        'pricing.css',
        'Questionnaires.css',
        'exercise.css',
        'modal.css',
        'start.css',
        'ReportTracker.css',
        'track.css'
      ];

      // Create an array to track when all CSS files are loaded
      let loadedCount = 0;

      cssFiles.forEach((cssFile) => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = `${cssBaseUrl}${cssFile}`;

        // Increment the loaded count when the file is loaded
        linkElement.onload = () => {
          loadedCount += 1;
          if (loadedCount === cssFiles.length) {
            setIsLoading(false); // All CSS files are loaded
          }
        };

        // Error handling: If a CSS file fails to load, hide the spinner after a fallback delay
        linkElement.onerror = () => {
          console.error(`Error loading CSS file: ${cssFile}`);
          loadedCount += 1; // Increment the count even if there's an error
          if (loadedCount === cssFiles.length) {
            setIsLoading(false); // Hide spinner after error
          }
        };

        document.head.appendChild(linkElement);
      });
    };

    // Load CSS when component mounts
    loadCss();

    // Optional: Set a maximum timeout in case something goes wrong
    const maxTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Fallback after 5 seconds if CSS is taking too long

    // Cleanup on unmount
    return () => {
      clearTimeout(maxTimeout);
    };
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <HashLoader
            color="#164B60"
            loading
            size={50}
            speedMultiplier={1.5}
          />
        </div>
      ) : (
        <>
          <Header />
          <AllRoutes />
          <Bot />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
