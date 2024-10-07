/* eslint-disable */

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContextProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [temporaryData, setTemporaryData] = useState(null);
  const [latestTestScoresData, setLatestTestScoresData] = useState([]);
  const [yogaSessionsData, setYogaSessionsData] = useState([]);
  const [yogaDonutData, setYogaDonutData] = useState([]);
  const [userTest, setUser] = useState({ username: 'Guest', profilePicture: 'path_to_profile_picture.jpg' });

  // Sample data
  const sampleTestScores = [
    { date: '10/01/2024', GAD7: 10, PHQ9: 8 },
    { date: '09/29/2024', GAD7: 7, PHQ9: 6 },
  ];

  const sampleYogaSessions = [
    { date: '09/28', yogaType: 'Hatha Yoga', duration: 30 },
    { date: '09/29', yogaType: 'Vinyasa Yoga', duration: 45 },
    { date: '09/29', yogaType: 'Ashtanga Yoga', duration: 25 },
    { date: '09/30', yogaType: 'Ashtanga Yoga', duration: 28 },
    { date: '09/30', yogaType: 'Hatha Yoga', duration: 18 },
    { date: '09/30', yogaType: 'XYZ Yoga', duration: 30 },
    { date: '10/01', yogaType: 'CTY Yoga', duration: 20 },
    { date: '10/01', yogaType: 'Tree Yoga', duration: 20 },
    { date: '10/01', yogaType: 'Vinyasa Yoga', duration: 5 },
    { date: '10/01', yogaType: 'XYZ Yoga', duration: 50 },
  ];

  useEffect(() => {
    if (!user) {
      // Case 1: No user logged in
      const storedData = sessionStorage.getItem('temporaryGAD7Report');
      if (storedData) {
        // Case 2: User not logged in but data stored in session
        const parsedData = JSON.parse(storedData);
        setTemporaryData(parsedData);
        if (parsedData.username) {
          setUser({ username: parsedData.username, profilePicture: 'path_to_profile_picture.jpg' }); // Update with actual profile picture if available
        }
        prepareDataFromTemporary(parsedData);
      } else {
        // Fallback to sample data if no session data
        setLatestTestScoresData(sampleTestScores);
        setYogaSessionsData(prepareYogaSessionsData(sampleYogaSessions));
        setYogaDonutData(prepareYogaDonutData(sampleYogaSessions));
      }
    } else {
      // Case 3: User logged in
      fetchUserData();
    }
  }, [user]);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_FETCH_REPORT_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch report');
      }

      const userData = await response.json();
      prepareUserData(userData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to sample data if fetching fails
      setLatestTestScoresData(sampleTestScores);
      setYogaSessionsData(prepareYogaSessionsData(sampleYogaSessions));
      setYogaDonutData(prepareYogaDonutData(sampleYogaSessions));
    }
  };

  // Function to prepare user data
  const prepareUserData = (userData) => {
    const yogaSessions = userData.yogaSessions || sampleYogaSessions;
    setYogaSessionsData(prepareYogaSessionsData(yogaSessions));
    setYogaDonutData(prepareYogaDonutData(yogaSessions));

    const username = user.username; // Using logged-in username
    const storedResults = userData.latestTestScores || []; // Assuming the API returns this structure

    console.log("hdgs",userData)

    const latestTestScoresData = storedResults.length
      ? storedResults.reduce((acc, result) => {
        const existingEntry = acc.find(item => item.date === result.date);
        if (existingEntry) {
          existingEntry.GAD7 = Math.max(existingEntry.GAD7, result.gad7Score || 0);
          existingEntry.PHQ9 = Math.max(existingEntry.PHQ9, result.phq9Score || 0);
        } else {
          acc.push({
            date: result.date || 'N/A',
            GAD7: result.GAD7 || 0,
            PHQ9: result.PHQ9 || 0,
          });
        }
        return acc;
      }, [])
      : sampleTestScores.map(score => ({
        date: score.date,
        GAD7: score.GAD7,
        PHQ9: score.PHQ9,
      }));

    setLatestTestScoresData(latestTestScoresData);
  };

  // Function to prepare data from temporary data
  const prepareDataFromTemporary = (parsedData) => {
    const yogaSessions = parsedData.yogaSessions || sampleYogaSessions;
    setYogaSessionsData(prepareYogaSessionsData(yogaSessions));
    setYogaDonutData(prepareYogaDonutData(yogaSessions));

    const username = parsedData.username; // Use username from temporary data
    const storedResults = parsedData.testResults || []; // Assuming the temporary data contains test results

    const latestTestScoresData = storedResults.length
      ? storedResults.reduce((acc, result) => {
        const existingEntry = acc.find(item => item.date === result.date);
        if (existingEntry) {
          existingEntry.GAD7 = Math.max(existingEntry.GAD7, result.gad7Score || 0);
          existingEntry.PHQ9 = Math.max(existingEntry.PHQ9, result.phq9Score || 0);
        } else {
          acc.push({
            date: result.date || 'N/A',
            GAD7: result.gad7Score || 0,
            PHQ9: result.phq9Score || 0,
          });
        }
        return acc;
      }, [])
      : sampleTestScores.map(score => ({
        date: score.date,
        GAD7: score.GAD7,
        PHQ9: score.PHQ9,
      }));

    setLatestTestScoresData(latestTestScoresData);
  };

  // Helper function to prepare yoga sessions data for AreaChart
  const prepareYogaSessionsData = (yogaSessions) => {
    return yogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.totalDuration += session.duration; // Sum durations for the same date
      } else {
        acc.push({ date: session.date, totalDuration: session.duration });
      }
      return acc;
    }, []);
  };

  // Helper function to prepare yoga sessions data for Donut Chart
  const prepareYogaDonutData = (yogaSessions) => {
    return yogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.data.push({ name: session.yogaType, value: session.duration });
        existingSession.totalDuration += session.duration;
      } else {
        acc.push({
          date: session.date,
          data: [{ name: session.yogaType, value: session.duration }],
          totalDuration: session.duration,
        });
      }
      return acc;
    }, []);
  };

  const yogaColorMap = {
    'Hatha Yoga': '#FF4B5C',
    'Vinyasa Yoga': '#6C63FF',
    'Ashtanga Yoga': '#FFCC00',
    'XYZ Yoga': '#FFC0CB',
    'CTY Yoga': '#00C49F',
    'Tree Yoga': '#FFBB28',
  };

  return (
    <div className="start-profile">
      <div className="profile-container">
        <div className="profile-left">
          {user ? (
            <>
              <img src={user.profilePicture} alt="Profile" className="profile-picture" />
              <h2>{user.username}</h2>
            </>
          ) : (
            <>
            <img src={userTest.profilePicture} alt="Profile" className="profile-picture" />
            <h2>{userTest.username}</h2>
          </>
          )}
        </div>

        <div className="profile-right">
          <div className="charts-row">
            <div className="chart-container">
              <h4>Test Scores (GAD-7 & PHQ-9)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={latestTestScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="GAD7" fill="#8884d8" name="GAD-7" barSize={30}/>
                  <Bar dataKey="PHQ9" fill="#82ca9d" name="PHQ-9" barSize={30}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h4>Total Yoga Sessions Duration</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={yogaSessionsData}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7ED321" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload.length) {
                        return (
                          <div style={{ background: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                            <p style={{ margin: 0 }}>{`Date: ${payload[0].payload.date}`}</p>
                            <p style={{ margin: 0 }}>{`Total Duration: ${payload[0].value} mins`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="totalDuration" stroke="#4A90E2" fill="url(#colorArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
       

          <div className="chart-container">
            <h4>Yoga Session Distribution</h4>
            <div className="yoga-donut-charts">
              {yogaDonutData.map((data, index) => (
                <div className="donut-chart-container" key={index}>
                  <h4>{data.date}</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        label={false} // Disable the default labels
                      >
                        {data.data.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                             yogaColorMap[entry.name] || '#FFC0CB'
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
