"use client";

import { m, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to wait before animating; use for staggering siblings. */
  delay?: number;
  /** Distance in px the element rises while fading in. */
  y?: number;
};

/**
 * Fades and lifts its children into view once, when scrolled to.
 * Disabled automatically for visitors who prefer reduced motion
 * (see <MotionConfig reducedMotion="user"> in Providers).
 */
export function Reveal({ delay = 0, y = 28, children, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </m.div>
  );
}
