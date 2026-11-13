import "server-only"
import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"

export async function requireUserId() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")
    return userId
}

// cache(): called by both the page and generateMetadata? Only one query runs.
export const getPlanRecord = cache(async (planId: string) => {
    const userId = await requireUserId()
    return db.query.plans.findFirst({
        where: { id: planId, userId },
        with: {
            sections: {
                orderBy: { number: "asc" },
                with: { masteryChecks: { orderBy: { takenOn: "desc" }, limit: 1 } },
            },
            redoItems: { where: { resolvedAt: { isNull: true } } },
        },
    })
})

export const getPlans = cache(async (lifecycle?: "active" | "paused" | "completed") => {
    const userId = await requireUserId()
    return db.query.plans.findMany({
        where: { userId, ...(lifecycle ? { lifecycle } : {}) },
        orderBy: { createdAt: "desc" },
        with: { sections: { columns: { number: true, title: true, status: true, currentStep: true } } },
    })
})