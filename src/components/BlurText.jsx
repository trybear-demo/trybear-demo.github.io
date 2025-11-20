import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

const BlurText = ({
  text,
  className = "",
  variant,
  duration = 1,
  delay = 0,
  yOffset = 20,
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top',
  onAnimationComplete,
}) => {
  const defaultVariants = {
    hidden: { 
      filter: 'blur(10px)', 
      opacity: 0, 
      y: direction === 'top' ? -yOffset : yOffset 
    },
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      y: 0 
    },
  };

  const combinedVariants = variant || defaultVariants;

  const getElements = () => {
      if (animateBy === 'words') {
          return text.split(" ");
      }
      return text.split("");
  };

  const elements = getElements();

  return (
    <p className={className} key={text}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={combinedVariants}
          transition={{
            duration: 0.4,
            delay: delay * 0.001 + i * 0.05, // Reduced delay for smoother typing effect
            ease: [0.25, 0.25, 0, 1],
          }}
          style={{ display: 'inline-block', marginInlineEnd: animateBy === 'words' ? '0.25em' : '0' }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {el}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;

