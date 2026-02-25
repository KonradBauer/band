"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

const NOTE_CHARS = ["♪", "♫", "♩", "♬"]

interface Note {
  id: number
  char: string
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  rotate: number
}

export function FloatingNotes({ count = 12 }: { count?: number }) {
  const notes = useMemo<Note[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      char: NOTE_CHARS[i % NOTE_CHARS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 18,
      opacity: 0.08 + Math.random() * 0.18,
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 4,
      rotate: -20 + Math.random() * 40,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {notes.map((n) => (
        <motion.span
          key={n.id}
          className="absolute text-primary select-none"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            fontSize: n.size,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -10, 0],
            rotate: [n.rotate, n.rotate + 15, n.rotate - 10, n.rotate],
            opacity: [n.opacity, n.opacity * 1.8, n.opacity],
          }}
          transition={{
            duration: n.duration,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      ))}
    </div>
  )
}
