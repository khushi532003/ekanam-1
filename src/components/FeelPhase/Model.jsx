import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function Model() {
  
  const texture = useTexture('/textures/model.png');

  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
  }, [texture]);

  return (
    <mesh position={[-45, -5, -99]} scale={2} rotation={[0, 0, 0]} >
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

export default Model;