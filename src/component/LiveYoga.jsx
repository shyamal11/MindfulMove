import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import './LiveYoga.css';

import { POINTS, keypointConnections } from '../utils/data';
import { drawPoint, drawSegment } from '../utils/helper';
import { count } from '../utils/music';

let skeletonColor = 'rgb(255,255,255)';
let interval;
let flag = false; // Flag to capture time when pose is detected

const Yoga = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pose = queryParams.get('pose') || 'Tree'; // Get the 'pose' query parameter from URL

  const [currentPose, setCurrentPose] = useState(pose);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [isStartPose, setIsStartPose] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        await tf.ready(); // Wait until TensorFlow.js is ready
        await tf.setBackend('webgpu'); // Optional: Set the backend to WebGPU
        runMovenet(); // Call your function to start pose detection
      } catch (error) {
        console.error("Error initializing TensorFlow or setting backend:", error);
      }
    };

    if (isStartPose) {
      initialize(); // Initialize TensorFlow when the pose session starts
    }
  }, [isStartPose]);

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
  };

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if (timeDiff > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  const get_center_point = (landmarks, left_bodypart, right_bodypart) => {
    try {
      let left = tf.gather(landmarks, left_bodypart, 1);
      let right = tf.gather(landmarks, right_bodypart, 1);
      const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
      return center;
    } catch (error) {
      console.error("Error calculating center point:", error);
    }
  };

  const get_pose_size = (landmarks, torso_size_multiplier = 2.5) => {
    try {
      let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
      let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
      let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
      let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
      pose_center_new = tf.expandDims(pose_center_new, 1);
      pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
      let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
      let max_dist = tf.max(tf.norm(d, 'euclidean', 0));
      let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
      return pose_size;
    } catch (error) {
      console.error("Error calculating pose size:", error);
    }
  };

  const normalize_pose_landmarks = (landmarks) => {
    try {
      let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
      pose_center = tf.expandDims(pose_center, 1);
      pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
      landmarks = tf.sub(landmarks, pose_center);
      let pose_size = get_pose_size(landmarks);
      landmarks = tf.div(landmarks, pose_size);
      return landmarks;
    } catch (error) {
      console.error("Error normalizing pose landmarks:", error);
    }
  };

  const landmarks_to_embedding = (landmarks) => {
    try {
      landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
      let embedding = tf.reshape(landmarks, [1, 34]);
      return embedding;
    } catch (error) {
      console.error("Error converting landmarks to embedding:", error);
    }
  };

  const runMovenet = async () => {
    try {
      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
      const poseClassifier = await tf.loadLayersModel('https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json');
      const countAudio = new Audio(count);
      countAudio.loop = true;

      interval = setInterval(() => {
        detectPose(detector, poseClassifier, countAudio);
      }, 100);
    } catch (error) {
      console.error("Error in running MoveNet:", error);
    }
  };

  
  const detectPose = async (detector, poseClassifier, countAudio) => {
    try {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        let notDetected = 0;
        const video = webcamRef.current.video;

        try {
          const pose = await detector.estimatePoses(video);
          if (!pose || pose.length === 0) {
            console.warn("No poses detected");
            return;
          }

          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          const keypoints = pose[0].keypoints;

          let input = keypoints.map((keypoint) => {
            if (keypoint.score > 0.4 && !(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)');
              const connections = keypointConnections[keypoint.name];
              connections?.forEach((connection) => {
                drawSegment(ctx, [keypoint.x, keypoint.y], [keypoints[POINTS[connection.toUpperCase()]].x, keypoints[POINTS[connection.toUpperCase()]].y], skeletonColor);
              });
            } else {
              notDetected += 1;
            }
            return [keypoint.x, keypoint.y];
          });

          if (notDetected > 4) {
            skeletonColor = 'rgb(255,255,255)';
            return;
          }

          const processedInput = landmarks_to_embedding(input);
          const classification = await poseClassifier.predict(processedInput);
          classification.array().then((data) => {
            const classNo = CLASS_NO[currentPose];
            if (data[0][classNo] > 0.97) {
              if (!flag) {
                countAudio.play();
                setStartingTime(new Date().getTime());
                flag = true;
              }
              setCurrentTime(new Date().getTime());
              skeletonColor = 'rgb(0,255,0)';
            } else {
              flag = false;
              skeletonColor = 'rgb(255,255,255)';
              countAudio.pause();
              countAudio.currentTime = 0;
            }
          }).catch(err => {
            console.error("Error processing classification:", err);
          });

        } catch (err) {
          console.error("Error estimating poses:", err);
        }
      } else {
        console.warn("Webcam video is not ready");
      }
    } catch (error) {
      console.error("Error in detectPose function:", error);
    }
  };


  function startYoga() {
    setIsStartPose(true);
    runMovenet();
  }

  function stopPose() {
    setIsStartPose(false);
    clearInterval(interval);
  }

  return (
    <div className="live-yoga-container">
      <h1 className="pose-title">Pose: {currentPose}</h1>
      <div className="yoga-session">
        <div className="camera-feed-container">
          <Webcam className="webcam" ref={webcamRef} />
          <canvas ref={canvasRef} id="my-canvas" width="640px" height="480px" style={{ position: 'absolute', left: 95, top: 230, zIndex: 1 }}></canvas>
        </div>
        <div className="video-box">
          <div className="video-container">
            <video controls>
              <source src="path_to_your_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="instruction-box">
            <h2>Instructions</h2>
            <p>Here you can include detailed instructions for the pose.</p>
          </div>
        </div>
      </div>
      {isStartPose ? (
        <button onClick={stopPose} className="secondary-btn">Stop Pose</button>
      ) : (
        <button onClick={startYoga} className="secondary-btn">Start Pose</button>
      )}
      <div className="performance-container">
        <div className="pose-performance"><h4>Pose Time: {poseTime} s</h4></div>
        <div className="pose-performance"><h4>Best: {bestPerform} s</h4></div>
      </div>
    </div>
  );
};

export default Yoga;
