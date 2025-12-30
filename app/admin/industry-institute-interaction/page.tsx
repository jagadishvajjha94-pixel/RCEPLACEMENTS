
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Upload,
  Download,
  Folder,
  Building2,
  Mail,
  FileCheck,
  Calendar,
  Users,
  Search,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function IndustryInstituteInteractionPage() {
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false)
  const [companies, setCompanies] = useState([
    { id: "1", name: "Infosys", year: "2025-26" },
    { id: "2", name: "TCS", year: "2025-26" },
    { id: "3", name: "Wipro", year: "2025-26" },
  ])
  
  const handleUpload = (companyId: string, fileType: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx,.jpg,.png"
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        alert(`File "${file.name}" uploaded successfully for ${fileType}`)
        // In real app, upload to server
      }
    }
    input.click()
  }
  
  const handleDownload = (fileName: string) => {
    alert(`Downloading ${fileName}...`)
    // In real app, download from server
  }
  
  const handleAddCompany = () => {
    setShowAddCompanyModal(true)
  }
  
  const handleExportData = () => {
    const data = JSON.stringify(companies, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `iii-data-${selectedYear}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-8 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Industry Institute Interaction (III)</h1>
                <p className="text-gray-600">Manage industry visits, MoUs, talks, and interactions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleExportData}>
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button className="gap-2" onClick={handleAddCompany}>
                  <Building2 className="w-4 h-4" />
                  Add Company
                </Button>
              </div>
            </motion.div>

            {/* Year Selection & Search */}
            <Card className="p-4 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Academic Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                </select>
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="companies">Company Folders</TabsTrigger>
                <TabsTrigger value="moms">III MOMs & Circulars</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Company Folders Tab */}
              <TabsContent value="companies" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Folder className="w-8 h-8 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Scanned Circular</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleUpload(company.id, "Scanned Circular")}>
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleDownload(`${company.name}-circular.pdf`)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Mail Communication</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleUpload(company.id, "Scanned Circular")}>
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleDownload(`${company.name}-circular.pdf`)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Scanned Report</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleUpload(company.id, "Scanned Circular")}>
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleDownload(`${company.name}-circular.pdf`)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Scanned Sign Sheets</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleUpload(company.id, "Scanned Circular")}>
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleDownload(`${company.name}-circular.pdf`)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* MOMs & Circulars Tab */}
              <TabsContent value="moms" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">Minutes of Meetings & Circulars</h3>
                    </div>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload and manage III-related minutes of meetings and circulars
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">MOM Document {i}</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploaded on {new Date().toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6 mt-6">
                <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">III Reports</h3>
                    </div>
                    <Button className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Monthly Reports</h4>
                        <p className="text-sm text-gray-600">Upload monthly III activity reports</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">Annual Reports</h4>
                        <p className="text-sm text-gray-600">Upload annual III summary reports</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Add Company Modal */}
            <Dialog open={showAddCompanyModal} onOpenChange={setShowAddCompanyModal}>
              <DialogContent className="bg-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Company</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const newCompany = {
                    id: String(companies.length + 1),
                    name: formData.get("name") as string,
                    year: selectedYear,
                  }
                  setCompanies([...companies, newCompany])
                  setShowAddCompanyModal(false)
                  alert("Company added successfully!")
                }} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input id="name" name="name" required placeholder="Enter company name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Company description (optional)" rows={3} />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Add Company</Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddCompanyModal(false)}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}

