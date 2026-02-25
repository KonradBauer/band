"use client"

import { motion } from "motion/react"

export function SectionDivider({ className }: { className?: string }) {
  return (
    <motion.div
      className={`mx-auto max-w-xs h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent ${className ?? ""}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  )
}
