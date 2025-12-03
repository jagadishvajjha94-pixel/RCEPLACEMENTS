import { generateText } from "ai"
import { model } from "@/lib/openai-client"

export async function POST(req: Request) {
  const { message } = await req.json()

  const { text } = await generateText({
    model,
    prompt: message,
    system: "You are a helpful assistant for the College Career Portal.",
  })

  return Response.json({ response: text })
}
