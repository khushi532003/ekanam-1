// TransparentRipple.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const TransparentRippleMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointer: new THREE.Vector4(-9999, -9999, 0, 0),
  },

  // Vertex Shader
  /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  // Fragment Shader (UV distortion only)
  /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec4 uPointer;

  varying vec2 vUv;

  void main() {
    vec2 pointerUV = uPointer.xy;
    vec2 velocity = uPointer.zw;

    float dist = distance(vUv, pointerUV);
    float influence = exp(-dist * 20.0);

    // Create alpha glow only in distorted region
    float alpha = influence * length(velocity) * 10.0;

    // Output only alpha distortion - transparent ripple
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
  }
  `
);

extend({ TransparentRippleMaterial });

export default function RippleEffect() {
  const matRef = useRef();
  const pointer = useRef(new THREE.Vector4(-9999, -9999, 0, 0));
  const lastUV = useRef([0, 0]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uTime = clock.getElapsedTime();
      matRef.current.uPointer = pointer.current;
    }
  });

  const handleMove = (e) => {
    e.stopPropagation();
    const uv = e.uv;
    const dx = uv.x - lastUV.current[0];
    const dy = uv.y - lastUV.current[1];
    lastUV.current = [uv.x, uv.y];

    pointer.current.set(uv.x, uv.y, dx, dy);
  };

  const handleOut = () => {
    pointer.current.set(-9999, -9999, 0, 0);
  };

  return (
    <mesh
      position={[0, -9, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={handleMove}
      onPointerOut={handleOut}
      renderOrder={10}
      transparent
    >
      <planeGeometry args={[80, 80]} />
      <transparentRippleMaterial ref={matRef} transparent />
    </mesh>
  );
}
