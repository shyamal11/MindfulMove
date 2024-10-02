import React, { useEffect, useState } from 'react';
import yourImage from '../assets/img/1000_F_493906068_6Syr6loEpxgGTCZAhRd2Z4LJXAy3zQNT-removebg-preview.png'; // Adjust path based on your file structure
import Speedometer from "react-d3-speedometer"; // Ensure the import is correct
import './HalfCircleMeter.css'; // Ensure your CSS file has the necessary styles

const AnxietyGauge = ({ score }) => {
  const [animatedValue, setAnimatedValue] = useState(0); 

  useEffect(() => {
    // Animate the value from the current animatedValue to the new score
    const duration = 1000; // Animation duration in milliseconds
    const stepTime = 50; // Update interval in milliseconds
    const steps = duration / stepTime; // Calculate total steps
    const increment = (score - animatedValue) / steps; // Calculate increment per step

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps) {
        setAnimatedValue(prevValue => Math.min(prevValue + increment, score)); // Ensure not to exceed the score
        currentStep++;
      } else {
        clearInterval(interval); // Clear the interval when done
      }
    }, stepTime);
  }, [score]); // Run the animation effect when score changes



  let severityColor = '#fffff'
  
  // Animation for the needle


  return (
    <div className="gauge-container">
      <img src={yourImage} alt="Anxiety Gauge" className="gauge-image" />
     
      
      <div className="speedometer-container">
        <Speedometer
          minValue={0}
          maxValue={21} // Assuming the max score is 21 for GAD-7
          value={animatedValue}
          needleColor={severityColor} // Needle color based on severity
          segments={5} // Number of segments for your speedometer
          segmentColors={['#00cd34', '#9acb34', '#ffc91f', '#ff6501', '#fe0002']} // Colors for segments
          needleHeightRatio={0.5}
          needleTransitionDuration={400}
          needleTransition="easeElastic"
          textColor="transparent" // Change the text color if necessary
          ringWidth={0} // Remove the ring to effectively hide the circular part
          backgroundColor="transparent" // Make the background transparent
        />
      </div>
    </div>
  );
};

export default AnxietyGauge;
