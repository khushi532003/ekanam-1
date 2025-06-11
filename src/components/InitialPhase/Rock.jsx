import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function Rock({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const texture = useTexture('/textures/rock1.png');

  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
  }, [texture]);

  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

export default Rock;