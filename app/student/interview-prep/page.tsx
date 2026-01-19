
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, BookOpen, LinkIcon, ChevronRight, Building2, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { CompanySpecificPrepService } from "@/lib/db-service"
import { useState, useEffect } from "react"
import type { CompanySpecificPrep } from "@/lib/mock-data"
import { AuthService } from "@/lib/auth-service"

// All available coding problems by technology
const codingProblems = [
  // JavaScript problems
  { id: 1, title: "Two Sum", difficulty: "Easy", language: "JavaScript", solved: false },
  { id: 2, title: "Reverse String", difficulty: "Easy", language: "JavaScript", solved: false },
  { id: 3, title: "Valid Parentheses", difficulty: "Easy", language: "JavaScript", solved: false },
  { id: 4, title: "Merge Intervals", difficulty: "Medium", language: "JavaScript", solved: false },
  { id: 5, title: "Longest Substring", difficulty: "Medium", language: "JavaScript", solved: false },
  { id: 6, title: "3Sum", difficulty: "Medium", language: "JavaScript", solved: false },
  { id: 7, title: "Trapping Rain Water", difficulty: "Hard", language: "JavaScript", solved: false },
  { id: 8, title: "Word Ladder", difficulty: "Hard", language: "JavaScript", solved: false },
  
  // Python problems
  { id: 9, title: "Merge Sorted Array", difficulty: "Easy", language: "Python", solved: false },
  { id: 10, title: "Contains Duplicate", difficulty: "Easy", language: "Python", solved: false },
  { id: 11, title: "Best Time to Buy", difficulty: "Easy", language: "Python", solved: false },
  { id: 12, title: "Product of Array", difficulty: "Medium", language: "Python", solved: false },
  { id: 13, title: "Group Anagrams", difficulty: "Medium", language: "Python", solved: false },
  { id: 14, title: "Longest Palindromic", difficulty: "Medium", language: "Python", solved: false },
  { id: 15, title: "Edit Distance", difficulty: "Hard", language: "Python", solved: false },
  { id: 16, title: "N-Queens", difficulty: "Hard", language: "Python", solved: false },
  
  // Java problems
  { id: 17, title: "Binary Tree Level Order", difficulty: "Medium", language: "Java", solved: false },
  { id: 18, title: "Maximum Depth", difficulty: "Easy", language: "Java", solved: false },
  { id: 19, title: "Same Tree", difficulty: "Easy", language: "Java", solved: false },
  { id: 20, title: "Invert Binary Tree", difficulty: "Easy", language: "Java", solved: false },
  { id: 21, title: "Path Sum", difficulty: "Medium", language: "Java", solved: false },
  { id: 22, title: "Serialize Tree", difficulty: "Hard", language: "Java", solved: false },
  { id: 23, title: "Word Search II", difficulty: "Hard", language: "Java", solved: false },
  
  // C++ problems
  { id: 24, title: "Rotate Array", difficulty: "Medium", language: "C++", solved: false },
  { id: 25, title: "Move Zeroes", difficulty: "Easy", language: "C++", solved: false },
  { id: 26, title: "Plus One", difficulty: "Easy", language: "C++", solved: false },
  { id: 27, title: "Single Number", difficulty: "Easy", language: "C++", solved: false },
  { id: 28, title: "Missing Number", difficulty: "Easy", language: "C++", solved: false },
  
  // React problems
  { id: 29, title: "Component State", difficulty: "Easy", language: "React", solved: false },
  { id: 30, title: "Hooks Usage", difficulty: "Medium", language: "React", solved: false },
  { id: 31, title: "Context API", difficulty: "Medium", language: "React", solved: false },
  { id: 32, title: "Performance Optimization", difficulty: "Hard", language: "React", solved: false },
  
  // Node.js problems
  { id: 33, title: "Async Operations", difficulty: "Medium", language: "Node.js", solved: false },
  { id: 34, title: "File System", difficulty: "Medium", language: "Node.js", solved: false },
  { id: 35, title: "Express Routes", difficulty: "Medium", language: "Node.js", solved: false },
  
  // SQL problems
  { id: 36, title: "Select Queries", difficulty: "Easy", language: "SQL", solved: false },
  { id: 37, title: "Joins Practice", difficulty: "Medium", language: "SQL", solved: false },
  { id: 38, title: "Subqueries", difficulty: "Medium", language: "SQL", solved: false },
  { id: 39, title: "Window Functions", difficulty: "Hard", language: "SQL", solved: false },
]

const externalResources = [
  {
    name: "LeetCode",
    description: "3000+ coding problems with solutions",
    url: "https://leetcode.com",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "HackerRank",
    description: "Coding challenges and interview prep",
    url: "https://hackerrank.com",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "CodeSignal",
    description: "Technical assessments and skills development",
    url: "https://codesignal.com",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Educative",
    description: "Interactive coding interview courses",
    url: "https://educative.io",
    color: "from-purple-500 to-pink-500",
  },
]

export default function InterviewPrepPage() {
  const [companyPrep, setCompanyPrep] = useState<CompanySpecificPrep[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [solvedProblems, setSolvedProblems] = useState<any[]>([])

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      // Load solved problems from localStorage
      const saved = JSON.parse(localStorage.getItem(`interview_prep_${currentUser.id}`) || '[]')
      setSolvedProblems(saved)
    }
  }, [])

  useEffect(() => {
    const loadCompanyPrep = async () => {
      try {
        const data = await CompanySpecificPrepService.getAll()
        setCompanyPrep(data)
      } catch (error) {
        console.error("Error loading company prep:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCompanyPrep()
  }, [])

  const handleProblemSolved = (problemId: number, language: string) => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) return

    const saved = JSON.parse(localStorage.getItem(`interview_prep_${currentUser.id}`) || '[]')
    const updated = [...saved, { id: problemId, language, solved: true, date: new Date().toISOString() }]
    localStorage.setItem(`interview_prep_${currentUser.id}`, JSON.stringify(updated))
    setSolvedProblems(updated)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/student/dashboard" className="text-accent hover:underline mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Interview Preparation
          </h1>
          <p className="text-muted-foreground">Master coding problems and prepare for technical interviews</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Coding Problems */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="problems" className="w-full">
              <TabsList className="bg-slate-100/90 dark:bg-slate-800/90 mb-4 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                <TabsTrigger value="problems">Coding Problems</TabsTrigger>
                <TabsTrigger value="concepts">DSA Concepts</TabsTrigger>
                <TabsTrigger value="company">Company Specific</TabsTrigger>
              </TabsList>

              <TabsContent value="problems" className="space-y-4">
                {codingProblems.map((problem, index) => {
                  const isSolved = solvedProblems.some((p: any) => p.id === problem.id)
                  return (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-5 h-5 text-accent" />
                            <h3 className="text-lg font-bold">{problem.title}</h3>
                          </div>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span
                              className={`px-2 py-1 rounded ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                  : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded">{problem.language}</span>
                          </div>
                        </div>
                          {(problem.solved || isSolved) && <div className="text-green-500 text-xl">✓</div>}
                      </div>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 shadow-md"
                        onClick={() => {
                            // Track that student is practicing this technology
                            handleProblemSolved(problem.id, problem.language)
                          // Open online IDE in new tab
                          const problemTitle = problem.title.replace(/\s+/g, '-').toLowerCase()
                          window.open(`https://onecompiler.com/${problem.language.toLowerCase()}?code=${encodeURIComponent(`// ${problem.title}\n// Difficulty: ${problem.difficulty}\n\nfunction solution() {\n  // Your code here\n  \n}`)}`, '_blank')
                        }}
                      >
                        <Code className="w-4 h-4" />
                        Solve in IDE
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Card>
                  </motion.div>
                  )
                })}
              </TabsContent>

              <TabsContent value="concepts" className="space-y-4">
                <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Data Structures & Algorithms
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice DSA concepts with free Google Books and online resources
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { name: "Arrays", book: "https://www.google.com/search?tbm=bks&q=data+structures+arrays" },
                      { name: "Linked Lists", book: "https://www.google.com/search?tbm=bks&q=linked+lists+data+structures" },
                      { name: "Trees", book: "https://www.google.com/search?tbm=bks&q=binary+trees+data+structures" },
                      { name: "Graphs", book: "https://www.google.com/search?tbm=bks&q=graph+algorithms" },
                      { name: "Sorting", book: "https://www.google.com/search?tbm=bks&q=sorting+algorithms" },
                      { name: "Dynamic Programming", book: "https://www.google.com/search?tbm=bks&q=dynamic+programming+algorithms" },
                      { name: "Greedy Algorithms", book: "https://www.google.com/search?tbm=bks&q=greedy+algorithms" },
                      { name: "Recursion", book: "https://www.google.com/search?tbm=bks&q=recursion+programming" },
                    ].map((concept) => (
                      <Button 
                        key={concept.name} 
                        variant="outline" 
                        className="justify-start bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        onClick={() => window.open(concept.book, '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {concept.name}
                      </Button>
                    ))}
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Practice Resources</p>
                    <div className="space-y-2">
                      <a 
                        href="https://www.google.com/search?tbm=bks&q=introduction+to+algorithms+clrs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        📚 Introduction to Algorithms (CLRS)
                      </a>
                      <a 
                        href="https://www.google.com/search?tbm=bks&q=data+structures+algorithms+made+easy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        📚 Data Structures and Algorithms Made Easy
                      </a>
                      <a 
                        href="https://www.google.com/search?tbm=bks&q=algorithm+design+manual" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        📚 The Algorithm Design Manual
                      </a>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                {loading ? (
                  <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
                    <p className="text-muted-foreground">Loading company-specific materials...</p>
                  </Card>
                ) : companyPrep.length === 0 ? (
                  <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Company-Specific Questions</h3>
                    <p className="text-muted-foreground">No company-specific materials uploaded yet. Check back later.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {companyPrep.map((prep) => (
                      <Card key={prep.id} className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-primary" />
                            <div>
                              <h3 className="text-xl font-bold">{prep.company}</h3>
                              {prep.description && (
                                <p className="text-sm text-muted-foreground mt-1">{prep.description}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(prep.uploadedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2 text-primary">Topics to Cover in Interview:</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {prep.topics.map((topic, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-accent/10 rounded-lg">
                                <FileText className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {prep.fileUrl && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(prep.fileUrl, '_blank')}
                            className="gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Download Materials
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Resources Sidebar */}
          <div>
            {/* Study Progress */}
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Your Progress
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold">Problems Solved</p>
                    <p className="text-lg font-bold text-primary">13 / 20</p>
                  </div>
                  <div className="bg-primary/20 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <span className="text-xs font-bold text-white">65%</span>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold">Concepts Mastered</p>
                    <p className="text-lg font-bold text-secondary">9 / 20</p>
                  </div>
                  <div className="bg-secondary/20 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-secondary to-accent h-full rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    >
                      <span className="text-xs font-bold text-white">45%</span>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold">Interview Prep Score</p>
                    <p className="text-lg font-bold text-accent">78%</p>
                  </div>
                  <div className="bg-accent/20 rounded-full h-6 relative overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-accent to-primary h-full rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    >
                      <span className="text-xs font-bold text-white">78%</span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* External Resources Below Progress */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-accent" />
                  External Resources
                </h3>
                <div className="space-y-3">
                  {externalResources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div
                        className={`bg-gradient-to-br ${resource.color} p-4 rounded-lg text-white hover:shadow-lg transition-all`}
                      >
                        <p className="font-bold text-sm">{resource.name}</p>
                        <p className="text-xs opacity-90 mt-1">{resource.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
