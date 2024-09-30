import React, { useState } from 'react';
import { poseInstructions } from '../../utils/data';
import { poseImages } from '../../utils/pose_images';
import './Instructions.css';

export default function Instructions({ currentPose }) {
    const [instructions] = useState(poseInstructions);

    // Check if currentPose has valid instructions
    const poseInstructionsForCurrentPose = instructions[currentPose];

    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {poseInstructionsForCurrentPose ? (
                    poseInstructionsForCurrentPose.map((instruction, index) => (
                        <li key={index} className="instruction">
                            {instruction}
                        </li>
                    ))
                ) : (
                    <li className="instruction">No instructions available for this pose.</li>
                )}
            </ul>
            <img 
                className="pose-demo-img"
                src={poseImages[currentPose]} // Ensure poseImages[currentPose] exists
                alt={currentPose} // Add alt text for accessibility
            />
        </div>
    );
}
