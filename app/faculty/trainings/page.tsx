import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Users, Calendar, Clock, Zap, Edit, Trash2, CheckCircle, Upload, X, BookOpen } from "lucide-react"
import { TrainingService } from "@/lib/db-service"
import type { Training } from "@/lib/mock-data"

interface TrainingWithProgress extends Training {
  enrolled?: number
  completed?: number
  progress?: number
  syllabusCompleted?: { date: string; topics: string[] }[]
}

export default function TrainingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing")
  const [trainings, setTrainings] = useState<TrainingWithProgress[]>([])
  const [showNewTraining, setShowNewTraining] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<TrainingWithProgress | null>(null)
  const [trainingForm, setTrainingForm] = useState({
    title: "",
    topic: "",
    date: "",
    time: "",
    location: "",
    instructor: "",
    branch: "CSE",
    section: "A",
    year: "3rd",
  })
  const [syllabusForm, setSyllabusForm] = useState({
    date: new Date().toISOString().split('T')[0],
    topics: "",
  })

  // Load trainings
  const loadTrainings = async () => {
    const data = await TrainingService.getAll()
    const trainingsWithProgress = data.map(t => ({
      ...t,
      enrolled: Math.floor(Math.random() * 50) + 20,
      completed: Math.floor(Math.random() * 30),
      progress: Math.floor(Math.random() * 100),
      syllabusCompleted: [
        { date: "2025-01-15", topics: ["Arrays", "Linked Lists"] },
        { date: "2025-01-20", topics: ["Stacks", "Queues"] },
      ],
    }))
    setTrainings(trainingsWithProgress)
  }

  useEffect(() => {
    loadTrainings()
  }, [])

  const filteredTrainings = trainings.filter((t) => {
    if (activeTab === "all") return true
    return t.status === activeTab
  })

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await TrainingService.create({
        ...trainingForm,
        language: "English",
        syllabusCovered: [],
        status: new Date(trainingForm.date) > new Date() ? "upcoming" : "ongoing",
      })
      setTrainingForm({ title: "", topic: "", date: "", time: "", location: "", instructor: "", branch: "CSE", section: "A", year: "3rd" })
      setShowNewTraining(false)
      loadTrainings()
    } catch (error) {
      alert("Failed to create training")
    }
  }

  const handleUpdateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTraining) return
    try {
      await TrainingService.update(selectedTraining.id, {
        title: trainingForm.title,
        topic: trainingForm.topic,
        date: trainingForm.date,
        time: trainingForm.time,
        location: trainingForm.location,
        instructor: trainingForm.instructor,
        status: new Date(trainingForm.date) > new Date() ? "upcoming" : "ongoing",
      })
      setShowUpdate(false)
      setSelectedTraining(null)
      loadTrainings()
    } catch (error) {
      alert("Failed to update training")
    }
  }

  const handleAddSyllabusCompletion = () => {
    if (!selectedTraining || !syllabusForm.topics.trim()) return
    const topics = syllabusForm.topics.split(',').map(t => t.trim())
    // In real app, update training with new syllabus completion
    alert(`Syllabus completion added for ${syllabusForm.date}: ${topics.join(", ")}`)
    setSyllabusForm({ date: new Date().toISOString().split('T')[0], topics: "" })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Calendar view - get dates with syllabus completion
  const getCalendarDays = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Training Programs
          </h1>
          <p className="text-muted-foreground">Manage and track training progress with calendar</p>
        </div>
        <Button 
          onClick={() => {
            setTrainingForm({ title: "", topic: "", date: "", time: "", location: "", instructor: "", branch: "CSE", section: "A", year: "3rd" })
            setShowNewTraining(true)
          }}
          className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
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
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === tab 
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col shadow-sm">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{training.title}</h3>
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
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>
                    {training.enrolled} enrolled • {training.completed} completed
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Started {new Date(training.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{training.time}</span>
                </div>
              </div>

              {/* Progress Bar with Color Change */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs font-semibold">{training.progress || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className={`${getProgressColor(training.progress || 0)} rounded-full h-3 transition-all duration-500`}
                    style={{ width: `${training.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Button 
                  size="sm" 
                  className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setSelectedTraining(training)
                    setTrainingForm({
                      title: training.title,
                      topic: training.topic,
                      date: training.date,
                      time: training.time,
                      location: training.location,
                      instructor: training.instructor,
                      branch: training.branch,
                      section: training.section,
                      year: training.year,
                    })
                    setShowUpdate(true)
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Update
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50"
                  onClick={() => {
                    setSelectedTraining(training)
                    setShowDetails(true)
                  }}
                >
                  Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* New Training Modal */}
      <Dialog open={showNewTraining} onOpenChange={setShowNewTraining}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Training</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTraining} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Training Title</label>
              <Input 
                placeholder="e.g., Full Stack Development Workshop" 
                value={trainingForm.title}
                onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Topic</label>
              <Input 
                placeholder="e.g., React & Node.js Fundamentals" 
                value={trainingForm.topic}
                onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Date</label>
                <Input 
                  type="date" 
                  value={trainingForm.date}
                  onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Time</label>
                <Input 
                  type="time" 
                  value={trainingForm.time}
                  onChange={(e) => setTrainingForm({ ...trainingForm, time: e.target.value })}
                  required 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Location</label>
              <Input 
                placeholder="e.g., Lab 1, A Building" 
                value={trainingForm.location}
                onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Instructor</label>
              <Input 
                placeholder="Instructor name" 
                value={trainingForm.instructor}
                onChange={(e) => setTrainingForm({ ...trainingForm, instructor: e.target.value })}
                required 
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Branch</label>
                <select
                  value={trainingForm.branch}
                  onChange={(e) => setTrainingForm({ ...trainingForm, branch: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {["CSE", "ECE", "Mechanical", "Civil", "EEE", "AIDS", "AI/ML", "Cybersecurity", "IoT", "ServiceNow"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Section</label>
                <select
                  value={trainingForm.section}
                  onChange={(e) => setTrainingForm({ ...trainingForm, section: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {["A", "B", "C"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Year</label>
                <select
                  value={trainingForm.year}
                  onChange={(e) => setTrainingForm({ ...trainingForm, year: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {["1st", "2nd", "3rd", "4th"].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewTraining(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Create Training
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Training Modal */}
      <Dialog open={showUpdate} onOpenChange={setShowUpdate}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Training</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateTraining} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Training Title</label>
              <Input 
                value={trainingForm.title}
                onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Topic</label>
              <Input 
                value={trainingForm.topic}
                onChange={(e) => setTrainingForm({ ...trainingForm, topic: e.target.value })}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Date</label>
                <Input 
                  type="date" 
                  value={trainingForm.date}
                  onChange={(e) => setTrainingForm({ ...trainingForm, date: e.target.value })}
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Time</label>
                <Input 
                  type="time" 
                  value={trainingForm.time}
                  onChange={(e) => setTrainingForm({ ...trainingForm, time: e.target.value })}
                  required 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Location</label>
              <Input 
                value={trainingForm.location}
                onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                required 
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Instructor</label>
              <Input 
                value={trainingForm.instructor}
                onChange={(e) => setTrainingForm({ ...trainingForm, instructor: e.target.value })}
                required 
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowUpdate(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Update Training
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Training Details Modal with Calendar */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedTraining?.title}</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <div className="space-y-6 mt-4">
              {/* Training Info */}
              <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold mb-4">Training Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Topic</p>
                    <p className="font-semibold">{selectedTraining.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-semibold">{selectedTraining.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold">{new Date(selectedTraining.date).toLocaleDateString()} at {selectedTraining.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedTraining.location}</p>
                  </div>
                </div>
              </Card>

              {/* Calendar View */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Syllabus Completion Calendar
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground">{day}</div>
                  ))}
                  {getCalendarDays().map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const hasCompletion = selectedTraining.syllabusCompleted?.some(sc => sc.date === dateStr)
                    return (
                      <div
                        key={index}
                        className={`p-2 text-center text-sm rounded-lg border ${
                          hasCompletion
                            ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {date.getDate()}
                        {hasCompletion && <CheckCircle className="w-3 h-3 mx-auto mt-1 text-green-600" />}
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Add Syllabus Completion */}
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Topic Completion
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={syllabusForm.date}
                      onChange={(e) => setSyllabusForm({ ...syllabusForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Topics Completed (comma-separated)</label>
                    <Textarea
                      placeholder="e.g., Arrays, Linked Lists, Stacks"
                      value={syllabusForm.topics}
                      onChange={(e) => setSyllabusForm({ ...syllabusForm, topics: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleAddSyllabusCompletion} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Completion
                  </Button>
                </div>
              </Card>

              {/* Completed Topics List */}
              {selectedTraining.syllabusCompleted && selectedTraining.syllabusCompleted.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Completed Topics
                  </h3>
                  <div className="space-y-3">
                    {selectedTraining.syllabusCompleted.map((completion, index) => (
                      <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="font-semibold mb-2">{new Date(completion.date).toLocaleDateString()}</p>
                        <div className="flex flex-wrap gap-2">
                          {completion.topics.map((topic, i) => (
                            <Badge key={i} className="bg-green-500/20 text-green-700 dark:text-green-300">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
