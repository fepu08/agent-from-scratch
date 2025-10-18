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

  let history = await getMessages()
  let response = await runLLM({ messages: history, tools })

  await addMessages([response])

  logMessage(response)

  if (response.tool_calls) {
    const toolCall = response.tool_calls[0]
    loader.update(`executing: ${toolCall.function.name}`)

    const toolResponse = await runTool(toolCall, userMessage)
    await saveToolResponse(toolCall.id, toolResponse)

    loader.update(`executed: ${toolCall.function.name}`)

    loader.update('⚙️  Processing results...')
    history = await getMessages()
    response = await runLLM({ messages: history, tools })

    await addMessages([response])
    logMessage(response)
  }

  loader.stop()
  return getMessages()
}
