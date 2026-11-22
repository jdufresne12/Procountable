import "server-only"
import { cache } from "react"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { sections } from "@/db/schema"
import { requireUserId } from "./auth"

const nextStep = { learn: "practice", practice: "check" } as const

/**
 * Full content for ONE section (lesson, quiz, resources, latest mastery result).
 * Returns undefined for locked sections, so locked content never leaves the server.
 *
 * @param {string} planId - ID of the Plan the section belongs to
 * @param {number} number - The section's number within the plan (1-based)
 */
export const getSection = cache(async (planId: string, number: number) => {
    const userId = await requireUserId()
    const plan = await db.query.plans.findFirst({
        where: { id: planId, userId },
        columns: { id: true },
        with: {
            sections: {
                where: { number },
                limit: 1,
                with: {
                    masteryChecks: {
                        orderBy: { takenOn: "desc" },
                        limit: 1,
                        columns: { outcome: true, rubric: true, takenOn: true }, // no transcript/userId
                    },
                },
            },
        },
    })

    const section = plan?.sections[0]
    if (!section || section.status === "locked") return undefined

    const { masteryChecks, ...rest } = section
    return { ...rest, mastery: masteryChecks[0] ?? null }
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
        const plan = await tx.query.plans.findFirst({
            where: { id: planId, userId },
            columns: { id: true },
            with: {
                sections: {
                    where: { number },
                    limit: 1,
                    columns: { id: true, status: true, currentStep: true }, // only what's checked
                },
            },
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

        await tx.update(sections)
            .set({ status: "done", currentStep: null })
            .where(eq(sections.id, section.id))
        await tx.update(sections)
            .set({ status: "current", currentStep: "learn" })
            .where(and(eq(sections.planId, planId), eq(sections.number, number + 1)))
        return { finishedSection: true }
    })
}

// _____ TYPES _____
export type SectionContent = NonNullable<Awaited<ReturnType<typeof getSection>>>
export type MasteryResult = NonNullable<SectionContent["mastery"]>