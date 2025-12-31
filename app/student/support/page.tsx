
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageCircle, HelpCircle, Mail, Phone } from "lucide-react"

export default function SupportPage() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAskChatbot = async () => {
    if (!question.trim()) {
      setError("Please enter a question")
      return
    }

    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/support/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      setResponse(data.response || data.answer || "No response received")
      setQuestion("")
    } catch (err) {
      setError("Failed to connect to chatbot. Please try again or contact support.")
      console.error("[v0] Chatbot error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-2">Support Center</h1>
          <p className="text-muted-foreground">Get help with placements, interviews, and more</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Chatbot */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                AI Chatbot Assistant
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about placements, interviews, resources..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAskChatbot()}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAskChatbot}
                    disabled={loading || !question.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Thinking..." : "Ask"}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {response && (
                  <motion.div
                    className="bg-primary/5 border border-primary/20 p-4 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm text-foreground whitespace-pre-wrap">{response}</p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Contact & FAQ Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-secondary" />
                Quick Help
              </h3>
              <ul className="space-y-3 text-sm">
                <li>• How to register for placement drives?</li>
                <li>• Interview preparation resources</li>
                <li>• Resume building tips</li>
                <li>• Technical assessment guidance</li>
                <li>• Company eligibility criteria</li>
              </ul>
            </Card>

            <Card className="glass-lg p-6">
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-accent" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">placement@college.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 text-accent" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91-XXXXX-XXXXX</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
