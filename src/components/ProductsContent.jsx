import React, { useRef, useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useCursor } from "../context/CursorContext";
import BlurText from "./BlurText";
import { fetchProducts } from "../services/productService";
import CircularGallery from "./CircularGallery";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

// Expanded collection of high-quality tech/abstract images
const IMAGE_COLLECTION = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Data/Analytics
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", // AI/Neural
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Security/Tech
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", // Circuit/Hardware
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Network/Globe
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop", // AI Brain
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop", // Code/Matrix
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop", // Robot/Future
  "https://images.unsplash.com/photo-1558494949-efc0257bb3af?q=80&w=2070&auto=format&fit=crop", // Server/Infrastructure
  "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1862&auto=format&fit=crop", // Abstract Geometry
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop", // Blockchain/Crypto
  "https://images.unsplash.com/photo-1509023464722-18d996398ca8?q=80&w=2070&auto=format&fit=crop", // Dark Tech
];

const ProductsContent = () => {
  const { t, language } = useContext(LanguageContext);
  const { setCursorTheme } = useCursor();
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const LIMIT = 12; // Limit to match our image collection size nicely

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(0, LIMIT);

      // Enhance data with images deterministically based on product ID or index
      const enhancedData = data.map((product, index) => {
        const imageIndex = index % IMAGE_COLLECTION.length;
        return {
          ...product,
          img: IMAGE_COLLECTION[imageIndex],
        };
      });

      setProducts(enhancedData);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleItemClick = (index) => {
    if (products[index]) {
      setSelectedProduct(products[index]);
    }
  };

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-black text-white"
      >
        <div className="text-xl animate-pulse">
          {t("loading") || "Loading..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={containerRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-black text-white"
      >
        <div className="text-red-500">
          {t("error_loading_products") || "Error loading products"}
        </div>
      </div>
    );
  }

  const galleryItems = products.map((product) => ({
    image: product.img,
    text:
      language === "en" && product.title_en ? product.title_en : product.title,
  }));

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden font-serif text-white transition-colors duration-300"
    >
      {/* Section Title */}
      <div className="absolute top-16 md:top-28 z-10 text-center w-full pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 flex justify-center">
          <BlurText
            text={t("our_products")}
            className="inline-block"
            animateBy="words"
            direction="top"
          />
        </h2>
        <p className="mt-2 text-gray-400 text-sm animate-pulse">
          {language === "en"
            ? "Click or drag to view details"
            : "برای مشاهده جزئیات کلیک کنید یا بکشید"}
        </p>
      </div>

      {/* Circular Gallery Container */}
      <div className="w-full h-[80vh] relative mt-20 md:mt-0">
        {products.length > 0 && (
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.05}
            onItemClick={handleItemClick}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-8 lg:px-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedProduct(null)}
            />

            {/* Expanded Card */}
            <motion.div
              layoutId={`product-card-${selectedProduct.id}`}
              className="relative w-full max-w-6xl h-[80vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                <motion.img
                  src={selectedProduct.img}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
              </div>

              {/* Text Section */}
              <motion.div
                className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center items-center text-center overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-3xl md:text-5xl font-bold text-[#00ffff] mb-4">
                  {language === "en" && selectedProduct.title_en
                    ? selectedProduct.title_en
                    : selectedProduct.title}
                </h3>

                {selectedProduct.category && (
                  <h4 className="text-xl text-gray-400 mb-6 font-light">
                    {selectedProduct.category}
                  </h4>
                )}

                <div className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  <BlurText
                    text={
                      language === "en" && selectedProduct.description_en
                        ? selectedProduct.description_en
                        : selectedProduct.description
                    }
                    animateBy="words"
                    direction="top"
                    className="block"
                    delay={100}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsContent;
