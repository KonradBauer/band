"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

type Direction = "up" | "down" | "left" | "right" | "scale"

const offsets: Record<Direction, { x: number; y: number; scale: number }> = {
  up: { x: 0, y: 60, scale: 1 },
  down: { x: 0, y: -60, scale: 1 },
  left: { x: 60, y: 0, scale: 1 },
  right: { x: -60, y: 0, scale: 1 },
  scale: { x: 0, y: 20, scale: 0.95 },
}

export function AnimateOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}) {
  const offset = offsets[direction]

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: offset.scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
