import React, { useState } from 'react';
import TestPopup from '../component/PopUp'; // Assuming this is your popup component
import '../component/popup.css'; // Assuming you have the necessary styles for the popup
import './exercise.css'
import lunges from "../assets/img/lunges.png"
import yoga from "../assets/img/yoga-pose.png"
import ex from "../assets/img/extended.png"

const Exercise = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  


  const handleClick = () => {
    setIsPopupOpen(true); // Open the popup when "Start" is clicked
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup when the user clicks "Close" in the popup
  };

  return (
    <section>
      <div className="container exercise__top">
        <div className="exercise__top">
          <h2 className="section__title">
            How it <span className="highlights">Works</span>
          </h2>
        </div>
        <div className="exButtonm">
          <div className="exercise__wrapper">
            <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <span className="exercise__icon"><img src={lunges} alt="err" /></span>
              <div className="exercise__content">
                <h4>Assessment</h4>
                <p>Include stress, anxiety, and depression assessments to understand your mental well-being.</p>
              </div>
            </div>
            <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <span className="exercise__icon"><img src={yoga} alt="err" /></span>
              <div className="exercise__content">
                <h4>Suggested Yoga</h4>
                <p>Based on your assessment, we recommend yoga to improve flexibility, mental clarity, and overall well-being.</p>
              </div>
            </div>
            <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
              <span className="exercise__icon"><img src={ex} alt="err" /></span>
              <div className="exercise__content">
                <h4>Yoga with AI Instructor</h4>
                <p>Experience live yoga sessions guided by AI instructors for personalized and interactive sessions.</p>
              </div>
            </div>
          </div>
          <div className="exButton">
          <div className="start-line"></div> 
    <div className="mental-well-being-message">
        Ready to nurture your mental well-being?
    </div>
    <button onClick={handleClick} className="btn btn-start">
    Begin Your Assessment 
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
