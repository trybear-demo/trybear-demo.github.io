import { useRef, useContext, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LanguageContext } from "../context/LanguageContext";
import { ANIMATION_CONFIG } from "../lib/constants";
import { useCursor } from "../context/CursorContext";

const ScrollIndicator = () => {
  const indicatorRef = useRef(null);
  const bounceRef = useRef(null);
  const { t } = useContext(LanguageContext);
  const { setCursorVariant } = useCursor();
  const [isVisible, setIsVisible] = useState(true);

  // Ref to track visibility inside the GSAP effect without triggering re-runs
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useGSAP(
    () => {
      // Initialize positioning
      gsap.set(indicatorRef.current, {
        xPercent: -50,
        left: "50%",
      });

      // Bouncing animation on the inner element
      const bounceAnim = gsap.to(bounceRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
      });

      // Magnetic Hover Effect Setup
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let magneticCleanup = () => {};

      if (!prefersReducedMotion) {
        // Use quickTo for performant mouse tracking
        // x and y are pixel offsets, separate from xPercent
        const xTo = gsap.quickTo(indicatorRef.current, "x", {
          duration: 0.5,
          ease: "power3",
        });
        const yTo = gsap.quickTo(indicatorRef.current, "y", {
          duration: 0.5,
          ease: "power3",
        });

        const handleMouseMove = (e) => {
          if (!indicatorRef.current || !isVisibleRef.current) return;

          const { clientX, clientY } = e;
          const rect = indicatorRef.current.getBoundingClientRect();

          // Calculate center based on current position
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = clientX - centerX;
          const deltaY = clientY - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          const threshold = ANIMATION_CONFIG.MENU.MAGNETIC_THRESHOLD || 150;

          if (distance < threshold) {
            const strength = 1 - distance / threshold;
            // Adjust strength for vertical layout
            const x =
              deltaX * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;
            const y =
              deltaY * strength * ANIMATION_CONFIG.MENU.MAGNETIC_STRENGTH;

            xTo(x);
            yTo(y);
          } else {
            xTo(0);
            yTo(0);
          }
        };

        window.addEventListener("mousemove", handleMouseMove);
        magneticCleanup = () =>
          window.removeEventListener("mousemove", handleMouseMove);
      }

      // Scroll listener to hide/show
      // Removed scroll listener as we use scroll snapping now and it will scroll away naturally

      return () => {
        magneticCleanup();
        bounceAnim.kill();
      };
    },
    { scope: indicatorRef }
  );

  return (
    <div
      ref={indicatorRef}
      className="absolute bottom-4 flex flex-col items-center gap-2 text-white/50 cursor-default z-20 mix-blend-difference pb-4"
      onMouseEnter={() => setCursorVariant("menu")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      {/* Inner wrapper for bounce animation to separate from magnetic movement */}
      <div ref={bounceRef} className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest font-medium">
          {t("scroll_hint")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 6l5 5 5-5" />
        </svg>
      </div>
    </div>
  );
};

export default ScrollIndicator;
