"use server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireUserId } from "@/lib/server/plans"
import { advanceStep } from "@/lib/server/sections"

const input = z.object({
    planId: z.string().min(1),
    number: z.number().int().positive()
})

export async function finishStepAction(raw: unknown) {
    const userId = await requireUserId()                        // 1. who is this
    const { planId, number } = input.parse(raw)                 // 2. is the input sane
    const result = await advanceStep(userId, planId, number)    // 3. owns it + do it
    revalidatePath(`/your-plans/${planId}`)
    return result
}