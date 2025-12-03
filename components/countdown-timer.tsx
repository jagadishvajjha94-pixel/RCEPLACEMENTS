"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  deadline: string
  compact?: boolean
}

export function CountdownTimer({ deadline, compact = false }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const deadlineTime = new Date(deadline).getTime()
      const now = new Date().getTime()
      const distance = deadlineTime - now

      if (distance > 0) {
        setTime({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        })
      } else {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (compact) {
    return (
      <motion.div className="flex gap-1 text-xs font-bold text-accent">
        <span>{time.days}d</span>
        <span>{time.hours}h</span>
        <span>{time.minutes}m</span>
      </motion.div>
    )
  }

  return (
    <div className="flex gap-2 justify-center">
      {Object.entries(time).map(([label, value]) => (
        <motion.div
          key={label}
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg p-3 min-w-16 text-center">
            <p className="text-2xl font-bold">{String(value).padStart(2, "0")}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{label}</p>
        </motion.div>
      ))}
    </div>
  )
}
