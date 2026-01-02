import { AITrainingService, type TimetableScheduleRequest } from "@/lib/ai-training-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const request: TimetableScheduleRequest = body

    // Validate required fields
    if (!request.semester || !request.academicYear || !request.branch || !request.subjects || request.subjects.length === 0) {
      return Response.json(
        { error: "Missing required fields: semester, academicYear, branch, subjects" },
        { status: 400 }
      )
    }

    const result = await AITrainingService.generateTimetable(request)
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error("AI Timetable Schedule Error:", error)
    return Response.json(
      {
        error: "Failed to generate timetable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

