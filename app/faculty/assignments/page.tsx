import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Calendar, Users, Clock, Trash2, Edit2, Code, CheckCircle, X, Sparkles } from "lucide-react"
import { AssignmentService } from "@/lib/db-service"
import type { Assignment } from "@/lib/mock-data"

interface AssignmentWithSubmissions extends Assignment {
  submissions?: number
  total?: number
  status?: "active" | "closed"
  questionType?: "coding" | "mcq" | "practice"
  questions?: any[]
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentWithSubmissions[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<AssignmentWithSubmissions | null>(null)
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    totalMarks: 100,
    questionType: "coding" as "coding" | "mcq" | "practice",
    questions: [] as any[],
  })
  const [newQuestion, setNewQuestion] = useState({
    type: "coding" as "coding" | "mcq" | "practice",
    question: "",
    options: [] as string[],
    correctAnswer: "",
    testCases: [] as { input: string; output: string }[],
    marks: 10,
  })

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    const data = await AssignmentService.getAll()
    const assignmentsWithSubmissions = data.map(a => ({
      ...a,
      submissions: Math.floor(Math.random() * 45),
      total: 45,
      status: new Date(a.dueDate) > new Date() ? "active" : "closed",
      questionType: "coding",
      questions: [],
    }))
    setAssignments(assignmentsWithSubmissions)
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignmentForm.title || !assignmentForm.subject || !assignmentForm.dueDate) {
      alert("Please fill in all required fields")
      return
    }
    try {
      await AssignmentService.create({
        title: assignmentForm.title,
        subject: assignmentForm.subject,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate,
        totalMarks: assignmentForm.totalMarks,
        uploadedBy: "faculty-1",
        branch: "CSE",
        section: "A",
        year: "3rd",
      })
      setAssignmentForm({ title: "", subject: "", description: "", dueDate: "", totalMarks: 100, questionType: "coding", questions: [] })
      setShowForm(false)
      setEditingAssignment(null)
      loadAssignments()
    } catch (error) {
      alert("Failed to create assignment")
    }
  }

  const handleEditAssignment = (assignment: AssignmentWithSubmissions) => {
    setEditingAssignment(assignment)
    setAssignmentForm({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      totalMarks: assignment.totalMarks,
      questionType: assignment.questionType || "coding",
      questions: assignment.questions || [],
    })
    setShowForm(true)
  }

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAssignment) return
    if (!assignmentForm.title || !assignmentForm.subject || !assignmentForm.dueDate) {
      alert("Please fill in all required fields")
      return
    }
    try {
      await AssignmentService.update(editingAssignment.id, {
        title: assignmentForm.title,
        subject: assignmentForm.subject,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate,
        totalMarks: assignmentForm.totalMarks,
      })
      setShowForm(false)
      setEditingAssignment(null)
      setAssignmentForm({ title: "", subject: "", description: "", dueDate: "", totalMarks: 100, questionType: "coding", questions: [] })
      loadAssignments()
    } catch (error) {
      alert("Failed to update assignment")
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await AssignmentService.delete(id)
        loadAssignments()
      } catch (error) {
        alert("Failed to delete assignment")
      }
    }
  }

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert("Please enter a question")
      return
    }
    if (assignmentForm.questionType === "mcq" && newQuestion.options.length < 2) {
      alert("Please add at least 2 options for MCQ")
      return
    }
    if (assignmentForm.questionType === "mcq" && !newQuestion.correctAnswer) {
      alert("Please specify the correct answer")
      return
    }
    if (assignmentForm.questionType === "coding" && newQuestion.testCases.length === 0) {
      alert("Please add at least one test case for coding questions")
      return
    }
    setAssignmentForm({
      ...assignmentForm,
      questions: [...assignmentForm.questions, { ...newQuestion, type: assignmentForm.questionType }],
    })
    setNewQuestion({
      type: assignmentForm.questionType,
      question: "",
      options: [],
      correctAnswer: "",
      testCases: [],
      marks: 10,
    })
  }

  const handleAIGrade = async (assignmentId: string) => {
    // Mock AI grading - in real app, this would call an AI API
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) {
      alert("Assignment not found")
      return
    }
    
    // Simulate AI grading process
    const confirmGrade = confirm(`AI will grade all submissions for "${assignment.title}". This will:\n\n1. Compile and test coding solutions\n2. Check MCQ answers automatically\n3. Evaluate practice questions\n4. Generate scores and feedback\n\nProceed?`)
    if (!confirmGrade) return
    
    // Simulate processing
    alert("AI grading in progress...\n\n✓ Compiling code submissions\n✓ Running test cases\n✓ Checking MCQ answers\n✓ Evaluating practice responses\n✓ Generating scores and feedback\n\nGrading complete! Results will be available in student submissions.")
    
    // In real implementation:
    // 1. Fetch all submissions for this assignment
    // 2. For coding questions: compile code, run test cases
    // 3. For MCQ: check against correct answers
    // 4. For practice: evaluate based on criteria
    // 5. Generate scores and feedback
    // 6. Update submission records
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Assignments
          </h1>
          <p className="text-muted-foreground">Create and track student assignments with AI grading</p>
        </div>
        <Button 
          onClick={() => {
            setAssignmentForm({ title: "", subject: "", description: "", dueDate: "", totalMarks: 100, questionType: "coding", questions: [] })
            setEditingAssignment(null)
            setShowForm(true)
          }}
          className="gap-2 bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="w-4 h-4" />
          New Assignment
        </Button>
      </motion.div>

      {/* Assignment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 rounded-lg p-6 mb-8 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-4">{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</h3>
            <form onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Assignment Title</label>
                <Input
                  type="text"
                  placeholder="Assignment Title"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Subject</label>
                <Input
                  type="text"
                  placeholder="Subject"
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Description</label>
                <Textarea
                  placeholder="Description"
                  rows={4}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Total Marks</label>
                  <Input
                    type="number"
                    value={assignmentForm.totalMarks}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: parseInt(e.target.value) || 100 })}
                    required
                  />
                </div>
              </div>

              {/* Question Type Selection */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Question Type</label>
                <Tabs value={assignmentForm.questionType} onValueChange={(v) => setAssignmentForm({ ...assignmentForm, questionType: v as any })}>
                  <TabsList className="bg-slate-100/90 dark:bg-slate-800/90 mb-4">
                    <TabsTrigger value="coding">
                      <Code className="w-4 h-4 mr-2" />
                      Coding
                    </TabsTrigger>
                    <TabsTrigger value="mcq">MCQ</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Questions List */}
              {assignmentForm.questions.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-2">Added Questions ({assignmentForm.questions.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {assignmentForm.questions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{q.question.substring(0, 50)}...</p>
                          <p className="text-xs text-muted-foreground">Type: {q.type} | Marks: {q.marks}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAssignmentForm({
                              ...assignmentForm,
                              questions: assignmentForm.questions.filter((_, i) => i !== idx)
                            })
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Questions Section */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Add Questions</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Question</label>
                    <Textarea
                      placeholder="Enter question..."
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Marks</label>
                    <Input
                      type="number"
                      placeholder="Marks for this question"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) || 10 })}
                      min="1"
                      required
                    />
                  </div>
                  {assignmentForm.questionType === "mcq" && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold mb-2 block">Options (one per line)</label>
                      <Textarea
                        placeholder="Option A\nOption B\nOption C\nOption D"
                        value={newQuestion.options.join("\n")}
                        onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split("\n").filter(o => o.trim()) })}
                        className="min-h-[80px]"
                      />
                      <div>
                        <label className="text-sm font-semibold mb-2 block">Correct Answer</label>
                        <Input
                          type="text"
                          placeholder="Enter correct option (e.g., A, B, C, or D)"
                          value={newQuestion.correctAnswer}
                          onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  {assignmentForm.questionType === "coding" && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold mb-2 block">Test Cases (JSON format)</label>
                      <Textarea
                        placeholder='[{"input": "5", "output": "25"}]'
                        className="min-h-[80px] font-mono text-sm"
                        value={JSON.stringify(newQuestion.testCases, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value)
                            setNewQuestion({ ...newQuestion, testCases: Array.isArray(parsed) ? parsed : [] })
                          } catch {
                            // Invalid JSON, keep as is
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Input"
                          value={newQuestion.testCases[newQuestion.testCases.length - 1]?.input || ""}
                          onChange={(e) => {
                            const last = newQuestion.testCases[newQuestion.testCases.length - 1]
                            if (last) {
                              setNewQuestion({
                                ...newQuestion,
                                testCases: [...newQuestion.testCases.slice(0, -1), { ...last, input: e.target.value }]
                              })
                            } else {
                              setNewQuestion({
                                ...newQuestion,
                                testCases: [{ input: e.target.value, output: "" }]
                              })
                            }
                          }}
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          placeholder="Expected Output"
                          value={newQuestion.testCases[newQuestion.testCases.length - 1]?.output || ""}
                          onChange={(e) => {
                            const last = newQuestion.testCases[newQuestion.testCases.length - 1]
                            if (last) {
                              setNewQuestion({
                                ...newQuestion,
                                testCases: [...newQuestion.testCases.slice(0, -1), { ...last, output: e.target.value }]
                              })
                            } else {
                              setNewQuestion({
                                ...newQuestion,
                                testCases: [{ input: "", output: e.target.value }]
                              })
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewQuestion({
                              ...newQuestion,
                              testCases: [...newQuestion.testCases, { input: "", output: "" }]
                            })
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <Button type="button" onClick={handleAddQuestion} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
                  {editingAssignment ? "Update Assignment" : "Create Assignment"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments List */}
      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all duration-300 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
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
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>Posted {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>
                          {assignment.submissions}/{assignment.total} submissions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditAssignment(assignment)}
                    className="bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    onClick={() => handleAIGrade(assignment.id)}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Grade
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
