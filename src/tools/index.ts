import { generateImageToolDefinition } from './generateImage'
import { redditToolDefinition } from './reddit'
import { dadJokeToolDefinition } from './dadJokes'

export * from './dadJokes'
export * from './reddit'
export * from './generateImage'

export const tools = {
  generateImageToolDefinition,
  redditToolDefinition,
  dadJokeToolDefinition,
}
