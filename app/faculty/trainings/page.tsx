"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Calendar, Clock, Zap } from "lucide-react"

const trainings = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    enrolled: 45,
    completed: 28,
    duration: "8 weeks",
    status: "ongoing",
    instructor: "Dr. Amit Singh",
    startDate: "2025-01-01",
    progress: 65,
  },
  {
    id: 2,
    name: "Web Development with React",
    enrolled: 38,
    completed: 15,
    duration: "10 weeks",
    status: "ongoing",
    instructor: "Prof. Priya Sharma",
    startDate: "2025-01-05",
    progress: 45,
  },
  {
    id: 3,
    name: "System Design Fundamentals",
    enrolled: 52,
    completed: 52,
    duration: "6 weeks",
    status: "completed",
    instructor: "Dr. Vikram Patel",
    startDate: "2024-11-01",
    progress: 100,
  },
  {
    id: 4,
    name: "Database Management Systems",
    enrolled: 40,
    completed: 0,
    duration: "8 weeks",
    status: "upcoming",
    instructor: "Dr. Sneha Kumar",
    startDate: "2025-02-01",
    progress: 0,
  },
]

export default function TrainingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing")

  const filteredTrainings = trainings.filter((t) => {
    if (activeTab === "all") return true
    return t.status === activeTab
  })

  return (
    <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                  Training Programs
                </h1>
                <p className="text-muted-foreground">Manage and track training progress</p>
              </div>
              <Button className="gap-2 bg-secondary text-secondary-foreground">
                <Plus className="w-4 h-4" />
                New Training
              </Button>
            </motion.div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-8 flex-wrap">
              {["all", "ongoing", "completed", "upcoming"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab ? "bg-secondary text-secondary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </motion.div>

            {/* Trainings Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredTrainings.map((training, index) => (
                <motion.div
                  key={training.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-lg p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold">{training.name}</h3>
                        <Badge
                          className={
                            training.status === "completed"
                              ? "bg-green-500/20 text-green-700 dark:text-green-300"
                              : training.status === "ongoing"
                                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                : "bg-gray-500/20 text-gray-700 dark:text-gray-300"
                          }
                        >
                          {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{training.instructor}</p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-secondary" />
                        <span>
                          {training.enrolled} enrolled • {training.completed} completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>Started {new Date(training.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{training.duration}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs text-secondary font-semibold">{training.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary rounded-full h-2 transition-all"
                          style={{ width: `${training.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Button size="sm" className="flex-1 gap-2 bg-secondary text-secondary-foreground">
                        <Zap className="w-4 h-4" />
                        Update
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
    </div>
  )
}
