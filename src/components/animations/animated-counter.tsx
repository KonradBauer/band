"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, animate } from "motion/react"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  label: string
  duration?: number
}

export function AnimatedCounter({
  value,
  suffix = "",
  label,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    })

    return () => controls.stop()
  }, [isInView, value, duration])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="font-heading text-4xl md:text-5xl font-bold gold-gradient-text">
        {displayValue}
        {suffix}
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{label}</p>
    </motion.div>
  )
}
