import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ANIMATION_CONFIG } from "../lib/constants";
import { useCursor } from "../context/CursorContext";

gsap.registerPlugin(useGSAP);

const MenuBar = ({ visible, onClick }) => {
  const containerRef = useRef(null);
  const linesRef = useRef([]);
  const { setCursorVariant } = useCursor();

  useGSAP(() => {
    if (visible) {
      gsap.to(containerRef.current, {
        duration: ANIMATION_CONFIG.MENU.FADE_IN_DURATION,
        opacity: 1,
        delay: ANIMATION_CONFIG.MENU.FADE_IN_DELAY,
        ease: "power2.out",
      });
    }
  }, [visible]);

  useGSAP(
    () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // If reduced motion is preferred, do not initialize magnetic effect
      if (prefersReducedMotion) return;

      // Magnetic Hover Effect
      const xTo = gsap.quickTo(containerRef.current, "x", {
        duration: 0.5,
        ease: "power3",
      });
      const yTo = gsap.quickTo(containerRef.current, "y", {
        duration: 0.5,
        ease: "power3",
      });
      const scaleXTo = gsap.quickTo(linesRef.current, "scaleX", {
        duration: 0.5,
        ease: ANIMATION_CONFIG.MENU.ELASTIC_EASE,
      });

      const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const threshold = ANIMATION_CONFIG.MENU.MAGNETIC_THRESHOLD || 150;

        if (distance < threshold) {
          // Calculate magnetic pull based on proximity
          // Closer = stronger pull
          const strength = 1 - distance / threshold;
          const x = deltaX * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;
          const y = deltaY * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;

          xTo(x);
          yTo(y);

          // Scale up slightly when very close
          const scale =
            1 + strength * (ANIMATION_CONFIG.MENU.ELASTIC_SCALE - 1);
          scaleXTo(scale);
        } else {
          // Reset when out of range
          xTo(0);
          yTo(0);
          scaleXTo(1);
        }
      };

      // Attach to window to track proximity globally
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed top-8 right-8 w-16 h-8 flex flex-col justify-between cursor-none z-40 opacity-0 p-2"
      onMouseEnter={() => setCursorVariant("menu")}
      onMouseLeave={() => setCursorVariant("default")}
      onClick={onClick}
    >
      <div
        ref={(el) => (linesRef.current[0] = el)}
        className="w-full h-[2px] bg-white origin-center"
      ></div>
      <div
        ref={(el) => (linesRef.current[1] = el)}
        className="w-full h-[2px] bg-white origin-center"
      ></div>
    </div>
  );
};

export default MenuBar;
