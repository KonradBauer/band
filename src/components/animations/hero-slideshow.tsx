"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

const IMAGES = [
  "/konradiusz1-1400x933.webp",
  "/pawe3ek-2-1400x942.webp",
  "/7b614157-c048-469c-b07d-ffec5d18d8c3.webp",
  "/763127a4-87da-4a50-b2fc-f07187d9b0d0.webp",
  "/9b652e4b-9e30-49cb-854f-1f6f1b2186c7-1400x1400.webp",
]

const SLIDE_DURATION = 5000

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.img
            src={IMAGES[current]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 1.5, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Gradient overlay — dark at top and bottom, preserves brand gold glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,168,76,0.12)_0%,transparent_70%)]" />
    </div>
  )
}
