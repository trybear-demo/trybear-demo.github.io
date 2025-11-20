import { useRef, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import BlurText from "./BlurText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ANIMATION_CONFIG } from "../lib/constants";
import { useCursor } from "../context/CursorContext";

gsap.registerPlugin(useGSAP);

const LanguageToggle = ({ visible }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const containerRef = useRef(null);
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
        } else {
          // Reset when out of range
          xTo(0);
          yTo(0);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLanguage();
    }
  };

  return (
    <button
      ref={containerRef}
      onClick={toggleLanguage}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setCursorVariant("menu")}
      onMouseLeave={() => setCursorVariant("default")}
      className={`fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-200 text-gray-800 opacity-0 outline-none flex items-center justify-center font-bold text-sm w-10 h-10 focus:ring-2 focus:ring-purple-600 cursor-none ${!visible ? 'pointer-events-none' : ''}`}
      aria-label={language === "fa" ? "Switch to English" : "تغییر به فارسی"}
      title={language === "fa" ? "Switch to English" : "تغییر به فارسی"}
    >
      <BlurText
        text={language === "fa" ? "NE" : "FA"}
        animateBy="letters"
        direction="top"
        className="inline-block"
      />
    </button>
  );
};

export default LanguageToggle;
