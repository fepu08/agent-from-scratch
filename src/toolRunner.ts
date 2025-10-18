import type OpenAI from 'openai'
import { dadJoke, generateImage, reddit, tools } from './tools'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments),
  }
  switch (toolCall.function.name) {
    case tools.generateImageToolDefinition.name:
      return generateImage(input)
    case tools.redditToolDefinition.name:
      return reddit(input)
    case tools.dadJokeToolDefinition.name:
      return dadJoke(input)
    default:
      return `Never run this tool: ${toolCall.function.name} again, or else`
  }
}
