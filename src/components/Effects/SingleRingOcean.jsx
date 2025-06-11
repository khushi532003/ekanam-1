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

  const waterNormals = useLoader(TextureLoader, "/textures/waternormals.jpg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const { waterColor, waterDistortion } = useControls("Ocean", {
    waterColor: "#73f5d8",
    waterDistortion: 2,
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(500, 200), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const [ripples, setRipples] = useState([]);

  const water = useMemo(() => {
    const waterObj = new Water(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      alpha: 1.0,
      sunDirection: new THREE.Vector3(),
      waterColor: new THREE.Color(waterColor),
      distortionScale: waterDistortion,
      fog: false,
      format: THREE.RGBAFormat,
    });
    return waterObj;
  }, [geometry, waterNormals]);

  // Update uniforms when waterColor or distortion changes
  useEffect(() => {
    if (ref.current) {
      ref.current.material.uniforms.waterColor.value.set(waterColor);
      ref.current.material.uniforms.distortionScale.value = waterDistortion;
    }
  }, [waterColor, waterDistortion]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }

    setRipples((prev) =>
      prev
        .map((r) => ({
          ...r,
          scale: r.scale + delta * 3,
          opacity: r.opacity - delta * 0.5,
        }))
        .filter((r) => r.opacity > 0)
    );
  });

  const handlePointerDown = (event) => {
    event.stopPropagation();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point.setY(-9); // Direct Y set

      const newRipples = [0, 1, 2].map((i) => ({
        id: Date.now() + i,
        position: point.clone(),
        scale: 0.3 + i * 0.1,
        opacity: 0.5 - i * 0.1,
      }));

      setRipples((prev) => [...prev, ...newRipples]);
    }
  };

  return (
    <>
      {/* Invisible Plane for raycasting */}
      <mesh
        ref={planeRef}
        position={[0, -9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[500, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Water Primitive */}
      <primitive
        object={water}
        ref={ref}
        position={[0, -10, 0]}
        rotation-x={-Math.PI / 2}
        onPointerDown={handlePointerDown}
      />

      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <mesh
          key={ripple.id}
          position={ripple.position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[ripple.scale, ripple.scale + 0.2, 32]} />
          <meshBasicMaterial
            transparent
            opacity={ripple.opacity}
            color="white"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}