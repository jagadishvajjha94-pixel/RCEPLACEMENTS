
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, MessageSquare, Star } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { FeedbackService } from "@/lib/db-service"
import { AuthService } from "@/lib/auth-service"

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("submit")
  const [feedback, setFeedback] = useState("")
  const [ratings, setRatings] = useState({
    training: 0,
    workshop: 0,
    placement: 0,
    campus: 0,
    other: 0
  })
  const [category, setCategory] = useState<"training" | "workshop" | "placement" | "campus" | "other">("training")
  const [submitting, setSubmitting] = useState(false)

  const handleRatingChange = (cat: typeof category, value: number) => {
    setRatings(prev => ({ ...prev, [cat]: value }))
    setCategory(cat)
  }

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please enter your feedback")
      return
    }
    const currentRating = ratings[category]
    if (currentRating === 0) {
      alert("Please provide a rating for this category")
      return
    }

    setSubmitting(true)
    try {
      const currentUser = AuthService.getCurrentUser()
      await FeedbackService.create({
        studentId: currentUser?.id || "anonymous",
        category,
        subject: `Feedback - ${category}`,
        content: feedback,
        rating: currentRating,
        status: "pending",
      })
      setFeedback("")
      setRatings(prev => ({ ...prev, [category]: 0 }))
      setCategory("training")
      alert("Feedback submitted successfully! Thank you for your input.")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10 dark:to-primary/5 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/student/dashboard" className="text-accent hover:underline mb-4 inline-flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Feedback & Suggestions</h1>
          <p className="text-muted-foreground">Share your feedback anonymously to help us improve</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/90 dark:bg-slate-800/90 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
            <TabsTrigger value="view">View My Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <motion.div
              className="grid lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Feedback Form */}
              <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 lg:col-span-2 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["training", "workshop", "placement", "campus", "other"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-lg border-2 transition-all capitalize font-semibold ${
                            category === cat
                              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md"
                              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating for {category}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          onClick={() => handleRatingChange(category, star)} 
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= ratings[category] 
                                ? "fill-accent text-accent" 
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                      {ratings[category] > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {ratings[category]} / 5
                        </span>
                      )}
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

              <Button 
                onClick={handleSubmit} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 h-12 shadow-md font-semibold"
                disabled={submitting || !feedback.trim() || ratings[category] === 0}
              >
                    <Send className="w-4 h-4" />
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </Card>

              {/* Info Sidebar */}
              <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
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
          </TabsContent>

          <TabsContent value="view">
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">My Submitted Feedback</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">Your feedback history will appear here</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
