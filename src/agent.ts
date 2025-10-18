import { APIError } from 'openai'
import { runLLM } from './llm'
import { addMessages, getMessages, saveToolResponse } from './memory'
import { runTool } from './toolRunner'
import { logMessage, showLoader } from './ui'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessages([{ role: 'user', content: userMessage }])
  const loader = showLoader('🤔 Thinking...\n')

  while (true) {
    const history = await getMessages()
    const response = await runLLM({ messages: history, tools })

    await addMessages([response])

    if (response.content) {
      loader.stop()
      logMessage(response)
      return getMessages()
    }

    if (response.tool_calls) {
      const toolCall = response.tool_calls[0]
      logMessage(response)
      loader.update(`executing: ${toolCall.function.name}`)
      try {
        const toolResponse = await runTool(toolCall, userMessage)
        await saveToolResponse(toolCall.id, toolResponse)
        loader.update(`executed: ${toolCall.function.name}`)
      } catch (error) {
        console.error(
          `\n❌ Error executing ${toolCall.function.name}:`,
          (error as Error).message
        )

        if (
          error instanceof APIError &&
          error.code === 'content_policy_violation'
        ) {
          const errorMessage =
            "I'm sorry, but I can't generate that image due to content policy restrictions. Please try a different prompt or request."
          await saveToolResponse(toolCall.id, errorMessage)
        } else {
          const errorMessage = `I encountered an error while executing ${
            toolCall.function.name
          }: ${(error as Error).message}`
          await saveToolResponse(toolCall.id, errorMessage)
        }
      }
    }
  }
}
