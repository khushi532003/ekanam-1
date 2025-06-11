import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraController({ resettingCamera }) {
  const scrollDeltaRef = useRef(0);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const position = useRef(new THREE.Vector3(0, -10, 50));

  useEffect(() => {
    const handleWheel = (event) => {
      // ✅ Clamp scroll only if not too far
       if (event.deltaY > 0) {
      if (position.current.z > -250 && !resettingCamera) {
        scrollDeltaRef.current += event.deltaY * 0.020;
      }
    }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [resettingCamera]); // React to reset toggle


  useFrame((state, delta) => {
    const impulseStrength = 0.6 * delta;

    if (scrollDeltaRef.current !== 0) {
      velocity.current.z -= scrollDeltaRef.current * impulseStrength;
      scrollDeltaRef.current = 0;
    }

    // Damping
    velocity.current.multiplyScalar(0.95);

    // Clamp Z movement
    if (position.current.z + velocity.current.z < -420) {
      velocity.current.z = 0;
      position.current.z = -420; // lock at limit
    } else {
      position.current.add(velocity.current);
    }
    // console.log(position.current.z);
    

    state.camera.position.copy(position.current);

    const lookTarget = new THREE.Vector3(
      position.current.x,
      position.current.y,
      position.current.z - 10
    );
    state.camera.lookAt(lookTarget);

  });

  return null;
}
