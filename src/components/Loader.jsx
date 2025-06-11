import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import FrameAnimation from './InitialPhase/FrameAnimation';
import CameraController from './CameraController';

function Loader({ setLoading }) {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <div className="loader fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50 relative overflow-hidden">
      {/* Background Video Layer */}
      <video
        className="absolute inset-0 w-full h-full object-cover filter  scale-110"
        src="/videos/displayvid.mp4" // Replace with your actual video path
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Foreground content */}
      <div className="relative z-10 w-full h-full">
        <Canvas>
          <CameraController />
          <FrameAnimation onComplete={() => setAnimationComplete(true)} />
        </Canvas>

        {animationComplete && (
          <button
            className="absolute startbtn left-[45%] tracking-wider text-white font-custom bottom-[20%] px-5 py-2 bg-transparent border-2 border-teal-500"
            onClick={() => setLoading(false)}
          >
            <span>Start the Experience</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Loader;
