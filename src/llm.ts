import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({
  model = 'gpt-4o-mini',
  messages,
  temperature = 0.1, // measurement of "creativity" or more likely the randomness/entropy
}: {
  messages: AIMessage[]
  temperature?: number
  model?: string
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: messages,
    temperature,
  })

  return response.choices[0].message.content
}
