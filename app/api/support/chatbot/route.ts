import { generateText } from "ai"
import { chatModel } from "@/lib/openai-client"

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    if (!question || question.trim().length === 0) {
      return Response.json({ error: "Question is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: chatModel,
      system: `You are an AI assistant for the RCE College Career Portal. Your role is to help students with:
- Placement drive registration and eligibility
- Interview preparation tips and resources
- Resume building and optimization
- Assessment guidelines and test preparation
- Career guidance and company information
- Technical and soft skills development
- FAQ answers about the portal features

Be helpful, concise, and professional. If a question is outside your scope, politely redirect to contacting the admin at placement@college.edu.`,
      prompt: question,
      temperature: 0.7,
      maxTokens: 500,
    })

    return Response.json({
      answer: text,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Chatbot error:", error)

    return Response.json(
      {
        error: "Failed to process your question. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
