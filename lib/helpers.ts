
import type { PlanSection } from "./server/plans"

// ============================================================================
// Styling & Display Constants
// ============================================================================

/** Tailwind color classes for each plan status. */
export const badgeTones = {
    "on-track": "bg-mint-soft text-mint-ink",
    behind: "bg-coral-soft text-coral-ink",
    paused: "bg-slate-100 text-slate-700",
    completed: "bg-brand-soft text-brand-ink",
} as const

// ============================================================================
// Lesson Steps
// ============================================================================

/** The order in which a section's lesson steps are completed. */
export const stepOrder: LessonStep[] = ["learn", "practice", "check"]

/** Human-readable labels for each lesson step. */
export const stepLabels = {
    learn: "learn",
    practice: "practice",
    check: "mastery check",
} as const

/** Fraction of a section completed when the given step is current. */
const stepFraction = {
    learn: 0,
    practice: 1 / 3,
    check: 2 / 3,
} as const

/**
 * Generates a display label for a scheduled study session.
 *
 * @param entry - Schedule entry containing a step and section.
 * @returns A descriptive label or a default "Study session" label.
 */
export function scheduleLabel(entry: {
    step: keyof typeof stepLabels | null
    section: { title: string } | null
}): string {
    const { step, section } = entry

    return section && step
        ? `${section.title}: ${stepLabels[step]}`
        : "Study session"
}

/**
 * Returns the lesson steps for a section with their current states.
 *
 * - Done sections: all steps are complete.
 * - Locked sections: all steps are locked.
 * - Current sections: previous steps are done, the active step is
 *   current, and remaining steps are locked.
 *
 * @param section - The section to evaluate.
 * @returns Ordered lesson steps with labels and states.
 */
export function getSectionSteps(
    section: PlanSection
): { step: LessonStep; label: string; state: StepState }[] {
    const currentIndex = stepOrder.indexOf(section.currentStep ?? "learn")

    return stepOrder.map((step, index) => {
        let state: StepState

        if (section.status === "done") {
            state = "done"
        } else if (section.status === "locked") {
            state = "locked"
        } else {
            state =
                index < currentIndex
                    ? "done"
                    : index === currentIndex
                        ? "current"
                        : "locked"
        }

        return {
            step,
            label: stepLabels[step],
            state,
        }
    })
}

// ============================================================================
// Navigation Helpers
// ============================================================================

/** Returns the URL for a plan's overview page. */
export const planHref = (planId: string): string =>
    `/your-plans/${planId}`

/** Returns the URL for a specific section within a plan. */
export const lessonHref = (
    planId: string,
    sectionNumber: number
): string =>
    `/your-plans/${planId}/section/${sectionNumber}`


// ============================================================================
// Plan Progress
// ============================================================================

/** Minimum section data required to calculate plan progress. */
type ProgressSection = {
    title: string
    number: number
    status: "locked" | "current" | "done"
    currentStep: keyof typeof stepFraction | null
}

/**
 * Calculates a plan's overall progress based on completed sections
 * and partial progress within the current section.
 *
 * Each section contributes equally to the total percentage.
 * Within an active section:
 * - Learn:    0%
 * - Practice: 33.3%
 * - Check:    66.7%
 *
 * @param sections - The plan's sections and their current states.
 * @returns Progress totals, current section, and completion percentage.
 */
export function planProgress(sections: ProgressSection[]) {
    const total = sections.length
    const done = sections.filter((section) => section.status === "done").length
    const current = sections.find((section) => section.status === "current")

    const partial = current?.currentStep
        ? stepFraction[current.currentStep]
        : 0

    const percent = total
        ? Math.trunc(((done + partial) / total) * 100)
        : 0

    return {
        total,
        done,
        current,
        currentNumber: current?.number ?? total,
        percent,
    }
}