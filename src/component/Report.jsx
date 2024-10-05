// ReportPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HalfCircleMeter from './HalfCircleMeter'; // Import your HalfCircleMeter component

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportData = location.state?.reportData; // Retrieve report data from state

  // If reportData is not available, you can redirect back or show an error message
  if (!reportData) {
    navigate('/gad7'); // Navigate back to the questionnaire if no report data
    return null;
  }

  return (
    <div className="report-section">
      {/* Left Column: GAD-7 Score */}
      <div className="left-section">
        <div className="result-box">
          <h4>Your Score</h4>
          <div className="score">
            {reportData.gad7Score} <span>of 21</span>
          </div>
          <div className="severity">
            {reportData.gad7Severity}
          </div>
          <HalfCircleMeter score={reportData.gad7Score} />
        </div>
      </div>

      {/* Right Column: Summary */}
      <div className="right-section">
        <h4>Summary</h4>
        <p className="description">
          You scored higher than {Math.floor((reportData.gad7Score / 21) * 100)}% of people who have taken this test.
        </p>
        <ul className="summary-list">
          <li>
            <span className="summary-label">Minimal Anxiety</span>
            <span className="summary-score">0 - 4</span>
          </li>
          <li>
            <span className="summary-label">Mild Anxiety</span>
            <span className="summary-score">5 - 9</span>
          </li>
          <li>
            <span className="summary-label">Moderate Anxiety</span>
            <span className="summary-score">10 - 14</span>
          </li>
          <li>
            <span className="summary-label">Severe Anxiety</span>
            <span className="summary-score">15 - 21</span>
          </li>
        </ul>
        <div className="report-actions">
          {/* You may need to handle the view and retake actions as needed */}
          <button type="button" onClick={() => navigate('/gad7')}>
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
