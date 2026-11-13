import {
    boolean, date, index, integer, jsonb, pgEnum,
    snakeCase, text, timestamp, unique, uuid
} from "drizzle-orm/pg-core"

// _______ ENUMS _______
export const planColor = pgEnum("plan_color", ["violet", "sun", "coral"])
export const planLifecycle = pgEnum("plan_lifecycle", ["active", "paused", "completed"])
export const planSchedule = pgEnum("plan_schedule", ["on-track", "behind"])
export const sectionStatus = pgEnum("section_status", ["done", "current", "locked"])
export const sectionStep = pgEnum("section_step", ["learn", "practice", "check"])
export const masteryOutcome = pgEnum("mastery_outcome", ["pass", "pass-with-gaps", "retry"])

// Spread into any table that needs them
const timestamps = {
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow()
}

// _______ Plans _______
export const plans = snakeCase.table("plans",
    {
        id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
        userId: text().notNull(),   // Clerk generates user id
        name: text().notNull(),
        color: planColor().notNull().default("violet"),
        lifecycle: planLifecycle().notNull().default("active"),
        schedule: planSchedule().notNull().default("on-track"),
        daysBehind: integer().notNull().default(0),
        goal: text().notNull(),
        startDate: date({ mode: "string" }).notNull(),
        endDate: date({ mode: "string" }).notNull(),
        hoursPerWeek: integer().notNull(),
        pausedOn: date({ mode: "string" }),
        completedOn: date({ mode: "string" }),
        rules: jsonb()
            .$type<{ masteryCheck: boolean; reminderTime: string | null; allowSkipping: boolean }>()
            .notNull(),
        ...timestamps,
    },
    (t) => [index().on(t.userId)],
)

// ______ Sections ______
export const sections = snakeCase.table("sections",
    {
        id: uuid().primaryKey().defaultRandom(),
        planId: text().notNull().references(() => plans.id, { onDelete: "cascade" }),
        number: integer().notNull(),
        title: text().notNull(),
        summary: text().notNull(),
        week: integer().notNull(),
        minutes: integer().notNull(),
        status: sectionStatus().notNull().default("locked"),
        currentStep: sectionStep(),     // null except on the current section     
        objectives: jsonb().$type<string[]>().notNull().default([]),
        lesson: jsonb().$type<LessonBlock[]>(),
        resources: jsonb().$type<LessonResource[]>().notNull().default([]),
        quiz: jsonb().$type<QuizQuestion[]>().notNull().default([]),
        ...timestamps,
    },
    (t) => [unique().on(t.planId, t.number)],
)

// ______ Quiz Attempts ______
export const quizAttempts = snakeCase.table("quiz_attempts",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: text().notNull(),
        sectionId: uuid().notNull().references(() => sections.id, { onDelete: "cascade" }),
        questionId: text().notNull(),
        choiceId: text().notNull(),
        correct: boolean().notNull(),
        createdAt: timestamps.createdAt,
    },
    (t) => [index().on(t.sectionId, t.userId)],
)

// ______ Mastery Checks ______
export const masteryChecks = snakeCase.table("mastery_checks",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: text().notNull(),
        sectionId: uuid().notNull().references(() => sections.id, { onDelete: "cascade" }),
        outcome: masteryOutcome().notNull(),
        rubric: jsonb().$type<RubricItem[]>().notNull(),
        tranScript: jsonb().$type<{ role: "ai" | "user"; text: string }[]>(),
        takenOn: timestamp({ withTimezone: true }).notNull().defaultNow(),
    }
)

// ______ Redo Items ______
export const redoItems = snakeCase.table(
    "redo_items",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: text().notNull(),
        planId: text().notNull().references(() => plans.id, { onDelete: "cascade" }),
        sectionId: uuid().references(() => sections.id, { onDelete: "set null" }),
        concept: text().notNull(),
        prompt: text().notNull(),
        nextReviewOn: date({ mode: "string" }).notNull(),
        resolvedAt: timestamp({ withTimezone: true }),
        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [index().on(t.userId, t.nextReviewOn)],
)

// ______ Schedule Entries ______
export const scheduleEntries = snakeCase.table(
    "schedule_entries",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: text().notNull(),
        planId: text().notNull().references(() => plans.id, { onDelete: "cascade" }),
        sectionId: uuid().references(() => sections.id, { onDelete: "set null" }),
        date: date({ mode: "string" }).notNull(),
        minutes: integer().notNull(),
        done: boolean().notNull().default(false),
    },
    (t) => [index().on(t.userId, t.date)],
)

// ______ Inferred Types ______
export type PlanRow = typeof plans.$inferSelect     // shape a SELECT returns
export type NextPlanRow = typeof plans.$inferInsert // shape an INSERT returns
export type SectionRow = typeof sections.$inferSelect