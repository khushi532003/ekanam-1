import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export default function WaterBase() {
  const texture = useLoader(THREE.TextureLoader, '/textures/water2.jpg')

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <planeGeometry args={[500, 200]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
