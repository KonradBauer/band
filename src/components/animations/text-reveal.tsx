"use client"

import { motion } from "motion/react"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  letterDelay?: number
}

export function TextReveal({
  text,
  className,
  delay = 0,
  letterDelay = 0.05,
}: TextRevealProps) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: letterDelay,
            delayChildren: delay,
          },
        },
      }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
