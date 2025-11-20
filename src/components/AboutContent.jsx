import React, { useRef, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import BlurText from "./BlurText";

const AboutContent = () => {
  const containerRef = useRef(null);
  const { setCursorVariant } = useCursor();
  const { t } = useContext(LanguageContext);

  useGSAP(
    () => {
      // Entry animation
      gsap.to(".word", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.02,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="container mx-auto px-6 py-20 text-center space-y-8 flex flex-col items-center justify-center min-h-[60vh]"
    >
      <h1
        className="text-4xl md:text-3xl lg:text-7xl font-black leading-tight tracking-tighter max-w-5xl mx-auto text-balance text-white drop-shadow-lg pb-2 cursor-none"
        onMouseEnter={() => setCursorVariant("text")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <BlurText
          text={t("about_title")}
          className="block"
          animateBy="words"
          direction="top"
        />
      </h1>

      <p
        className="text-lg md:text-2xl text-brand-text/70 max-w-3xl mx-auto leading-relaxed font-light text-balance cursor-none"
        onMouseEnter={() => setCursorVariant("text")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <BlurText
          text={t("about_subtitle")}
          className="block"
          animateBy="words"
          direction="top"
        />
      </p>
    </div>
  );
};

export default AboutContent;

