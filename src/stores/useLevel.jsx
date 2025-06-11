// stores/useLevel.js
import { create } from "zustand";

const phaseNames = ['sense', 'feel', 'live'];
const phasePositions = {
  sense: { x: 0, y: -10, z: 50 },
  feel: { x: 0, y: -10, z: 25 },
  live: { x: 0, y: -10, z: -100 },
};

const useLevel = create((set) => ({
  phases: phaseNames.length,
  phase: 'sense',
  phasePositions,

  // Setters
  setPhase: (phase) => set({ phase }),
  setPhaseByIndex: (index) => {
    if (index >= 0 && index < phaseNames.length) {
      set({ phase: phaseNames[index] });
    }
  },

  // Convenience methods
  sense: () => set({ phase: 'sense' }),
  feel: () => set({ phase: 'feel' }),
  live: () => set({ phase: 'live' }),
}));

export default useLevel;
