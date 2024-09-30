import React, { useState } from 'react';
import { poseImages } from '../../utils/pose_images';
import './DropDown.css';

const DropDown = ({ poseList, currentPose, setCurrentPose }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePoseSelect = (pose) => {
        setCurrentPose(pose);
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className="dropdown dropdown-container" role="menu">
            <p>DropDown Component Rendered</p>
            <button 
                className="btn btn-secondary dropdown-toggle"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
            >
                {currentPose}
            </button>
            {isOpen && (
                <ul className="dropdown-menu dropdown-custom-menu" role="menu">
                    {poseList.map((pose, index) => (
                        <li key={index} onClick={() => handlePoseSelect(pose)} role="menuitem">
                            <div className="dropdown-item-container">
                                <p className="dropdown-item-1">{pose}</p>
                                <img 
                                    src={poseImages[pose]}
                                    className="dropdown-img"
                                    alt={`${pose} illustration`} 
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DropDown;
