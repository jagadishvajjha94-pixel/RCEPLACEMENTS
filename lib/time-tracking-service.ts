/**
 * Time Tracking Service
 * Tracks individual student time spent on different activities in the portal
 */

export interface TimeSpentEntry {
  studentId: string
  date: string // YYYY-MM-DD format
  category: 'applications' | 'interviews' | 'resumeBuilding' | 'training'
  minutes: number
  timestamp: string
}

export interface DailyTimeSpent {
  day: string // Mon, Tue, etc.
  date: string // YYYY-MM-DD
  applications: number
  interviews: number
  resumeBuilding: number
  training: number
  total: number
}

class TimeTrackingService {
  private storageKey = 'rce_time_tracking'
  private currentSessionStart: { [key: string]: number } = {}
  private currentCategory: { [key: string]: string } = {}

  /**
   * Initialize time tracking for a student
   */
  initializeTracking(studentId: string) {
    if (typeof window === 'undefined') return

    // Load existing data
    const existing = this.getTimeSpentData(studentId)
    if (!existing || existing.length === 0) {
      // Initialize with some mock data for demo
      this.initializeMockData(studentId)
    }
  }

  /**
   * Start tracking time for a specific category
   */
  startTracking(studentId: string, category: 'applications' | 'interviews' | 'resumeBuilding' | 'training') {
    if (typeof window === 'undefined') return

    // Stop previous tracking if any
    this.stopTracking(studentId)

    // Start new tracking
    const key = `${studentId}_${category}`
    this.currentSessionStart[key] = Date.now()
    this.currentCategory[studentId] = category
  }

  /**
   * Stop tracking time for current category
   */
  stopTracking(studentId: string) {
    if (typeof window === 'undefined') return

    const category = this.currentCategory[studentId]
    if (!category) return

    const key = `${studentId}_${category}`
    const startTime = this.currentSessionStart[key]
    if (!startTime) return

    const minutes = Math.round((Date.now() - startTime) / (1000 * 60))
    if (minutes > 0) {
      this.recordTimeSpent(studentId, category as any, minutes)
    }

    delete this.currentSessionStart[key]
    delete this.currentCategory[studentId]
  }

  /**
   * Record time spent manually
   */
  recordTimeSpent(
    studentId: string,
    category: 'applications' | 'interviews' | 'resumeBuilding' | 'training',
    minutes: number
  ) {
    if (typeof window === 'undefined') return

    const today = new Date().toISOString().split('T')[0]
    const entries = this.getTimeSpentData(studentId)

    // Check if entry exists for today and category
    const existingIndex = entries.findIndex(
      (e) => e.date === today && e.category === category
    )

    if (existingIndex >= 0) {
      entries[existingIndex].minutes += minutes
      entries[existingIndex].timestamp = new Date().toISOString()
    } else {
      entries.push({
        studentId,
        date: today,
        category,
        minutes,
        timestamp: new Date().toISOString(),
      })
    }

    this.saveTimeSpentData(studentId, entries)
  }

  /**
   * Get time spent data for a student
   */
  getTimeSpentData(studentId: string): TimeSpentEntry[] {
    if (typeof window === 'undefined') return []

    try {
      const data = localStorage.getItem(`${this.storageKey}_${studentId}`)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * Get daily time spent for last week
   */
  getLastWeekData(studentId: string): DailyTimeSpent[] {
    const entries = this.getTimeSpentData(studentId)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result: DailyTimeSpent[] = []

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = days[date.getDay()]

      const dayEntries = entries.filter((e) => e.date === dateStr)

      const daily: DailyTimeSpent = {
        day: dayName,
        date: dateStr,
        applications: 0,
        interviews: 0,
        resumeBuilding: 0,
        training: 0,
        total: 0,
      }

      dayEntries.forEach((entry) => {
        daily[entry.category] += entry.minutes
        daily.total += entry.minutes
      })

      result.push(daily)
    }

    return result
  }

  /**
   * Get time spent for this week
   */
  getThisWeekData(studentId: string): DailyTimeSpent[] {
    const entries = this.getTimeSpentData(studentId)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result: DailyTimeSpent[] = []

    // Get current week (Monday to Sunday)
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = days[date.getDay()]

      const dayEntries = entries.filter((e) => e.date === dateStr)

      const daily: DailyTimeSpent = {
        day: dayName,
        date: dateStr,
        applications: 0,
        interviews: 0,
        resumeBuilding: 0,
        training: 0,
        total: 0,
      }

      dayEntries.forEach((entry) => {
        daily[entry.category] += entry.minutes
        daily.total += entry.minutes
      })

      result.push(daily)
    }

    return result
  }

  /**
   * Save time spent data
   */
  private saveTimeSpentData(studentId: string, entries: TimeSpentEntry[]) {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(`${this.storageKey}_${studentId}`, JSON.stringify(entries))
    } catch (error) {
      console.error('Failed to save time tracking data:', error)
    }
  }

  /**
   * Initialize mock data for demo purposes
   */
  private initializeMockData(studentId: string) {
    const entries: TimeSpentEntry[] = []
    const today = new Date()

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Random time distribution
      const applications = Math.floor(Math.random() * 40) + 20
      const interviews = Math.floor(Math.random() * 30) + 15
      const resumeBuilding = Math.floor(Math.random() * 25) + 10
      const training = Math.floor(Math.random() * 20) + 5

      entries.push(
        {
          studentId,
          date: dateStr,
          category: 'applications',
          minutes: applications,
          timestamp: new Date(dateStr).toISOString(),
        },
        {
          studentId,
          date: dateStr,
          category: 'interviews',
          minutes: interviews,
          timestamp: new Date(dateStr).toISOString(),
        },
        {
          studentId,
          date: dateStr,
          category: 'resumeBuilding',
          minutes: resumeBuilding,
          timestamp: new Date(dateStr).toISOString(),
        },
        {
          studentId,
          date: dateStr,
          category: 'training',
          minutes: training,
          timestamp: new Date(dateStr).toISOString(),
        }
      )
    }

    this.saveTimeSpentData(studentId, entries)
  }

  /**
   * Get total time spent for a period
   */
  getTotalTimeSpent(
    studentId: string,
    period: 'today' | 'week' | 'month'
  ): number {
    const entries = this.getTimeSpentData(studentId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let filteredEntries = entries

    if (period === 'today') {
      const todayStr = today.toISOString().split('T')[0]
      filteredEntries = entries.filter((e) => e.date === todayStr)
    } else if (period === 'week') {
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      filteredEntries = entries.filter(
        (e) => new Date(e.date) >= weekAgo
      )
    } else if (period === 'month') {
      const monthAgo = new Date(today)
      monthAgo.setMonth(today.getMonth() - 1)
      filteredEntries = entries.filter(
        (e) => new Date(e.date) >= monthAgo
      )
    }

    return filteredEntries.reduce((sum, entry) => sum + entry.minutes, 0)
  }
}

export const timeTrackingService = new TimeTrackingService()

