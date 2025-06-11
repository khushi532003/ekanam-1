import { useTexture } from '@react-three/drei'
import React, { useMemo } from 'react'
import * as THREE from 'three'

function ShaderWater() {
    const texture = useTexture('/textures/water.jpeg')

    useMemo(() => {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 100;
      }, [texture]);
  return (
    <>
    <mesh position={[0, -10, 0]}
        rotation-x={-Math.PI / 2} >
        <planeGeometry args={[500, 200]}/>
        <meshStandardMaterial map={texture} />
    </mesh>
    </>
  )
}

export default ShaderWater;