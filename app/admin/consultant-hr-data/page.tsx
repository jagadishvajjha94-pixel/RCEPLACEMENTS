
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Upload,
  Download,
  Building2,
  Mail,
  Phone,
  User,
  Search,
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  FileSpreadsheet,
  Plus,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ConsultantHRDataPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [editingHr, setEditingHr] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingData, setViewingData] = useState<any>(null)

  const [hrData, setHrData] = useState([
    {
      id: "1",
      name: "John Doe",
      company: "Infosys",
      mobile: "+91 9876543210",
      email: "john.doe@infosys.com",
      status: "active",
      followup: "2025-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "TCS",
      mobile: "+91 9876543211",
      email: "jane.smith@tcs.com",
      status: "active",
      followup: "2025-01-20",
    },
  ])

  const [companies, setCompanies] = useState([
    {
      id: "1",
      name: "Infosys",
      status: "active",
      requirements: "Full Stack Developers",
      area: "IT",
      registrationLink: "https://infosys.com/register",
    },
    {
      id: "2",
      name: "TCS",
      status: "responsive",
      requirements: "Java Developers",
      area: "IT",
      registrationLink: "https://tcs.com/register",
    },
  ])

  return (
    <div className="flex h-screen bg-gray-50">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultant & HR Data</h1>
                <p className="text-gray-600">Follow-up & Master Sheets Management</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button className="gap-2">
                  <User className="w-4 h-4" />
                  Add HR Contact
                </Button>
              </div>
            </motion.div>

            {/* Search & Filters */}
            <Card className="p-4 border border-gray-200 bg-white">
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search companies or HRs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="hr-master" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200">
                <TabsTrigger value="hr-master">HR Master</TabsTrigger>
                <TabsTrigger value="company-followup">Company Follow-up</TabsTrigger>
                <TabsTrigger value="drive-status">Drive Status</TabsTrigger>
                <TabsTrigger value="consultant">Consultant Details</TabsTrigger>
                <TabsTrigger value="career-links">Career Links</TabsTrigger>
                <TabsTrigger value="contacts">Named Contacts</TabsTrigger>
              </TabsList>

              {/* HR Master Sheet Tab */}
              <TabsContent value="hr-master" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">HR Master Sheet</h3>
                    <Button className="gap-2" onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = ".csv,.xlsx,.xls"
                      input.onchange = (e: any) => {
                        const file = e.target.files[0]
                        if (file) {
                          alert(`Importing data from "${file.name}"...`)
                          // In real app, parse and import data
                        }
                      }
                      input.click()
                    }}>
                      <Upload className="w-4 h-4" />
                      Import HR Data
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">HR Name</th>
                          <th className="text-left p-3 font-semibold">Company</th>
                          <th className="text-left p-3 font-semibold">Mobile</th>
                          <th className="text-left p-3 font-semibold">Email</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">Follow-up</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrData.map((hr) => (
                          <tr key={hr.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{hr.name}</td>
                            <td className="p-3">{hr.company}</td>
                            <td className="p-3">{hr.mobile}</td>
                            <td className="p-3">{hr.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${hr.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }`}>
                                {hr.status}
                              </span>
                            </td>
                            <td className="p-3">{hr.followup}</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setEditingHr(hr)
                                setShowEditModal(true)
                              }}>Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Company Follow-up Tab */}
              <TabsContent value="company-followup" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Company Follow-up Sheet (Area wise)</h3>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Company
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Company Name</th>
                          <th className="text-left p-3 font-semibold">Area</th>
                          <th className="text-left p-3 font-semibold">Requirements</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">Registration Link</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((company) => (
                          <tr key={company.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{company.name}</td>
                            <td className="p-3">{company.area}</td>
                            <td className="p-3">{company.requirements}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${company.status === "active" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                {company.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <a href={company.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" />
                                Link
                              </a>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setEditingHr(company)
                                setShowEditModal(true)
                              }}>Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Drive Status Tab */}
              <TabsContent value="drive-status" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 border-2 border-green-200 bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Active</h3>
                        <p className="text-3xl font-bold text-green-600">12</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </Card>
                  <Card className="p-6 border-2 border-yellow-200 bg-yellow-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">On Hold</h3>
                        <p className="text-3xl font-bold text-yellow-600">5</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                  </Card>
                  <Card className="p-6 border-2 border-red-200 bg-red-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Non-Responsive</h3>
                        <p className="text-3xl font-bold text-red-600">3</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </Card>
                </div>
                <Card className="p-6 border border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Drive Status Master Sheet</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Master Sheet</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        setViewingData({ type: "Master Sheet", data: hrData })
                        setShowViewModal(true)
                      }}>View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Completed Sheet</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        setViewingData({ type: "Master Sheet", data: hrData })
                        setShowViewModal(true)
                      }}>View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Month-wise Sheet</span>
                      <Button variant="outline" size="sm" onClick={() => {
                        setViewingData({ type: "Master Sheet", data: hrData })
                        setShowViewModal(true)
                      }}>View</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Consultant Details Tab */}
              <TabsContent value="consultant" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Consultant Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">2025 Drives</h4>
                        <p className="text-sm text-gray-600">Consultant information for 2025 placement drives</p>
                        <Button variant="outline" size="sm" className="mt-2">View Details</Button>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold mb-2">2026 Drives</h4>
                        <p className="text-sm text-gray-600">Consultant information for 2026 placement drives</p>
                        <Button variant="outline" size="sm" className="mt-2">View Details</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Career Links Tab */}
              <TabsContent value="career-links" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Career Links</h3>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Link
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">IT Sector Links</h4>
                          <p className="text-sm text-gray-600">15 companies</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          setViewingData({ type: "Master Sheet", data: hrData })
                          setShowViewModal(true)
                        }}>View</Button>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Non-IT Sector Links</h4>
                          <p className="text-sm text-gray-600">8 companies</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          setViewingData({ type: "Master Sheet", data: hrData })
                          setShowViewModal(true)
                        }}>View</Button>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">ServiceNow Links</h4>
                          <p className="text-sm text-gray-600">5 companies</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                          setViewingData({ type: "Master Sheet", data: hrData })
                          setShowViewModal(true)
                        }}>View</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Named Contacts Tab */}
              <TabsContent value="contacts" className="space-y-6 mt-6">
                <Card className="p-6 border border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Named Contact Sheets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {["Surendra Sir Contacts", "Prabhu Contacts", "Janardhan Contacts", "My Own Contacts", "IT Sector", "Non-IT Sector"].map((name) => (
                      <div key={name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{name}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Edit HR Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="bg-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Edit HR Details</DialogTitle>
                </DialogHeader>
                {editingHr && (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    const updatedHr = {
                      ...editingHr,
                      name: formData.get("name") as string,
                      company: formData.get("company") as string,
                      mobile: formData.get("mobile") as string,
                      email: formData.get("email") as string,
                      status: formData.get("status") as string,
                      followup: formData.get("followup") as string,
                    }
                    setHrData(hrData.map(h => h.id === editingHr.id ? updatedHr : h))
                    setShowEditModal(false)
                    setEditingHr(null)
                    alert("HR details updated successfully!")
                  }} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">HR Name *</Label>
                      <Input id="name" name="name" defaultValue={editingHr.name} required />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input id="company" name="company" defaultValue={editingHr.company} required />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile *</Label>
                      <Input id="mobile" name="mobile" defaultValue={editingHr.mobile} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" defaultValue={editingHr.email} required />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select id="status" name="status" defaultValue={editingHr.status} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="followup">Follow-up Date</Label>
                      <Input id="followup" name="followup" type="date" defaultValue={editingHr.followup} />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">Update</Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={() => {
                        setShowEditModal(false)
                        setEditingHr(null)
                      }}>Cancel</Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* View Data Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
              <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{viewingData?.type || "View Data"}</DialogTitle>
                </DialogHeader>
                {viewingData && (
                  <div className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            {Object.keys(viewingData.data[0] || {}).map((key) => (
                              <th key={key} className="text-left p-3 font-semibold capitalize">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {viewingData.data.slice(0, 10).map((item: any, idx: number) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              {Object.values(item).map((val: any, i: number) => (
                                <td key={i} className="p-3">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {viewingData.data.length > 10 && (
                      <p className="text-sm text-gray-600 mt-4">Showing first 10 of {viewingData.data.length} records</p>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}

