
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Award, TrendingUp } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AuthService } from "@/lib/auth-service"
import { PlacementAnalyticsService } from "@/lib/placement-service"
import { initializeAllMockData } from "@/lib/mock-data-initializer"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/recharts-wrapper"
import type { User as AuthUser } from "@/lib/auth-service"

const COLORS = ["#FF8C42", "#2E86AB", "#A23B72", "#F18F01", "#06A77D"]

export default function OfferStatementPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [statement, setStatement] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login")
      return
    }
    setUser(currentUser)
    // Initialize mock data if needed
    initializeAllMockData()
    loadStatement()
  }, [navigate])

  const loadStatement = () => {
    setLoading(true)
    const offerStatement = PlacementAnalyticsService.getOfferStatement()
    setStatement(offerStatement)
    setLoading(false)
  }

  const handleDownload = () => {
    if (!statement) return

    const reportData = {
      title: "Offer Statement Report",
      generatedAt: new Date().toISOString(),
      summary: {
        singleOffer: statement.singleOffer,
        multipleOffers: statement.multipleOffers,
        totalOffers: statement.singleOffer + statement.multipleOffers,
      },
      branchWise: statement.branchWise,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `offer_statement_${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-72">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto pt-16">
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10 dark:to-accent/5">
          <div className="p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                  Offer Statement
                </h1>
                <p className="text-muted-foreground">Single and multiple offer statistics with branch-wise breakdown</p>
              </div>
              <Button onClick={handleDownload} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </motion.div>

            {loading ? (
              <Card className="glass-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading offer statement...</p>
              </Card>
            ) : statement ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="glass-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Single Offer</p>
                        <p className="text-3xl font-bold text-green-600">{statement.singleOffer}</p>
                        <p className="text-xs text-muted-foreground mt-1">Students with one offer</p>
                      </div>
                      <Award className="w-12 h-12 text-green-600 opacity-50" />
                    </div>
                  </Card>

                  <Card className="glass-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Multiple Offers</p>
                        <p className="text-3xl font-bold text-accent">{statement.multipleOffers}</p>
                        <p className="text-xs text-muted-foreground mt-1">Students with multiple offers</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-accent opacity-50" />
                    </div>
                  </Card>

                  <Card className="glass-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
                        <p className="text-3xl font-bold text-primary">
                          {statement.singleOffer + statement.multipleOffers}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Combined offer count</p>
                      </div>
                      <FileText className="w-12 h-12 text-primary opacity-50" />
                    </div>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Branch-wise Breakdown */}
                  <Card className="glass-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Branch-wise Offer Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statement.branchWise}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="branch" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="single" fill="#06A77D" name="Single Offer" />
                        <Bar dataKey="multiple" fill="#FF8C42" name="Multiple Offers" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Pie Chart */}
                  <Card className="glass-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Single vs Multiple Offers</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Single Offer", value: statement.singleOffer },
                            { name: "Multiple Offers", value: statement.multipleOffers },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#06A77D" />
                          <Cell fill="#FF8C42" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Branch-wise Table */}
                <Card className="glass-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Detailed Branch-wise Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Branch</th>
                          <th className="text-right p-3">Single Offer</th>
                          <th className="text-right p-3">Multiple Offers</th>
                          <th className="text-right p-3">Total Students</th>
                          <th className="text-right p-3">Total Offers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statement.branchWise.map((branch: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-medium">{branch.branch}</td>
                            <td className="p-3 text-right text-green-600">{branch.single}</td>
                            <td className="p-3 text-right text-accent">{branch.multiple}</td>
                            <td className="p-3 text-right font-semibold">
                              {branch.single + branch.multiple}
                            </td>
                            <td className="p-3 text-right font-semibold">
                              {branch.single + branch.multiple * 2}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

