import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YogaUI.css';
import treePose from '../utils/pose_images/tree.png';
import cobraPose from '../utils/pose_images/cobra.png';
import warriorPose from '../utils/pose_images/warrior.png';
import trianglePose from '../utils/pose_images/triangle.jpg';
import dogPose from '../utils/pose_images/dog.png';
import ShoulderstandPose from '../utils/pose_images/Shoulderstand.png';


const poseData = [
  { name: 'Tree', img: treePose, benefit: 'Improves Focus and Concentration' },
  { name: 'Cobra', img: cobraPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Warrior', img: warriorPose, benefit: 'Builds strength & stability.' },
  { name: 'Downward Dog', img: trianglePose, benefit: 'Enhanced Emotional Regulation' },
  { name: 'dogPose', img: dogPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Shoulder Stand', img: ShoulderstandPose, benefit: 'Enhanced Emotional Regulation' },
  // Add more poses as needed
];

const YogaPage = () => {
  const navigate = useNavigate();
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0); // State to track the current pose index

  useEffect(() => {
    // Set the first seat as the reference seat
    const seats = document.querySelectorAll('.carousel-seat');
    if (seats.length > 0) {
      seats[0].classList.add('is-ref');
    }

    const intervalId = setInterval(() => {
      const el = document.querySelector('.is-ref');
      if (el) {
        const newSeat = el.nextElementSibling || seats[0]; // Loop back to the first seat if at the end
        el.classList.remove('is-ref');
        newSeat.classList.add('is-ref');
        
        // Update the current pose index
        setCurrentPoseIndex((prevIndex) => (prevIndex + 1) % poseData.length);

        seats.forEach((seat, index) => {
          seat.style.order = index + 2; // Adjust the order based on the new seat
        });

        document.querySelector('.carousel').classList.remove('is-set');
        setTimeout(() => {
          document.querySelector('.carousel').classList.add('is-set');
        }, 50);
      }
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handlePoseClick = (poseName) => {
    console.log("Pose clicked:", poseName);
    navigate(`/live-yoga?pose=${poseName}`);
  };

  return (
    <div>
      <h2 className="title_yoga">
        Explore <span className="highlights">Activities</span>
      </h2>

      <div className="container yoga-page">
        <div className="wrap">
          <ul className="carousel is-set">
            {poseData.map((pose, index) => (
              <li key={index} className="carousel-seat" onClick={() => handlePoseClick(pose.name)}>
                <div className="pose-card">
                  <div className="pose-image-container">
                    <img src={pose.img} alt={pose.name} className="pose-image" loading="lazy" />
                  </div>
                  <div className="pose-details">
                    <h2 className="pose-name">{pose.name}</h2>
                    <p className="pose-benefit">{pose.benefit}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Dots for Navigation */}
        <div className="dotss-container">
          {poseData.map((_, index) => (
            <span
              key={index}
              className={`dots ${currentPoseIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentPoseIndex(index)} // Navigate to specific pose on dot click
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="view-all-container">
          <button className="register__btn" onClick={() => navigate('/all-yoga')}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default YogaPage;
