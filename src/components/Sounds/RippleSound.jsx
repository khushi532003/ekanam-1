import { useEffect, useRef } from 'react'

export default function RippleSound() {
    const audioRef = useRef()

    useEffect(() => {
        audioRef.current = new Audio('/sounds/water_drop.mp3') // chirping sound
        // audioRef.current.loop = true
        audioRef.current.volume = Math.random()
        audioRef.current.play()

        return () => audioRef.current.pause()
    }, [])

    return null
}
