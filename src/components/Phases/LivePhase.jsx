// components/LivePhase.jsx

import Ground from "../Ground/Ground";

export default function LivePhase({position}) {
  return (
     <group position={position}>
             <Ground color={'blue'} />
             {/* Sense content */}
           </group>
  );
}
