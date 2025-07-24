import { useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import React, { useRef } from 'react'
import * as THREE from 'three'

function Lights() {
    const light = useRef()

    useHelper(light, THREE.DirectionalLight, 1)

    useFrame((state) => {
        light.current.position.z = state.camera.position.z + 1 - 4
        light.current.target.position.z = state.camera.position.z + 1 - 4

        light.current.target.updateMatrixWorld() // when the object moves light will follow


    })
    const { sunX, sunY, sunZ } = useControls({
        sunX: 40, sunY: -400, sunZ: -600,
        //   intensity: { value: 2, min: 0, max: 10 },
    });
    return (
        <>
            <directionalLight
                ref={light}
                intensity={1}
                position={[sunX, sunY, sunZ]}
                // color="yellow"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={500}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />
            <ambientLight intensity={1.5} />
        </>
    )
}

export default Lights;