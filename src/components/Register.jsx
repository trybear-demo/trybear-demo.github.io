import React, { useRef, useState, useContext } from "react";
import { useCursor } from "../context/CursorContext";
import { LanguageContext } from "../context/LanguageContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BlurText from "./BlurText";
import Magnet from "./Magnet";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import MenuOverlay from "./MenuOverlay";
import LanguageToggle from "./LanguageToggle";
import Logo from "./Logo";

const Register = () => {
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

      tl.from(".register-title", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      })
        .from(
          ".register-input-group",
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
          ".register-button",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
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
        <Magnet padding={50} magnetStrength={2}>
          <motion.button
            onClick={() => navigate("/")}
            className="back-button flex items-center justify-center h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden relative group"
            initial={{ width: "3rem" }}
            whileHover={{ width: "9rem" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            dir="ltr"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <div className="absolute left-0 w-12 h-12 flex items-center justify-center z-10">
              <ArrowLeft 
                size={20} 
                className="text-white group-hover:-translate-x-1 transition-transform duration-300" 
              />
            </div>
            
            <motion.span
              className="whitespace-nowrap pl-10 pr-5 text-sm font-medium text-white"
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {t("back")}
            </motion.span>
          </motion.button>
        </Magnet>
      </div>

      <Logo ref={logoRef} />
      <MenuBar visible={true} onClick={() => setIsMenuOpen(true)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div
        ref={formRef}
        className="w-full max-w-md px-8 py-12 flex flex-col items-center z-10 mt-20"
      >
        <div className="register-title mb-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            onMouseEnter={() => setCursorVariant("text")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <BlurText
              text={t("register_welcome")}
              className="block"
              animateBy="words"
              direction="top"
              delay={200}
            />
          </h1>
          <p className="text-gray-400 text-lg">{t("register_description")}</p>
        </div>

        <form className="w-full space-y-4">
          {/* Full Name */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder={t("full_name_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          {/* Username */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder={t("username_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          {/* Email */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder={t("email_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          {/* Phone */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              placeholder={t("phone_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          {/* Password */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder={t("password_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          {/* Confirm Password */}
          <div className="register-input-group relative group">
            <div className="absolute inset-y-0 left-0 pl-4 rtl:right-0 rtl:left-auto rtl:pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors duration-300">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder={t("confirm_password_placeholder")}
              className="w-full bg-gray-900/30 border border-gray-800 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 focus:bg-gray-900/50 transition-all duration-300 rtl:text-right"
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>

          <div className="register-button pt-4 w-full">
            <Magnet padding={80} magnetStrength={5} className="w-full">
              <button
                type="button"
                className="w-full bg-white text-black font-extrabold text-xl py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98]"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {t("sign_up")}
              </button>
            </Magnet>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              {t("already_have_account")}{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-white cursor-pointer hover:underline font-bold"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {t("sign_in")}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

