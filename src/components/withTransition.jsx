import { motion } from "framer-motion";

const withTransition = (OgComponent) => {
  return (props) => (
    <>
      <OgComponent {...props} />
      {/* 
         Transition Overlay:
         Blue-turquoise leaning towards black as requested
      */}

      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-[#012E2E] z-50"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />

      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-[#012E2E] z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </>
  );
};

export default withTransition;
