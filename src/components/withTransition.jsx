import { motion } from "framer-motion";

const withTransition = (OgComponent, transitionText = "TryBear") => {
  return (props) => (
    <>
      <OgComponent {...props} />

      <div className="fixed top-0 left-0 w-full h-screen flex z-50 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-full h-full bg-[#012E2E] relative pointer-events-auto"
            initial={{ scaleY: 1, transformOrigin: "top" }}
            animate={{
              scaleY: 0,
              transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1 * i,
              },
            }}
            exit={{
              scaleY: 1,
              transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05 * i,
              },
            }}
            style={{ transformOrigin: "top" }}
          >
            {/* Optional: Add a subtle border or texture to the bars */}
            <div className="absolute inset-0 border-r border-white/5" />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default withTransition;
