import { forwardRef } from "react";
import { useCursor } from "../context/CursorContext";
import ShinyText from "./ShinyText";

const Logo = forwardRef((props, ref) => {
  const { setCursorVariant } = useCursor();

  return (
    <h1
      ref={ref}
      className="fixed z-50 text-8xl md:text-9xl font-bold select-none whitespace-nowrap tracking-tighter cursor-none"
      style={{ fontFamily: '"Outfit", sans-serif' }}
      onMouseEnter={() => setCursorVariant("text")}
      onMouseLeave={() => setCursorVariant("default")}
      {...props}
    >
      <ShinyText text="TryBear" disabled={false} speed={3} />
    </h1>
  );
});

Logo.displayName = "Logo";

export default Logo;
