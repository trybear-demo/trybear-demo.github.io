import React, { useRef, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import BlurText from "./BlurText";

const AboutContactContent = () => {
  const containerRef = useRef(null);
  const { setCursorVariant } = useCursor();
  const { t } = useContext(LanguageContext);

  useGSAP(
    () => {
      // Entry animation
      gsap.fromTo(
        ".content-block",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="container mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-center h-full gap-12 lg:gap-24"
    >
      {/* About Section */}
      <div className="content-block flex-1 flex flex-col items-center lg:items-start text-center lg:text-start space-y-6">
        <h2
          className="text-3xl md:text-5xl font-black text-white drop-shadow-lg cursor-none"
          onMouseEnter={() => setCursorVariant("text")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          <BlurText
            text={t("about_title")}
            className="block"
            animateBy="words"
            direction="top"
          />
        </h2>
        <p
          className="text-lg md:text-xl text-brand-text/80 leading-relaxed font-light text-balance lg:text-pretty cursor-none"
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

      {/* Divider for Desktop */}
      <div className="hidden lg:block w-px h-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      {/* Contact Section */}
      <div className="content-block flex-1 flex flex-col items-center lg:items-start text-center lg:text-start space-y-6">
        <h2
          className="text-3xl md:text-5xl font-black text-white drop-shadow-lg cursor-none"
          onMouseEnter={() => setCursorVariant("text")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          <BlurText
            text={t("contact_title")}
            className="block"
            animateBy="words"
            direction="top"
          />
        </h2>
        <p
          className="text-lg md:text-xl text-brand-text/80 leading-relaxed font-light text-balance lg:text-pretty cursor-none"
          onMouseEnter={() => setCursorVariant("text")}
          onMouseLeave={() => setCursorVariant("default")}
        >
          <BlurText
            text={t("contact_subtitle")}
            className="block"
            animateBy="words"
            direction="top"
          />
        </p>
      </div>
    </div>
  );
};

export default AboutContactContent;

