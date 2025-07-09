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
  const rippleTexture = useLoader(TextureLoader, "/textures/ripple2.webp");

  const { waterColor, waterDistortion } = useControls("Ocean", {
    waterColor: "#73f5d8",
    waterDistortion: { value: 2, min: 0, max: 10, step: 0.1 },
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(500, 200), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const [ripples, setRipples] = useState([]);
  const lastRippleTime = useRef(0);

  // Add audioRef
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/water_drop.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  const playRippleSound = () => {
    if (!audioRef.current) return;
    const sound = audioRef.current.cloneNode(); // clone to allow overlapping
    sound.volume = 0.3 + Math.random() * 0.2; // slight random volume
    sound.play().catch((e) => {
      // In case autoplay is blocked
      console.warn("Sound playback blocked:", e);
    });
  };

  const water = useMemo(() => {
    return new Water(geometry, {
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
  }, [geometry, waterNormals, waterColor, waterDistortion]);

  useEffect(() => {
    if (ref.current) {
      ref.current.material.uniforms.waterColor.value.set(waterColor);
      ref.current.material.uniforms.distortionScale.value = waterDistortion;
    }
  }, [waterColor, waterDistortion]);

  const handlePointerMove = (event) => {
    const now = performance.now();
    if (now - lastRippleTime.current < 100) return;
    lastRippleTime.current = now;

    event.stopPropagation();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point.clone();
      point.y = -9;

      setRipples((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: point,
          scale: 1,
          opacity: 0.8,
        },
      ]);

      playRippleSound(); // Play the sound on ripple
    }
  };

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta;
    }

    setRipples((prevRipples) =>
      prevRipples
        .map((r) => ({
          ...r,
          scale: r.scale + delta * 10,
          opacity: r.opacity - delta * 1.5,
        }))
        .filter((r) => r.opacity > 0 && r.scale < 10)
    );
  });

  return (
    <>
      <mesh
        ref={planeRef}
        position={[0, -9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[500, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <primitive
        object={water}
        ref={ref}
        position={[0, -10, 0]}
        rotation-x={-Math.PI / 2}
        onPointerMove={handlePointerMove}
      />

      {ripples.map((ripple) => (
        <mesh
          key={ripple.id}
          position={ripple.position}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[ripple.scale, ripple.scale, 1]}
          renderOrder={999}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={rippleTexture}
            transparent
            opacity={ripple.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}
