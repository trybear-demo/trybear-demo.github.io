import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MenuBar from "./MenuBar";
import LandingContent from "./LandingContent";
import Logo from "./Logo";
import IntroOverlay from "./IntroOverlay";
import MenuOverlay from "./MenuOverlay";
import LanguageToggle from "./LanguageToggle";
import LightRays from "./LightRays";
import ScrollIndicator from "./ScrollIndicator";
import ProductsContent from "./ProductsContent";
import AboutContactContent from "./AboutContactContent";
import { ANIMATION_CONFIG } from "../lib/constants";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP);

function Home() {
  const [isIntroComplete, setIntroComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoRef = useRef(null);
  const overlayRef = useRef(null);
  const appRef = useRef(null);
  const location = useLocation();

  // Handle scrolling to section after navigation from another page
  useEffect(() => {
    if (isIntroComplete && location.state?.scrollTo) {
      const targetId = location.state.scrollTo.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear state to prevent scrolling on subsequent refreshes
      window.history.replaceState({}, document.title);
    }
  }, [isIntroComplete, location.state]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setIntroComplete(true);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => setIntroComplete(true),
      });

      // Initial State
      tl.set(logoRef.current, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        opacity: 1,
        transformOrigin: "center top", // Set transform origin to help with scaling position
      });

      // Hold
      tl.to(logoRef.current, {
        duration: ANIMATION_CONFIG.INTRO.DURATION, // 1.5s
      });

      // Animate to Navbar
      tl.to(logoRef.current, {
        duration: 1.2,
        top: "2rem", // Aligns with top-8 (32px)
        yPercent: 0, // Remove vertical center offset
        scale: 0.25, // Smaller scale to fit better in navbar
        ease: "power4.inOut",
      });

      // Fade out Overlay simultaneously
      tl.to(
        overlayRef.current,
        {
          duration: 0.8,
          opacity: 0,
          ease: "power2.inOut",
        },
        "<0.2"
      );
    },
    { scope: appRef }
  );

  return (
    <div
      ref={appRef}
      className="h-screen bg-brand-bg text-brand-text relative overflow-hidden"
    >
      {/* Toggles */}
      <LanguageToggle visible={isIntroComplete} />

      {/* Persistent Logo */}
      <Logo ref={logoRef} />

      {/* Intro Overlay */}
      {!isIntroComplete && <IntroOverlay ref={overlayRef} />}

      {/* Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <MenuBar visible={isIntroComplete} onClick={() => setIsMenuOpen(true)} />

      {/* Main Content */}
      <main
        id="main-scroll-container"
        className={`relative z-10 h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth transition-opacity duration-1000 ${
          isIntroComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        {isIntroComplete && (
          <>
            <section
              id="home"
              className="w-full h-screen snap-start flex flex-col items-center justify-center relative px-4 overflow-hidden"
            >
              {/* LightRays - Only in first section */}
              <div className="absolute inset-0 pointer-events-none z-0">
              <LightRays
                  raysOrigin="top-center"
                  raysColor="#00ffff"
                  raysSpeed={1.5}
                  lightSpread={0.8}
                  rayLength={1.2}
                  followMouse={true}
                  mouseInfluence={0.1}
                  noiseAmount={0.1}
                  distortion={0.05}
                  className="custom-rays"
                />
              </div>

              {/* Gradient Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <LandingContent />
                <ScrollIndicator />
              </div>
            </section>
            <section
              id="products"
              className="w-full h-screen snap-start flex flex-col items-center justify-center relative px-4 bg-black"
            >
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-bg to-transparent z-0 pointer-events-none"></div>
              <ProductsContent />
            </section>

            {/* Merged About & Contact Section */}
            <section
              id="about-contact"
              className="w-full h-screen snap-start flex flex-col items-center justify-center relative px-4 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <AboutContactContent />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
