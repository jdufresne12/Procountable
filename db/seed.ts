import postgres from "postgres"
import { loadEnvConfig } from "@next/env"
import { drizzle } from "drizzle-orm/postgres-js"
import { eq } from "drizzle-orm"
import { planRecords } from "../lib/mock-data"
import { masteryChecks, plans, sections } from "./schema"
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
            const { sections: sectionList, ...plan } = record
            await tx.insert(plans).values({ ...plan, userId: userId! })

            for (const s of sectionList) {
                const { mastery, ...section } = s
                const [row] = await tx
                    .insert(sections)
                    .values({ ...section, planId: record.id })
                    .returning({ id: sections.id })

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
        }
    })
    console.log(`Seeded ${planRecords.length} plans for ${userId}`)
}

main().finally(() => client.end())