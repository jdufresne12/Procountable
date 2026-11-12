type PlanColor = "violet" | "sun" | "coral"
type PlanStatus = "on-track" | "behind"
type StepState = "done" | "current" | "locked"

type Plan = {
    id: string
    name: string
    color: PlanColor
    progress: number // 0–100
    currentSection: number
    totalSections: number
    status: PlanStatus
    statusLabel: string
    href: string
}

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