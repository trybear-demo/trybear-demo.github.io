import { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ANIMATION_CONFIG } from "../lib/constants";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import BlurText from "./BlurText";
import { useNavigate, useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { key: "menu_home", href: "#home" },
  { key: "menu_products", href: "#products" },
  { key: "menu_about_contact", href: "#about-contact" },
];

const MenuOverlay = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const targetSectionRef = useRef(null);
  const { setCursorVariant } = useCursor();
  const { t, language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    targetSectionRef.current = href;
    onClose();
  };

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Instant transition for reduced motion
      if (isOpen) {
        gsap.set(overlayRef.current, { yPercent: 100 });
        gsap.set(linksRef.current, { y: 0, opacity: 1 });
      } else {
        gsap.set(overlayRef.current, { yPercent: 0 });
        gsap.set(linksRef.current, { y: -50, opacity: 0 });

        // Handle navigation immediately for reduced motion
        if (targetSectionRef.current) {
          if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: targetSectionRef.current } });
          } else {
            const element = document.getElementById(
              targetSectionRef.current.replace("#", "")
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
          targetSectionRef.current = null;
        }
      }
      return;
    }

    const tl = gsap.timeline();

    if (isOpen) {
      tl.to(overlayRef.current, {
        yPercent: 100,
        duration: ANIMATION_CONFIG.MENU_OVERLAY.DURATION,
        ease: ANIMATION_CONFIG.MENU_OVERLAY.EASE,
      }).to(
        linksRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: ANIMATION_CONFIG.MENU_OVERLAY.STAGGER,
          ease: "power3.out",
        },
        `-=${ANIMATION_CONFIG.MENU_OVERLAY.LINK_REVEAL_DELAY}`
      );
    } else {
      // Exit animation
      tl.to(linksRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        {
          yPercent: 0,
          duration: ANIMATION_CONFIG.MENU_OVERLAY.DURATION,
          ease: ANIMATION_CONFIG.MENU_OVERLAY.EASE,
          onComplete: () => {
            if (targetSectionRef.current) {
              if (location.pathname !== "/") {
                // If not on home page, navigate to home and pass the target section
                navigate("/", {
                  state: { scrollTo: targetSectionRef.current },
                });
              } else {
                // If already on home page, just scroll
                const element = document.getElementById(
                  targetSectionRef.current.replace("#", "")
                );
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }
              targetSectionRef.current = null;
            }
          },
        },
        "-=0.2"
      );
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 w-full h-full bg-black border-b border-gray-800 z-50 flex items-center justify-center"
      style={{ transform: "translateY(-100%)" }} // Start above the screen
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Login Button */}
      <button
        onClick={() => {
          onClose();
          navigate("/login");
        }}
        className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors text-lg md:text-xl uppercase tracking-widest font-bold z-50 flex items-center justify-center h-16"
        onMouseEnter={() => setCursorVariant("button")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        {t("login")}
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 w-16 h-16 flex items-center justify-center text-brand-text hover:opacity-70 transition-opacity z-50"
        aria-label="Close Menu"
        onMouseEnter={() => setCursorVariant("menu")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <nav className="flex flex-col items-center gap-8">
        {navLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            ref={(el) => (linksRef.current[index] = el)}
            className="text-4xl md:text-6xl font-bold text-brand-text opacity-0 translate-y-[-50px] hover:text-gray-300 transition-colors"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
            onClick={(e) => handleLinkClick(e, link.href)}
          >
            <BlurText
              text={t(link.key)}
              animateBy={language === "fa" ? "words" : "letters"}
              delay={200}
              direction="bottom"
            />
          </a>
        ))}
      </nav>
    </div>
  );
};

export default MenuOverlay;
