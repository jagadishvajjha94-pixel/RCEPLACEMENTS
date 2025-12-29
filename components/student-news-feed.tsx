"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MessageCircle, Share2, X } from "lucide-react"
import { mockNewsFeed, type NewsFeed } from "@/lib/mock-data"

export function StudentNewsFeed() {
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (mockNewsFeed.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockNewsFeed.length)
    }, 3000) // Change news every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const currentNews = mockNewsFeed[currentIndex] || mockNewsFeed[0]

  return (
    <>
      {/* Small Scrolling News Ticker */}
      <div className="w-full max-w-full">
        <Card 
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white p-1.5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-bold">
              NEWS
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-medium truncate"
              >
                {currentNews?.title || "No news available"}
              </motion.div>
            </div>
            <div className="flex-shrink-0 text-[10px] opacity-80 px-1">
              {mockNewsFeed.length} items
            </div>
          </div>
        </Card>
      </div>

      {/* News Feed Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">College News Feed</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {mockNewsFeed.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {news.uploadedBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{news.uploadedBy}</p>
                        <Badge variant="outline" className="text-xs">
                          {news.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(news.uploadedAt).toLocaleDateString()} • {new Date(news.uploadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{news.description}</p>
                  
                  {news.image && (
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full rounded-lg mb-3 max-h-64 object-cover"
                    />
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {news.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {news.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                  
                  {news.tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {news.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
