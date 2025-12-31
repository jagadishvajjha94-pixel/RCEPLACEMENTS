"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface StatItem {
  label: string
  value: string | number
  icon?: React.ReactNode
}

interface InteractiveStatsProps {
  stats: StatItem[]
}

export function InteractiveStats({ stats }: InteractiveStatsProps) {
  const [counts, setCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    stats.forEach((stat, index) => {
      if (typeof stat.value === "number") {
        let current = 0
        const target = stat.value
        const increment = target / 50

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCounts((prev) => ({ ...prev, [index]: target }))
            clearInterval(timer)
          } else {
            setCounts((prev) => ({ ...prev, [index]: Math.floor(current) }))
          }
        }, 30)

        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearInterval(timer))
    }
  }, [stats])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants} className="glass-lg rounded-xl p-6 text-center">
          {stat.icon && <div className="text-3xl mb-2">{stat.icon}</div>}
          <motion.div className="text-3xl md:text-4xl font-bold text-accent mb-2">
            {typeof stat.value === "number" ? counts[index] || 0 : stat.value}
            {typeof stat.value === "string" && stat.value.includes("LPA") && ""}
          </motion.div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
