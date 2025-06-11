import React, { Suspense, useState } from "react";
import SensePhase from "../components/Phases/SensePhase";
import FeelPhase from "../components/Phases/FeelPhase";
import LivePhase from "../components/Phases/LivePhase";
import FrameAnimation from "../components/InitialPhase/FrameAnimation";
import CameraController from "../components/CameraController";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useLevel from "../stores/useLevel";

// Optional: import Rock, Trees, etc. if needed
// import Rock from "../components/Environment/Rock";
// import Trees from "../components/Environment/Trees";

function InitialPhase() {
  const [newCameraZ, setNewCameraZ] = useState(-Math.PI / 4);
  const [targetReached, setTargetReached] = useState(false);
  const [cameraZ, setCameraZ] = useState(0);
  const [resettingCamera, setResettingCamera] = useState(false);

  const setPhase = useLevel((state) => state.setPhase);
  const currentPhase = useLevel((state) => state.phase);

  const initialCameraPos = new THREE.Vector3(0, -10, 50);

  // Phase Z positions
  const phasePositions = {
    sense: 50,
    feel: 25,
    live: -100,
  };

  useFrame((state, delta) => {
    const camera = state.camera;
    const currentZ = camera.position.z;
    setCameraZ(currentZ);

    console.log(currentZ);
    

    console.log("Current phase:", currentPhase);


    // Rotation easing
    if (currentZ <= 25 && !targetReached) {
      setTargetReached(true);
    }

    if (targetReached && Math.abs(newCameraZ) > 0.001) {
      const lerped = THREE.MathUtils.lerp(newCameraZ, 0, 0.05);
      setNewCameraZ(lerped);
    }

    // Reset camera if Z < -475
    if (currentZ < - 150 && !resettingCamera) {
      setResettingCamera(true);
    }

    if (resettingCamera) {
      camera.position.lerp(initialCameraPos, 0.05);
      if (camera.position.distanceTo(initialCameraPos) < 0.1) {
        camera.position.copy(initialCameraPos);
        setResettingCamera(false);
        setTargetReached(false);
        setNewCameraZ(-Math.PI / 4);
      }
    }

    // Phase detection
    const distances = Object.entries(phasePositions).map(([key, z]) => ({
      key,
      dist: Math.abs(camera.position.z - z),
    }));
    const nearest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));
    if (nearest.dist < 1 && nearest.key !== currentPhase) {
      setPhase(nearest.key);
    }
  });

  // Visibility toggles
  const showSense = cameraZ > -100;
  const showFeel = cameraZ <= -100;
  const showLive = cameraZ <= -200 && !resettingCamera;

  return (
    <Suspense fallback={null}>
      {/* Optional: <FrameAnimation /> */}
      <CameraController resettingCamera={resettingCamera} />

      {/* Optional static components */}
      {/* <Rock position={[...]} /> */}
      {/* <Trees position={[...]} /> */}

      {showSense && (
        <SensePhase
          position={[0, -10, 0]}
          rotation={[0, newCameraZ, 0]}
          targetReached={targetReached}
        />
      )}

      {showFeel && (
        <FeelPhase
          position={[0, -10, -100]}
          rotation={[0, newCameraZ, 0]}
          targetReached={targetReached}
        />
      )}

    </Suspense>
  );
}

export default InitialPhase;
