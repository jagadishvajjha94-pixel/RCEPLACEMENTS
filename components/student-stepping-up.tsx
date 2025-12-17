"use client"

import { motion } from "framer-motion"
import { useRef, useEffect } from "react"

export function StudentSteppingUp() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Upward Arrow */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Arrow path */}
        <svg
          width="200"
          height="500"
          viewBox="0 0 200 500"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <defs>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="arrowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Glow effect */}
          <motion.path
            d="M 100 450 L 100 50 L 150 100 L 130 100 L 130 450 Z M 100 50 L 50 100 L 70 100 L 100 50"
            fill="url(#arrowGlow)"
            filter="blur(10px)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          
          {/* Main arrow */}
          <motion.path
            d="M 100 450 L 100 50 L 150 100 L 130 100 L 130 450 Z M 100 50 L 50 100 L 70 100 L 100 50"
            fill="url(#arrowGradient)"
            stroke="#fff"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* Steps on the arrow */}
        {[400, 300, 200, 100].map((y, index) => (
          <motion.div
            key={index}
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `${y}px` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            <div className="w-16 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg" />
          </motion.div>
        ))}
      </motion.div>

      {/* Student Character - Stepping up */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: "450px" }}
        initial={{ y: 0 }}
        animate={{
          y: [0, -400, -400, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.7, 0.85, 1]
        }}
      >
        {/* Student SVG */}
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="drop-shadow-2xl"
          animate={{
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        >
          {/* Head */}
          <circle cx="40" cy="25" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          {/* Body */}
          <rect x="30" y="37" width="20" height="30" rx="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          {/* Arms */}
          <line x1="30" y1="45" x2="20" y2="55" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="45" x2="60" y2="55" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          {/* Legs - stepping animation */}
          <motion.line
            x1="35"
            y1="67"
            x2="35"
            y2="75"
            stroke="#1e40af"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              x2: [35, 30, 40, 35],
            }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          />
          <motion.line
            x1="45"
            y1="67"
            x2="45"
            y2="75"
            stroke="#1e40af"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              x2: [45, 50, 45, 45],
            }}
            transition={{
              duration: 0.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
          {/* Graduation cap */}
          <motion.rect
            x="32"
            y="18"
            width="16"
            height="8"
            rx="2"
            fill="#1e293b"
            animate={{
              y: [18, 16, 18]
            }}
            transition={{
              duration: 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="40"
            cy="18"
            r="2"
            fill="#fbbf24"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          />
        </motion.svg>

        {/* Success sparkles around student */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}px`,
              top: `${-10 - i * 5}px`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating success badges */}
      {["💼", "🎓", "⭐", "🏆"].map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute text-3xl"
          style={{
            left: `${50 + (index - 1.5) * 30}%`,
            top: `${30 + index * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}

