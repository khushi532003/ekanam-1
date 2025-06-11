import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

export default function FrameAnimation({ onComplete }) {
  const totalFrames = 48;
  const frameDelay = 2;
  const displayDelay = 80;

  const textures = useLoader(TextureLoader, 
    Array.from({ length: totalFrames }, (_, i) =>
      `/logoframes/logo/frame_${String(i + 1).padStart(3, '0')}.png`
    )
  );

  const meshRef = useRef();
  const [frame, setFrame] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const counter = useRef(0);
  const ended = useRef(false);
  const hideTimer = useRef(0);

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      map: textures[0],
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      opacity: 1
    });
    mat.renderOrder = 1000;
    return mat;
  }, [textures]);

  useFrame(() => {
    if (!ended.current) {
      counter.current++;
      if (counter.current % frameDelay === 0 && frame < totalFrames - 1) {
        const nextFrame = frame + 1;
        setFrame(nextFrame);
        material.map = textures[nextFrame];
      }
      if (frame >= totalFrames - 1) {
        ended.current = true;
        counter.current = 0;
         if (onComplete) onComplete(); 
      }
    } 
    // else {
    //   hideTimer.current++;
    //   if (hideTimer.current > displayDelay) {
    //     setOpacity((prev) => {
    //       const newOpacity = Math.max(0, prev - 0.02);
    //       material.opacity = newOpacity;
    //       return newOpacity;
    //     });
    //   }
    // }
  });

  return (
    <mesh ref={meshRef} position={[0, -9, 45]} scale={1.5}>
      <planeGeometry args={[13.5, 14]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}