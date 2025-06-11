import { useEffect, useRef } from 'react'

export default function Bird() {
    const audioRef = useRef()

    useEffect(() => {
        audioRef.current = new Audio('/sounds/windBird.mp3') // chirping sound
        audioRef.current.loop = true
        audioRef.current.volume = Math.random()
        audioRef.current.play()

        return () => audioRef.current.pause()
    }, [])

    return null
}
