"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

export function Hero3DSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      container.style.setProperty("--mouse-x", `${x * 100}%`)
      container.style.setProperty("--mouse-y", `${y * 100}%`)
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const floatingVariants = {
    animate: (custom: number) => ({
      y: [0, -20, 0],
      rotation: [0, 5, -5, 0],
      transition: {
        duration: 6 + custom,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: custom * 0.2,
      },
    }),
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 overflow-hidden"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Interactive gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl"
          style={{
            left: "var(--mouse-x)",
            top: "var(--mouse-y)",
            transform: "translate(-50%, -50%)",
            transition: "all 0.1s ease-out",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Floating cards */}
          <div className="relative mb-8 h-48 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={floatingVariants}
                animate="animate"
                className="absolute w-32 h-32 rounded-2xl glass-lg backdrop-blur-md border border-white/20 flex items-center justify-center"
                style={{
                  left: `${50 + (i - 1) * 120}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className={`text-4xl font-bold ${["text-accent", "text-primary", "text-secondary"][i]}`}>
                  {["R", "C", "E"][i]}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent"
          >
            Ramachandra Hub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Your gateway to exceptional career opportunities and professional growth
          </motion.p>

          {/* Animated line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent max-w-xs mx-auto mb-8"
          />
        </motion.div>
      </div>

      {/* Animated background circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none"
      >
        <div className="w-full h-full border border-accent/20 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none"
      >
        <div className="w-full h-full border border-primary/20 rounded-full" />
      </motion.div>
    </div>
  )
}
