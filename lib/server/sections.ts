import "server-only"
import { cache } from "react"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { sections } from "@/db/schema"
import { requireUserId } from "./plans"

const nextStep = { learn: "practice", practice: "check" } as const

/**
 * Retrieves all data for a section
 * 
 * @param {string} planId - ID of Plan the Section belongs to
 * @param {string} sectionId  - ID of Section
 */
export const getSection = cache(async (planId: string, sectionId: string) => {

})

/**
 * Moves a section to its next step (learn → practice → check). When the
 * mastery check step finishes, marks the section done and unlocks the next one.
 *
 * Runs in a transaction, so a section is never left half-updated. Ownership is
 * checked by loading the plan with both `planId` and `userId`: another user's
 * plan looks the same as a missing one.
 *
 * @param {string} planId - ID of the Plan the section belongs to.
 * @param {number} number - The Section's number within the Plan (1-based), not its database id.
 * @returns {Promise<{ finishedSection: boolean }>} `finishedSection` is true when the
 *   check step was completed and the next section was unlocked, false when the
 *   section only moved to its next step.
 * @throws {Error} "Section not available" if the plan or section doesn't exist,
 *   isn't owned by the user, or the section isn't the current one.
 */
export async function advanceStep(planId: string, number: number) {
    const userId = await requireUserId()
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