import { auto } from 'openai/_shims/registry.mjs'
import type { AIMessage } from '../types'
import { openai } from './ai'
import { zodFunction } from 'openai/helpers/zod'
import type z from 'zod'

export const runLLM = async ({
  model = 'gpt-4o-mini',
  messages,
  tools,
  temperature = 0.1, // measurement of "creativity" or more likely the randomness/entropy
}: {
  messages: AIMessage[]
  temperature?: number
  tools?: { name: string; parameters: z.AnyZodObject }[]
  model?: string
}) => {
  const formattedTools = tools?.map(zodFunction)
  const response = await openai.chat.completions.create({
    model,
    messages: messages,
    temperature,
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false,
  })

  return response.choices[0].message
}
