import { OrbitControls, Sparkles } from "@react-three/drei";
import CameraController from "../components/CameraController";
import InitialPhase from "./InitialPhase";
import Lights from "../components/Lights/Lights";
import Background from "../components/Background";

function Entrance() {
  return (
    <>
      <CameraController />
      <OrbitControls />
      <Background />
      <Sparkles count={1000} size={3} scale={50} position={[0, -8, -50]} color="gold" blending="Additive" />
      <InitialPhase />
      <Lights />
    </>
  );
}

export default Entrance;