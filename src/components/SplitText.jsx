import React from "react";

// Helper to split text into words wrapped in spans
const SplitText = ({ children, className = "" }) => {
  if (typeof children !== "string") return children;

  const words = children.split(" ");
  return (
    <span className={`inline-block ${className}`} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word inline-block whitespace-pre opacity-0 translate-y-4 will-change-transform"
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
};

export default SplitText;

