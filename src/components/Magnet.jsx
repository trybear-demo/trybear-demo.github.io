import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ANIMATION_CONFIG } from '../lib/constants';

gsap.registerPlugin(useGSAP);

const Magnet = ({
  children,
  padding = 100, // Keep for API compatibility but might rely on CONSTANTS
  magnetStrength = 2, // Keep for API compatibility
  wrapperClassName = '',
  ...props
}) => {
  const magnetRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      const xTo = gsap.quickTo(magnetRef.current, 'x', {
        duration: 0.5,
        ease: 'power3',
      });
      const yTo = gsap.quickTo(magnetRef.current, 'y', {
        duration: 0.5,
        ease: 'power3',
      });

      const handleMouseMove = (e) => {
        if (!magnetRef.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } =
          magnetRef.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Use local prop or fallback to global config
        const threshold =
          padding || ANIMATION_CONFIG.MENU.MAGNETIC_THRESHOLD || 150;
        
        // Override strength if prop provided is different scaling
        // The user prop `magnetStrength` (e.g. 5) works inversely to the constant (0.5)
        // Let's adapt to the logic in MenuBar: x = deltaX * strength * CONSTANT
        // Or stick to the requested Magnet logic but with GSAP.
        // MenuBar Logic: const x = deltaX * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;
        
        if (distance < threshold) {
          const strength = 1 - distance / threshold;
          
          // Using the prop magnetStrength as a divisor like in original Magnet code:
          // original: const offsetX = (e.clientX - centerX) / magnetStrength;
          // But GSAP implementation usually multiplies.
          // Let's use the MENU config style for consistency if possible, but maybe adapted.
          // If user passed magnetStrength=5, it means movement is 1/5th of mouse movement?
          // In original code: offsetX = delta / 5. So movement is damped.
          
          // In MenuBar: x = deltaX * strength * 0.5. (strength is 0 to 1 based on distance).
          // So at center (strength 1), movement is 0.5 * delta.
          // If magnetStrength prop is 5 (dampening factor), then factor is 1/5 = 0.2.
          
          const moveFactor = magnetStrength ? (1 / magnetStrength) : ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;

          const x = deltaX * strength * moveFactor * 5; // * 5 to make it noticeable with high dampening or just tune it
          // Actually, let's trust the MenuBar logic which feels good.
          // The user wants it "like the menu button".
          
          // MenuBar Logic exact replication:
          // const x = deltaX * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;
          // But we should respect the `magnetStrength` prop if passed to tune it.
          
          // Let's use the GSAP QuickTo for performance
          const pullX = (deltaX * strength) / (magnetStrength > 0 ? magnetStrength * 0.2 : 1); 
          const pullY = (deltaY * strength) / (magnetStrength > 0 ? magnetStrength * 0.2 : 1);

          xTo(pullX);
          yTo(pullY);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    },
    { scope: magnetRef }
  );

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'block' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Magnet;
