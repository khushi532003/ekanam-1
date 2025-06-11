import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

function Butterfly({ position = [0, 0, 0], scale = 0.02, rotation = [0, 0, 0] }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/butterfly.glb');
  const { actions } = useAnimations(animations, group)

  // Play first animation
  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play()
    }
  }, [actions, animations])

  // Clone once per instance
  const clonedScene = useMemo(() => clone(scene), [scene]);

  return (
    <group ref={group}>
      <primitive
        object={clonedScene}
        position={position}
        scale={scale}
        rotation={rotation}
      />
    </group>
  );
}

export default Butterfly;