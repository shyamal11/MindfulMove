import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests
import { AuthContext } from './AuthContextProvider'; // Assuming you have an AuthContext for user information

const TrackFitness = () => {
  const { user } = useContext(AuthContext); // Access user context for user ID
  const [mentalHealthData, setMentalHealthData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    
    if (user) {
      fetchMentalHealthData(user.userId); // Fetch mental health data when component mounts with user ID
    }
  }, [user]);

  const fetchMentalHealthData = async (userId) => {
    console.log("Fetching data for user ID:", userId);
    try {
      const response = await axios.get(`http://localhost:5000/api/fetch-report/${userId}`);
      console.log("Response from server:", response.data); // Log response for debugging
      setMentalHealthData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mental health data:', error);
      setLoading(false);
    }
  };
  

  return (
    <div className="track-fitness-container">
      <h2>Track Your Mental Health Assessments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : mentalHealthData && mentalHealthData.length > 0 ? (
        <div className="mental-health-data">
          {mentalHealthData.map((report) => (
            <div key={report._id} className="mental-health-report">
              <p>Date: {new Date(report.timestamp).toLocaleDateString()}</p>
              <p>PHQ-9 Score: {report.phq9Score}</p>
              <p>PHQ-9 Severity: {report.phq9Severity}</p>
              <p>GAD-7 Score: {report.gad7Score}</p>
              <p>GAD-7 Severity: {report.gad7Severity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No mental health data found.</p>
      )}
    </div>
  );
  
};

export default TrackFitness;
