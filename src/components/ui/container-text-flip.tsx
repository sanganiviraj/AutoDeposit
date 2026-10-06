"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
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

  // Find the longest word to lock the width of the badge container and prevent layout shift
  const longestWord = useMemo(() => {
    if (!words || words.length === 0) return "";
    return words.reduce((longest, current) => (current.length > longest.length ? current : longest), words[0]);
  }, [words]);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl py-1 px-4 font-extrabold text-[#F3BA2F] align-middle transition-all border border-[#F3BA2F]/35 bg-[#F3BA2F]/10 backdrop-blur-md overflow-hidden mx-1.5 shadow-[0_0_18px_rgba(243,186,47,0.18)] select-none",
        className
      )}
    >
      {/* Invisible text ghost matching the longest word to guarantee rock-solid constant width */}
      <span className="invisible opacity-0 select-none whitespace-nowrap leading-none font-extrabold px-0.5" aria-hidden="true">
        {longestWord}
      </span>

      {/* Animated active word centered absolutely over the ghost container */}
      <AnimatePresence mode="wait">
        <motion.span
          key={`flip-word-${currentWordIndex}-${id}`}
          initial={{ y: 14, opacity: 0, filter: "blur(3px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -14, opacity: 0, filter: "blur(3px)" }}
          transition={{
            duration: animationDuration / 1000,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center text-center whitespace-nowrap leading-none font-extrabold text-[#F3BA2F]",
            textClassName
          )}
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


