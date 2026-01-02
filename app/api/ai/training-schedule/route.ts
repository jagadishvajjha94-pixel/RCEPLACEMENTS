import { AITrainingService, type TrainingScheduleRequest } from "@/lib/ai-training-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const request: TrainingScheduleRequest = body

    // Validate required fields
    if (!request.title || !request.topic || !request.branch || !request.year || !request.duration) {
      return Response.json(
        { error: "Missing required fields: title, topic, branch, year, duration" },
        { status: 400 }
      )
    }

    const result = await AITrainingService.generateTrainingSchedule(request)
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error("AI Training Schedule Error:", error)
    return Response.json(
      {
        error: "Failed to generate training schedule",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

