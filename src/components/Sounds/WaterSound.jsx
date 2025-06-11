import { useEffect, useRef } from 'react'

export default function WaterSound() {
    const audioRef = useRef()

    useEffect(() => {
        audioRef.current = new Audio('/sounds/water-noises.mp3') // water sound
        audioRef.current.loop = true
        audioRef.current.volume = Math.random()
        audioRef.current.play()

        return () => audioRef.current.pause()
    }, [])

    return null
}