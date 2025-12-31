import { createOpenAI } from "@ai-sdk/openai"

// Initialize OpenAI model with environment variable
// Falls back to gpt-4-turbo if variable is not set
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn("[v0] OPENAI_API_KEY is not set. AI features will not work.")
}

const openai = createOpenAI({
  apiKey,
})

// Export the model for use in API routes and server actions
export const model = openai("gpt-4-turbo")

export const chatModel = openai("gpt-4-turbo")

// Lighter model for simple tasks
export const fastModel = openai("gpt-3.5-turbo")