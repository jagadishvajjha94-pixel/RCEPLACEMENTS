"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Mic, MicOff, CheckCircle2, Circle, Trash2, Clock, Briefcase } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export function TaskManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [isWriting, setIsWriting] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("adminTasks")
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)
        setTasks(parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })))
      } catch (e) {
        console.error("Error loading tasks:", e)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("adminTasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = 
        (window as any).webkitSpeechRecognition || 
        (window as any).SpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition

      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = "en-US"

          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = ""
            let hasNewFinal = false

            // Clear silence timeout when we get results
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current)
              silenceTimeoutRef.current = null
            }

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript + " "
                hasNewFinal = true
              }
            }

            // Process final transcripts immediately
            if (hasNewFinal && finalTranscript.trim()) {
              processTranscript(finalTranscript)
            }

            // Set timeout to auto-stop after 2 seconds of silence
            silenceTimeoutRef.current = setTimeout(() => {
              if (isRecording) {
                stopRecording()
              }
            }, 2000) // 2 seconds of silence = stop recording
          }

          recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            
            if (event.error === "not-allowed") {
              // Permission denied - try to request it automatically
              setPermissionError("Requesting microphone permission...")
              requestMicrophonePermission()
            } else if (event.error === "no-speech") {
              // No speech detected, this is normal - just continue listening
              // Don't stop recording, keep listening
              console.log("No speech detected, continuing to listen...")
            } else if (event.error === "aborted") {
              // Recognition was aborted, this is normal when stopping
              setIsRecording(false)
              setIsListening(false)
            } else if (event.error === "network") {
              setPermissionError("Network error. Please check your connection.")
              setIsRecording(false)
              setIsListening(false)
            } else {
              // For other errors, try to continue
              console.log("Recognition error, but continuing:", event.error)
            }
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
            // Auto-restart if still in recording mode (for continuous listening)
            if (isRecording && recognitionRef.current && !permissionError) {
              try {
                setTimeout(() => {
                  if (isRecording && recognitionRef.current) {
                    // Check if not already started before restarting
                    try {
                      const state = recognitionRef.current.state
                      if (state !== "listening" && state !== "starting") {
                        recognitionRef.current.start()
                      }
                    } catch (e) {
                      // State property not available, try to start anyway
                      try {
                        recognitionRef.current.start()
                      } catch (startError: any) {
                        if (!startError.message?.includes("already started")) {
                          throw startError
                        }
                      }
                    }
                  }
                }, 100)
              } catch (e) {
                console.error("Error restarting recognition:", e)
                // If restart fails, stop recording
                setIsRecording(false)
              }
            }
          }
        } catch (error) {
          console.error("Error initializing speech recognition:", error)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [isRecording])

  // Set up 5-minute reminder interval
  useEffect(() => {
    // Show reminder every 5 minutes (300000 ms)
    reminderIntervalRef.current = setInterval(() => {
      if (tasks.length > 0 && !isOpen) {
        setShowReminder(true)
        setIsWriting(false) // Stop writing animation when reminder shows
      }
    }, 300000) // 5 minutes

    return () => {
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current)
      }
    }
  }, [tasks, isOpen])

  const processTranscript = (transcript: string) => {
    // Process the final transcript and create tasks
    // Try to split by numbered lists (1., 2., etc.)
    let sentences = transcript
      .split(/\d+[.)]\s+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)

    // If no numbered lists, try splitting by keywords or punctuation
    if (sentences.length <= 1) {
      sentences = transcript
        .split(/[.!?]\s+|and\s+then\s+|also\s+|next\s+/i)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    }

    // Process each sentence
    sentences.forEach((sentence: string) => {
      // Clean up common speech artifacts
      sentence = sentence
        .replace(/^\s*(?:um|uh|er|ah|like|you know)\s+/i, "")
        .replace(/\s+(?:um|uh|er|ah|like|you know)\s+/gi, " ")
        .trim()

      // Only add meaningful tasks (at least 5 characters)
      if (sentence.length >= 5) {
        // Remove common prefixes
        sentence = sentence.replace(/^(?:task|item|thing|remind me to|i need to|i should|add|create)\s+/i, "")
        
        if (sentence.length >= 5) {
          addTask(sentence)
        }
      }
    })
  }

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Permission granted, stop the stream and start recognition
      stream.getTracks().forEach(track => track.stop())
      setPermissionError(null)
      // Auto-start recording after permission is granted
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            setIsRecording(true)
            setIsListening(true)
            recognitionRef.current.start()
          } catch (e) {
            console.error("Error restarting after permission:", e)
          }
        }
      }, 200)
    } catch (error: any) {
      console.error("Error requesting microphone permission:", error)
      if (error.name === "NotAllowedError") {
        setPermissionError("Microphone permission denied. Please allow microphone access in your browser settings.")
      } else if (error.name === "NotFoundError") {
        setPermissionError("No microphone found. Please connect a microphone.")
      } else {
        setPermissionError(`Error accessing microphone: ${error.message}`)
      }
      setIsRecording(false)
      setIsListening(false)
    }
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const startRecording = async () => {
    if (!recognitionRef.current) {
      setPermissionError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      return
    }

    // Check if already started
    try {
      // Check the state property if available
      const isAlreadyStarted = recognitionRef.current.state === "listening" || recognitionRef.current.state === "starting"
      
      if (isAlreadyStarted) {
        // Already running, just update UI state
        setIsRecording(true)
        setIsListening(true)
        setIsWriting(false)
        return
      }
    } catch (e) {
      // State property might not be available, continue with start attempt
    }

    // Try to start recognition directly - browser will handle permission prompt
    try {
      setIsRecording(true)
      setIsListening(true)
      setIsWriting(false) // Stop writing when recording
      setPermissionError(null)
      recognitionRef.current.start()
    } catch (error: any) {
      console.error("Error starting recognition:", error)
      
      // Check if it's already started error
      if (
        error.message?.includes("already started") || 
        error.message?.includes("started") ||
        error.message?.includes("recognition has already started")
      ) {
        // Recognition already running, just update state
        setIsRecording(true)
        setIsListening(true)
        setIsWriting(false)
      } else {
        // Don't show error immediately, let the onerror handler deal with it
        setIsRecording(false)
        setIsListening(false)
      }
    }
  }

  const stopRecording = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore errors when stopping
      }
      setIsRecording(false)
      setIsListening(false)
      setIsWriting(true) // Resume writing animation
    }
  }

  const handleOpen = async () => {
    setIsOpen(true)
    setShowReminder(false)
    setIsWriting(false) // Stop writing when popup opens
    
    // Automatically start recording when opened
    // Small delay to ensure modal is open and recognition is ready
    setTimeout(() => {
      // Only start if not already recording
      if (!isRecording && recognitionRef.current) {
        startRecording()
      }
    }, 500)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsWriting(true) // Resume writing when popup closes
  }

  const handleReminderClose = () => {
    setShowReminder(false)
    setIsWriting(true) // Resume writing
  }

  const handleReminderOpen = () => {
    setShowReminder(false)
    handleOpen()
  }

  const pendingTasks = tasks.filter((t) => !t.completed).length

  return (
    <>
      {/* Floating Task Manager Icon - 3D Design */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.button
          onClick={handleOpen}
          className="relative w-20 h-20 group"
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, -5, 0] }}
          whileTap={{ scale: 0.9 }}
          style={{
            perspective: "1000px",
          }}
        >
          {/* 3D Container with depth */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: [0, 5, -5, 0],
              rotateX: [0, 3, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Base shadow layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl blur-xl transform translate-y-2" />
            
            {/* Main 3D button */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:shadow-blue-500/50"
              style={{
                boxShadow: `
                  0 10px 30px rgba(59, 130, 246, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                  0 -5px 15px rgba(0, 0, 0, 0.3) inset
                `,
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
              
              {/* Office Guy Writing Animation - Enhanced 3D */}
              <div className="relative w-full h-full flex items-center justify-center p-3">
                <motion.div
                  animate={isWriting ? {
                    y: [0, -2, 0],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: isWriting ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                    {/* Desk/Table with 3D effect */}
                    <defs>
                      <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                      </linearGradient>
                      <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    
                    {/* Desk shadow */}
                    <ellipse cx="60" cy="100" rx="50" ry="8" fill="#000" opacity="0.2" />
                    
                    {/* Desk surface */}
                    <rect x="10" y="75" width="100" height="8" rx="2" fill="url(#deskGradient)" />
                    <rect x="10" y="75" width="100" height="4" rx="2" fill="#6366f1" opacity="0.6" />
                    
                    {/* Head with 3D effect */}
                    <circle cx="60" cy="25" r="14" fill="#fbbf24" />
                    <circle cx="60" cy="25" r="14" fill="url(#headGradient)" opacity="0.3" />
                    <ellipse cx="55" cy="23" rx="2" ry="3" fill="#1f2937" />
                    <ellipse cx="65" cy="23" rx="2" ry="3" fill="#1f2937" />
                    <ellipse cx="60" cy="28" rx="4" ry="2" fill="#dc2626" />
                    
                    {/* Hair */}
                    <path d="M 50 20 Q 60 15 70 20" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round" />
                    
                    {/* Body with gradient */}
                    <rect x="48" y="38" width="24" height="28" rx="3" fill="url(#shirtGradient)" />
                    <rect x="48" y="38" width="24" height="14" rx="3" fill="#60a5fa" opacity="0.7" />
                    
                    {/* Tie */}
                    <rect x="58" y="38" width="4" height="20" rx="1" fill="#1e40af" />
                    <polygon points="58,38 60,42 62,38" fill="#1e3a8a" />
                    
                    {/* Arms with 3D effect */}
                    <motion.g
                      animate={isWriting ? {
                        rotate: [0, 12, -12, 0],
                        transformOrigin: "42px 45px",
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: isWriting ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Left arm (writing) */}
                      <line x1="48" y1="45" x2="30" y2="60" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="30" cy="60" r="4" fill="#1e40af" />
                      
                      {/* Hand */}
                      <circle cx="30" cy="60" r="3" fill="#fbbf24" />
                      
                      {/* Pen with 3D effect */}
                      <motion.g
                        animate={isWriting ? {
                          y: [0, 3, 0],
                          rotate: [0, 2, 0],
                        } : {}}
                        transition={{
                          duration: 0.6,
                          repeat: isWriting ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      >
                        <line x1="30" y1="60" x2="18" y2="72" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                        <line x1="18" y1="72" x2="15" y2="75" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="15" cy="75" r="1.5" fill="#dc2626" />
                      </motion.g>
                    </motion.g>
                    
                    {/* Right arm */}
                    <line x1="72" y1="45" x2="88" y2="50" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="88" cy="50" r="4" fill="#1e40af" />
                    <circle cx="88" cy="50" r="3" fill="#fbbf24" />
                    
                    {/* Legs with depth */}
                    <line x1="52" y1="66" x2="52" y2="80" stroke="#1e40af" strokeWidth="5" strokeLinecap="round" />
                    <line x1="68" y1="66" x2="68" y2="80" stroke="#1e40af" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Shoes */}
                    <ellipse cx="52" cy="80" rx="4" ry="2" fill="#1e3a8a" />
                    <ellipse cx="68" cy="80" rx="4" ry="2" fill="#1e3a8a" />
                    
                    {/* Paper on desk */}
                    <rect x="20" y="70" width="30" height="8" rx="1" fill="#fef3c7" opacity="0.8" />
                    <line x1="22" y1="72" x2="28" y2="72" stroke="#fbbf24" strokeWidth="0.5" />
                    <line x1="22" y1="74" x2="26" y2="74" stroke="#fbbf24" strokeWidth="0.5" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 to-purple-400/0"
                animate={{
                  background: isWriting ? [
                    "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                  ] : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                }}
                transition={{
                  duration: 2,
                  repeat: isWriting ? Infinity : 0,
                }}
              />
            </div>
          </motion.div>

          {/* Notification Badge - 3D style */}
          {pendingTasks > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -right-2 z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-60" />
                <div className="relative w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
                  style={{
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {pendingTasks > 9 ? "9+" : pendingTasks}
                </div>
              </div>
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Reminder Popup */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80"
          >
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 shadow-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Task Reminder</h3>
                </div>
                <button
                  onClick={handleReminderClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                You have <span className="font-bold text-blue-600">{pendingTasks}</span> pending task{pendingTasks !== 1 ? "s" : ""}.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleReminderOpen}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  View Tasks
                </Button>
                <Button
                  onClick={handleReminderClose}
                  size="sm"
                  variant="outline"
                >
                  Later
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Manager Modal - Creative Layout */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-md z-40"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 right-6 w-[420px] max-h-[700px] z-50"
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: "1000px" }}
            >
              {/* 3D Card Effect */}
              <div className="relative">
                {/* Shadow layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl transform translate-y-4" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transform translate-y-2" />
                
                <Card className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 shadow-2xl border-0 flex flex-col max-h-[700px] overflow-hidden backdrop-blur-xl"
                  style={{
                    boxShadow: `
                      0 20px 60px rgba(59, 130, 246, 0.3),
                      0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                      0 -10px 30px rgba(139, 92, 246, 0.2) inset
                    `,
                  }}
                >
                  {/* Decorative Header Background */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90">
                    <div 
                      className="absolute inset-0 opacity-20" 
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }}
                    />
                  </div>

                  {/* Header Content */}
                  <div className="relative p-6 text-white z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold drop-shadow-lg">Task Manager</h2>
                          <p className="text-xs text-white/80">Stay organized & productive</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={handleClose}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/30"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  
                  {/* Speech to Text Controls */}
                  <div className="space-y-2">
                    {permissionError && !permissionError.includes("Requesting") && (
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-xs text-white">
                        <p className="font-medium mb-1">⚠️ {permissionError}</p>
                        <Button
                          onClick={requestMicrophonePermission}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white text-xs h-6"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                    {permissionError && permissionError.includes("Requesting") && (
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2 text-xs text-white text-center">
                        <p className="font-medium">🎤 {permissionError}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {isRecording ? (
                        <>
                          <Button
                            onClick={stopRecording}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white flex-1"
                          >
                            <MicOff className="w-4 h-4 mr-2" />
                            {isListening ? "Listening..." : "Stop Recording"}
                          </Button>
                          {isListening && (
                            <motion.div
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="flex items-center gap-1 text-white/90 text-xs px-2 py-1 bg-white/20 rounded"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-2 bg-red-400 rounded-full"
                              ></motion.div>
                              Recording...
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={startRecording}
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      )}
                    </div>
                    {isRecording && (
                      <p className="text-xs text-white/80 text-center">
                        Speak your tasks. Recording will stop automatically after 2 seconds of silence.
                      </p>
                    )}
                      
                      {/* Manual Input - Styled */}
                      <div className="pt-2 border-t border-white/20">
                        <p className="text-xs text-white/70 mb-2 font-medium">Or type manually:</p>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter task..."
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && manualInput.trim()) {
                                addTask(manualInput)
                                setManualInput("")
                              }
                            }}
                            className="bg-white/90 text-gray-900 placeholder:text-gray-400 border-2 border-white/50 focus:border-white/80 rounded-xl"
                          />
                          <Button
                            onClick={() => {
                              if (manualInput.trim()) {
                                addTask(manualInput)
                                setManualInput("")
                              }
                            }}
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm px-4 rounded-xl"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List - Creative Layout */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-transparent to-blue-50/20">
                    {tasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Briefcase className="w-10 h-10 text-blue-500" />
                        </div>
                        <p className="text-gray-600 font-medium mb-2">No tasks yet</p>
                        <p className="text-sm text-gray-500">Start speaking or type to add your first task!</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                          >
                            <div className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 ${
                              task.completed
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50"
                                : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
                            }`}>
                              <motion.button
                                onClick={() => toggleTask(task.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="mt-0.5"
                              >
                                {task.completed ? (
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center">
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </motion.button>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium ${
                                    task.completed
                                      ? "line-through text-gray-500"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {task.text}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <p className="text-xs text-gray-400">
                                    {task.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <motion.button
                                onClick={() => deleteTask(task.id)}
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Stats - Enhanced */}
                  <div className="p-4 border-t-2 border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-semibold text-gray-700">
                          {pendingTasks} pending
                        </span>
                      </div>
                      <div className="h-6 w-px bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {tasks.filter((t) => t.completed).length} done
                        </span>
                      </div>
                      <div className="h-6 w-px bg-gray-300" />
                      <div className="text-sm font-bold text-blue-600">
                        {tasks.length} total
                      </div>
                    </div>
                    {/* Progress Bar */}
                    {tasks.length > 0 && (
                      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

