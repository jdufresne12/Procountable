import postgres from "postgres"
import { loadEnvConfig } from "@next/env"
import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import { planRecords } from "../lib/mock-data"
import { masteryChecks, plans, redoItems, scheduleEntries, sections } from "./schema"
import { relations } from "./relations"

loadEnvConfig(process.cwd())

const userId = process.env.SEED_USER_ID
if (!userId) throw new Error("Set SEED_USER_ID to your Clerk user id (user_...)")

// Own client: db/index.ts imports "server-only", which throws outside Next
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
const db = drizzle({ client, relations })

async function main() {
    await db.transaction(async (tx) => {
        // Re-runnable: wipe this user's plans (cascade clears sections, checks, etc.)
        await tx.delete(plans).where(eq(plans.userId, userId!))

        for (const record of planRecords) {
            // Pull out everything that isn't a column on `plans`
            const { sections: sectionList, upcoming, redo, ...plan } = record
            await tx.insert(plans).values({ ...plan, userId: userId! })

            // section number -> new section id, so redo/schedule rows can point at sections
            const sectionIds = new Map<number, string>()

            for (const s of sectionList) {
                const { mastery, ...section } = s
                const [row] = await tx
                    .insert(sections)
                    .values({ ...section, planId: record.id })
                    .returning({ id: sections.id })
                sectionIds.set(s.number, row.id)

                if (mastery) {
                    await tx.insert(masteryChecks).values({
                        userId: userId!,
                        sectionId: row.id,
                        outcome: mastery.outcome,
                        rubric: mastery.rubric,
                        takenOn: new Date(mastery.takenOn),
                    })
                }
            }

            if (redo.length > 0) {
                await tx.insert(redoItems).values(
                    redo.map((r) => ({
                        userId: userId!,
                        planId: record.id,
                        sectionId: sectionIds.get(r.section) ?? null,
                        concept: sectionList.find((s) => s.number === r.section)?.title ?? "General",
                        prompt: r.prompt,
                        nextReviewOn: new Date().toISOString().slice(0, 10), // due today
                    })),
                )
            }

            if (upcoming.length > 0) {
                await tx.insert(scheduleEntries).values(
                    upcoming.map((u) => ({
                        userId: userId!,
                        planId: record.id,
                        sectionId: sectionIds.get(u.section) ?? null,
                        step: u.step,
                        date: u.date,
                        minutes: u.minutes,
                    })),
                )
            }
        }
    })
    console.log(`Seeded ${planRecords.length} plans for ${userId}`)
}

main().finally(() => client.end())