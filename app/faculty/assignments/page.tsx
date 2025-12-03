"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, Users, Clock, Trash2, Edit2 } from "lucide-react"

const assignments = [
  {
    id: 1,
    title: "Array Problems - Easy",
    description: "Solve 10 easy array-based DSA problems",
    posted: "2025-01-10",
    deadline: "2025-01-15",
    submissions: 32,
    total: 45,
    status: "active",
  },
  {
    id: 2,
    title: "Binary Trees Implementation",
    description: "Implement common binary tree operations",
    posted: "2025-01-08",
    deadline: "2025-01-18",
    submissions: 28,
    total: 45,
    status: "active",
  },
  {
    id: 3,
    title: "String Manipulation Challenges",
    description: "Complete string problem set",
    posted: "2024-12-28",
    deadline: "2025-01-05",
    submissions: 45,
    total: 45,
    status: "closed",
  },
]

export default function AssignmentsPage() {
  const [showForm, setShowForm] = useState(false)

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
                  Assignments
                </h1>
                <p className="text-muted-foreground">Create and track student assignments</p>
              </div>
              <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-secondary text-secondary-foreground">
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </motion.div>

            {/* Assignment Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-lg rounded-lg p-6 mb-8"
              >
                <h3 className="text-lg font-bold mb-4">Create New Assignment</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Assignment Title"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border"
                  />
                  <textarea
                    placeholder="Description"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="date" className="px-4 py-2 rounded-lg bg-input border border-border" />
                    <input type="date" className="px-4 py-2 rounded-lg bg-input border border-border" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-secondary text-secondary-foreground">Create</Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Assignments List */}
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {assignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-lg p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{assignment.title}</h3>
                            <Badge
                              className={
                                assignment.status === "active"
                                  ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : "bg-gray-500/20 text-gray-700 dark:text-gray-300"
                              }
                            >
                              {assignment.status === "active" ? "Active" : "Closed"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-secondary" />
                              <span>Posted {new Date(assignment.posted).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-secondary" />
                              <span>Due {new Date(assignment.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-secondary" />
                              <span>
                                {assignment.submissions}/{assignment.total} submissions
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
    </div>
  )
}
