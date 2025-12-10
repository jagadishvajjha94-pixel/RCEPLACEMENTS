
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, BookOpen, Download, Eye } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { TimetableService } from "@/lib/db-service"
import type { Timetable } from "@/lib/mock-data"
import type { User as AuthUser } from "@/lib/auth-service"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function StudentSchedulePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)

    if (currentUser && currentUser.profile) {
      loadTimetables(currentUser.profile.branch, currentUser.profile.section, currentUser.profile.year)
    } else {
      // Fallback for demo
      loadTimetables("CSE", "A", "1st")
    }
  }, [])

  const loadTimetables = async (branch: string, section: string, year: string) => {
    setLoading(true)
    try {
      const data = await TimetableService.getTimetables({ branch, section, year })
      setTimetables(data)
      if (data.length > 0) {
        setSelectedSemester(data[0].semester)
        setSelectedTimetable(data[0])
      }
    } catch (error) {
      console.error("Error loading timetables:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSemesterChange = (semester: number) => {
    setSelectedSemester(semester)
    const timetable = timetables.find((t) => t.semester === semester)
    setSelectedTimetable(timetable || null)
  }

  const getScheduleForDay = (day: string) => {
    if (!selectedTimetable) return []
    return selectedTimetable.schedule.filter((s) => s.day === day)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetable...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Academic Schedule
        </h1>
        <p className="text-muted-foreground">
          View your semester-wise timetable and training schedules
        </p>
      </motion.div>

      {/* Semester Selector */}
      {timetables.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 flex-wrap"
        >
          {Array.from(new Set(timetables.map((t) => t.semester)))
            .sort()
            .map((sem) => (
              <Button
                key={sem}
                variant={selectedSemester === sem ? "default" : "outline"}
                onClick={() => handleSemesterChange(sem)}
                className="bg-white"
              >
                Semester {sem}
              </Button>
            ))}
        </motion.div>
      )}

      {selectedTimetable ? (
        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="timetable">Weekly Timetable</TabsTrigger>
            <TabsTrigger value="trainings">Training Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable" className="space-y-6">
            {/* Timetable Info */}
            <Card className="bg-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Semester {selectedTimetable.semester} - {selectedTimetable.academicYear}
                  </h2>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{selectedTimetable.branch} - Section {selectedTimetable.section}</span>
                    <span>•</span>
                    <span>Year: {selectedTimetable.year}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Uploaded by: {selectedTimetable.uploadedBy}</p>
                  <p>{new Date(selectedTimetable.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Weekly Schedule */}
            <div className="grid gap-4">
              {daysOfWeek.map((day, dayIndex) => {
                const daySchedule = getScheduleForDay(day)
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                  >
                    <Card className="bg-white p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {day}
                      </h3>
                      {daySchedule.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {daySchedule.map((slot, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: dayIndex * 0.1 + index * 0.05 }}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <Badge
                                  className={
                                    slot.type === "Training"
                                      ? "bg-accent text-accent-foreground"
                                      : slot.type === "Lab"
                                        ? "bg-primary text-primary-foreground"
                                        : slot.type === "Lecture"
                                          ? "bg-secondary text-secondary-foreground"
                                          : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {slot.type}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-lg mb-2">{slot.subject}</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{slot.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{slot.room}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>{slot.faculty}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No classes scheduled</p>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="trainings" className="space-y-4">
            <Card className="bg-white p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                Training Schedule
              </h2>
              {selectedTimetable.trainings.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedTimetable.trainings.map((training, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-accent/5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold">{training.title}</h3>
                        <Badge className="bg-accent text-accent-foreground">Training</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{training.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">{new Date(training.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{training.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{training.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span>{training.instructor}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No trainings scheduled for this semester</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-white p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Timetable Available</h3>
          <p className="text-muted-foreground">
            The timetable for your branch and section has not been uploaded yet. Please check back later.
          </p>
        </Card>
      )}
    </div>
  )
}

