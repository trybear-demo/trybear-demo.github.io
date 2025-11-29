import React, { useRef, useContext, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import BlurText from "./BlurText";
import Magnet from "./Magnet";

const LandingContent = () => {
  const containerRef = useRef(null);
  const { setCursorVariant } = useCursor();
  const { t, language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [landingData, setLandingData] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Use relative path to leverage Vite proxy and avoid CORS
        const response = await fetch("/api/v1/landing", {
          headers: {
            accept: "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Landing data fetched successfully:", data);
          setLandingData(data);
        } else {
          console.error("Failed to fetch landing data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching landing data:", error);
      }
    };

    fetchLandingData();
  }, []);

  useGSAP(
    () => {
      // Entry animation
      gsap.to(".word", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.02, // Faster stagger for smoother flow
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
          text={
            language === "en"
              ? landingData?.title_en || t("landing_title")
              : landingData?.title || t("landing_title")
          }
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
          text={
            language === "en"
              ? landingData?.subtitle_en || t("landing_subtitle")
              : landingData?.subtitle || t("landing_subtitle")
          }
          className="block"
          animateBy="words"
          direction="top"
        />
      </p>

      <div className="pt-8 relative z-20">
        <Magnet padding={50} magnetStrength={5}>
          <button
            className="magnet-btn"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
            onClick={() => navigate("/login")}
          >
            {t("login")}
          </button>
        </Magnet>
      </div>
    </div>
  );
};

export default LandingContent;
