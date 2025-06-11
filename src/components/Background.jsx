import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'

function Background() {
  const skyboxRef = useRef()
  const textures = useLoader(THREE.TextureLoader, [
    '/envMaps/0/px.png', // right
    '/envMaps/0/nx.png', // left
    '/envMaps/0/py.png', // top
    '/envMaps/0/ny.png', // bottom
    '/envMaps/0/pz.png', // back
    '/envMaps/0/nz.png', // front
  ])

  // Encoding fix for correct brightness
  // textures.forEach((t) => (t.encoding = THREE.sRGBEncoding))
  textures.colorSpace = THREE.SRGBColorSpace;

  const materials = [
    new THREE.MeshBasicMaterial({ map: textures[5], side: THREE.BackSide }), // right
    new THREE.MeshBasicMaterial({ map: textures[4], side: THREE.BackSide }), // left
    new THREE.MeshBasicMaterial({ map: textures[2], side: THREE.BackSide }), // top
    new THREE.MeshBasicMaterial({ map: textures[3], side: THREE.BackSide }), // bottom
    new THREE.MeshBasicMaterial({ map: textures[3], side: THREE.BackSide }), // back
    new THREE.MeshBasicMaterial({ map: textures[1], side: THREE.BackSide }), // front
  ]

  return (
    <mesh ref={skyboxRef} position={[0, 0, 0]} scale={1000}>
      <boxGeometry args={[1, 1, 1]} />
      {materials.map((material, index) => (
        <primitive key={index} attach={`material-${index}`} object={material} />
      ))}
    </mesh>
  )
}

export default Background;

// import { Environment } from '@react-three/drei'
// import React from 'react'

// function Background() {
//   return (
//     <>
//       <Environment
//       background
//       files={'/envMaps/1/bg.jpg'}
//       // preset='night'
//       />
//     </>
//   )
// }

// export default Background;