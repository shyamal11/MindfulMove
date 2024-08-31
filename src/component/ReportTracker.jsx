import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContextProvider';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const TrackFitness = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReports(user.userId);
    }
  }, [user]);

  const fetchReports = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/fetch-report/${userId}`);
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  // Prepare data for line chart
  const chartData = {
    labels: reports.map(report => moment(report.timestamp).format('MMM D, YYYY')),
    datasets: [
      {
        label: 'PHQ-9 Score',
        data: reports.map(report => ({ x: moment(report.timestamp), y: report.phq9Score })),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      },
      {
        label: 'GAD-7 Score',
        data: reports.map(report => ({ x: moment(report.timestamp), y: report.gad7Score })),
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="track-fitness-container">
      <h2>Track Your Mental Health Assessments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reports.length > 0 ? (
        <div>
          {/* Line Chart */}
          <div className="line-chart">
            <Line
              data={{
                datasets: chartData.datasets,
                labels: chartData.labels
              }}
              options={{
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'day'
                    },
                    title: {
                      display: true,
                      text: 'Date'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Score'
                    }
                  }
                }
              }}
            />
          </div>
          {/* Reports Table */}
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>PHQ-9 Score</th>
                  <th>PHQ-9 Severity</th>
                  <th>GAD-7 Score</th>
                  <th>GAD-7 Severity</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>{moment(report.timestamp).format('MMM D, YYYY')}</td>
                    <td>{report.phq9Score}</td>
                    <td>{report.phq9Severity}</td>
                    <td>{report.gad7Score}</td>
                    <td>{report.gad7Severity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No mental health data found.</p>
      )}
    </div>
  );
};

export default TrackFitness;
