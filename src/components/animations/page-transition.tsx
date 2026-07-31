"use client"

import { motion } from "motion/react"
import { useRef } from "react"
import type { ReactNode } from "react"

let hasMountedBefore = false

export function PageTransition({ children }: { children: ReactNode }) {
  const isFirstMount = useRef(!hasMountedBefore)
  hasMountedBefore = true

  return (
    <motion.div
      initial={isFirstMount.current ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
