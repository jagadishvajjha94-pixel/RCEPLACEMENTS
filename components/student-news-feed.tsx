"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { mockNewsFeed, type NewsFeed } from "@/lib/mock-data"

export function StudentNewsFeed() {
  const [expanded, setExpanded] = useState(false)
  const [visibleItems, setVisibleItems] = useState(3)

  const displayedNews = expanded ? mockNewsFeed : mockNewsFeed.slice(0, visibleItems)

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="bg-white p-4 h-full max-h-[calc(100vh-5rem)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">College News</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {displayedNews.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {news.uploadedBy.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="font-semibold text-xs truncate">{news.uploadedBy}</p>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                        {news.type}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(news.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <h4 className="text-sm font-bold mb-1 line-clamp-2">{news.title}</h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{news.description}</p>
                
                {news.image && (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full rounded-md mb-2 max-h-32 object-cover"
                  />
                )}
                
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    {news.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-3 h-3" />
                    {news.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>
                
                {news.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {news.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        
        {!expanded && mockNewsFeed.length > visibleItems && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 text-sm text-primary hover:underline text-center w-full"
          >
            View {mockNewsFeed.length - visibleItems} more
          </button>
        )}
      </Card>
    </div>
  )
}

