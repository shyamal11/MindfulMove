import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Yoga.css'; // Import the CSS file for styling
import treePose from '../utils/pose_images/tree.png';
import cobraPose from '../utils/pose_images/cobra.png';
import warriorPose from '../utils/pose_images/warrior.png';
import trianglePose from '../utils/pose_images/traingle.jpg';

const poseData = [
  { name: 'Tree', img: treePose, benefit: 'Improves Focus and Concentration' },
  { name: 'Cobra', img: cobraPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Warrior', img: warriorPose, benefit: 'Builds strength & stability.' },
  { name: 'Downward Dog', img: trianglePose, benefit: 'Enhanced Emotional Regulation' }
];

const YogaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Filter poses based on search term
  const filteredPoses = poseData.filter(pose =>
    pose.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle pose click
  const handlePoseClick = (poseName) => {
    console.log("Pose clicked:", poseName);
    navigate(`/live-yoga?pose=${poseName}`); // Navigate to the Yoga component with query parameter
  };

  return (
    <div className="yoga-page">
      <div className="yoga-title-container">
        <h1 className="yoga-title">Your Yoga Title</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="  Search yoga poses..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="pose-gallery">
        {filteredPoses.map((pose, index) => (
          <div key={index} className="pose-card" onClick={() => handlePoseClick(pose.name)}> {/* Add click handler */}
            <div className="pose-image-container">
              <img src={pose.img} alt={pose.name} className="pose-image" loading="lazy" />
            </div>
            <div className="pose-details">
              <h2 className="pose-name">{pose.name}</h2>
              <p className="pose-benefit">{pose.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YogaPage;
