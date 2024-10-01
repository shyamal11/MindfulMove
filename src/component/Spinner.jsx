import React from "react";
import '../styles/Spinner.css'; // Make sure to import your CSS file

const LoadingScreen = () => {
  return (
    <div id="loading-screen">
      <div className="bouncing-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      
    </div>
  );
};

export default LoadingScreen;
