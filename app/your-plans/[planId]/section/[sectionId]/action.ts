"use server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { advanceStep } from "@/lib/server/sections"

const input = z.object({
    planId: z.string().min(1),
    number: z.number().int().positive()
})

export async function finishStepAction(raw: unknown) {
    const { planId, number } = input.parse(raw)
    const result = await advanceStep(planId, number)
    revalidatePath(`/your-plans/${planId}`)
    return result
}