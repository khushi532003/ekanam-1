import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

function Leaf({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF('/models/leaf2.glb');

  // Clone once per instance
  const clonedScene = useMemo(() => clone(scene), [scene]);

  return (
    <group
      position={position}
      scale={scale}
      rotation={rotation}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

export default Leaf;