import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
    plans: {
        sections: r.many.sections(),
        redoItems: r.many.redoItems(),
        scheduleEntries: r.many.scheduleEntries(),
    },
    sections: {
        plan: r.one.plans({ from: r.sections.planId, to: r.plans.id, optional: false }),
        quizAttempts: r.many.quizAttempts(),
        masteryChecks: r.many.masteryChecks(),
    },
    quizAttempts: {
        section: r.one.sections({ from: r.quizAttempts.sectionId, to: r.sections.id, optional: false }),
    },
    masteryChecks: {
        section: r.one.sections({ from: r.masteryChecks.sectionId, to: r.sections.id, optional: false }),
    },
    redoItems: {
        plan: r.one.plans({ from: r.redoItems.planId, to: r.plans.id, optional: false }),
        section: r.one.sections({ from: r.redoItems.sectionId, to: r.sections.id }),
    },
    scheduleEntries: {
        plan: r.one.plans({ from: r.scheduleEntries.planId, to: r.plans.id, optional: false }),
        section: r.one.sections({ from: r.scheduleEntries.sectionId, to: r.sections.id }),
    },
}))