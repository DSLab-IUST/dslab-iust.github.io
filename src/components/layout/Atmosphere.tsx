import { useEffect, useRef } from 'react';

/**
 * Decorative layers from DESIGN.md §6.5. The glow follows the pointer through a
 * CSS variable written on an animation frame, so no React render is involved.
 */
export function Atmosphere() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!glow || !finePointer || reducedMotion) return undefined;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.setProperty('--pointer-x', `${event.clientX}px`);
        glow.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
    </>
  );
}
