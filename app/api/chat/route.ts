import { z } from "zod"
import {
    streamText,
    convertToModelMessages,
    createUIMessageStreamResponse,
    toUIMessageStream,
    validateUIMessages,
    createIdGenerator,
    isStepCount,
    type UIMessage,
} from "ai"
import { createIntakeTools } from "@/lib/ai/intake-tools"
import { missingIntakeFields } from "@/lib/ai/intake"
import { intakeSystemPrompt } from "@/lib/ai/prompts/intake"
import { requireUserId } from "@/lib/server/auth"
import { getDraft, saveDraftMessages } from "@/lib/server/drafts"
import { models } from "@/lib/ai/models"

const bodySchema = z.object({
    id: z.uuid(),
    message: z.custom<UIMessage>()
})

export async function POST(req: Request) {
    const userId = await requireUserId()

    // Check the request's shape before touching the database
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) return new Response("Bad request", { status: 400 })
    const { id, message } = parsed.data

    // Load the draft
    const draft = await getDraft(id)
    if (!draft) return new Response("Not found", { status: 404 })

    const tools = createIntakeTools(userId, id)
    const messages = await validateUIMessages({
        messages: [...draft.messages, message],
        tools,
    })

    const result = streamText({
        model: models.planner,
        system: intakeSystemPrompt(draft.intake, missingIntakeFields(draft.intake)),
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: isStepCount(5)
    })

    // Keep generating even if the user closes the tab, so the reply still gets saved
    result.consumeStream()

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({
            stream: result.stream,
            originalMessages: messages,
            generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
            onEnd: async ({ messages }) => {
                await saveDraftMessages(userId, id, messages)
            },
        }),
    })
}