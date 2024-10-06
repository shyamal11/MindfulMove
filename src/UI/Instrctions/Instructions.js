// poseData.js

import tree from '../../assets/img/tree.mp4';
import triangle from '../../assets/img/triangle.mp4';
import shoulderstand from '../../assets/img/shoulderstand.mp4';
import downwardDog from '../../assets/img/downwardDog.mp4';
import cobra from '../../assets/img/cobra.mp4';
import chair from '../../assets/img/chair.mp4';
import warrior from '../../assets/img/warrior.mp4';

const poseData = {
  'Warrior': {
    instructions: [
      '1. Come to a standing position with your feet together.',
      '2. Find a focal point to help you balance, then lift one leg up off the ground, grabbing ahold of your knee.',
      '3. Root down through all four corners of your standing-leg foot to find balance.',
      '4. Grab the ankle of your lifted leg with the same-side hand. Flex your foot, and bring the sole of your foot as high as you can on the standing-leg inner thigh with your toes facing down.',
      '5. Press your foot into your thigh and your thigh into your foot to create a lock.',
      '6. Bring your hands to your heart, or reach your arms high overhead to the fullest expression of the pose.'
    ],
    video: warrior,
  },
  'Tree': {
    instructions: [
      '1. Stand tall and shift your weight onto your left foot.',
      '2. Bring the sole of your right foot to your left inner thigh.',
      '3. Press your foot into your thigh and your thigh into your foot to create a lock.',
      '4. Once balanced, bring your hands to your heart center or extend them overhead.',
      '5. Focus on a point in front of you to help maintain your balance.',
      '6. Hold the pose for several breaths before switching sides.'
    ],
    video: tree,
  },
  'Downward Dog': {
    instructions: [
      '1. Start on your hands and knees.',
      '2. Tuck your toes under and lift your hips towards the ceiling.',
      '3. Press your hands into the mat and keep your spine straight.',
      '4. Try to keep your heels flat on the ground, if possible.',
      '5. Relax your head between your arms, and hold the position for a few breaths.',
      '6. Gradually lower back down to the starting position.'
    ],
    video: downwardDog,
  },
  'Triangle': {
    instructions: [
      '1. Stand with your feet wide apart.',
      '2. Turn your right foot out and your left foot slightly in.',
      '3. Extend your arms to the sides, then reach towards your right foot with your right hand.',
      '4. Place your right hand on your ankle or a block, and extend your left arm towards the ceiling.',
      '5. Keep your chest open and gaze up at your left hand.',
      '6. Hold the pose, then repeat on the other side.'
    ],
    video: triangle,
  },
  'Shoulder Stand': {
    instructions: [
      '1. Lie on your back and lift your legs overhead.',
      '2. Support your lower back with your hands, elbows on the ground.',
      '3. Keep your legs straight and perpendicular to the floor.',
      '4. Hold the pose and breathe deeply.',
      '5. To come down, slowly lower your legs back to the mat.'
    ],
    video: shoulderstand,
  },
  'Cobra': {
    instructions: [
      '1. Lie on your stomach with your hands under your shoulders.',
      '2. Press your hands into the mat and lift your chest off the ground.',
      '3. Keep your elbows close to your body and shoulders relaxed.',
      '4. Hold the position, breathing deeply.',
      '5. To release, lower your chest back to the mat.'
    ],
    video: cobra,
  },
  'Chair': {
    instructions: [
      '1. Stand with your feet together.',
      '2. Bend your knees and lower your hips as if sitting back into a chair.',
      '3. Keep your chest lifted and arms extended overhead.',
      '4. Hold the position while breathing steadily.',
      '5. To release, stand back up and relax.'
    ],
    video: chair,
  },
  // Add more poses and instructions as needed
};

export default poseData;
