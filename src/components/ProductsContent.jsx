import React, { useRef, useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useCursor } from "../context/CursorContext";
import BlurText from "./BlurText";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const products = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    titleKey: "product_1_title",
    categoryKey: "product_1_category",
    descKey: "product_1_desc",
    longDescKey: "product_1_long_desc",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    titleKey: "product_2_title",
    categoryKey: "product_2_category",
    descKey: "product_2_desc",
    longDescKey: "product_2_long_desc",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    titleKey: "product_3_title",
    categoryKey: "product_3_category",
    descKey: "product_3_desc",
    longDescKey: "product_3_long_desc",
  },
];

const ProductsContent = () => {
  const { t } = useContext(LanguageContext);
  const { setCursorVariant, setCursorTheme, setCursorText } = useCursor();
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  // Use IntersectionObserver to set the cursor theme for the entire page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCursorTheme("products");
          } else {
            setCursorTheme("default");
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      // Reset on unmount
      setCursorTheme("default");
    };
  }, [setCursorTheme]);

  // Handle closing modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-serif text-white transition-colors duration-300"
    >
      {/* Section Title */}
      <div className="absolute top-16 md:top-28 z-10 text-center w-full">
        <h2
          className="text-3xl md:text-5xl font-bold text-white mb-3 flex justify-center"
          // Removed local cursor overrides as the global theme handles it now
        >
          <BlurText
            text={t("our_products")}
            className="inline-block"
            animateBy="words"
            direction="top"
          />
        </h2>
      </div>

      {/* Cards Container */}
      <div
        className={`
        relative flex flex-wrap justify-center items-center gap-6 md:gap-8 z-10
        w-full max-w-[1200px]
        mt-48 md:mt-32
      `}
      >
        {products.map((product) => {
          return (
            <motion.div
              key={product.id}
              layoutId={`product-card-${product.id}`}
              onTap={() => setSelectedId(product.id)}
              className="card relative flex-none group cursor-none"
              onMouseEnter={() => {
                setCursorVariant("detail");
                setCursorText(t("view_product") || "View");
              }}
              onMouseLeave={() => {
                setCursorVariant("default");
                setCursorText("");
              }}
            >
              <motion.div
                className={`
                         w-[250px] h-[350px] md:w-[350px] md:h-[500px]
                         rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800
                         hover:scale-[1.02] transition-transform duration-500
                    `}
              >
                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <motion.img
                    layoutId={`product-image-${product.id}`}
                    src={product.img}
                    alt={t(product.titleKey)}
                    className="absolute top-0 left-0 w-full h-full object-cover object-center hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay Container - Only visible in card view */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Gradient Overlay for readability */}
                    <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/50" />

                    {/* Product Title - Always Visible, moves up slightly on hover */}
                    <h3 className="relative z-10 text-white text-2xl md:text-3xl font-bold drop-shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2">
                      <BlurText
                        text={t(product.titleKey)}
                        className="inline-block"
                        animateBy="words"
                        direction="top"
                        delay={200}
                      />
                    </h3>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded View Overlay */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-8 lg:px-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedId(null)}
            />

            {/* Expanded Card */}
            {products.map((product) => {
              if (product.id !== selectedId) return null;
              return (
                <motion.div
                  layoutId={`product-card-${product.id}`}
                  className="relative w-full max-w-6xl h-[80vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                  key={product.id}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <X size={24} />
                  </button>

                  {/* Left Side: Text (In RTL, this is actually the right side visually if dir=rtl)
                       Wait, user asked for: "Right side image", "Left side description".
                       In Flex Row + RTL: First Item is Right. Second Item is Left.
                       So we need Image First, then Text.
                   */}

                  {/* Image Section */}
                  <motion.div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                    <motion.img
                      layoutId={`product-image-${product.id}`}
                      src={product.img}
                      alt={t(product.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
                  </motion.div>

                  {/* Text Section */}
                  <motion.div
                    className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h3 className="text-3xl md:text-5xl font-bold text-[#00ffff] mb-4">
                      {t(product.titleKey)}
                    </h3>
                    <h4 className="text-xl text-gray-400 mb-6 font-light">
                      {t(product.categoryKey)}
                    </h4>

                    <div className="text-lg md:text-xl text-gray-300 leading-relaxed">
                      <BlurText
                        text={t(product.longDescKey || product.descKey)}
                        animateBy="words"
                        direction="top"
                        className="block"
                        delay={400}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsContent;
