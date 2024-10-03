import React from 'react';
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

  
  const user = {
    username: 'JohnDoe',
    profilePicture: 'path_to_profile_picture.jpg',
    testScores: [
      { date: '2024-10-01', GAD7: 10, PHQ9: 8 },
      { date: '2024-09-29', GAD7: 7, PHQ9: 6 },
    ],
    yogaSessions: [
      { date: '09/28', yogaType: 'Hatha Yoga', duration: 30 },
      { date: '09/29', yogaType: 'Vinyasa Yoga', duration: 45 },
      { date: '09/29', yogaType: 'Ashtanga Yoga', duration: 25 },
      { date: '09/30', yogaType: 'Ashtanga Yoga', duration: 28 },
      { date: '09/30', yogaType: 'Hatha Yoga', duration: 18 },
      { date: '09/30', yogaType: 'XYZ Yoga', duration: 30 },
      { date: '10/01', yogaType: 'CTY Yoga', duration: 20 },
      { date: '10/01', yogaType: 'tree Yoga', duration: 20 },
      { date: '10/01', yogaType: 'Vinyasa Yoga', duration: 5 },
      { date: '10/01', yogaType: 'XYZ Yoga', duration: 50 },

    ],
  };

  // Data for Test Scores Bar Chart
  const testScoresData = user.testScores.map(score => ({
    date: score.date,
    GAD7: score.GAD7,
    PHQ9: score.PHQ9,
  }));

  // Data for Yoga Sessions Line Chart (Total Duration)
  const yogaSessionsData = user.yogaSessions.reduce((acc, session) => {
    const existingSession = acc.find(item => item.date === session.date);
    if (existingSession) {
      existingSession.totalDuration += session.duration; // Sum durations for the same date
    } else {
      acc.push({ date: session.date, totalDuration: session.duration });
    }
    return acc;
  }, []);

  // Data for Donut Chart
  const yogaDonutData = user.yogaSessions.reduce((acc, session) => {
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
    <div className="start-profile ">
      <div className="profile-container ">
        <div className="profile-left">
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
          <h2>{user.username}</h2>
        </div>

        <div className="profile-right">
          <div className="charts-row">
            <div className="chart-container">
              <h4>Test Scores (GAD-7 & PHQ-9)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testScoresData}  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
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
                <AreaChart data={yogaSessionsData} >
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
            <h4>Total Yoga Sessions Duration</h4>
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
                              // Assign colors dynamically based on the yogaType
                              entry.name === 'Hatha Yoga' ? '#FF4B5C' :
                                entry.name === 'Vinyasa Yoga' ? '#6C63FF' :
                                  entry.name === 'Ashtanga Yoga' ? '#FF7F50' :
                                    entry.name === 'Tree Yoga' ? '#F9C74F' :
                                      entry.name === 'XYZ Yoga' ? '#90BE6D' :
                                        entry.name === 'CTY Yoga' ? '#F39C12' :
                                          '#8884d8' // Default color for any other type
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip cursor={false} />
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
