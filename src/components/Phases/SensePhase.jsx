import { useRef, useMemo } from "react";
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
import { Cloud, Sparkles } from "@react-three/drei";
import Plants from "../InitialPhase/Plants";
import Rock from "../InitialPhase/Rock";
import Model from "../FeelPhase/Model";


export default function SensePhase({ position, rotation, targetReached }) {
  const tree1Pos = useRef(new THREE.Vector3(-50, 2, -99));
  const tree2Pos = useRef(new THREE.Vector3(120, 2, -99));

  useFrame(() => {
    if (targetReached) {
      const target1 = new THREE.Vector3(-120,2 , -99);
      const target2 = new THREE.Vector3(120, 2 , -99);
      tree1Pos.current.lerp(target1, 0.05);
      tree2Pos.current.lerp(target2, 0.05);
    }
  });

  const staticElements = useMemo(() => (
    <>
      <Ocean />
      <Bridge />
      <Model />
      <Rock position={[-20, -8.1, 10]} scale={3} rotation={[0, Math.PI / 4, 0]} />
      <Rock position={[42, -8, -65]} scale={2.5} rotation={[0, Math.PI , 0]} />
      <Tree position={[-110, 0, 40]} scale={17} rotation={[0, Math.PI / 4, 0]} />
      <Tree position={[-110, 0, 50]} scale={17} rotation={[0, Math.PI / 4, 0]} />
      <WaterSound />
      <Bird />
    </>
  ), []);

  const butterflies = useMemo(() => (
    <>
      {/* Initial */}
      <Floating position={[26, -8.5, 16]}><Butterfly scale={0.02} /></Floating>
      <Floating position={[5, -8.5, 30]}><Butterfly scale={0.02} /></Floating>
      {/* Targeted */}
      <Floating position={[-10, -9, -45]}><Butterfly scale={0.02} /></Floating>
      <Floating position={[-15, -9, -25]}><Butterfly scale={0.02} /></Floating>
    </>
  ), []);

  const sparkles = useMemo(() => (
    <>
      <Sparkles position={[26, -8.5, 16]} count={20} size={5} scale={5} color="gold" blending="Additive" />
      <Sparkles position={[5, -8.5, 30]}  count={20} size={5} scale={5} color="gold" blending="Additive" />
      <Sparkles position={[-10, -9, -45]} count={20} size={5} scale={5} color="gold" blending="Additive" />
      <Sparkles position={[-15, -9, -25]} count={20} size={5} scale={5} color="gold" blending="Additive" />
    </>
  ), []);

  const flowers = useMemo(() => (
    <>
      {/* Initial */}
      <Floating position={[26, -8.5, 16]}><Flower scale={3} /></Floating>
      <Floating position={[5, -8.5, 30]}><Flower scale={3} rotation={[0, -Math.PI / 2, 0]} /></Floating>
      {/* Targeted */}
      <Floating position={[-10, -9, -45]}><Flower scale={3} /></Floating>
      <Floating position={[-15, -9, -25]}><Flower scale={3} rotation={[0, -Math.PI / 2, 0]} /></Floating>
    </>
  ), []);

  const leaves = useMemo(() => (
    <>
      {/* Initial */}
      <Floating position={[20, -10, 2]}><Leaf scale={4} /></Floating>
      <Floating position={[0, -10.1, 35]}><Leaf scale={3} /></Floating>
      {/* Targeted */}
      <Floating position={[0, -10, -17]}><Leaf scale={4} /></Floating>
      <Floating position={[8, -10, -40]}><Leaf scale={3} /></Floating>
      {/* Static */}
      <Floating position={[20, -10, -40]}><Leaf scale={2} /></Floating>
    </>
  ), []);

  return (
    <group position={position} rotation={rotation}>
      {staticElements}
      {/* <Plants position={tree1Pos.current.toArray()} scale={20} />
      <Plants position={tree2Pos.current.toArray()} scale={20} rotation={[0, Math.PI, 0]} /> */}
      {butterflies}
      {sparkles}
      {flowers}
      {leaves}
    </group>
  );
}