"use client"

import { motion } from "motion/react"
import { useMemo } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const isMobile = useIsMobile()
  const effectiveCount = isMobile ? Math.min(count, 8) : count

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.4,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
    }))
  }, [effectiveCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 0.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
