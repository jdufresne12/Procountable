import "server-only"
import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { masteryChecks, redoItems } from "@/db/schema"

export async function requireUserId() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    return userId
}

const stepLabels = { learn: "learn", practice: "practice", check: "mastery check" } as const

/**
 * Retrieves and builds a PlanRecord object
 * 
 * @params {string} planID - ID of the plan to gather    
 * @returns {PlanRecord} All data relevant to a specific plan (sections, rule, start/end, etc.)                         
 */
export const getPlan = cache(async (planId: string) => {
    const userId = await requireUserId()
    const row = await db.query.plans.findFirst({
        where: { id: planId, userId },
        with: {
            sections: {
                orderBy: { number: "asc" },
                with: { masteryChecks: { orderBy: { takenOn: "desc" }, limit: 1 } },
            },
            redoItems: {
                where: { resolvedAt: { isNull: true } },
                orderBy: { nextReviewOn: "asc" },
                with: { section: { columns: { number: true } } },
            },
            scheduleEntries: {
                where: { done: false },
                orderBy: { date: "asc" },
                limit: 3,
                with: { section: { columns: { title: true } } },
            },
        },
    })
    if (!row) return undefined

    const { sections, scheduleEntries, redoItems, ...plan } = row
    return {
        ...plan,
        sections: sections.map(({ masteryChecks, ...section }) => ({
            ...section,
            mastery: masteryChecks[0] ?? null,
        })),
        upcoming: scheduleEntries.map((e) => ({
            id: e.id,
            date: e.date,
            minutes: e.minutes,
            label: e.section && e.step ? `${e.section.title}: ${stepLabels[e.step]}` : "Study session",
        })),
        redo: redoItems.map((r) => ({
            id: r.id,
            prompt: r.prompt,
            section: r.section?.number ?? null,
        })),
    }
})


/**
 * Retrieves all learning plans with an optional lifecyle filter
 * 
 * @params {enum: "active" | "paused" | "completed" } lifecyle - Optional lifecyle filter
 * @returns {Plan[]} An array of Plans
 */
export const getPlans = cache(async (lifecycle?: "active" | "paused" | "completed") => {
    const userId = await requireUserId()
    const rows = await db.query.plans.findMany({
        where: { userId, ...(lifecycle ? { lifecycle } : {}) },
        orderBy: { createdAt: "desc" },
        with: { sections: { columns: { number: true, title: true, status: true, currentStep: true } } },
    })
    return rows
})

// _____ Return Object Types _____
export type Plan = NonNullable<Awaited<ReturnType<typeof getPlan>>>
export type PlanSection = Plan["sections"][number]
export type MasteryResult = Pick<NonNullable<PlanSection["mastery"]>, "outcome" | "rubric" | "takenOn">

/* _____ NOTES _____
    cache(): called by both the page and generateMetadata? Only one query runs.
*/