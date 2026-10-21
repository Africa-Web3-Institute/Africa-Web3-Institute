import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Reveal — scroll-triggered entrance animation via Framer Motion.
 *
 * Props:
 *  children  – content to reveal
 *  delay     – stagger delay in seconds (default 0)
 *  direction – "up" | "down" | "left" | "right" | "none" (default "up")
 *  distance  – pixels to travel (default 28)
 *  duration  – animation duration in seconds (default 0.7)
 *  once      – only animate once (default true)
 *  className – forwarded className
 *  as        – element tag (default "div")
 *  style     – forwarded style
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 28,
  duration = 0.7,
  once = true,
  className = "",
  as: Tag = "div",
  style,
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });

  const offset = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    none:  {},
  }[direction] ?? { y: distance };

  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
