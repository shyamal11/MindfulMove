import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContextProvider';
import '../styles/Questionnaires.css';
import AuthModal from './modal'; // Assuming AuthModal is implemented

const PHQ9AndGAD7Questionnaire = () => {
  const { user } = useContext(AuthContext);

  const [phq9Responses, setPhq9Responses] = useState(Array(9).fill(''));
  const [gad7Responses, setGad7Responses] = useState(Array(7).fill(''));
  const [showReport, setShowReport] = useState(false);
  const [saveReportModalOpen, setSaveReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handlePhq9InputChange = (index, value) => {
    const newResponses = [...phq9Responses];
    newResponses[index] = value;
    setPhq9Responses(newResponses);
  };

  const handleGad7InputChange = (index, value) => {
    const newResponses = [...gad7Responses];
    newResponses[index] = value;
    setGad7Responses(newResponses);
  };

  const analyzeReport = () => {
    const phq9Score = calculatePHQ9Score(phq9Responses);
    const gad7Score = calculateGAD7Score(gad7Responses);
    
    const analyzedData = {
      phq9Score,
      phq9Severity: getPHQ9Severity(phq9Score),
      gad7Score,
      gad7Severity: getGAD7Severity(gad7Score),
    };

    setReportData(analyzedData);
    setShowReport(true); // Show the report popup
  };

  const calculatePHQ9Score = (responses) => {
    let score = 0;
    responses.forEach((response, index) => {
      if (response === 'Several days') {
        score += 1;
      } else if (response === 'More than half the days') {
        score += 2;
      } else if (response === 'Nearly every day') {
        score += 3;
      }
    });
    return score;
  };

  const calculateGAD7Score = (responses) => {
    let score = 0;
    responses.forEach((response, index) => {
      if (response === 'Several days') {
        score += 1;
      } else if (response === 'More than half the days') {
        score += 2;
      } else if (response === 'Nearly every day') {
        score += 3;
      }
    });
    return score;
  };

  const getPHQ9Severity = (score) => {
    if (score >= 20) {
      return 'Severe depression';
    } else if (score >= 15) {
      return 'Moderately severe depression';
    } else if (score >= 10) {
      return 'Moderate depression';
    } else if (score >= 5) {
      return 'Mild depression';
    } else {
      return 'Minimal depression';
    }
  };

  const getGAD7Severity = (score) => {
    if (score >= 15) {
      return 'Severe anxiety';
    } else if (score >= 10) {
      return 'Moderate anxiety';
    } else if (score >= 5) {
      return 'Mild anxiety';
    } else {
      return 'Minimal anxiety';
    }
  };

  const handleSaveReport = async () => {
    if (!user) {
      setSaveReportModalOpen(true); // Open login modal if user is not logged in
    } else {
      try {
        setSubmitting(true);

        const payload = {
          userId: user.userId,
          ...reportData, // Use spread operator to include all data from reportData
        }

        const response = await fetch('http://localhost:5000/api/save-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to save report');
        }

        setSuccessMessage('Report saved successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error saving report:', error);
        setError('Failed to save report. Please try again later.');
      } finally {
        setSubmitting(false);
        setShowReport(false); // Close report popup after saving
        setSaveReportModalOpen(false); // Close save report modal
      }
    }
  };

  const responseOptions = [
    'Not at all',
    'Several days',
    'More than half the days',
    'Nearly every day'
  ];

  const phq9Questions = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead or of hurting yourself in some way',
  ];

  const gad7Questions = [
    'Feeling nervous, anxious, or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it is hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen',
  ];

  return (
    <div className="questionnaires-container">
      <h2 className="page-title">PHQ-9 and GAD-7 Questionnaires</h2>
      <p className="page-description">
        The PHQ-9 and GAD-7 are self-report questionnaires used to screen for and measure the severity of depression and anxiety, respectively. Please answer the questions below based on your experiences over the past two weeks.
      </p>
      <form className="questionnaires-form">
        <div className="questionnaire">
          <div className="phq9">
            <h3>PHQ-9 Questionnaire</h3>
            <div className="questions">
              {phq9Questions.map((question, index) => (
                <div key={index} className="question">
                  <label>{question}</label>
                  <select
                    value={phq9Responses[index]}
                    onChange={(e) => handlePhq9InputChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {responseOptions.map((option, optIndex) => (
                      <option key={optIndex} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="questionnaire">
          <div className="gad7">
            <h3>GAD-7 Questionnaire</h3>
            <div className="questions">
              {gad7Questions.map((question, index) => (
                <div key={index} className="question">
                  <label>{question}</label>
                  <select
                    value={gad7Responses[index]}
                    onChange={(e) => handleGad7InputChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {responseOptions.map((option, optIndex) => (
                      <option key={optIndex} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="submit-button">
          <button type="button" onClick={analyzeReport} disabled={submitting}>
            {submitting ? 'Analyzing...' : 'Analyze Report'}
          </button>
        </div>
        {showReport && (
          <div className="report-popup">
            <h3>PHQ-9 Score: {reportData.phq9Score}</h3>
            <p>Depression Severity: {reportData.phq9Severity}</p>
            <h3>GAD-7 Score: {reportData.gad7Score}</h3>
            <p>Anxiety Severity: {reportData.gad7Severity}</p>
            <div className="report-actions">
              <button type="button" onClick={handleSaveReport}>Save Report</button>
              <button type="button" onClick={() => setShowReport(false)}>Close</button>
            </div>
          </div>
        )}
        {saveReportModalOpen && (
          <AuthModal isOpen={true} onRequestClose={() => setSaveReportModalOpen(false)} />
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default PHQ9AndGAD7Questionnaire;
