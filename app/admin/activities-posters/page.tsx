
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Download,
  Image,
  Camera,
  FileImage,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function ActivitiesPostersPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities & Posters</h1>
                <p className="text-gray-600">Manage T&P activities, photos, and posters</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </motion.div>

            {/* Main Tabs */}
            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-gray-100 shadow-lg">
                <TabsTrigger value="activities">Activities & Photos</TabsTrigger>
                <TabsTrigger value="posters">Posters</TabsTrigger>
              </TabsList>

              {/* Activities Tab */}
              <TabsContent value="activities" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Camera className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">T&P Activities & Photos</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Upload and manage T&P activity photos</p>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photos
                    </Button>
                  </Card>

                  <Card className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Camera className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">MBA Activities & Photos</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Upload and manage MBA activity photos</p>
                    <Button className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photos
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              {/* Posters Tab */}
              <TabsContent value="posters" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["Placement Posters", "Summer BootCamp Posters", "Welcome Posters"].map((poster, idx) => (
                    <Card key={idx} className="p-6 border-2 border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <FileImage className="w-6 h-6 text-orange-600" />
                        <h3 className="text-lg font-bold text-gray-900">{poster}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

