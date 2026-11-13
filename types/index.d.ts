type PlanColor = "violet" | "sun" | "coral"
type PlanStatus = "on-track" | "behind"
type PlanLifecycle = "active" | "paused" | "completed"
type StepState = "done" | "current" | "locked"
type LessonStep = "learn" | "practice" | "check"
type MasteryLevel = "strong" | "solid" | "gap"
type MasteryOutcome = "pass" | "pass-with-gaps" | "retry"

type NavNode = {
    title: string
    href: string
    icon?: import("lucide-react").LucideIcon // top-level items
    dotClass?: string // plans: their color
    status?: StepState // sections
    children?: NavNode[]
}

// ---------------------------------------------------------------------------
// Plan summary: what lists and cards need. Derived from a PlanRecord.

type Plan = {
    id: string
    name: string
    color: PlanColor
    lifecycle: PlanLifecycle
    progress: number // 0–100
    currentSection: number
    totalSections: number
    status: PlanStatus
    statusLabel: string
    href: string
}

// ---------------------------------------------------------------------------
// Full plan: roughly what the database will hold.

type LessonBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "code"; language: string; code: string }
    | { type: "tip"; title: string; text: string }

type LessonResource = {
    kind: "video" | "article" | "practice" | "docs"
    title: string
    meta: string // "14 min", "Easy · LeetCode", …
    url: string
}

type QuizQuestion = {
    id: string
    concept: string
    prompt: string
    options: { id: string; text: string }[]
    answerId: string
    explanation: string
}

type ChatMessage = { from: "ai" | "you"; text: string }

type RubricItem = { objective: string; level: MasteryLevel; note: string }

type MasteryResult = {
    outcome: MasteryOutcome
    takenOn: string // ISO date
    rubric: RubricItem[]
    transcript?: ChatMessage[]
}

type PlanSection = {
    number: number
    title: string
    summary: string
    week: number
    minutes: number
    status: StepState
    currentStep?: LessonStep // only on the current section
    objectives: string[]
    lesson?: LessonBlock[] // missing = not generated yet
    resources: LessonResource[]
    quiz: QuizQuestion[]
    mastery?: MasteryResult
}

type PlanRecord = {
    id: string
    name: string
    color: PlanColor
    lifecycle: PlanLifecycle
    schedule: PlanStatus
    daysBehind?: number
    goal: string
    startDate: string // ISO date
    endDate: string
    hoursPerWeek: number
    pausedOn?: string
    completedOn?: string
    rules: { masteryCheck: boolean; reminderTime: string | null; allowSkipping: boolean }
    sections: PlanSection[]
    upcoming: { date: string; label: string; minutes: number }[]
    redo: { prompt: string; section: number }[]
}

type PlanDraft = {
    name: string
    goal: string
    weeks: number
    hoursPerWeek: number
    endDate: string
    sections: { title: string; summary: string; week: number }[]
    suggestions: string[]
    messages: ChatMessage[]
}

// ---------------------------------------------------------------------------
// Dashboard

type Session = {
    id: string
    planId: string
    title: string
    kind: string // "lesson", "practice", "practice design", …
    minutes: number
    href: string
}

type UpNext = Session & {
    sectionNumber: number
    minutesLeft: number
    steps: { label: string; state: StepState }[]
}

type Stat = {
    value: string
    label: string
    hint: string
    tone: "sun" | "coral" | "mint"
}

type CalendarItem = {
    label: string
    planId: string | null // null = not tied to one plan (redo queue, weekly review)
    done: boolean
}

type CalendarDay = {
    weekday: string
    day: number
    isToday: boolean
    items: CalendarItem[]
}
