import { forwardRef } from "react";

const IntroOverlay = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-brand-bg z-40"
      aria-hidden="true"
      {...props}
    />
  );
});

IntroOverlay.displayName = "IntroOverlay";

export default IntroOverlay;

