// TestPopup.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './popup.css'; // Import the CSS for the popup
import { ReactComponent as CloseIcon } from '../assets/img/close-icon.svg';

const TestPopup = ({ closePopup }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGAD7Click = () => {
    closePopup(); // Close the popup
    navigate('/gad7'); // Redirect to the GAD-7 and PHQ-9 Questionnaire page
  };

  const handlePHQ9Click = () => {
    closePopup(); // Close the popup
    navigate('/phq9'); // Redirect to the PHQ-9 and GAD-7 Questionnaire page
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="close-icon" onClick={closePopup}>
          <CloseIcon />
        </div>
        <h2 className="popup-title">Select a Test</h2>
        <div className="test-options">
          <div className="test-card" onClick={handleGAD7Click}>
            <div className="card-icon">🧠</div>
            <h4 className="card-title">GAD-7</h4>
            <p className="card-description">Take the GAD-7 for Anxiety Assessment!</p>
          </div>
          <div className="test-card" onClick={handlePHQ9Click}>
            <div className="card-icon">😞</div>
            <h4 className="card-title">PHQ-9</h4>
            <p className="card-description">Take the PHQ-9 for Depression Assessment!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPopup;
