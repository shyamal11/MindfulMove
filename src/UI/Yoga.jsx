import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Glide, { Controls, Breakpoints } from '@glidejs/glide/dist/glide.modular.esm';
import './YogaUI.css';
import treePose from '../utils/pose_images/tree.png';
import cobraPose from '../utils/pose_images/cobra.png';
import warriorPose from '../utils/pose_images/warrior.png';
import trianglePose from '../utils/pose_images/triangle.jpg';

const poseData = [
  { name: 'Tree', img: treePose, benefit: 'Improves Focus and Concentration' },
  { name: 'Cobra', img: cobraPose, benefit: 'Relaxes & reduces stress' },
  { name: 'Warrior', img: warriorPose, benefit: 'Builds strength & stability.' },
  { name: 'Downward Dog', img: trianglePose, benefit: 'Enhanced Emotional Regulation' }
];

const YogaPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const glide = new Glide('.glide', {
      type: 'carousel',
      perView: 3, // Show 3 items at a time
      focusAt: 'center',
      breakpoints: {
        800: {
          perView: 2, // Show 2 items on medium screens
        },
        480: {
          perView: 1, // Show 1 item on small screens
        },
      },
    });

    glide.mount({ Controls, Breakpoints });

    return () => glide.destroy(); // Cleanup glide instance on unmount
  }, []);

  const handlePoseClick = (poseName) => {
    console.log("Pose clicked:", poseName);
    navigate(`/live-yoga?pose=${poseName}`);
  };

  return (
    <div className="container yoga-page">
      <div className="yoga-title-container">
        <h1 className="yoga-title">Explore Exercise</h1>
      </div>

      <div className="gallery-container">
        <div className="glide">
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {poseData.map((pose, index) => (
                <li key={index} className="glide__slide" onClick={() => handlePoseClick(pose.name)}>
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
          <div className="glide__arrows" data-glide-el="controls">
            <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="view-all-container">
        <button className="register__btn" onClick={() => navigate('/all-yoga')}>
          View All 
        </button>
      </div>
    </div>
  );
};

export default YogaPage;
