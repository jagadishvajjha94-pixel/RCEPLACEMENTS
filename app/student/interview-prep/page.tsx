"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, BookOpen, LinkIcon, ChevronRight } from "lucide-react"
import Link from "next/link"

const codingProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    language: "JavaScript",
    solved: true,
  },
  {
    id: 2,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    language: "Python",
    solved: false,
  },
  {
    id: 3,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    language: "Java",
    solved: false,
  },
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10 dark:to-primary/5 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/student/dashboard" className="text-accent hover:underline mb-4 inline-flex items-center gap-1">
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
              <TabsList className="glass-lg mb-4">
                <TabsTrigger value="problems">Coding Problems</TabsTrigger>
                <TabsTrigger value="concepts">DSA Concepts</TabsTrigger>
                <TabsTrigger value="company">Company Specific</TabsTrigger>
              </TabsList>

              <TabsContent value="problems" className="space-y-4">
                {codingProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-lg p-6 hover:shadow-lg transition-all">
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
                        {problem.solved && <div className="text-green-500 text-xl">✓</div>}
                      </div>
                      <Button className="w-full bg-accent text-accent-foreground gap-2">
                        <Code className="w-4 h-4" />
                        Solve in IDE
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="concepts" className="space-y-4">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Data Structures & Algorithms</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Arrays",
                      "Linked Lists",
                      "Trees",
                      "Graphs",
                      "Sorting",
                      "Dynamic Programming",
                      "Greedy",
                      "Recursion",
                    ].map((concept) => (
                      <Button key={concept} variant="outline" className="justify-start bg-transparent">
                        {concept}
                      </Button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="company">
                <Card className="glass-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Company-Specific Questions</h3>
                  <p className="text-muted-foreground">Questions commonly asked by your target companies</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Resources Sidebar */}
          <div>
            <Card className="glass-lg p-6">
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
            </Card>

            {/* Study Progress */}
            <Card className="glass-lg p-6 mt-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Your Progress
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Problems Solved</p>
                  <div className="bg-primary/20 rounded-full h-2">
                    <div className="bg-primary h-full rounded-full" style={{ width: "65%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">13 of 20</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Concepts Mastered</p>
                  <div className="bg-primary/20 rounded-full h-2">
                    <div className="bg-primary h-full rounded-full" style={{ width: "45%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">9 of 20</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
