
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, Trash2, Download, Share2, Folder, Plus, Clock } from "lucide-react"

const mockDocuments = [
  {
    id: 1,
    name: "Resume.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedDate: "2025-01-10",
    category: "Resume",
    icon: FileText,
  },
  {
    id: 2,
    name: "Cover Letter.docx",
    type: "Document",
    size: "1.2 MB",
    uploadedDate: "2025-01-08",
    category: "Cover Letter",
    icon: FileText,
  },
  {
    id: 3,
    name: "Certificates.pdf",
    type: "PDF",
    size: "5.8 MB",
    uploadedDate: "2024-12-20",
    category: "Certificates",
    icon: ImageIcon,
  },
  {
    id: 4,
    name: "Academic Transcript.pdf",
    type: "PDF",
    size: "1.1 MB",
    uploadedDate: "2024-11-15",
    category: "Academic",
    icon: FileText,
  },
  {
    id: 5,
    name: "Portfolio.zip",
    type: "Archive",
    size: "12.4 MB",
    uploadedDate: "2025-01-05",
    category: "Portfolio",
    icon: Folder,
  },
]

const categories = [
  { name: "Resume", count: 1, icon: FileText },
  { name: "Certificates", count: 3, icon: ImageIcon },
  { name: "Academic", count: 2, icon: FileText },
  { name: "Portfolio", count: 1, icon: Folder },
]

export default function StudentDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [documents, setDocuments] = useState(mockDocuments)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10 MB')
          return
        }
        setUploading(true)
        try {
          const formData = new FormData()
          formData.append('file', file)
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          if (response.ok) {
            const data = await response.json()
            const newDoc = {
              id: documents.length + 1,
              name: file.name,
              type: file.type.split('/')[1].toUpperCase(),
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              uploadedDate: new Date().toISOString().split('T')[0],
              category: 'Other',
              icon: FileText,
            }
            setDocuments([newDoc, ...documents])
            alert('Document uploaded successfully!')
          } else {
            throw new Error('Upload failed')
          }
        } catch (error) {
          alert('Failed to upload document. Please try again.')
        } finally {
          setUploading(false)
        }
      }
    }
    input.click()
  }

  const handleDownload = (doc: any) => {
    // Create a mock download
    const blob = new Blob([`Mock content for ${doc.name}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.name
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = (doc: any) => {
    if (navigator.share) {
      navigator.share({
        title: doc.name,
        text: `Check out this document: ${doc.name}`,
      }).catch(() => {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id))
      alert('Document deleted successfully!')
    }
  }

  const filteredDocuments = selectedCategory ? documents.filter((doc) => doc.category === selectedCategory) : documents

  return (
    <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex justify-between items-center"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  My Documents
                </h1>
                <p className="text-muted-foreground">Upload and manage your resume, certificates, and documents</p>
              </div>
              <Button 
                className="gap-2 bg-accent text-accent-foreground"
                onClick={handleUpload}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar Categories */}
              <div className="lg:col-span-1">
                <Card className="glass-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === null ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">All Documents</div>
                      <div className="text-xs text-muted-foreground">{documents.length} files</div>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.name ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">{cat.count} files</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Upload Info */}
                <Card className="glass-lg p-6 mt-4">
                  <h3 className="font-bold text-sm mb-3">Upload Tips</h3>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>• Use PDF for resumes</li>
                    <li>• Max file size: 10 MB</li>
                    <li>• Keep names clear</li>
                    <li>• Update regularly</li>
                  </ul>
                </Card>
              </div>

              {/* Documents List */}
              <div className="lg:col-span-3">
                {filteredDocuments.length > 0 ? (
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {filteredDocuments.map((doc, index) => {
                      const Icon = doc.icon
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="glass-lg p-6 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 rounded-lg bg-accent/20 text-accent">
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{doc.name}</h4>
                                  <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(doc.uploadedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Badge className="mt-2 bg-secondary/20 text-secondary">{doc.category}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="gap-1"
                                  onClick={() => handleDownload(doc)}
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="gap-1"
                                  onClick={() => handleShare(doc)}
                                  title="Share"
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(doc.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : (
                  <Card className="glass-lg p-12 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No documents uploaded yet</h3>
                    <p className="text-muted-foreground mb-6">Upload your resume and documents to get started</p>
                    <Button 
                      className="gap-2 bg-accent text-accent-foreground"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      <Plus className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Upload First Document"}
                    </Button>
                  </Card>
                )}
              </div>
            </div>
    </div>
  )
}
