import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TestPopup from '../component/PopUp'; // Assuming this is your popup component
import '../component/popup.css'; // Assuming you have the necessary styles for the popup
import './exercise.css';
import lunges from "../assets/img/evaluate-icon-for-your-website-mobile-presentation-and-logo-design-free-vector.jpg";
import yoga from "../assets/img/attachment_121893514.png";
import ex from "../assets/img/1707478560595-removebg-preview.png";


const Exercise = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const location = useLocation(); // Hook to get the current location
  const navigate = useNavigate(); // Hook to access the navigate function

  // Function to open the popup
  const handleClick = () => {
    setIsPopupOpen(true); // Open the popup when "Start" is clicked
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup when the user clicks "Close" in the popup
    navigate('/'); // Redirect after closing
  };

  // Use effect to open popup automatically when the component mounts
  useEffect(() => {
    if (location.pathname === '/exercise') {
      setIsPopupOpen(true); // Open the popup if the current path is /exercise
    }
  }, [location.pathname]); // Dependency on the pathname

  return (
    <section>
      <div className="container exercise__top">
        <div className="exercise__top">
          <h2 className="title_ex">
            How it <span className="highlights">Works</span>
          </h2>
        </div>
        <div className="exButtonm">
          <div className="exercise__wrapper">
            <a href="/assessment" className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <div className="exercise__content">
                <span className="exercise__icon"><img src={lunges} alt="err" /></span>
                <h4>Assessment</h4>
                <p>Take quick and insightful GAD-7 and PHQ-9 assessments to measure your anxiety and depression levels</p>
              </div>
            </a>

            <a href="/yoga" className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <div className="exercise__content">
                <span className="exercise__icon"><img src={yoga} alt="err" /></span>
                <h4>Personalized Activites</h4>
                <p>Receive exercise and wellness tips tailored to your individual needs and progress</p>
              </div>
            </a>

            <a href="/ai-instructor" className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <div className="exercise__content">
                <span className="exercise__icon"><img src={ex} alt="err" /></span>
                <h4> Fitness Coach</h4>
                <p>Real-time guidance with AI that detects and corrects your posture during exercises</p>
              </div>
            </a>
          </div>

          <div className="exButton">
            <div className="start-line"></div>
            <div className="mental-well-being-message">
              Ready to nurture your mental well-being?
            </div>
            <button onClick={handleClick} className="btn btn-start">
              Begin Assessment
            </button>

    
            
          </div>

        </div>
      </div>

      {/* Conditionally render the TestPopup component based on isPopupOpen */}
      {isPopupOpen && <TestPopup closePopup={closePopup} />}
    </section>
  );
};

export default Exercise;
