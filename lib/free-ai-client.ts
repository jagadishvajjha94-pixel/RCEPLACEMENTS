// Free AI Client using Hugging Face Inference API and Google Gemini
// No API keys required for basic usage with Hugging Face public models

/**
 * Free AI Client - Uses Hugging Face Inference API (completely free)
 * Falls back to Google Gemini free tier if needed
 */

// Hugging Face Inference API - Free, no API key needed for public models
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models"

// Available free models (no API key required)
const FREE_MODELS = {
  // Chat models
  chat: "microsoft/DialoGPT-large", // Good for conversational AI
  chat2: "facebook/blenderbot-400M-distill", // Better for longer conversations
  chat3: "google/flan-t5-large", // Good for Q&A
  
  // Text generation
  text: "gpt2", // Fast and free
  text2: "distilgpt2", // Lighter version
  
  // Best for our use case - instruction following
  instruction: "google/flan-t5-xxl", // Good for following instructions
  instruction2: "bigscience/bloom-560m", // Alternative
}

/**
 * Call Hugging Face Inference API (Free)
 */
async function callHuggingFace(model: string, inputs: string, systemPrompt?: string): Promise<string> {
  try {
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${inputs}\nAssistant:`
      : inputs

    const response = await fetch(`${HUGGINGFACE_API_URL}/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Hugging Face API error: ${error}`)
    }

    const data = await response.json()
    
    // Handle different response formats
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim()
    }
    if (data.generated_text) {
      return data.generated_text.trim()
    }
    if (typeof data === 'string') {
      return data.trim()
    }
    
    // Fallback: try to extract text from response
    const text = JSON.stringify(data)
    return text.substring(0, 500) // Limit response length
  } catch (error) {
    console.error("Hugging Face API error:", error)
    throw error
  }
}

/**
 * Call Google Gemini Free API (requires API key but free tier)
 */
async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error("Google Gemini API key not set. Using Hugging Face fallback.")
  }

  try {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || "No response generated"
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}

/**
 * Generate text using free AI (Hugging Face with Gemini fallback)
 */
export async function generateFreeText(options: {
  prompt: string
  system?: string
  model?: "chat" | "instruction" | "text"
}): Promise<string> {
  const { prompt, system, model = "instruction" } = options

  try {
    // Try Hugging Face first (completely free, no API key needed)
    const huggingFaceModel = FREE_MODELS[model] || FREE_MODELS.instruction
    return await callHuggingFace(huggingFaceModel, prompt, system)
  } catch (error) {
    console.warn("Hugging Face failed, trying Gemini fallback:", error)
    
    try {
      // Fallback to Gemini if available
      return await callGemini(prompt, system)
    } catch (geminiError) {
      console.error("All AI services failed:", geminiError)
      
      // Final fallback: return a helpful response
      return `I'm a free AI assistant for the RCE College Career Portal. I can help you with:
- Placement drive information and registration
- Interview preparation tips
- Resume building guidance
- Career advice
- Portal navigation help

For your question: "${prompt.substring(0, 100)}..."

Please note: The AI service is currently using free models. For more detailed responses, you can contact the admin at placement@college.edu.`
    }
  }
}

/**
 * Chat model interface (compatible with AI SDK)
 */
export const freeChatModel = {
  provider: "free-ai",
  modelId: "huggingface-chat",
  
  async doGenerate(options: any) {
    const prompt = options.prompt || options.messages?.[options.messages.length - 1]?.content || ""
    const system = options.system || options.messages?.find((m: any) => m.role === "system")?.content

    const text = await generateFreeText({
      prompt: typeof prompt === 'string' ? prompt : prompt.toString(),
      system: system,
      model: "chat",
    })

    return {
      text,
      finishReason: "stop" as const,
      usage: {
        promptTokens: prompt.length / 4, // Rough estimate
        completionTokens: text.length / 4,
      },
    }
  },
}

/**
 * Main model interface (compatible with AI SDK)
 */
export const freeModel = {
  provider: "free-ai",
  modelId: "huggingface-instruction",
  
  async doGenerate(options: any) {
    const prompt = options.prompt || options.messages?.[options.messages.length - 1]?.content || ""
    const system = options.system || options.messages?.find((m: any) => m.role === "system")?.content

    const text = await generateFreeText({
      prompt: typeof prompt === 'string' ? prompt : prompt.toString(),
      system: system,
      model: "instruction",
    })

    return {
      text,
      finishReason: "stop" as const,
      usage: {
        promptTokens: prompt.length / 4,
        completionTokens: text.length / 4,
      },
    }
  },
}

