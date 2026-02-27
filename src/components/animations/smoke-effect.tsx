"use client"

import { motion } from "motion/react"

interface SmokeParticle {
  id: number
  x: string
  delay: number
  duration: number
  size: number
  peakOpacity: number
  drift: number
  blur: number
  startY: string
}

function generateParticles(count: number): SmokeParticle[] {
  const particles: SmokeParticle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 8,
      size: 300 + Math.random() * 500,
      peakOpacity: 0.25 + Math.random() * 0.2,
      drift: (i % 2 === 0 ? 1 : -1) * (50 + Math.random() * 100),
      blur: 30 + Math.random() * 30,
      startY: `${85 + Math.random() * 20}%`,
    })
  }
  return particles
}

const particles = generateParticles(18)

export function SmokeEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.startY,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,255,255,${p.peakOpacity}) 0%, rgba(200,190,170,${p.peakOpacity * 0.5}) 35%, transparent 65%)`,
            filter: `blur(${p.blur}px)`,
            mixBlendMode: "screen",
          }}
          animate={{
            y: [0, -500, -1000],
            x: [0, p.drift, p.drift * -0.6],
            scale: [0.3, 1.6, 2.8],
            opacity: [0, p.peakOpacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
