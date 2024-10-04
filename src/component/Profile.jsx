import React, { useEffect, useState } from 'react';
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
  
  // Example user data
  const [user, setUser] = useState({ username: 'Guest', profilePicture: 'path_to_profile_picture.jpg' });

  // Temporary data state
  const [temporaryData, setTemporaryData] = useState(null);

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

  // Fetch data from local storage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('temporaryGAD7Report');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTemporaryData(parsedData);
      // Update user state if username is stored in local storage
      if (parsedData.username) {
        setUser({ username: parsedData.username, profilePicture: 'path_to_profile_picture.jpg' }); // Update with actual profile picture if available
      }
    }
  }, []);

  // Prepare Test Scores Data

  const username = user ? user.username : null; 

  const storedResults = temporaryData?.testResults || []; 

  const latestTestScoresData = storedResults.length
  ? storedResults.reduce((acc, result, index) => {
      const existingEntry = acc.find(item => item.date === result.date);
      
      if (existingEntry) {
        // If entry exists, keep only the latest GAD7 and PHQ9 scores
        if (index > storedResults.findIndex(item => item.date === existingEntry.date)){
        existingEntry.GAD7 = result.username === username ? Math.max(existingEntry.GAD7, result.gad7Score || 0) : existingEntry.GAD7;
        existingEntry.PHQ9 = result.username === username ? Math.max(existingEntry.PHQ9, result.phq9Score || 0) : existingEntry.PHQ9;}
      } else {
        acc.push({
          date: result.date || 'N/A',
          GAD7: result.username === username ? result.gad7Score || 0 : 0, 
          PHQ9: result.username === username ? result.phq9Score || 0 : 0,
        });
      }

      return acc;
    }, [])
  : sampleTestScores.map(score => ({
      date: score.date,
      GAD7: score.GAD7,
      PHQ9: score.PHQ9,
    }));


  // Data for Yoga Sessions Line Chart (Total Duration)
  const yogaSessionsData = temporaryData?.yogaSessions?.length > 0
    ? temporaryData.yogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.totalDuration += session.duration; // Sum durations for the same date
      } else {
        acc.push({ date: session.date, totalDuration: session.duration });
      }
      return acc;
    }, [])
    : sampleYogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.totalDuration += session.duration; // Sum durations for the same date
      } else {
        acc.push({ date: session.date, totalDuration: session.duration });
      }
      return acc;
    }, []);

  // Data for Donut Chart
  const yogaDonutData = temporaryData?.yogaSessions?.length > 0
    ? temporaryData.yogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.data.push({ name: session.yogaType, value: session.duration });
        existingSession.totalDuration += session.duration;
      } else {
        acc.push({ date: session.date, data: [{ name: session.yogaType, value: session.duration }], totalDuration: session.duration });
      }
      return acc;
    }, [])
    : sampleYogaSessions.reduce((acc, session) => {
      const existingSession = acc.find(item => item.date === session.date);
      if (existingSession) {
        existingSession.data.push({ name: session.yogaType, value: session.duration });
        existingSession.totalDuration += session.duration;
      } else {
        acc.push({ date: session.date, data: [{ name: session.yogaType, value: session.duration }], totalDuration: session.duration });
      }
      return acc;
    }, []);

    

  return (
    <div className="start-profile">
      <div className="profile-container">
        <div className="profile-left">
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <h2>{user.username}</h2>
        </div>

        <div className="profile-right">
          <div className="charts-row">
            <div className="chart-container">
              <h4>Test Scores (GAD-7 & PHQ-9)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={latestTestScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 21]} ticks={[0, 5, 10, 15, 20, 25]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="GAD7" fill="#4A90E2" name="GAD-7" barSize={30} />
                  <Bar dataKey="PHQ9" fill="#D0021B" name="PHQ-9" barSize={30} />
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
                              entry.name === 'Hatha Yoga' ? '#FF4B5C' :
                                entry.name === 'Vinyasa Yoga' ? '#6C63FF' :
                                  entry.name === 'Ashtanga Yoga' ? '#FFCC00' :
                                    '#FFC0CB' // Default color for other yoga types
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
