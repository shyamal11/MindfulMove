// TestPopup.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './popup.css';
import { ReactComponent as CloseIcon } from '../assets/img/close-icon.svg';

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
            <div className="card-icon">🧠</div>
            <h4 className="card-title">GAD-7</h4>
            <p className="card-description">Assess your anxiety severity</p>
          </div>
          <div className="test-card" onClick={handlePHQ9Click}>
            <div className="card-icon">😞</div>
            <h4 className="card-title">PHQ-9</h4>
            <p className="card-description">Evaluate your depression severity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPopup;
