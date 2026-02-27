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

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.5, 0])

  return (
    <div ref={ref} className={className}>
      <motion.div className="will-change-transform" style={{ scale, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}
