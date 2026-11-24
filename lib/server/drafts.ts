import "server-only"
import { cache } from "react"
import { and, eq, sql } from "drizzle-orm"
import type { UIMessage } from "ai"
import { db } from "@/db"
import { planDrafts } from "@/db/schema"
import { requireUserId } from "./auth"
import { Intake } from "../ai/intake"

export const createDraft = async () => {
    const userId = await requireUserId()
    const [row] = await db
        .insert(planDrafts)
        .values({ userId })
        .returning({ id: planDrafts.id })
    return row.id
}

export const getDraft = cache(async (draftId: string) => {
    const userId = await requireUserId()
    const row = await db.query.planDrafts.findFirst({
        where: { id: draftId, userId }
    })

    return row
})

export const saveDraftMessages = async (userId: string, draftId: string, messages: UIMessage[]) => {
    await db
        .update(planDrafts)
        .set({ messages })
        .where(
            and(
                eq(planDrafts.id, draftId),
                eq(planDrafts.userId, userId)
            )
        )
}

export const mergeDraftIntake = async (userId: string, draftId: string, patch: Partial<Intake>) => {
    const [row] = await db
        .update(planDrafts)
        // Postgres jsonb merge: existing intake || new fields
        .set({ intake: sql`${planDrafts.intake} || ${JSON.stringify(patch)}::text::jsonb` })
        .where(
            and(
                eq(planDrafts.id, draftId),
                eq(planDrafts.userId, userId),
            )
        )
        .returning({ intake: planDrafts.intake })

    if (!row) throw new Error("Draft not found")
    return row.intake
}