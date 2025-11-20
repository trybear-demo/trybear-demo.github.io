import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCursor } from "../context/CursorContext";

function CustomCursor() {
  const cursorRef = useRef(null); // The container moving with mouse
  const followerRef = useRef(null); // The trailing circle
  const dotRef = useRef(null); // The inner dot
  const textRef = useRef(null); // The text element
  const { cursorVariant, cursorTheme, cursorText } = useCursor();
  const cyanColor = "#00ffff"; // Turquoise blue from LightRays

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Hide default cursor
    document.body.style.cursor = "none";

    // Initial centering
    gsap.set([cursor, follower], {
      xPercent: -50,
      yPercent: -50,
    });

    // Mouse move handler
    const handleMouseMove = (e) => {
      // Animate main cursor container
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
      });

      // Animate follower
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, []);

  // Handle cursor variants
  useEffect(() => {
    const follower = followerRef.current;
    const dot = dotRef.current;
    const text = textRef.current;

    if (!follower || !dot || !text) return;

    // Priority 1: Detail view (Hovering product card)
    if (cursorVariant === "detail") {
        // Hide follower
        gsap.to(follower, { scale: 0, opacity: 0, duration: 0.3 });
        
        // Hide dot
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 });

        // Show Text
        gsap.to(text, {
            scale: 2,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        return;
    }

    // Priority 2: Products Theme (General page theme)
    if (cursorTheme === "products") {
      gsap.to(follower, { scale: 0, opacity: 0, duration: 0.3 });
      
      // If hovering interactive elements in products page (like menu)
      const isHoveringInteractive = cursorVariant === "menu" || cursorVariant === "text";

      gsap.to(dot, {
        scale: isHoveringInteractive ? 2 : 1.5,
        backgroundColor: cyanColor,
        mixBlendMode: "normal",
        opacity: 1,
        width: 16,
        height: 16,
        duration: 0.3,
      });
      
      gsap.to(text, { scale: 0, opacity: 0, duration: 0.3 });
      return;
    }

    // Priority 3: Standard Variants
    switch (cursorVariant) {
      case "text":
        gsap.to(follower, {
          scale: 4,
          backgroundColor: "white",
          borderColor: "transparent",
          opacity: 1,
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 0,
          mixBlendMode: "difference",
          duration: 0.3,
        });
        gsap.to(text, { scale: 0, opacity: 0 });
        break;

      case "menu":
        gsap.to(follower, {
          scale: 1.5,
          backgroundColor: "transparent",
          borderColor: "white",
          borderWidth: "2px",
          opacity: 1,
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "white",
          mixBlendMode: "difference",
          duration: 0.3,
        });
        gsap.to(text, { scale: 0, opacity: 0 });
        break;

      default:
        gsap.to(follower, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "white",
          borderWidth: "2px",
          opacity: 1,
          duration: 0.3,
        });
        gsap.to(dot, {
          scale: 1,
          backgroundColor: "white",
          mixBlendMode: "difference",
          duration: 0.3,
        });
        gsap.to(text, { scale: 0, opacity: 0 });
        break;
    }
  }, [cursorVariant, cursorTheme, cyanColor]);

  return (
    <>
      {/* Main cursor container */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
      >
        {/* The Dot */}
        <div 
            ref={dotRef} 
            className="w-4 h-4 bg-white rounded-full mix-blend-difference"
        />
        
        {/* The Text */}
        <div ref={textRef} className="absolute opacity-0 transform scale-0 whitespace-nowrap text-[10px] font-bold tracking-wider uppercase" style={{ color: cyanColor }}>
            {cursorText}
        </div>
      </div>

      {/* Follower circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
      />
    </>
  );
}

export default CustomCursor;
