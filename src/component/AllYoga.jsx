import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './AllYoga.css'; // Import the CSS file for styling
import treePose from '../utils/pose_images/tree.png';
import cobraPose from '../utils/pose_images/cobra.png';
import warriorPose from '../utils/pose_images/warrior.png';
import trianglePose from '../utils/pose_images/triangle.jpg';
import dogPose from '../utils/pose_images/dog.png';
import chairPose from '../utils/pose_images/chair.png';
import ShoulderstandPose from '../utils/pose_images/Shoulderstand.png';
import video from '../assets/img/testvideo.mp4'

const poseData = [
  { name: 'Tree', img: treePose, benefit: 'Improves Focus and Concentration' },
  { name: 'Cobra', img: cobraPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Warrior', img: warriorPose, benefit: 'Builds strength & stability.' },
  { name: 'triangle', img: trianglePose, benefit: 'Enhanced Emotional Regulation' },
  { name: 'Downward Dog', img: dogPose, benefit: 'Relaxes & reduces stress' },
  { name: 'chair', img: chairPose, benefit: 'Builds strength & stability.' },
  { name: 'Shoulder Stand ', img: ShoulderstandPose, benefit: 'Enhanced Emotional Regulation' }

];

const AllYogaPage = () => { // Changed component name to AllYogaPage

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on mount
  }, []); // Empty dependency array ensures this runs only once on mount

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
    <div className="allyoga-page">
      <div className='allyoga-title'>
      <div className="allyoga-hero">
        <video autoPlay muted loop className="video-background">
          <source src= {video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      <div className='allyoga-intro'>
        <h1>Embark on Your Wellness Journey</h1>
        <p>Tap on any pose below to be led through a tailored workout session by our virtual AI instructor!!</p>
      </div>
      </div>
      </div>
      <div className="allyoga-search-container">
        <input
          type="text"
          placeholder="Find an exercise..."
          className="allyoga-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="allyoga-pose-gallery">
        {filteredPoses.map((pose, index) => (
          <div key={index} className="allyoga-pose-card" onClick={() => handlePoseClick(pose.name)}>
            <div className="allyoga-pose-image-container">
              <img src={pose.img} alt={pose.name} className="allyoga-pose-image" loading="lazy" />
            </div>
            <div className="allyoga-pose-details">
              <h2 className="allyoga-pose-name">{pose.name}</h2>
              <p className="allyoga-pose-benefit">{pose.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>


  );
};

export default AllYogaPage; // Changed export name to AllYogaPage
