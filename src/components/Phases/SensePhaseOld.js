import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Ocean from "../Ground/Ocean";
import Bridge from "../Bridge";
import Flower from "../InitialPhase/FLower";
import Leaf from "../InitialPhase/Leaf";
import Tree from "../InitialPhase/Tree";
import Floating from "../../Animation/Floating";
import WaterSound from "../Sounds/WaterSound";
import Bird from "../Sounds/Bird";
import Butterfly from "../Effects/Butterfly";
import { Sparkles } from "@react-three/drei";
import Plants from "../InitialPhase/Plants";
import Rock from "../InitialPhase/Rock";
import Model from "../FeelPhase/Model";

export default function SensePhase({ position, rotation, targetReached }) {
  const lightSource = useRef()
  // Initial positions
  // const [flower1Pos, setFlower1Pos] = useState([26, -8.5, 16]); 
  // const [flower2Pos, setFlower2Pos] = useState([5, -8.5, 30]);  
  // const [leaf1Pos, setLeaf1Pos] = useState([20, -10, 2]);       
  // const [leaf2Pos, setLeaf2Pos] = useState([0, -10.1, 35]);     
  const [tree1Pos, setTree1Pos] = useState([-50, -0, -99]);     
  const [tree2Pos, setTree2Pos] = useState([120, 0, -99]);      
  // const [rock1Pos, setRock1Pos] = useState([-20, -8.1, 10]);      

  useFrame(() => {
    if (targetReached) {
      // Targets when cameraZ <= 0
      const targetFlower1 = [-10, -9, -45];
      const targetFlower2 = [-15, -9, -25];
      const targetLeaf1 = [0, -10, -17];
      const targetLeaf2 = [8, -10, -40];
      const targetTree1 = [-120, -0, -99];
      const targetTree2 = [120, -0, -99];
      const targetRock1 = [-20, -8, -75];

      setFlower1Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetFlower1[i], 0.05))
      );
      setFlower2Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetFlower2[i], 0.05))
      );
      setLeaf1Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetLeaf1[i], 0.05))
      );
      setLeaf2Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetLeaf2[i], 0.05))
      );
      setTree1Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetTree1[i], 0.05))
      );
      setTree2Pos((prev) =>
        prev.map((val, i) => THREE.MathUtils.lerp(val, targetTree2[i], 0.05))
      );
      setRock1Pos((prev) =>
       prev.map((val, i) => THREE.MathUtils.lerp(val, targetRock1[i], 0.05))
      );
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <Ocean />
      <Bridge />
      <Model position={[-42, -5, -100]} scale={2} rotation={[0, 0, 0]}/>
      {/* <Model position={leaf1Pos} scale={2} rotation={[0, 0, 0]}/> */}
      <Plants position={tree1Pos} scale={20} rotation={[0, 0, 0]}/>
      <Plants position={tree2Pos} scale={20} rotation={[0, Math.PI, 0]}/>
      {/* <Plants position={[-85, 0, -50]} scale={20} rotation={[0, Math.PI/3, 0]}/> */}
      {/* <Butterfly scale={0.02} position={[-10, -7, -20]} rotation={[0, 0, 0]} /> */}
      {/* Butterfly Inistial  */}
      <Floating position={[26, -8.5, 16]}><Butterfly scale={0.02} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[5, -8.5, 30]}><Butterfly scale={0.02} rotation={[0, 0, 0]} /></Floating>
      {/* Butterfly Targeted  */}
      <Floating position={[-10, -9, -45]}><Butterfly scale={0.02} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[-15, -9, -25]}><Butterfly scale={0.02} rotation={[0, 0, 0]} /></Floating>

      <Rock position={[-20, -8.1, 10]} scale={3} rotation={[0, Math.PI/4, 0]} />
      <Rock position={[-20, -8, -75]} scale={3} rotation={[0, Math.PI/4, 0]} />

      {/* Sparkles Initial  */}
      <Sparkles position={[26, -8.5, 16]} count={20} size={5} scale={5} color="gold" blending="Additive" />
      <Sparkles position={[5, -8.5, 30]} count={20} size={5} scale={5} color="gold" blending="Additive" />
      {/* Sparkles Targted  */}
      <Sparkles position={[-10, -9, -45]} count={20} size={5} scale={5} color="gold" blending="Additive" />
      <Sparkles position={[-15, -9, -25]} count={20} size={5} scale={5} color="gold" blending="Additive" />


      {/* flowers Initial*/}
      <Floating position={[26, -8.5, 16]}><Flower scale={3} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[5, -8.5, 30]}><Flower scale={3} rotation={[0, -Math.PI / 2, 0]} /></Floating>
      {/* flowers Targeted*/}
      <Floating position={[-10, -9, -45]}><Flower scale={3} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[-15, -9, -25]}><Flower scale={3} rotation={[0, -Math.PI / 2, 0]} /></Floating>

      {/* LEAF Initial */}
      <Floating position={[20, -10, 2]} ><Leaf scale={4} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[0, -10.1, 35]} ><Leaf scale={3} rotation={[0, 0, 0]} /></Floating>
      {/* LEAF  Trageted*/}
      <Floating position={[0, -10, -17]} ><Leaf scale={4} rotation={[0, 0, 0]} /></Floating>
      <Floating position={[8, -10, -40]} ><Leaf scale={3} rotation={[0, 0, 0]} /></Floating>
      {/* Static Leaf */}
      <Floating position={[20, -10, -40]}><Leaf scale={2} rotation={[0, 0, 0]} /></Floating>

      {/* Static Trees */}
      <Tree position={[-110, 0, 40]} scale={17} rotation={[0, Math.PI / 4, 0]} />
      <Tree position={[-110, 0, 50]} scale={17} rotation={[0, Math.PI / 4, 0]} />
      <WaterSound />
      <Bird />


    </group>
  );
}