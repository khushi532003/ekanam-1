import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import {
  simulationVertexShader,
  simulationFragmentShader,
  renderVertexShader,
  renderFragmentShader,
} from './shaders/shaders.js';

export default function RipplePlane() {
  const meshRef = useRef();
  const simMatRef = useRef();
  const renderMatRef = useRef();
  const { size, gl } = useThree();

  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size.width, size.height]);

  // Mouse pos offscreen default
  const mouse = useRef(new THREE.Vector2(-1, -1));

  // Framebuffers need to be recreated on size change
  const [fboA, setFboA] = useState(null);
  const [fboB, setFboB] = useState(null);

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    const params = {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    };
    const texA = new THREE.WebGLRenderTarget(size.width, size.height, params);
    const texB = new THREE.WebGLRenderTarget(size.width, size.height, params);
    setFboA(texA);
    setFboB(texB);
  }, [size.width, size.height]);

  // Simulation scene and camera
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(() => {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cam.position.z = 1;
    return cam;
  }, []);

  // Simulation plane with simulation shader
  const simPlane = useMemo(() => {
    const geom = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: {
        textureA: { value: null },
        resolution: { value: resolution },
        mouse: { value: mouse.current },
        time: { value: 0 },
        frame: { value: 0 },
      },
    });
    simMatRef.current = mat;
    return new THREE.Mesh(geom, mat);
  }, [resolution]);

  // Add simulation plane to simScene once
  useEffect(() => {
    simScene.add(simPlane);
  }, [simPlane, simScene]);

  // Render material for final ripple plane
  const renderMat = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/textures/water2.jpg'); // Replace with your texture
    const mat = new THREE.ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      uniforms: {
        textureA: { value: null }, // Will be set every frame
        textureB: { value: tex },
      },
    });
    renderMatRef.current = mat;
    return mat;
  }, []);

  // Plane geometry
  const planeGeom = useMemo(() => new THREE.PlaneGeometry(500, 200), []);

  // Simulation & render loop
  useFrame((state) => {
    const { gl, clock } = state;
    if (!fboA || !fboB) return; // Wait for FBOs to be ready

    // Update uniforms for simulation
    simMatRef.current.uniforms.time.value = clock.getElapsedTime();
    simMatRef.current.uniforms.mouse.value = mouse.current;
    simMatRef.current.uniforms.frame.value++;

    // Ping-pong simulation render
    simMatRef.current.uniforms.textureA.value = fboA.texture;

    gl.setRenderTarget(fboB);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    // Swap fboA and fboB references
    const temp = fboA;
    setFboA(fboB);
    setFboB(temp);

    // Update render material texture to latest simulation texture
    if (renderMatRef.current) {
      renderMatRef.current.uniforms.textureA.value = fboB.texture;
    }
  });

  // Pointer move updates mouse uniform
  const handlePointerMove = (e) => {
    if (!e.uv) return;
    const x = e.uv.x * resolution.x;
    const y = (1 - e.uv.y) * resolution.y;
    mouse.current.set(x, y);
    console.log('Pointer at:', mouse.current);
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -9.9, 0]}
      ref={meshRef}
      geometry={planeGeom}
      material={renderMat}
      onPointerMove={handlePointerMove}
    />
  );
}
