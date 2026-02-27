"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

export function HeroAnimations({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function HeroItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

export function HeroGlow() {
  const isMobile = useIsMobile()

  return (
    <>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] will-change-transform"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden
      />
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full blur-[100px] will-change-transform"
            style={{ background: "rgba(212, 175, 55, 0.06)" }}
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.6, 0.3],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[300px] h-[200px] rounded-full blur-[80px] will-change-transform"
            style={{ background: "rgba(245, 230, 184, 0.04)" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            aria-hidden
          />
        </>
      )}
    </>
  )
}
