import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Bridge() {
  // Load textures
  const [bridgeTexture] = useTexture([
    '/textures/sensebridge.png',
  ]);

  // Configure textures
  useMemo(() => {
    bridgeTexture.wrapS = bridgeTexture.wrapT = THREE.RepeatWrapping;
    bridgeTexture.minFilter = THREE.LinearFilter;
    bridgeTexture.magFilter = THREE.LinearFilter;
    bridgeTexture.anisotropy = 4;
  }, [bridgeTexture]);

  const bridgeRef = useRef();
  const [newCameraZ, setNewCameraZ] = useState(80);
  const [targetReached, setTargetReached] = useState(false);

  // Animation loop
  useFrame((state, delta) => {
    const cameraZ = state.camera.position.z;
    if (cameraZ <= 25 && !targetReached) setTargetReached(true);
    if (targetReached && Math.abs(newCameraZ) > 0.001) {
      const lerped = THREE.MathUtils.lerp(newCameraZ, 0, 0.05);
      setNewCameraZ(lerped);
    }
  });

  // Memoize geometries to prevent re-creation
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(3.8, 2, 0.01), []);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(20, 1.5), []);

  return (
    <>
      {/* Move EffectComposer to top-level component if used elsewhere */}
     
      {/* Bridge base */}
      <mesh
        ref={bridgeRef}
        position={[newCameraZ, -9, -100]}
        scale={30.5}
        geometry={boxGeometry}
      >
        <meshBasicMaterial
          color={"[1.9, 1.9, 1.9]"} // Lower intensity to reduce bloom artifacts
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Bridge surface */}
      <mesh
        position={[newCameraZ, 14, -98]}
        scale={40}
        rotation={[0, 0, 0]}
        geometry={planeGeometry}
      >
        <meshStandardMaterial
          map={bridgeTexture}
          transparent
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.2}
          alphaTest={0.5} // Prevent transparent pixel artifacts
        />
      </mesh>

    </>
  );
}