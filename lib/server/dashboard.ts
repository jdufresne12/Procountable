import "server-only"
import { cache } from "react"
import { db } from "@/db"
import { requireUserId } from "./auth"
import { getCurrentWeek } from "../dates"
import { check } from "drizzle-orm/sqlite-core/checks"

/**
 * TODAY'S SESSIONS
 */

/**
 * STATS
 * 
 * @returns
 */
export const getStats = cache(async () => {
    const userId = await requireUserId()

    const currentWeek = getCurrentWeek()
    const monday = `${currentWeek[0].year}-${currentWeek[0].monthNumber}-${currentWeek[0].dayNumber}`
    const sunday = `${currentWeek[6].year}-${currentWeek[6].monthNumber}-${currentWeek[6].dayNumber}`

    const rows = await db.query.plans.findMany({
        where: { userId, lifecycle: "active" },
        columns: { id: true, schedule: true },
        with: {
            sections: {
                columns: { id: true },
                with: {
                    masteryChecks: {
                        columns: { id: true, outcome: true }
                    }
                }
            },
            scheduleEntries: {
                where: { done: false, date: { gte: monday, lte: sunday } },
                columns: { id: true, date: true },
                orderBy: { date: "desc" }
            },
            redoItems: {
                where: { resolvedAt: { isNull: true } },
                columns: { id: true },
            }
        },
    })

    let redoCount = 0, acrossCount = 0
    let taskCount = 0, plansBehind = 0
    let checksPassed = 0, checksTotal = 0, checksWithGaps = 0

    rows.forEach((plan) => {
        if (plan.redoItems.length > 0) {
            redoCount += plan.redoItems.length
            acrossCount++
        }
        taskCount += plan.scheduleEntries.length
        plan.schedule === "behind" && plansBehind++
        plan.sections.forEach((section) => {
            if (section.masteryChecks.length > 0) {
                section.masteryChecks[0].outcome != "retry" && checksPassed++
                section.masteryChecks[0].outcome != "pass-with-gaps" && checksWithGaps++
                checksTotal++
            }
        })
    })

    return [
        {
            label: "Redo Queue",
            value: redoCount,
            hint: `Across ${acrossCount} plan${acrossCount > 1 && "s"}`,
            tone: "sun"
        },
        {
            label: "Tasks left this week",
            value: taskCount,
            hint: plansBehind > 0
                ? `${plansBehind} plan${plansBehind > 1 ? "s are" : " is"} behind`
                : "Your on track"
            ,
            tone: "coral"
        },
        {
            label: "Mastery Checks passed",
            value: `${checksPassed}/${checksTotal}`,
            hint: checksWithGaps > 0
                ? `${checksWithGaps} passed with gaps`
                : "Great Work",
            tone: "mint"
        }
    ] as Stat[]
})

/**
 * CALENDER
 */