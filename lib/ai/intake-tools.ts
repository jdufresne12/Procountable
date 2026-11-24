import "server-only"
import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai"
import { intakeUpdateSchema, missingIntakeFields } from "@/lib/ai/intake"
import { mergeDraftIntake } from "@/lib/server/drafts"

export function createIntakeTools(userId: string, draftId: string) {
    return {
        updateIntake: tool({
            description:
                "Save plan details the user just told you. Include only the fields they gave. " +
                "Call it every time they share any detail, even mid-conversation.",
            inputSchema: intakeUpdateSchema,
            execute: async (patch) => {
                const intake = await mergeDraftIntake(userId, draftId, patch)
                return { intake, missing: missingIntakeFields(intake) }
            },
        }),
    }
}

export type IntakeUIMessage = UIMessage<unknown, UIDataTypes, InferUITools<ReturnType<typeof createIntakeTools>>>