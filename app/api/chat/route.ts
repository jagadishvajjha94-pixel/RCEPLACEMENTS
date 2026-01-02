import { generateFreeText } from "@/lib/free-ai-client"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const text = await generateFreeText({
      prompt: message,
      system: "You are a helpful assistant for the College Career Portal.",
      model: "chat",
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { error: "Failed to generate response", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
