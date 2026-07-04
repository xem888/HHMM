
import type { Transition, Variants } from "framer-motion";

export const DURATION = {
  fast: 0.15,
  base: 0.22,
  slow: 0.32,
} as const;

export const EASING = {
  standard: [0.4, 0, 0.2, 1] as const,
  enter: [0, 0, 0.2, 1] as const,
} as const;

export const SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
};

export const SPRING_BOUNCY: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 25,
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: DURATION.base, ease: EASING.standard },
} as const;

export const listContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035 },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASING.enter },
  },
};
