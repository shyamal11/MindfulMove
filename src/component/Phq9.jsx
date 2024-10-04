import React, { useState, useRef, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';
import AuthModal from './modal';
import './gad.css';
import HalfCircleMeter from './HalfCircleMeter';
import SuggestedYoga from './SuggestYoga'
import Swal from "sweetalert2";
const GAD7Questionnaire = () => {


  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on mount
  }, []); // Empty dependency array ensures this runs only once on mount

  const { user } = useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gad7Responses, setGad7Responses] = useState(Array(7).fill(''));
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [successMessage] = useState('');
  const [error, setError] = useState('');
  const [saveReportModalOpen, setSaveReportModalOpen] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [setIsReportSaved] = useState(false);
  const exercisesRef = useRef(null);

  const [setTemporaryData] = useState(null);

  const generateRandomUsername = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `Guest${randomNum}`;
  };

  const gad7Questions = [
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

  const responseOptions = [
    { label: 'Not at all', value: 'Not at all' },
    { label: 'Several days', value: 'Several days' },
    { label: 'More than half the days', value: 'More than half the days' },
    { label: 'Nearly every day', value: 'Nearly every day' },
  ];

  const handleGad7InputChange = (value) => {
    const newResponses = [...gad7Responses];
    newResponses[currentQuestionIndex] = value;
    setGad7Responses(newResponses);
    handleNextQuestion(); // Automatically move to next question
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < gad7Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      analyzeReport();
    }
  };

  const analyzeReport = () => {
    const phq9Score = calculateGAD7Score(gad7Responses);
    const analyzedData = { phq9Score, gad7Severity: getGAD7Severity(phq9Score) };
    setReportData(analyzedData);
    setShowReport(true); // Show report and hide other elements


    setTimeout(() => {
      setShowExercises(true);
      // Scroll down a bit to the suggested exercises section
      window.scrollTo({ top: window.scrollY + 50, behavior: 'smooth' }); // Scrolls down by 300 pixels
    }, 4000); // Change to 3000 for 3 seconds
  };



  const calculateGAD7Score = (responses) => {
    let score = 0;
    responses.forEach((response) => {
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

  const getGAD7Severity = (score) => {
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

  const handleSaveReport = async () => {
    // Retrieve the existing data from sessionStorage
    const storedData = sessionStorage.getItem('temporaryGAD7Report');
    const parsedData = storedData ? JSON.parse(storedData) : {};

    // Use the existing username or generate a new one if not logged in
    const existingUsername = parsedData.username || (user ? user.username : generateRandomUsername());

    // Prepare reportPayload with the existing username
    const reportPayload = {
      ...reportData,
      username: existingUsername, // Always use existing username
      date: new Date().toLocaleDateString(),
    };

    const existingTestResults = parsedData.testResults || [];
    const updatedTestResults = existingTestResults.filter(result => {
      // Keep records that do not have a gad7Score for this username
      return !(result.username === existingUsername && result.date === reportPayload.date && result.phq9Score !== undefined);
    });
  
    updatedTestResults.push(reportPayload);

    if (!user) {
      // For guests (not logged in)
      // Append the new test result

      sessionStorage.setItem('temporaryGAD7Report', JSON.stringify({
        ...parsedData,  // Keep any existing data
        username: existingUsername, // Retain the username
        testResults: updatedTestResults,  // Save updated test results
      }));

      setTemporaryData({
        ...reportPayload,
        testResults: updatedTestResults // Optional: Update temporary data state if needed
        
      });
      console.log("sc", updatedTestResults)
    
      Swal.fire({
        position: "top-mid",
        icon: "success",
        title: "🎉 Your data is safely stored for this session!<br /> <br />Want to keep track of your progress? <br /><br />Just <strong>log in</strong>!",
        showConfirmButton: false,
        timer: 4000,
      });
      setIsReportSaved(true);
    } else {
      try {
        const payload = {
          testResults: updatedTestResults.map(({ username, ...rest }) => ({
            ...rest,
            username: user.username, // Send the logged-in username instead
          })),
        };

        
        const response = await fetch(`${process.env.REACT_APP_REPORT_URL}`, {
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
  
        setIsReportSaved(true);
        Swal.fire({
          position: "top-mid",
          icon: "success",
          title: "Your Data has been Saved. Thank you!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        console.error('Error saving report:', error);
        setError('Failed to save report. Please try again later.');
      } finally {
        setShowReport(false); // Close report popup after saving
        setSaveReportModalOpen(false); // Close save report modal
      }
    }
  };

  return (
    <>
      <div className={`questionnaires-container ${showExercises ? 'exercises-visible' : ''}`}>
        <div className="wrapper-box">
          {!showReport ? ( // Render the questionnaire form only if the report is not shown
            <>
              <h2 className="page-title">PHQ-9 Questionnaire</h2>
              <p className="page-description">
              The Patient Health Questionnaire-9 (PHQ-9) is a brief, self-report tool that screens for, diagnoses, monitors, and measures the severity of depression
              </p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${((currentQuestionIndex + 1) / gad7Questions.length) * 100}%` }}
                />
              </div>
              <form className="questionnaires-form">
                <div className="questionnaire">
                  <div className={`question`}>
                    <label>{gad7Questions[currentQuestionIndex]}</label>
                    <div className="response-options">
                      {responseOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`card ${gad7Responses[currentQuestionIndex] === option.value ? 'selected' : ''}`}
                          onClick={() => handleGad7InputChange(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="button-container">
                  {currentQuestionIndex > 0 && (
                    <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} className="back-button">
                      Back
                    </button>
                  )}
                  {currentQuestionIndex === gad7Questions.length - 1 && (
                    <button type="button" onClick={analyzeReport}>
                      Finish
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            // Render the report when showReport is true
            <div className="report-section">
              {/* Left Column: GAD-7 Score */}
              <div className="left-section">
                <div className="result-box">
                  <h4>Your Score</h4>
                  <div className="score">
                    {reportData.phq9Score} <span>of 27</span>
                  </div>
                  <div className="severity">
                    {reportData.gad7Severity}
                  </div>
                  <HalfCircleMeter score={reportData.phq9Score} />

                </div>
              </div>

              {/* Right Column: Summary */}
              <div className="right-section">
                <h4>Summary</h4>
                <p className="description">
                  You scored higher than {Math.floor((reportData.phq9Score / 27) * 100)}% of people who have taken this test.
                </p>
                <ul className="summary-list">
                  <li>
                    <span className="summary-label">Minimal Depression</span>
                    <span className="summary-score">0 - 4</span>
                  </li>
                  <li>
                    <span className="summary-label">Mild Depression</span>
                    <span className="summary-score">5 - 9</span>
                  </li>
                  <li>
                    <span className="summary-label">Moderate Depression</span>
                    <span className="summary-score">10 - 14</span>
                  </li>
                  <li>
                    <span className="summary-label">Severe Depression</span>
                    <span className="summary-score">15 - 21</span>
                  </li>
                </ul>
                <div className="report-actions">
                  <button type="button" onClick={handleSaveReport}>Save Report</button>
                  <button type="button" onClick={() => {
                    setShowReport(false);
                    setShowExercises(false); // Hide the suggested exercises section when closing the report
                  }}>
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}



          {saveReportModalOpen && (
            <AuthModal isOpen={saveReportModalOpen} onClose={() => setSaveReportModalOpen(false)} />
          )}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      {showExercises && (
        <div
          ref={exercisesRef}
          className={`suggested-exercises-section ${showExercises ? 'suggested-exercises-visible' : ''}`}
        >

          <SuggestedYoga />
        </div>
      )}


    </>
  );
};

export default GAD7Questionnaire;
