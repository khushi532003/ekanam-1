// components/Interface.jsx
import React, { useEffect, useState } from 'react';
import useLevel from '../stores/useLevel';

function Interface() {
  const phase = useLevel((state) => state.phase); // ✅ Safe Zustand hook usage
  const [visiblePhase, setVisiblePhase] = useState(null);
  const [fadeState, setFadeState] = useState(''); // 'fade-in' or 'fade-out'

  useEffect(() => {
    if (!phase) return;

    setVisiblePhase(phase);
    setFadeState('fade-in');

    const visibleTimeout = setTimeout(() => {
      setFadeState('fade-out');
    }, 6000); // Fade out after 4s

    const cleanupTimeout = setTimeout(() => {
      setVisiblePhase(null);
    }, 7000); // Fully remove after 5s

    return () => {
      clearTimeout(visibleTimeout);
      clearTimeout(cleanupTimeout);
    };
  }, [phase]);

  return (
    <div className="interface pointer-events-none">
      {visiblePhase && (
        <div
          className={`fade-text ${fadeState} sense uppercase z-9 text-white font-medium absolute top-[15%] left-[45%] text-center transition-opacity duration-1000`}
        >
          {visiblePhase === 'sense' && (
            <h2 className="text-6xl uppercase">Sense it</h2>
          )}
          {visiblePhase === 'feel' && (
            <h2 className="text-6xl uppercase">Feel it</h2>
          )}
          {visiblePhase === 'live' && (
            <h2 className="text-6xl uppercase">Live it</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Interface;
