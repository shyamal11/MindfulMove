import React, { useEffect, useContext } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "./App.css"; // Ensure your global styles are imported correctly
import Footer from "./UI/Footer";
import Header from "./component/Header";
import AllRoutes from "./component/AllRoutes";
import Bot from "./component/bot";
import { AuthContext } from "./component/AuthContextProvider";
import Home from "./UI/Home";

function App() {
  useEffect(() => {
    Aos.init();

    // Function to dynamically load CSS files
    const loadCss = () => {
      const cssBaseUrl = process.env.REACT_APP_CSS_BASE_URL;
      const cssFiles = [
        'header.css',       // Path to your main CSS file
        'bot.css', 
        'footer.css', 
        'hero.css', 
        'pricing.css', 
        'Questionnaires.css', 
        'exercise.css',
        'modal.css',
        'start.css'  ,
        'ReportTracker.css',
        'track.css' // Path to additional CSS files
      ];

      cssFiles.forEach((cssFile) => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = `${cssBaseUrl}${cssFile}`;
        document.head.appendChild(linkElement);
      });
    };

    // Load CSS when component mounts
    loadCss();
  }, []);

  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Header />
      <AllRoutes /> 
      <Bot />
      <Footer />
    </div>
  );
}

export default App;
