import React, { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useControls } from "leva";

export default function Ocean() {
  const ref = useRef();
  const planeRef = useRef();
  const { camera } = useThree();

  // Load water normal texture
  const waterNormals = useLoader(TextureLoader, "/textures/waternormals.jpg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  // Leva controls for water properties
  const { waterColor, waterDistortion } = useControls("Ocean", {
    waterColor: "#73f5d8",
    waterDistortion: { value: 2, min: 0, max: 10, step: 0.1 },
  });

  // Initialize geometry and utilities
  const geometry = useMemo(() => new THREE.PlaneGeometry(500, 200), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  // State for ripples and interaction tracking
  const [ripples, setRipples] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false);

  // Water object setup
  const water = useMemo(() => {
    const waterObj = new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      alpha: 1.0,
      sunDirection: new THREE.Vector3(0.707, 0.707, 0),
      waterColor: new THREE.Color(waterColor),
      distortionScale: waterDistortion,
      fog: false,
      format: THREE.RGBAFormat,
    });
    return waterObj;
  }, [geometry, waterNormals]);

  // Update water uniforms when controls change
  useEffect(() => {
    if (ref.current) {
      ref.current.material.uniforms.waterColor.value.set(waterColor);
      ref.current.material.uniforms.distortionScale.value = waterDistortion;
    }
  }, [waterColor, waterDistortion]);

  // Handle mouse move for hover and drag
  const handlePointerMove = (event) => {
    if (!isInteracting) return; // Only create ripples when dragging or hovering with intent

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point.setY(-9);

      // Create a single ripple per move event for smoother effect
      const newRipple = {
        id: Date.now(),
        position: point.clone(),
        scale: 0.1, // Start small for jQuery-like effect
        opacity: 0.7, // Higher initial opacity
      };

      setRipples((prev) => [...prev, newRipple]);
    }
  };

  // Start interaction on pointer down
  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsInteracting(true);
    handlePointerMove(event); // Trigger initial ripple
  };

  // Stop interaction on pointer up
  const handlePointerUp = () => {
    setIsInteracting(false);
  };

  // Handle hover (optional: enable ripples on hover without click)
  const handlePointerEnter = () => {
    setIsInteracting(true); // Enable for hover effect
  };

  const handlePointerLeave = () => {
    setIsInteracting(false);
  };

  // Animation loop
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }

    // Update ripples: grow and fade
    setRipples((prev) =>
      prev
        .map((r) => ({
          ...r,
          scale: r.scale + delta * 5, // Faster growth for jQuery-like spread
          opacity: r.opacity - delta * 1.2, // Faster fade for continuous ripples
        }))
        .filter((r) => r.opacity > 0 && r.scale < 5) // Remove when invisible or too large
    );
  });

  return (
    <>
      {/* Invisible plane for raycasting */}
      <mesh
        ref={planeRef}
        position={[0, -9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[500, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Water primitive */}
      <primitive
        object={water}
        ref={ref}
        position={[0, -10, 0]}
        rotation-x={-Math.PI / 2}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <mesh
          key={ripple.id}
          position={ripple.position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[ripple.scale, ripple.scale + 0.3, 64]} /> {/* Smoother rings */}
          <meshBasicMaterial
            transparent
            opacity={ripple.opacity}
            color="transparent"
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending} // Mimics jQuery ripples glow
          />
        </mesh>
      ))}
    </>
  );
}