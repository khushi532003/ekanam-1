// components/animations/Floating.js
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Floating({ children, position = [0, 0, 0], floatSpeed = 0.1, floatDistance = 3 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const offsetY = Math.sin(time * floatSpeed) * floatDistance;
      groupRef.current.position.set(position[0]  + offsetY, position[1], position[2]);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
