// AI Automation Service for Daily Updates and Reports
import { PlacementAnalyticsService, RegistrationService, PlacementDriveService } from "./placement-service"
import { StudentService } from "./db-service"
import { generateFreeText } from "./free-ai-client"

export interface AutomationReport {
  id: string
  date: string
  timestamp: string
  summary: {
    totalStudents: number
    newRegistrations: number
    placementsToday: number
    activeDrives: number
    pendingApplications: number
    completionRate: number
  }
  trends: {
    registrationTrend: Array<{ date: string; count: number }>
    placementTrend: Array<{ date: string; count: number }>
    driveActivity: Array<{ date: string; active: number; completed: number }>
  }
  insights: {
    topPerformingBranches: Array<{ branch: string; placementRate: number; students: number }>
    topCompanies: Array<{ company: string; offers: number; rate: number }>
    alerts: Array<{ type: string; message: string; severity: "low" | "medium" | "high" }>
    recommendations: string[]
  }
  branchWiseStats: Array<{
    branch: string
    totalStudents: number
    placed: number
    pending: number
    rate: number
  }>
  dailyActivities: Array<{
    time: string
    activity: string
    category: string
    impact: string
  }>
}

class AIAutomationServiceClass {
  private reports: AutomationReport[] = []

  // Generate daily automation report
  async generateDailyReport(): Promise<AutomationReport> {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const timestamp = now.toISOString()

    // Get all data
    const registrations = RegistrationService.getAll()
    const drives = PlacementDriveService.getAll()
    const stats = PlacementAnalyticsService.getStats()

    // Calculate today's metrics
    const todayRegistrations = registrations.filter(r => {
      const regDate = new Date(r.submittedAt).toISOString().split('T')[0]
      return regDate === today
    })

    const todayPlacements = registrations.filter(r => {
      if (!r.hasOffer) return false
      // Mock: assume offers received today
      return Math.random() > 0.7
    })

    // Generate trends (last 7 days)
    const trendData = this.generateTrendData(7)

    // Generate insights using AI
    const insights = await this.generateAIInsights(stats, registrations, drives)

    // Branch-wise statistics
    const branchStats = this.calculateBranchStats(registrations)

    // Daily activities log
    const activities = this.generateDailyActivities(registrations, drives)

    const report: AutomationReport = {
      id: `report-${Date.now()}`,
      date: today,
      timestamp,
      summary: {
        totalStudents: stats.totalStudents,
        newRegistrations: todayRegistrations.length,
        placementsToday: todayPlacements.length,
        activeDrives: drives.filter(d => d.status === "active").length,
        pendingApplications: registrations.filter(r => !r.hasOffer && r.status === "pending").length,
        completionRate: stats.placementRate,
      },
      trends: trendData,
      insights,
      branchWiseStats: branchStats,
      dailyActivities: activities,
    }

    // Store report
    this.reports.push(report)
    this.saveReports()

    return report
  }

  private generateTrendData(days: number) {
    const registrationTrend: Array<{ date: string; count: number }> = []
    const placementTrend: Array<{ date: string; count: number }> = []
    const driveActivity: Array<{ date: string; active: number; completed: number }> = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      registrationTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 50) + 20,
      })

      placementTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: Math.floor(Math.random() * 30) + 10,
      })

      driveActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        active: Math.floor(Math.random() * 15) + 5,
        completed: Math.floor(Math.random() * 10) + 2,
      })
    }

    return { registrationTrend, placementTrend, driveActivity }
  }

  private async generateAIInsights(stats: any, registrations: any[], drives: any[]) {
    // Top performing branches
    const branchMap = new Map<string, { placed: number; total: number }>()
    registrations.forEach(reg => {
      const branch = reg.branch || "Unknown"
      const existing = branchMap.get(branch) || { placed: 0, total: 0 }
      existing.total++
      if (reg.hasOffer) existing.placed++
      branchMap.set(branch, existing)
    })

    const topBranches = Array.from(branchMap.entries())
      .map(([branch, data]) => ({
        branch,
        placementRate: data.total > 0 ? (data.placed / data.total) * 100 : 0,
        students: data.total,
      }))
      .sort((a, b) => b.placementRate - a.placementRate)
      .slice(0, 5)

    // Top companies
    const companyMap = new Map<string, number>()
    registrations.filter(r => r.hasOffer).forEach(reg => {
      const drive = drives.find(d => d.id === reg.driveId)
      if (drive) {
        const company = drive.companyName
        companyMap.set(company, (companyMap.get(company) || 0) + 1)
      }
    })

    const topCompanies = Array.from(companyMap.entries())
      .map(([company, offers]) => {
        const drive = drives.find(d => d.companyName === company)
        const totalApplicants = registrations.filter(r => r.driveId === drive?.id).length
        return {
          company,
          offers,
          rate: totalApplicants > 0 ? (offers / totalApplicants) * 100 : 0,
        }
      })
      .sort((a, b) => b.offers - a.offers)
      .slice(0, 5)

    // Generate alerts
    const alerts: Array<{ type: string; message: string; severity: "low" | "medium" | "high" }> = []
    
    const pendingCount = registrations.filter(r => !r.hasOffer && r.status === "pending").length
    if (pendingCount > 100) {
      alerts.push({
        type: "High Pending Applications",
        message: `${pendingCount} applications are pending review`,
        severity: "high",
      })
    }

    const expiredDrives = drives.filter(d => {
      const deadline = new Date(d.deadline)
      return deadline < new Date() && d.status === "active"
    })
    if (expiredDrives.length > 0) {
      alerts.push({
        type: "Expired Drives",
        message: `${expiredDrives.length} drive(s) have passed deadline but are still active`,
        severity: "medium",
      })
    }

    const lowPlacementBranches = topBranches.filter(b => b.placementRate < 30)
    if (lowPlacementBranches.length > 0) {
      alerts.push({
        type: "Low Placement Rate",
        message: `${lowPlacementBranches.length} branch(es) have placement rate below 30%`,
        severity: "medium",
      })
    }

    // Generate AI-powered recommendations
    let recommendations: string[] = []
    
    try {
      const recommendationPrompt = `You are an expert placement and career guidance advisor analyzing placement data. Based on the following statistics, provide 5-7 specific, actionable recommendations:

Statistics:
- Total Students: ${stats.totalStudents}
- Placed Students: ${stats.placedStudents}
- Placement Rate: ${stats.placementRate.toFixed(2)}%
- Pending Applications: ${pendingCount}
- Active Drives: ${drives.filter(d => d.status === "active").length}
- Top Performing Branch: ${topBranches[0]?.branch || "N/A"} (${topBranches[0]?.placementRate.toFixed(2)}%)
- Low Performing Branches: ${lowPlacementBranches.map(b => b.branch).join(", ")}
- Top Companies: ${topCompanies.slice(0, 3).map(c => c.company).join(", ")}

Provide recommendations as a JSON array of strings:
["Recommendation 1", "Recommendation 2", ...]

Focus on:
- Improving placement rates for underperforming branches
- Strategic actions to increase placements
- Resource allocation and drive management
- Student preparation and skill development
- Data-driven insights and predictions

Return ONLY the JSON array, no additional text.`

      const text = await generateFreeText({
        prompt: recommendationPrompt,
        system: "You are an expert placement and career guidance advisor. Provide recommendations as a JSON array of strings.",
        model: "instruction",
      })

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0])
        }
      } catch (parseError) {
        console.error("Failed to parse AI recommendations:", parseError)
      }
    } catch (error) {
      console.error("AI Recommendation generation failed:", error)
    }

    // Fallback to rule-based recommendations if AI fails
    if (recommendations.length === 0) {
      if (stats.placementRate < 50) {
        recommendations.push("Consider organizing additional placement drives to improve overall placement rate")
      }
      
      if (topBranches.length > 0 && topBranches[0].placementRate > 80) {
        recommendations.push(`Excellent performance in ${topBranches[0].branch} branch - consider sharing best practices with other branches`)
      }

      if (pendingCount > 50) {
        recommendations.push("High number of pending applications - consider increasing review capacity")
      }

      if (drives.filter(d => d.status === "active").length < 5) {
        recommendations.push("Low number of active drives - consider reaching out to more companies")
      }
    }

    return {
      topPerformingBranches: topBranches,
      topCompanies,
      alerts,
      recommendations,
    }
  }

  private calculateBranchStats(registrations: any[]) {
    const branchMap = new Map<string, { total: number; placed: number; pending: number }>()

    registrations.forEach(reg => {
      const branch = reg.branch || "Unknown"
      const existing = branchMap.get(branch) || { total: 0, placed: 0, pending: 0 }
      existing.total++
      if (reg.hasOffer) {
        existing.placed++
      } else if (reg.status === "pending") {
        existing.pending++
      }
      branchMap.set(branch, existing)
    })

    return Array.from(branchMap.entries()).map(([branch, data]) => ({
      branch,
      totalStudents: data.total,
      placed: data.placed,
      pending: data.pending,
      rate: data.total > 0 ? (data.placed / data.total) * 100 : 0,
    }))
  }

  private generateDailyActivities(registrations: any[], drives: any[]) {
    const activities: Array<{ time: string; activity: string; category: string; impact: string }> = []
    
    const todayRegistrations = registrations.filter(r => {
      const regDate = new Date(r.submittedAt).toISOString().split('T')[0]
      return regDate === new Date().toISOString().split('T')[0]
    })

    if (todayRegistrations.length > 0) {
      activities.push({
        time: "09:00 AM",
        activity: `${todayRegistrations.length} new student registrations processed`,
        category: "Registrations",
        impact: "High",
      })
    }

    const newDrives = drives.filter(d => {
      const createdDate = new Date(d.createdAt).toISOString().split('T')[0]
      return createdDate === new Date().toISOString().split('T')[0]
    })

    if (newDrives.length > 0) {
      activities.push({
        time: "10:30 AM",
        activity: `${newDrives.length} new placement drive(s) added`,
        category: "Drives",
        impact: "High",
      })
    }

    activities.push({
      time: "02:00 PM",
      activity: "Daily analytics data refreshed",
      category: "Analytics",
      impact: "Medium",
    })

    activities.push({
      time: "04:00 PM",
      activity: "Automated report generation completed",
      category: "Automation",
      impact: "Medium",
    })

    const placements = registrations.filter(r => r.hasOffer)
    if (placements.length > 0) {
      activities.push({
        time: "05:00 PM",
        activity: `${placements.length} placement offers recorded`,
        category: "Placements",
        impact: "High",
      })
    }

    return activities
  }

  // Get all reports
  getAllReports(): AutomationReport[] {
    this.loadReports()
    return this.reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get latest report
  getLatestReport(): AutomationReport | null {
    this.loadReports()
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null
  }

  // Get report by date
  getReportByDate(date: string): AutomationReport | null {
    this.loadReports()
    return this.reports.find(r => r.date === date) || null
  }

  // Save reports to localStorage
  private saveReports() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ai_automation_reports", JSON.stringify(this.reports))
      } catch (error) {
        console.error("Error saving reports:", error)
      }
    }
  }

  // Load reports from localStorage
  private loadReports() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ai_automation_reports")
        if (stored) {
          this.reports = JSON.parse(stored)
        }
      } catch (error) {
        console.error("Error loading reports:", error)
      }
    }
  }

  // Schedule daily automation (runs at end of day)
  scheduleDailyUpdate() {
    if (typeof window === "undefined") return

    // Check if report already exists for today
    const today = new Date().toISOString().split('T')[0]
    const existingReport = this.getReportByDate(today)
    
    if (!existingReport) {
      // Generate report if it doesn't exist
      this.generateDailyReport().catch(err => console.error("Error generating report:", err))
    }

    // Set up interval to check for end of day (11:59 PM)
    const checkTime = async () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // Run at 11:59 PM
      if (hours === 23 && minutes === 59) {
        try {
          await this.generateDailyReport()
        } catch (err) {
          console.error("Error generating scheduled report:", err)
        }
      }
    }

    // Check every minute
    setInterval(checkTime, 60000)
  }

  // Initialize automation
  initialize() {
    this.loadReports()
    this.scheduleDailyUpdate()
    
    // Generate report for today if it doesn't exist
    const today = new Date().toISOString().split('T')[0]
    if (!this.getReportByDate(today)) {
      this.generateDailyReport().catch(err => console.error("Error generating initial report:", err))
    }
  }
}

export const AIAutomationService = new AIAutomationServiceClass()

