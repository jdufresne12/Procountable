import "server-only"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { plans, sections } from "@/db/schema"

const nextStep = { learn: "practice", practice: "check" } as const

export async function advanceStep(userId: string, planId: string, number: number) {
    return db.transaction(async (tx) => {
        // Check that the plan belongs to the user
        const plan = await tx.query.plans.findFirst({
            where: { id: planId, userId },
            with: { sections: { where: { number }, limit: 1 } },
        })

        const section = plan?.sections[0]
        if (!section || section.status !== "current" || !section.currentStep)
            throw new Error("Section not available")

        if (section.currentStep !== "check") {
            await tx.update(sections)
                .set({ currentStep: nextStep[section.currentStep] })
                .where(eq(sections.id, section.id))
            return { finishedSection: false }
        }

        // Finished section -> Close and open next 
        await tx.update(sections)
            .set({ status: "done", currentStep: null })
            .where(eq(sections.id, section.id))
        await tx.update(sections)
            .set({ status: "current", currentStep: "learn" })
            .where(and(eq(sections.planId, planId), eq(sections.number, number + 1)))
        return { finishedSection: true }
    })
}