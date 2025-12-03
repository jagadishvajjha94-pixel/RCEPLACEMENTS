"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare, Star } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState("training")

  const handleSubmit = () => {
    if (feedback.trim()) {
      // Submit feedback
      setFeedback("")
      setRating(0)
      alert("Feedback submitted anonymously to admin")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10 dark:to-primary/5 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/student/dashboard" className="text-accent hover:underline mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Feedback & Suggestions</h1>
          <p className="text-muted-foreground">Share your feedback anonymously to help us improve</p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Feedback Form */}
          <Card className="glass-lg p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {["training", "workshop", "placement", "facility"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-lg border-2 transition-all capitalize font-medium ${
                        category === cat
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                      <Star
                        className={`w-8 h-8 ${star <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none resize-none h-32"
                />
                <p className="text-xs text-muted-foreground mt-2">Your feedback will be submitted anonymously</p>
              </div>

              <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground gap-2 h-12">
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </div>
          </Card>

          {/* Info Sidebar */}
          <Card className="glass-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              About Feedback
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground mb-1">Privacy</p>
                <p>Your identity remains completely anonymous. We only see your feedback, not your details.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Categories</p>
                <p>Provide feedback on trainings, workshops, placements, or campus facilities.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Impact</p>
                <p>Your feedback directly helps us improve the placement process and student experience.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
