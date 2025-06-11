import { useEffect, useRef } from "react";
import $ from "jquery";
import "jquery.ripples";

export default function RippleOverlay({ onInteraction }) {
  const rippleRef = useRef(null);

  useEffect(() => {
    try {
      const $ripple = $(rippleRef.current);
      $ripple.ripples({
        resolution: 512,
        dropRadius: 40, // Larger ripples
        perturbance: 0.08, // Stronger effect
        interactive: false, // Manual control
      });
      console.log("jQuery Ripples initialized successfully");
    } catch (error) {
      console.error("jQuery Ripples initialization failed:", error);
    }

    const handleInteraction = (event, type) => {
      console.log(`RippleOverlay: ${type} at`, event.clientX, event.clientY);
      const $ripple = $(rippleRef.current);
      const rect = rippleRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      try {
        $ripple.ripples("drop", x, y, 40, 0.08);
        console.log("RippleOverlay: Dropped ripple at", x, y);
      } catch (error) {
        console.error("RippleOverlay: Failed to drop ripple:", error);
      }
      onInteraction(event, type); // Pass to SensePhase for raycasting
    };

    const handleMouseDown = (event) => {
      handleInteraction(event, "mousedown");
    };

    const handleMouseMove = (event) => {
      if (event.buttons === 1) {
        handleInteraction(event, "mousemove");
      }
    };

    const rippleEl = rippleRef.current;
    rippleEl.addEventListener("mousedown", handleMouseDown);
    rippleEl.addEventListener("mousemove", handleMouseMove);

    return () => {
      try {
        $(rippleRef.current).ripples("destroy");
      } catch (error) {
        console.error("jQuery Ripples destroy failed:", error);
      }
      rippleEl.removeEventListener("mousedown", handleMouseDown);
      rippleEl.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onInteraction]);

  return (
    <div
      ref={rippleRef}
      className="ripple-overlay"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 189, 161, 0.7)", // More visible #00bda1
        zIndex: 1,
        transformStyle: "preserve-3d",
        perspective: "2500px", // Adjusted for camera
        transform: "rotateX(-85deg) translateZ(-11px)", // Closer to ocean, Y ≈ -9.5
        transformOrigin: "center 75%", // Lower pivot
        border: "2px solid red", // Debug border
      }}
    />
  );
}