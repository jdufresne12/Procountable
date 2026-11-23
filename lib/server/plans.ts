import "server-only"
import { cache } from "react"
import { db } from "@/db"
import { requireUserId } from "./auth"
import { stepLabels, scheduleLabel } from "@/lib/helpers"

/**
 * Plan fields + a light list of every section (no lesson content).
 * Shared by the plan page, the section page, and generateMetadata.
 *
 * @param {string} planId - ID of the plan
 * @returns {PlanSummary} The plan with light sections, or undefined if missing / not the user's
 */
export const getPlanSummary = cache(async (planId: string) => {
    const userId = await requireUserId()
    const row = await db.query.plans.findFirst({
        where: { id: planId, userId },
        with: {
            sections: {
                orderBy: { number: "asc" },
                columns: { lesson: false, quiz: false, resources: false },
                with: {
                    masteryChecks: {
                        orderBy: { takenOn: "desc" },
                        limit: 1,
                        columns: { outcome: true, takenOn: true }
                    },
                }
            },
        },
    })
    if (!row) return undefined

    return {
        ...row,
        sections: row.sections.map(({ masteryChecks, ...section }) => ({
            ...section,
            mastery: masteryChecks[0] ?? null
        }))
    }
})

/**
 * Plan page sidebar data: open redo items and the next few scheduled sessions.
 *
 * @param {string} planId - ID of the plan
 * @returns {PlanActivity}
 */
export const getPlanActivity = cache(async (planId: string) => {
    const userId = await requireUserId()
    const row = await db.query.plans.findFirst({
        where: { id: planId, userId },
        columns: { id: true },
        with: {
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
    if (!row) return { upcoming: [], redo: [] }

    return {
        upcoming: row.scheduleEntries.map((e) => ({
            id: e.id,
            date: e.date,
            minutes: e.minutes,
            label: e.section && e.step ? `${e.section.title}: ${stepLabels[e.step]}` : "Study session",
        })),
        redo: row.redoItems.map((r) => ({
            id: r.id,
            prompt: r.prompt,
            section: r.section?.number ?? null,
        })),
    }
})


/**
 * All of the user's plans (shaped for plan cards on /your-plans).
 *
 * @returns {PlanListItem[]}
 */
export const getPlans = cache(async () => {
    const userId = await requireUserId()
    const rows = await db.query.plans.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        with: {
            sections: {
                orderBy: { number: "asc" },
                columns: { number: true, title: true, status: true, currentStep: true },
                with: {
                    masteryChecks: { orderBy: { takenOn: "desc" }, limit: 1, columns: { outcome: true } },
                },
            },
            redoItems: { where: { resolvedAt: { isNull: true } }, columns: { id: true } },
            scheduleEntries: {
                where: { done: false },
                orderBy: { date: "asc" },
                limit: 1,
                with: { section: { columns: { title: true } } },
            },
        },
    })

    return rows.map(({ sections, redoItems, scheduleEntries, ...plan }) => {
        const next = scheduleEntries[0]
        return {
            ...plan,
            sections: sections.map(({ masteryChecks, ...s }) => ({ ...s, mastery: masteryChecks[0] ?? null })),
            redoCount: redoItems.length,
            next: next ? { date: next.date, label: scheduleLabel(next) } : null,
        }
    })
})

/**
 * Users plans formatted for the Navbar.
 * Utilizes the getPlans() DAL to avoid unnecessary calls to the DB (cache)
 * 
 * @returns {NavPlan[]}
 */
export const getNavPlans = cache(async () => {
    const plans = await getPlans()
    return plans.map(({ id, name, color, sections, lifecycle }) => ({
        id,
        name,
        color,
        lifecycle,
        sections: sections.map(({ number, title, status }) => ({
            number,
            title,
            status
        })),
    }))
})

// _____ TYPES _____
export type PlanSummary = NonNullable<Awaited<ReturnType<typeof getPlanSummary>>>
export type PlanSection = PlanSummary["sections"][number]
export type PlanActivity = Awaited<ReturnType<typeof getPlanActivity>>
export type PlanListItem = Awaited<ReturnType<typeof getPlans>>[number]
export type NavPlan = Awaited<ReturnType<typeof getNavPlans>>