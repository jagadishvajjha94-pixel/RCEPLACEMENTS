"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  icon?: ReactNode
  title?: string
  description?: string
}

export function AnimatedCard({ children, delay = 0, icon, title, description }: AnimatedCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 45 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      className="glass-lg rounded-2xl p-8 border border-white/10 hover:border-accent/50 transition-all duration-300 perspective"
      style={
        {
          perspective: "1000px",
        } as React.CSSProperties
      }
    >
      {icon && (
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          viewport={{ once: true }}
          className="mb-4 text-4xl"
        >
          {icon}
        </motion.div>
      )}
      {title && (
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          viewport={{ once: true }}
          className="text-xl font-bold mb-2 text-white"
        >
          {title}
        </motion.h3>
      )}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          viewport={{ once: true }}
          className="text-gray-100 mb-4"
        >
          {description}
        </motion.p>
      )}
      {children}
    </motion.div>
  )
}
