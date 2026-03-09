import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const directions = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const dir = directions[direction] || directions.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...dir }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...dir }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
