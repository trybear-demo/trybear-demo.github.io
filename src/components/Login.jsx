import React, { useRef, useState, useContext } from "react";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BlurText from "./BlurText";
import Magnet from "./Magnet";
import { ArrowLeft, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import MenuOverlay from "./MenuOverlay";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";

const Login = () => {
  const { setCursorVariant } = useCursor();
  const { t } = useContext(LanguageContext);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useGSAP(
    () => {
      // Initial Logo Position (matching Home page final state)
      gsap.set(logoRef.current, {
        top: "2rem",
        left: "50%",
        xPercent: -50,
        scale: 0.25,
        transformOrigin: "center top",
        opacity: 1,
      });

      const tl = gsap.timeline();

      tl.from(".login-title", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      })
        .from(
          ".login-input-group",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ".forgot-password",
          {
            y: 10,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".login-button",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          ".back-button",
          {
            x: -20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black -z-10" />

      {/* Navigation Elements */}
      <LanguageToggle visible={true} />

      <div className="fixed top-4 left-20 z-50">
        <Magnet padding={20} magnetStrength={3}>
          <button
            onClick={() => navigate("/")}
            className="back-button flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 text-white group"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
            dir="ltr"
          >
            <ArrowLeft 
              size={18} 
              className="group-hover:-translate-x-1 transition-transform duration-300" 
            />
            <span className="text-sm font-medium">
              {t("back")}
            </span>
          </button>
        </Magnet>
      </div>

      <Logo ref={logoRef} />
      <MenuBar visible={true} onClick={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div
        ref={formRef}
        className="w-full max-w-md px-8 py-12 flex flex-col items-center z-10 mt-20"
      >
        <div className="login-title mb-12 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <BlurText
              text={t("login_welcome")}
              className="block"
              animateBy="words"
              direction="top"
              delay={200}
            />
          </h1>
          <p className="text-gray-400 text-lg">{t("login_description")}</p>
        </div>

        <form className="w-full space-y-6">
          <div className="login-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder={t("username_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          <div className="login-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder={t("password_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          <div className="forgot-password flex justify-end w-full">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
              {t("forgot_password")}
            </a>
          </div>

          <div className="login-button pt-2 w-full">
            <Magnet padding={80} magnetStrength={5} className="w-full">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full bg-white text-black font-extrabold text-xl py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98]"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {t("sign_in")}
              </button>
            </Magnet>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              {t("no_account")}{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-white cursor-pointer hover:underline font-bold"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {t("sign_up")}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
