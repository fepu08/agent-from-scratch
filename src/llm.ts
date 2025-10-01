import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({
  model = 'gpt-4o-mini',
  message,
  temperature = 0.1, // measurement of "creativity" or more likely the randomness/entropy
}: {
  message: string
  temperature?: number
  model?: string
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: message }],
    temperature,
  })

  return response.choices[0].message.content
}
