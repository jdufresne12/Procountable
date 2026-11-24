import { z } from "zod"

// Field order matters: the AI asks about missing fields in this order,
// and the chips under the chat follow the same order.
export const intakeSchema = z.object({
    goal: z.string().min(3).describe("What they want to learn, in their words"),
    doneLooksLike: z.string().min(3).describe("What they want to be able to do at the end"),
    level: z.enum(["new", "some", "comfortable"]).describe("Their current level with the topic"),
    hoursPerWeek: z.number().int().min(1).max(40).describe("Hours they can study per week"),
    studyDays: z
        .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
        .min(1)
        .describe("Days of the week they study"),
    weeks: z.number().int().min(1).max(26).describe("How many weeks the plan lasts"),
})

export type Intake = z.infer<typeof intakeSchema>

// The tool accepts any subset: the user rarely gives everything at once
export const intakeUpdateSchema = intakeSchema.partial()

export const intakeFields = Object.keys(intakeSchema.shape) as (keyof Intake)[]

export function missingIntakeFields(intake: Partial<Intake>) {
    return intakeFields.filter((field) => intake[field] === undefined)
}