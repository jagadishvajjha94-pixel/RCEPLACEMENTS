import { AITrainingService } from "@/lib/ai-training-service"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const branch = searchParams.get("branch")
    const year = searchParams.get("year")

    if (!branch || !year) {
      return Response.json(
        { error: "Missing required parameters: branch, year" },
        { status: 400 }
      )
    }

    const recommendations = await AITrainingService.getTrainingRecommendations(branch, year)
    return Response.json({ success: true, data: recommendations })
  } catch (error) {
    console.error("AI Training Recommendations Error:", error)
    return Response.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

