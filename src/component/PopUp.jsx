// TestPopup.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './popup.css';
import { ReactComponent as CloseIcon } from '../assets/img/close-icon.svg';
import phq9 from '../assets/img/246x0w-removebg-preview.png'
import gad7 from '../assets/img/images-removebg-preview.png'

const TestPopup = ({ closePopup }) => {
  const navigate = useNavigate();

  const handleGAD7Click = () => {
    closePopup();
    navigate('/gad7');
  };

  const handlePHQ9Click = () => {
    closePopup();
    navigate('/phq9');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="close-icon" onClick={closePopup}>
          <CloseIcon />
        </div>
        <h2 className="popup-title">Choose Your Assessment</h2>
        <p className="popup-subtitle">Taking the first step towards understanding your mental health is important!</p>
        <div className="test-options">
          <div className="test-card" onClick={handleGAD7Click}>
            <div className="card-icon">
              <img src={phq9} alt="" style={{ width: '50%' }} />
            </div>
           
            <p className="card-description">Assess  anxiety severity</p>
          </div>
          <div className="test-card" onClick={handlePHQ9Click}>
          <div className="card-icon">
              <img src={gad7} alt="" style={{ width: '50%' }}/>
            </div>
            
            <p className="card-description">Evaluate  depression severity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPopup;
