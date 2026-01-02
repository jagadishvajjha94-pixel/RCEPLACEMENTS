// AI-Powered Training and Timetable Scheduling Service
import { generateFreeText } from "./free-ai-client"
import { TrainingService } from "./db-service"
import { TimetableService } from "./db-service"
import type { Training } from "./mock-data"
import type { Timetable } from "./mock-data"

export interface TrainingScheduleRequest {
  title: string
  topic: string
  branch: string
  section: string
  year: string
  duration: number // hours
  instructor?: string
  preferredDays?: string[]
  preferredTimeSlots?: string[]
  excludeDates?: string[]
  maxSessions?: number
}

export interface TimetableScheduleRequest {
  semester: number
  academicYear: string
  branch: string
  section: string
  subjects: Array<{
    name: string
    faculty: string
    hoursPerWeek: number
    type: "Lecture" | "Lab" | "Tutorial" | "Training"
  }>
  availableRooms?: string[]
  availableTimeSlots?: string[]
  constraints?: {
    noClassDays?: string[]
    preferredTimings?: Record<string, string[]>
  }
}

export interface AIScheduleResult {
  schedule: Array<{
    date?: string
    day: string
    time: string
    topic: string
    location?: string
    instructor?: string
    duration: number
    notes?: string
  }>
  conflicts: Array<{
    type: string
    message: string
    severity: "low" | "medium" | "high"
  }>
  recommendations: string[]
  summary: string
}

class AITrainingServiceClass {
  // Generate optimal training schedule using AI
  async generateTrainingSchedule(request: TrainingScheduleRequest): Promise<AIScheduleResult> {
    try {
      // Get existing trainings and timetables to check for conflicts
      const existingTrainings = await TrainingService.getAll({
        branch: request.branch,
        section: request.section,
        year: request.year,
      })

      const existingTimetables = await TimetableService.getTimetables({
        branch: request.branch,
        section: request.section,
        year: request.year,
      })

      // Prepare context for AI
      const context = {
        request,
        existingTrainings: existingTrainings.map((t) => ({
          title: t.title,
          date: t.date,
          time: t.time,
          status: t.status,
        })),
        existingSchedule: existingTimetables[0]?.schedule || [],
      }

      // Use AI to generate optimal schedule
      const prompt = `You are an expert academic scheduling assistant. Generate an optimal training schedule based on the following requirements:

Training Details:
- Title: ${request.title}
- Topic: ${request.topic}
- Branch: ${request.branch}, Section: ${request.section}, Year: ${request.year}
- Duration: ${request.duration} hours total
- Preferred Days: ${request.preferredDays?.join(", ") || "Any"}
- Preferred Time Slots: ${request.preferredTimeSlots?.join(", ") || "Any"}
- Max Sessions: ${request.maxSessions || Math.ceil(request.duration / 2)}
- Exclude Dates: ${request.excludeDates?.join(", ") || "None"}

Existing Commitments:
${JSON.stringify(context.existingSchedule, null, 2)}

Existing Trainings:
${JSON.stringify(context.existingTrainings, null, 2)}

Generate a JSON response with this structure:
{
  "schedule": [
    {
      "day": "Monday",
      "time": "2:00 PM - 4:00 PM",
      "topic": "Topic for this session",
      "duration": 2,
      "notes": "Any additional notes"
    }
  ],
  "conflicts": [
    {
      "type": "Conflict type",
      "message": "Description",
      "severity": "low|medium|high"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "summary": "Brief summary of the schedule"
}

Important constraints:
- Avoid conflicts with existing schedules
- Distribute sessions evenly
- Consider optimal learning intervals (sessions should be 2-4 hours, with gaps between)
- Ensure total hours match the requested duration
- Provide specific day and time slots
- Return ONLY valid JSON, no additional text`

      const text = await generateFreeText({
        prompt,
        system: "You are an expert academic scheduling assistant. Generate optimal schedules as JSON.",
        model: "instruction",
      })

      // Parse AI response
      let result: AIScheduleResult
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON found in response")
        }
      } catch (parseError) {
        // Fallback to default schedule if AI parsing fails
        result = this.generateDefaultSchedule(request)
        result.conflicts.push({
          type: "AI Parsing Error",
          message: "AI response could not be parsed, using default schedule",
          severity: "low",
        })
      }

      return result
    } catch (error) {
      console.error("AI Training Schedule Error:", error)
      // Return default schedule on error
      return this.generateDefaultSchedule(request)
    }
  }

  // Generate optimal timetable using AI
  async generateTimetable(request: TimetableScheduleRequest): Promise<AIScheduleResult> {
    try {
      // Get existing timetables
      const existingTimetables = await TimetableService.getTimetables({
        branch: request.branch,
        section: request.section,
        year: request.year,
        semester: request.semester,
      })

      const prompt = `You are an expert academic timetable scheduler. Generate an optimal weekly timetable based on:

Academic Details:
- Semester: ${request.semester}
- Academic Year: ${request.academicYear}
- Branch: ${request.branch}, Section: ${request.section}

Subjects:
${request.subjects.map((s) => `- ${s.name} (${s.type}): ${s.hoursPerWeek} hours/week, Faculty: ${s.faculty}`).join("\n")}

Available Resources:
- Rooms: ${request.availableRooms?.join(", ") || "A-101, A-102, A-103, Lab-1, Lab-2"}
- Time Slots: ${request.availableTimeSlots?.join(", ") || "9:00 AM - 10:00 AM, 10:00 AM - 11:00 AM, 11:00 AM - 12:00 PM, 2:00 PM - 3:00 PM, 3:00 PM - 4:00 PM, 4:00 PM - 5:00 PM"}

Constraints:
${request.constraints?.noClassDays ? `- No classes on: ${request.constraints.noClassDays.join(", ")}` : ""}
${request.constraints?.preferredTimings ? `- Preferred timings: ${JSON.stringify(request.constraints.preferredTimings)}` : ""}

Generate a JSON response with this structure:
{
  "schedule": [
    {
      "day": "Monday",
      "time": "9:00 AM - 10:00 AM",
      "topic": "Subject Name",
      "location": "Room",
      "duration": 1,
      "notes": "Faculty name or other notes"
    }
  ],
  "conflicts": [],
  "recommendations": ["Recommendation 1"],
  "summary": "Brief summary"
}

Constraints:
- Distribute hours evenly across the week
- Labs should be 2-3 hours, Lectures 1 hour, Tutorials 1 hour
- Avoid scheduling same subject multiple times on same day (unless it's a lab)
- Respect faculty preferences if provided
- Ensure total hours per subject match requirements
- Return ONLY valid JSON`

      const text = await generateFreeText({
        prompt,
        system: "You are an expert academic timetable scheduler. Generate optimal timetables as JSON.",
        model: "instruction",
      })

      let result: AIScheduleResult
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON found in response")
        }
      } catch (parseError) {
        result = this.generateDefaultTimetable(request)
        result.conflicts.push({
          type: "AI Parsing Error",
          message: "AI response could not be parsed, using default timetable",
          severity: "low",
        })
      }

      return result
    } catch (error) {
      console.error("AI Timetable Generation Error:", error)
      return this.generateDefaultTimetable(request)
    }
  }

  // Default fallback schedule generator
  private generateDefaultSchedule(request: TrainingScheduleRequest): AIScheduleResult {
    const sessions = request.maxSessions || Math.ceil(request.duration / 2)
    const hoursPerSession = Math.ceil(request.duration / sessions)
    const schedule: AIScheduleResult["schedule"] = []
    const days = request.preferredDays || ["Monday", "Wednesday", "Friday"]
    const timeSlots = request.preferredTimeSlots || ["2:00 PM - 4:00 PM", "3:00 PM - 5:00 PM"]

    for (let i = 0; i < sessions; i++) {
      const day = days[i % days.length]
      const timeSlot = timeSlots[i % timeSlots.length]
      schedule.push({
        day,
        time: timeSlot,
        topic: `${request.topic} - Session ${i + 1}`,
        duration: hoursPerSession,
        notes: `Part ${i + 1} of ${sessions} sessions`,
      })
    }

    return {
      schedule,
      conflicts: [],
      recommendations: [
        "Consider student availability for optimal attendance",
        "Ensure adequate breaks between sessions",
        "Coordinate with faculty schedules",
      ],
      summary: `Generated ${sessions} sessions of ${hoursPerSession} hours each for ${request.title}`,
    }
  }

  // Default fallback timetable generator
  private generateDefaultTimetable(request: TimetableScheduleRequest): AIScheduleResult {
    const schedule: AIScheduleResult["schedule"] = []
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const timeSlots = ["9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM"]
    const rooms = request.availableRooms || ["A-101", "A-102", "A-103", "Lab-1", "Lab-2"]

    let timeIndex = 0
    for (const subject of request.subjects) {
      const sessionsNeeded = subject.hoursPerWeek
      for (let i = 0; i < sessionsNeeded; i++) {
        const day = days[i % days.length]
        const time = timeSlots[timeIndex % timeSlots.length]
        schedule.push({
          day,
          time,
          topic: subject.name,
          location: subject.type === "Lab" ? rooms.find((r) => r.includes("Lab")) || rooms[0] : rooms[0],
          duration: subject.type === "Lab" ? 2 : 1,
          notes: subject.faculty,
        })
        timeIndex++
      }
    }

    return {
      schedule,
      conflicts: [],
      recommendations: [
        "Review and adjust for faculty availability",
        "Ensure room capacity matches class size",
        "Consider travel time between classes",
      ],
      summary: `Generated timetable with ${request.subjects.length} subjects for ${request.branch} ${request.section}`,
    }
  }

  // Get AI recommendations for training improvements
  async getTrainingRecommendations(branch: string, year: string): Promise<string[]> {
    try {
      const trainings = await TrainingService.getAll({ branch, year })
      const completed = trainings.filter((t) => t.status === "completed")
      const ongoing = trainings.filter((t) => t.status === "ongoing")

      const prompt = `Based on the following training data, provide 5-7 specific recommendations for improving training programs:

Completed Trainings: ${completed.length}
Ongoing Trainings: ${ongoing.length}
Training Topics: ${trainings.map((t) => t.topic).join(", ")}

Provide recommendations as a JSON array of strings:
["Recommendation 1", "Recommendation 2", ...]

Focus on:
- Skill gaps to address
- Optimal scheduling
- Training effectiveness
- Resource allocation
- Student engagement

Return ONLY the JSON array, no additional text.`

      const text = await generateFreeText({
        prompt,
        system: "You are a training program advisor. Provide recommendations as a JSON array.",
        model: "instruction",
      })

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error("Failed to parse recommendations:", e)
      }

      return [
        "Consider adding more hands-on practical sessions",
        "Schedule regular assessment checkpoints",
        "Incorporate industry expert sessions",
        "Provide additional resources for advanced learners",
      ]
    } catch (error) {
      console.error("AI Recommendations Error:", error)
      return []
    }
  }
}

export const AITrainingService = new AITrainingServiceClass()

