import { Html, useProgress } from '@react-three/drei'
import React from 'react'

function Progress() {
    const { progress } = useProgress();

    return (
        <>
            <Html center className="text-white text-5xl flex gap-2">
                {progress.toFixed(0)}% Loaded
            </Html>
        </>
    )
}

export default Progress;