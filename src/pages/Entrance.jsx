import { Html, OrbitControls, Sparkles } from "@react-three/drei";
import CameraController from "../components/CameraController";
import InitialPhase from "./InitialPhase";
import Lights from "../components/Lights/Lights";
import Background from "../components/Background";
import { Suspense } from "react";

function Entrance() {
  return (
    <>
      <CameraController />
      <OrbitControls />
      <Background />
      <Sparkles count={1000} size={3} scale={50} position={[0, -8, -50]} color="gold" blending="Additive" />
      <Suspense fallback={<Html>
                    <img src="/textures/lotus-blossom.gif" alt="Lotus" />
                   <p className="text-white"> Loading... </p>
                 </Html>}>
      <InitialPhase />
      </Suspense>
      <Lights />
    </>
  );
}

export default Entrance;