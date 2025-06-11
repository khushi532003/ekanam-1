// components/FeelPhase.jsx

import Ground from "../Ground/Ground";
import Ocean from "../Ground/Ocean";

export default function FeelPhase({position, rotation}) {
  return (
     <group position={position} rotation={rotation}>
        {/* <Ocean/> */}
        <Ground color={'blue'} />
       </group>
  );
}
