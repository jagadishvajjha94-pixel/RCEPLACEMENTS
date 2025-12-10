import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Edit2, 
  Plus, 
  BookOpen, 
  Briefcase, 
  GraduationCap,
  FileCheck,
  Calendar,
  User
} from "lucide-react"
import { ResourceService } from "@/lib/db-service"
import type { Resource } from "@/lib/mock-data"

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<"exam" | "mid" | "interview" | "company">("exam")
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    category: "exam" as "exam" | "mid" | "interview" | "company",
    fileUrl: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    setLoading(true)
    try {
      const data = await ResourceService.getAll()
      setResources(data)
    } catch (error) {
      console.error("Failed to load resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceForm.title || !resourceForm.category) {
      alert("Please fill in all required fields")
      return
    }
    try {
      await ResourceService.create({
        title: resourceForm.title,
        description: resourceForm.description,
        category: resourceForm.category,
        fileUrl: resourceForm.fileUrl,
        tags: resourceForm.tags,
        uploadedBy: "faculty-1",
        uploadedAt: new Date().toISOString(),
      })
      setResourceForm({ title: "", description: "", category: "exam", fileUrl: "", tags: [] })
      setShowForm(false)
      setEditingResource(null)
      loadResources()
    } catch (error) {
      alert("Failed to create resource")
    }
  }

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return
    try {
      await ResourceService.update(editingResource.id, {
        title: resourceForm.title,
        description: resourceForm.description,
        category: resourceForm.category,
        fileUrl: resourceForm.fileUrl,
        tags: resourceForm.tags,
      })
      setShowForm(false)
      setEditingResource(null)
      setResourceForm({ title: "", description: "", category: "exam", fileUrl: "", tags: [] })
      loadResources()
    } catch (error) {
      alert("Failed to update resource")
    }
  }

  const handleDeleteResource = async (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await ResourceService.delete(id)
        loadResources()
      } catch (error) {
        alert("Failed to delete resource")
      }
    }
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)
    setResourceForm({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      fileUrl: resource.fileUrl,
      tags: resource.tags,
    })
    setShowForm(true)
  }

  const addTag = () => {
    if (newTag.trim() && !resourceForm.tags.includes(newTag.trim())) {
      setResourceForm({ ...resourceForm, tags: [...resourceForm.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setResourceForm({ ...resourceForm, tags: resourceForm.tags.filter(t => t !== tag) })
  }

  const filteredResources = resources.filter(r => r.category === selectedCategory)

  const categoryIcons = {
    exam: GraduationCap,
    mid: FileCheck,
    interview: Briefcase,
    company: BookOpen,
  }

  const categoryColors = {
    exam: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    mid: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    interview: "bg-green-500/20 text-green-700 dark:text-green-300",
    company: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Resources
          </h1>
          <p className="text-muted-foreground">Upload and manage exam, mid, interview, and company-related materials for students</p>
        </div>
        <Button 
          onClick={() => {
            setResourceForm({ title: "", description: "", category: selectedCategory, fileUrl: "", tags: [] })
            setEditingResource(null)
            setShowForm(true)
          }}
          className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Upload Resource
        </Button>
      </motion.div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
        <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg mb-6">
          <TabsTrigger value="exam" className="gap-2">
            <GraduationCap className="w-4 h-4" />
            Exam Related
          </TabsTrigger>
          <TabsTrigger value="mid" className="gap-2">
            <FileCheck className="w-4 h-4" />
            Mid Related
          </TabsTrigger>
          <TabsTrigger value="interview" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Interview Related
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Company Related
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {loading ? (
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 text-center shadow-sm">
              <p>Loading resources...</p>
            </Card>
          ) : filteredResources.length === 0 ? (
            <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-12 text-center shadow-sm">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No resources found for this category</p>
              <p className="text-muted-foreground text-sm mt-2">Upload a resource to get started</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource, index) => {
                const Icon = categoryIcons[resource.category]
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/70 p-6 hover:shadow-lg transition-all duration-300 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${categoryColors[resource.category]}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-slate-50 dark:bg-slate-800/50"
                            onClick={() => handleEditResource(resource)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{resource.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {resource.fileUrl && (
                        <Button
                          variant="outline"
                          className="w-full gap-2 bg-slate-50 dark:bg-slate-800/50"
                          onClick={() => window.open(resource.fileUrl, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Resource Form Modal */}
      <AnimatePresence>
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingResource ? "Edit Resource" : "Upload New Resource"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={editingResource ? handleUpdateResource : handleCreateResource} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Category</label>
                  <Tabs value={resourceForm.category} onValueChange={(v) => setResourceForm({ ...resourceForm, category: v as any })}>
                    <TabsList className="bg-slate-100/90 dark:bg-slate-800/90 mb-4">
                      <TabsTrigger value="exam">Exam Related</TabsTrigger>
                      <TabsTrigger value="mid">Mid Related</TabsTrigger>
                      <TabsTrigger value="interview">Interview Related</TabsTrigger>
                      <TabsTrigger value="company">Company Related</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Title *</label>
                  <Input
                    type="text"
                    placeholder="Resource title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Description</label>
                  <Textarea
                    placeholder="Resource description"
                    rows={4}
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">File URL</label>
                  <Input
                    type="url"
                    placeholder="https://example.com/file.pdf"
                    value={resourceForm.fileUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resourceForm.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <span>×</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                    {editingResource ? "Update Resource" : "Upload Resource"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

