// hooks/useLenisScroll.js
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function useLenisScroll() {
  const lenis = useRef(null);

  useEffect(() => {
    lenis.current = new Lenis({
      lerp: 0.1,
      smooth: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });

    function raf(time) {
      lenis.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.current.destroy();
    };
  }, []);

  return lenis;
}
