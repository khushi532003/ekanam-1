    // components/Ground.jsx
import { Plane } from '@react-three/drei';

export default function Ground({ color = '#555' }) {
  return (
    <Plane args={[500, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <meshStandardMaterial color={color} />
    </Plane>
  );
}
