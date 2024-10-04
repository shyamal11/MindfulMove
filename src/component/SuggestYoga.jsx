import React, { useState } from 'react';// Import useNavigate from react-router-dom
import './SuggestYoga.css'; // Import the CSS file for styling
import treePose from '../utils/pose_images/tree.png';
import cobraPose from '../utils/pose_images/cobra.png';
import warriorPose from '../utils/pose_images/warrior.png';


const poseData = [
  { name: 'Tree', img: treePose, benefit: 'Improves Focus and Concentration' },
  { name: 'Cobra', img: cobraPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Warrior', img: warriorPose, benefit: 'Builds strength & stability.' },
];

const SuggestedyogaPage = () => { // Corrected component name to SuggestedyogaPage
  const [searchTerm] = useState('');
  // Initialize useNavigate

  // Filter poses based on search term
  const filteredPoses = poseData.filter(pose =>
    pose.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle pose click
  const handlePoseClick = (poseName) => {
    console.log("Pose clicked:", poseName);
    window.open(`/live-yoga?pose=${poseName}`, '_blank'); // Navigate to the Yoga component with query parameter
  };

  // Function to handle "Try Now" button click
  const handleTryNowClick = (poseName) => {
    window.open(`/live-yoga?pose=${poseName}`, '_blank');// Navigate to the live yoga page for the specific pose
  };

  // Function to handle "Remind Me" button click
  const handleRemindMeClick = (poseName) => {
    console.log(`Reminder set for ${poseName}`); // You can add logic for reminders here
    // Example: navigate to a reminder page or show a notification
  };

  return (
    <div className="suggestedyoga-page">
      <div className="suggestedyoga-title-container">
        <h1 className="suggestedyoga-title">Suggested Exercises...</h1>
      </div>

      <div className="suggestedyoga-pose-gallery">
        {filteredPoses.map((pose, index) => (
          <div key={index}>
            <div className="suggestedyoga-pose-card" onClick={() => handlePoseClick(pose.name)}>
              <div className="suggestedyoga-pose-image-container">
                <img src={pose.img} alt={pose.name} className="suggestedyoga-pose-image" loading="lazy" />
              </div>
              <div className="suggestedyoga-pose-details">
                <h2 className="suggestedyoga-pose-name">{pose.name}</h2>
                <p className="suggestedyoga-pose-benefit">{pose.benefit}</p>
              </div>
            </div>
            <div className="button-container-new">
              <button type="button" className="try-now-button" onClick={() => handleTryNowClick(pose.name)}>Try Now</button>
              <button type="button" className="remind-me-button" onClick={() => handleRemindMeClick(pose.name)}>Remind Me</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedyogaPage; // Corrected export name to SuggestedyogaPage
