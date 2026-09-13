"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["hundreds", "thousands", "multiple", "scalable"],
  interval = 2800,
  className,
  textClassName,
  animationDuration = 400,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center min-w-[140px] sm:min-w-[190px] rounded-xl py-0.5 px-3 text-center font-extrabold text-[#F3BA2F] align-middle transition-all shadow-[0_0_20px_rgba(243,186,47,0.25)] border border-[#F3BA2F]/40 bg-[#F3BA2F]/10 backdrop-blur-md overflow-hidden my-0.5",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`flip-word-${currentWordIndex}-${id}`}
          initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
          transition={{
            duration: animationDuration / 1000,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={cn("inline-block text-center whitespace-nowrap leading-none", textClassName)}
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


