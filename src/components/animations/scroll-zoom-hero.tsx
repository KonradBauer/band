"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ScrollZoomHeroProps {
  children: ReactNode
  className?: string
}

export function ScrollZoomHero({ children, className }: ScrollZoomHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0])
  const filter = useTransform(scrollYProgress, (v) => `blur(${v * 10}px)`)

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity, filter }}>
        {children}
      </motion.div>
    </div>
  )
}
