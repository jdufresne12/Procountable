import "server-only"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { relations } from "./relations"

const globalForDB = globalThis as unknown as { pg?: ReturnType<typeof postgres> }

// Reuse one pool across hot reloads in dev, or you'll run out of connections
const client = globalForDB.pg ?? postgres(process.env.DATABASE_URL!, { prepare: false })
if (process.env.NODE_ENV !== "production") globalForDB.pg = client

export const db = drizzle({ client, relations, logger: true })
export type DB = typeof db